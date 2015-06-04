using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class TaskSummaryItem
    {
        public string TaskName { get; set; }
        public int CompletedCount { get; set; }
        public decimal ProportionCompleted { get; set; }
    }
}
