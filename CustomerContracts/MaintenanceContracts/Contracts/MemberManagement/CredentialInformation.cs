using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    [DataContract]
    public class CredentialInformation
    {
        [DataMemberAttribute]
        public string UserName { get; set; }
        [DataMemberAttribute]
        public string Password { get; set; }
        [DataMemberAttribute]
        public string Password1 { get; set; }
        [DataMemberAttribute]
        public string Question { get; set; }
        [DataMemberAttribute]
        public string Answer { get; set; }
    }
}
