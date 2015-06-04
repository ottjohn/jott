using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Messages.Common
{
    [DataContract]
    public class GetStateListResponse
    {
        [DataMemberAttribute]
        public StateList StateList { get; set; }
    }
}
