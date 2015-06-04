using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class UserApplicationList
    {
        public List<UserInApplication> UserInApp { get; set; }
        public string DefaultApplication { get; set; }
        public Guid SelectedApplicationId { get; set; }
        public bool IsDirty { get; set; }
        public string Message { get; set; }
    }
}
