using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.MemberManagement
{
    [DataContract]
    public class RetrieveUserRequest
    {
        [DataMemberAttribute]
        public Guid UserId { get; set; }
        [DataMemberAttribute]
        public string UserName { get; set; }
        [DataMemberAttribute]
        public Guid ApplicationId { get; set; }
    }
}
