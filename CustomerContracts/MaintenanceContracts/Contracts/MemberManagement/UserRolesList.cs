using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class UserRolesList
    {
        public List<UserInRoles> UserRoles { get; set; }
        public bool RolesActiveInApp { get; set; }
        public bool IsDirty { get; set; }
        public string Message { get; set; }
    }
}
