using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Contracts.MemberManagement {
    [DataContract]
    public class PasswordManagement : Notifications 
    {
        [DataMemberAttribute]
        public FieldTemplate<string> UserName { get; set; }
        [DataMemberAttribute]
        public FieldTemplate<string> SecurityQuestion { get; set; }
        [DataMemberAttribute]
        public FieldTemplate<string> SecurityAnswer { get; set; }
        [DataMemberAttribute]
        public FieldTemplate<string> OldPassword { get; set; }
        [DataMemberAttribute]
        public FieldTemplate<string> NewPassword { get; set; }
        [DataMemberAttribute]
        public FieldTemplate<string> NewEmail { get; set; }
    }
}
