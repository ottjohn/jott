using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Messages.MemberManagement
{
    [DataContract]
    public class UpdateUserResponse
    {
        [DataMemberAttribute]
        public Notifications Notes { get; set; }
    }
}
