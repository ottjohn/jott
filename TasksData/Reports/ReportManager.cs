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

namespace TasksData.Reports
{
    public class ReportManager
    {
        public string RetrieveHealthcareReport(ILogger Logger)
        {
            string RetVal = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedReport = Context.RetrieveHealthcareReport();
                    List<string> ReportItems = new List<string>();
                    ReportItems.AddRange(ReturnedReport.Select(x => x.ReportItem.ToString()));
                    string ReportString = String.Join("\r\n", ReportItems.ToArray());
                    string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
                    string ReportPath = ConfigurationManager.AppSettings["ReportPathServer"].ToString();
                    File.WriteAllText(driveLetter + ReportPath + "\\HealthcareReport.xls", ReportString);
                    RetVal = ConfigurationManager.AppSettings["ReportPathClient"].ToString() + "\\HealthcareReport.xls";
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("TasksData.Reports.RetrieveHealthcareReport", ex);
            }

            return RetVal;
        }

        public string RetrieveHandbookReport(ILogger Logger)
        {
            string RetVal = "";

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedReport = Context.RetrieveHandbookReport();
                    List<string> ReportItems = new List<string>();
                    ReportItems.AddRange(ReturnedReport.Select(x => x.ReportItem.ToString()));
                    string ReportString = String.Join("\r\n", ReportItems.ToArray());
                    string driveLetter = Path.GetPathRoot(HttpRuntime.AppDomainAppPath);
                    string ReportPath = ConfigurationManager.AppSettings["ReportPathServer"].ToString();
                    File.WriteAllText(driveLetter + ReportPath + "\\HandbookReport.xls", ReportString);
                    RetVal = ConfigurationManager.AppSettings["ReportPathClient"].ToString() + "\\HandbookReport.xls";
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("TasksData.Reports.RetrieveHandbookReport", ex);
            }

            return RetVal;
        }

        public TaskReportList RetieveTaskReport(ILogger Logger)
        {
            TaskReportList TRL = new TaskReportList
            {
                SummaryItems = new List<TaskSummaryItem>()
            };

            TRL.Message = "";

            try
            {
                TRL.SummaryItems = GetTaskSummary(Logger);
            }
            catch (Exception ex)
            {
                TRL.Message = "Failed to retrieve task report.";
                Logger.LogEvent("TasksData.Tasks.RetieveTaskReport", ex);
            }

            return TRL;
        }

        private List<TaskSummaryItem> GetTaskSummary(ILogger Logger)
        {
            List<TaskSummaryItem> TaskSummary = new List<TaskSummaryItem>();

            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    var ReturnedTasksSummary = Context.GetSummaryOfTasks();
                    TaskSummary.AddRange(ReturnedTasksSummary.Select(x => new TaskSummaryItem { TaskName = x.TaskName, CompletedCount = x.Completed.Value, ProportionCompleted = x.Proportion.Value }));
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("TasksData.Tasks.GetTaskSummary", ex);
            }

            return TaskSummary;
        }

        private int GetMemberRecordCount(ILogger Logger)
        {
            int RecordCount = 0;
            try
            {
                using (TaskManagerDataContext Context = new TaskManagerDataContext())
                {
                    Nullable<int> ReturnedCount = null;
                    Context.GetRecordCount(ConfigurationManager.AppSettings["DefaultApplication"].ToString(), 1, ref ReturnedCount);
                    RecordCount = ReturnedCount.Value;
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("TasksData.Tasks.GetMemberRecordCount", ex);
            }
            return RecordCount;
        }
    }
}
