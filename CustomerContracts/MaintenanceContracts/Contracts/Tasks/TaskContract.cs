using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Tasks
{
    public class TaskContract
    {
        public string TaskName { get; set; }
        public int TaskId { get; set; }
        public string TaskPayload { get; set; }
        public Guid UserId { get; set; }
        public string Password { get; set; }
        public bool RequiresMemberValidation { get; set; }
    }
}
