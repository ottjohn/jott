using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class MemberPswdUpdate
    {
        public Guid UserId { get; set; }
        public int AppUserId { get; set; }
        public string NewPassword { get; set; }
        public string UserName { get; set; }
    }
}
