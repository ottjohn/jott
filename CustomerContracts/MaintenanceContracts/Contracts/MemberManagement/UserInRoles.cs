using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class UserInRoles
    {
        [DataMemberAttribute]
        public string RoleName { get; set; }
        [DataMemberAttribute]
        public Guid RoleId { get; set; }
        [DataMemberAttribute]
        public Guid InRole { get; set; }
        [DataMemberAttribute]
        public Guid ApplicationId { get; set; }
        [DataMemberAttribute]
        public bool IsActive { get; set; }
    }
}
