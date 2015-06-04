using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class UserLoggedInInfo
    {
        public string UserName { get; set; }
        public string UserRoles { get; set; }
        public Guid UserId { get; set; }
        public string FeatureAccessList { get; set; }
    }
}
