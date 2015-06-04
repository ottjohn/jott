using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class TaskItemList
    {
        public List<TaskItem> Tasks { get; set; }
        public string TaskMessage { get; set; }
    }
}
