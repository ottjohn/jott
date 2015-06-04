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
    public class UserAddRequest
    {
        [DataMemberAttribute]
        public UserInformation UserInfo { get; set; }
    }
}
