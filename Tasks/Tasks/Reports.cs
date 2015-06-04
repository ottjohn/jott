using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MaintenanceContracts.Contracts.Tasks;
using TasksData;
using Tasks.Tasks;
using UtilityPot.CommonValidation;
using Tasks.Validate;

namespace Tasks.Tasks
{
    public class Reports
    {
        public string RetrieveHealthcareReport()
        {
            MemberTaskManager TM = new MemberTaskManager();
            return TM.RetrieveHealthcareReport();
        }

        public string RetrieveHandbookReport()
        {
            MemberTaskManager TM = new MemberTaskManager();
            return TM.RetrieveHandbookReport();
        }

        public TaskReportList RetieveTaskReport()
        {
            TaskReportList TRL = new TaskReportList();
            MemberTaskManager TM = new MemberTaskManager();
            TRL = TM.RetieveTaskReport();
            return TRL;
        }

        private string ValidatePagingMetrics(int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            string RetVal = "";
            if (CurrentPage < 1 || PageSize < 1 || (String.IsNullOrEmpty(SortField)) || String.IsNullOrEmpty(SortDirection))
                RetVal = "Paging metrics are flawed.";

            return RetVal;
        }
    }
}
