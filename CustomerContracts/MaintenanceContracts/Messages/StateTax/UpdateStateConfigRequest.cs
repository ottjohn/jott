using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Common;

namespace MaintenanceContracts.Messages.StateTax
{
    [DataContract]
    public class UpdateStateConfigRequest
    {
        [DataMemberAttribute]
        public State StateItem { get; set; }
        [DataMemberAttribute]
        public string EffectiveDate { get; set; }
    }
}
