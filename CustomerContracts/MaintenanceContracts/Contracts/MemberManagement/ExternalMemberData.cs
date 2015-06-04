using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class ExternalMemberData
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string SaleName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public int StoreId { get; set; }
    }
}
