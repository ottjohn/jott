using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class ExtMemberInfoManager
    {
        [DataMemberAttribute]
        public int RecordCount { get; set; }

        [DataMemberAttribute]
        public List<ExtendedMemberInfo> ExtendedMemberInfo { get; set; }

    }
}
