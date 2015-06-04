using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class User
    {
        [DataMemberAttribute]
        public string UserName { get; set; }
        [DataMemberAttribute]
        public Guid UserId { get; set; }
        [DataMemberAttribute]
        public string FirstName { get; set; }
        [DataMemberAttribute]
        public string LastName { get; set; }
        [DataMemberAttribute]
        public string Message { get; set; }
        [DataMemberAttribute]
        public string UserEmail { get; set; }
    }
}
