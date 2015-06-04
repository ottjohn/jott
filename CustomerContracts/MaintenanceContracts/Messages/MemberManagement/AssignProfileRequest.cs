using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.MemberManagement;

namespace MaintenanceContracts.Messages.MemberManagement
{
    [DataContract]
    public class AssignProfileRequest
    {
        [DataMemberAttribute]
        public Guid UserId { get; set; }
        [DataMemberAttribute]
        public bool UserApproved { get; set; }
        [DataMemberAttribute]
        public Guid ApplicationId { get; set; }
        [DataMemberAttribute]
        public MemberAppConfiguration MemberConfiguration { get; set; }
    }
}
