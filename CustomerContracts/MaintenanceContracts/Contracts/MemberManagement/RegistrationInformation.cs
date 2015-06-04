using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class RegistrationInformation
    {
        public FieldTemplate<string> FirstName { get; set; }
        public FieldTemplate<string> LastName { get; set; }
        public FieldTemplate<string> Email { get; set; }
        public FieldTemplate<string> UserName { get; set; }
        public FieldTemplate<string> Password { get; set; }
        public FieldTemplate<string> Password1 { get; set; }
        public FieldTemplate<string> Question { get; set; }
        public FieldTemplate<string> Answer { get; set; }
    }
}
