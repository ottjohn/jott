using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class UserInApplication
    {
        [DataMemberAttribute]
        public string ApplicationName { get; set; }
        [DataMemberAttribute]
        public Guid ApplicationID { get; set; }
        [DataMemberAttribute]
        public bool IsUserApproved { get; set; }
    }
}
