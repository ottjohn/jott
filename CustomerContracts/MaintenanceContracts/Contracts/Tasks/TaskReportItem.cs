using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class TaskReportItem
    {
        public Guid UserId { get; set; }
        public string TaskName { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string ReportStatus { get; set; }
    }
}
