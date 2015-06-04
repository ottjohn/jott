using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.MemberManagement;

namespace MaintenanceContracts.Messages.MemberManagement
{
    [DataContract]
    public class UserAddResponse
    {
        [DataMemberAttribute]
        public UserInformation CustInfo { get; set; }
        [DataMemberAttribute]
        public string ErrorMessage { get; set; }
    }
}
