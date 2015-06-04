using System;
using System.IO;
using System.Web;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UtilityPot;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using UtilityPot.Logger;

namespace CustomerUtility.EmailHandler
{
    public class EmailProcess
    {
        public int BuildRegEmail(ILogger Logger, UserInformation CustInfo)
        {
            int RetVal = 1;
            Email MessageComponents = new Email { EmailTo = new List<string>() };
            MessageComponents.Subject = ConfigurationManager.AppSettings["RegEmailSubject"].ToString();
            MessageComponents.Title = ConfigurationManager.AppSettings["RegEmailTitle"].ToString();
            MessageComponents.MessageFromDevice = ConfigurationManager.AppSettings["MessageFromDevice"].ToString();
            MessageComponents.EmailTo.Add(CustInfo.RegInfo.Email.Value);
            MessageComponents.Message = GetSuccessfulRegMessage(Logger, CustInfo.RegInfo.UserName.Value, CustInfo.RegInfo.Password.Value);

            if (MessageComponents.Message != "")
            {
                Utility Util = new Utility();
                if (!Util.ComposeEmail(MessageComponents)) RetVal = 2;
            }

            return RetVal;

        }

        public int BuildMessageEmail(ILogger Logger, string Message)
        {
            int RetVal = 1;
            Email MessageComponents = new Email { EmailTo = new List<string>() };
            MessageComponents.Subject = ConfigurationManager.AppSettings["MemberManageSubject"].ToString();
            MessageComponents.Title = ConfigurationManager.AppSettings["MemberManageTitle"].ToString();
            MessageComponents.MessageFromDevice = ConfigurationManager.AppSettings["MessageFromDevice"].ToString();
            string EmailRecipList = ConfigurationManager.AppSettings["MemberManageRecipientList"].ToString();
            string[] EmailRecips = EmailRecipList.Split(';');
            foreach (string EmailRecip in EmailRecips) MessageComponents.EmailTo.Add(EmailRecip);

            MessageComponents.Message = GetMemberManagementMessage(Logger, Message);

            if (MessageComponents.Message != "")
            {
                Utility Util = new Utility();
                if (!Util.ComposeEmail(MessageComponents)) RetVal = 2;
            }

            return RetVal;

        }

        private string GetMemberManagementMessage(ILogger Logger, string Message)
        {
            string EmailBodyTemplate = "";
            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string EmailTemplatePath = driveLetter + ConfigurationManager.AppSettings["MemberManagementTemplate"].ToString();

            try
            {
                EmailBodyTemplate = File.ReadAllText(EmailTemplatePath);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#NOTIFICATIONMESSAGE#", Message);
            }
            catch (Exception ex)
            {
                EmailBodyTemplate = "";
                Logger.LogEvent("CustomerUtility.EmailHandler.GetMemberManagementMessage", ex);
            }

            return EmailBodyTemplate;

        }

        private string GetSuccessfulRegMessage(ILogger Logger, string UserName, string Password)
        {
            string EmailBodyTemplate = "";
            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string EmailTemplatePath = driveLetter + ConfigurationManager.AppSettings["RegEmailTemplate"].ToString();

            try
            {
                EmailBodyTemplate = File.ReadAllText(EmailTemplatePath);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#USERNAME#", UserName);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#PASSWORD#", Password);
            }
            catch (Exception ex)
            {
                EmailBodyTemplate = "";
                Logger.LogEvent("CustomerUtility.EmailHandler.GetSuccessfulRegMessage", ex);
            }

            return EmailBodyTemplate;

        }

        public string BuildNotificationEmail(ILogger Logger, PasswordManagement PasswordManager, string Title, string Email)
        {
            try
            {
                Email MessageComponents = new Email { EmailTo = new List<string>() };
                MessageComponents.Subject = ConfigurationManager.AppSettings["AccontManageSubject"].ToString(); ;
                MessageComponents.Title = Title;
                MessageComponents.EmailTo.Add(Email);
                MessageComponents.MessageFromDevice = ConfigurationManager.AppSettings["MessageFromDevice"].ToString();

                if (Title == "Change Email")
                    MessageComponents.Message = GetChangeEmailMessage(Logger, PasswordManager.Message, PasswordManager.NewEmail.Value, PasswordManager.UserName.Value);
                else if (Title == "Change Password")
                    MessageComponents.Message = GetChangePasswordMessage(Logger, PasswordManager.OldPassword.Value, PasswordManager.NewPassword.Value, PasswordManager.UserName.Value);
                else if (Title == "Retrieve Password")
                    MessageComponents.Message = GetRetrievePasswordMessage(Logger, PasswordManager.OldPassword.Value, PasswordManager.UserName.Value);

                if (MessageComponents.Message != "")
                {
                    Utility Util = new Utility();
                    if (Util.ComposeEmail(MessageComponents))
                        PasswordManager.Message = Title + " successful. A notification has been sent to your email account. ";
                    else
                        PasswordManager.Message = Title + " successful. Notification email failed to send. ";
                }
            }
            catch (Exception ex)
            {
                PasswordManager.Message = Title + " failed. Please try again. ";
                Logger.LogEvent("CustomerUtility.EmailHandler.BuildNotificationEmail", ex);
            }

            return PasswordManager.Message;
        }

        private string GetRetrievePasswordMessage(ILogger Logger, string OldPassword, string UserName)
        {
            string EmailBodyTemplate = "";
            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string EmailTemplatePath = driveLetter + ConfigurationManager.AppSettings["RetrievePasswordTemplate"].ToString();

            try
            {
                EmailBodyTemplate = File.ReadAllText(EmailTemplatePath);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#USERNAME#", UserName);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#OLDPASSWORD#", OldPassword);
            }
            catch (Exception ex)
            {
                EmailBodyTemplate = "";
                Logger.LogEvent("CustomerUtility.EmailHandler.GetRetrievePasswordMessage", ex);
            }

            return EmailBodyTemplate;

        }

        private string GetChangePasswordMessage(ILogger Logger, string OldPassword, string NewPassword, string UserName)
        {
            string EmailBodyTemplate = "";
            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string EmailTemplatePath = driveLetter + ConfigurationManager.AppSettings["ChangePasswordTemplate"].ToString();

            try
            {
                EmailBodyTemplate = File.ReadAllText(EmailTemplatePath);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#USERNAME#", UserName);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#OLDPASSWORD#", OldPassword);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#NEWPASSWORD#", NewPassword);
            }
            catch (Exception ex)
            {
                EmailBodyTemplate = "";
                Logger.LogEvent("CustomerUtility.EmailHandler.GetChangePasswordMessage", ex);
            }

            return EmailBodyTemplate;

        }

        private string GetChangeEmailMessage(ILogger Logger, string OldEmail, string NewEmail, string UserName)
        {
            string EmailBodyTemplate = "";
            string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
            string EmailTemplatePath = driveLetter + ConfigurationManager.AppSettings["ChangeEmailTemplate"].ToString();

            try
            {
                EmailBodyTemplate = File.ReadAllText(EmailTemplatePath);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#USERNAME#", UserName);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#OLDEMAIL#", OldEmail);
                EmailBodyTemplate = EmailBodyTemplate.Replace("#NEWEMAIL#", NewEmail);
            }
            catch (Exception ex)
            {
                EmailBodyTemplate = "";
                Logger.LogEvent("CustomerUtility.EmailHandler.GetChangeEmailMessage", ex);
            }

            return EmailBodyTemplate;

        }
    }
}
