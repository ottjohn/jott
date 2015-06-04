using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class MemberAppConfiguration
    {
        [DataMemberAttribute]
        public UserRolesList Roles { get; set; }

        [DataMemberAttribute]
        public UserApplicationList UserApps { get; set; }

        [DataMemberAttribute]
        public FeatureTreeItems TreeItems { get; set; }

        [DataMemberAttribute]
        public string Message { get; set; }
    }
}
