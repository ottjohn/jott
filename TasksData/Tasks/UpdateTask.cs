using System;
using System.IO;
using System.Web;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using MaintenanceContracts.Contracts.Tasks;
using UtilityPot.Logger;

namespace TasksData.Tasks
{
    public class UpdateTask
    {
        public string SubmitAckEmployeeHandbook(ILogger Logger, Guid UserId, int TaskId)
        {
            string RetVal = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    Context.SubmitTask(UserId, TaskId);
                    RetVal = ConfigurationManager.AppSettings["ResourceDocPathClient"].ToString() + "\\HandbookPolicies WCRI 14.10.01.pdf";
                }
            }
            catch (Exception ex)
            {
                RetVal = "Problem connecting to the database.";
                Logger.LogEvent("TasksData.Tasks.SubmitAckEmployeeHandbook", ex);
            }

            return RetVal;
        }

        /// <summary>
        /// this should be TWO methods since the one adding the completion of the task will look the SAME for all tasks.
        /// </summary>
        /// <param name="Logger"></param>
        /// <param name="HealthcareElection"></param>
        /// <param name="UserId"></param>
        /// <param name="TaskId"></param>
        /// <returns></returns>
        public string SubmitHealthcareTask(ILogger Logger, HealthcareElectionContract HealthcareElection, Guid UserId, int TaskId)
        {
            string RetVal = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    Nullable<int> ReturnedValue = null;
                    Context.SubmitHealthcareElection(UserId, Convert.ToByte(HealthcareElection.GTThirty), Convert.ToByte(HealthcareElection.Participate), HealthcareElection.ElectionPlan, TaskId, ref ReturnedValue);
                    if (ReturnedValue.Value == 0) RetVal = "Problem: failed to add task";
                }
            }
            catch (Exception ex)
            {
                RetVal = "Problem connecting to the database.";
                Logger.LogEvent("TasksData.Tasks.SubmitHealthcareTask", ex);
            }

            return RetVal;
        }
    }
}
