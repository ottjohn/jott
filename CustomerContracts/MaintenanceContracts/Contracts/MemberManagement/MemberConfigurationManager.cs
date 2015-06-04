using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class MemberConfigurationManager
    {
        [DataMemberAttribute]
        public MemberAppConfiguration MemberConfiguration { get; set; }

        [DataMemberAttribute]
        public User UserInfo { get; set; }

        [DataMemberAttribute]
        public string Message { get; set; }
    }
}
