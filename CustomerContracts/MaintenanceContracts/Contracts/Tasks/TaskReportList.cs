using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class TaskReportList
    {
        public List<TaskReportItem> ReportItems { get; set; }
        public List<TaskSummaryItem> SummaryItems { get; set; }
        public int RecordCount { get; set; }
        public string Message { get; set; }
    }
}
