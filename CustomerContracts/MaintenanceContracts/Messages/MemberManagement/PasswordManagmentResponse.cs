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
    public class PasswordManagementResponse
    {
        [DataMemberAttribute]
        public PasswordManagement ManagePasswords { get; set; }
    }
}
