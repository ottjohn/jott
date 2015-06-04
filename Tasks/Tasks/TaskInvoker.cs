using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Text;
using MaintenanceContracts.Contracts.Tasks;
using TasksData;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.MemberManagement;
using MaintenanceContracts.Contracts.Common;
using UtilityPot;
using UtilityPot.CommonValidation;
using CustomerUtility;

namespace Tasks.Tasks
{
    public class TaskInvoker
    {
        public string ProcessHealthcareElection(object TaskDetail)
        {
            string RetVal = "";

            try 
            {
                TaskContract TaskDetailDelivery = (TaskContract)TaskDetail;
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(HealthcareElectionContract));
                MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(Convert.ToString(TaskDetailDelivery.TaskPayload)));
                HealthcareElectionContract HealthcareElection = (HealthcareElectionContract)ser.ReadObject(stream);

                MemberTaskManager TM = new MemberTaskManager();
                RetVal = TM.SubmitHealthcareTask(HealthcareElection, TaskDetailDelivery.UserId, TaskDetailDelivery.TaskId);

            } catch(Exception ex) {
                
            }

            return RetVal;
        }

        public string ProcessAcknowledgeEmployeeHandbook(object TaskDetail)
        {
            string RetVal = "";

            try
            {
                TaskContract TaskDetailDelivery = (TaskContract)TaskDetail;
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(EmployeeHandbookContract));
                MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(Convert.ToString(TaskDetailDelivery.TaskPayload)));
                EmployeeHandbookContract HandbookContract = (EmployeeHandbookContract)ser.ReadObject(stream);

                if (HandbookContract.SendHandbookByEmail) RetVal = BuidAcknowledgementEmail();

                MemberTaskManager TM = new MemberTaskManager();
                RetVal = TM.AckEmployeeHandbookTask(TaskDetailDelivery.UserId, TaskDetailDelivery.TaskId);
            }
            catch (Exception ex)
            {

            }

            return RetVal;
        }

        public string BuidAcknowledgementEmail()
        {
            string RetVal = "";
            CustomerProcess CP = new CustomerProcess();
            User Member = CP.GetUserShort();

            RetVal = StringExpressionDictionary.ValidateStringExpression(Member.UserName, "UserName");
            if (RetVal == "") RetVal = StringExpressionDictionary.ValidateStringExpression(Member.UserEmail, "Email");

            if (RetVal == "")
            {
                Email MessageComponents = new Email { EmailTo = new List<string>() };
                MessageComponents.Subject = "Employee Handbook";
                MessageComponents.Title = "Employee Handbook Attached";
                MessageComponents.EmailTo.Add(Member.UserEmail);
                MessageComponents.Message = GetEmployeeHandbookMessage(Member.UserName);
                string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
                MessageComponents.AttachmentPath = driveLetter + ConfigurationManager.AppSettings["EmployeeHandbookLocation"].ToString();

                if (MessageComponents.Message != "" &&  !String.IsNullOrEmpty(MessageComponents.AttachmentPath))
                {
                    Utility Util = new Utility();
                    if (!Util.ComposeEmail(MessageComponents)) RetVal = "Email message failed to send.";
                }
            }

            return RetVal;

        }

        private string GetEmployeeHandbookMessage(string UserName)
        {
            string EmailBodyTemplate = "";
            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string EmailTemplatePath = driveLetter + ConfigurationManager.AppSettings["EmployeeHandbookTemplate"].ToString();

            try
            {
                EmailBodyTemplate = File.ReadAllText(EmailTemplatePath);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#USERNAME#", UserName);
            }
            catch (Exception ex)
            {
                EmailBodyTemplate = "";
            }

            return EmailBodyTemplate;

        }
    }
}
