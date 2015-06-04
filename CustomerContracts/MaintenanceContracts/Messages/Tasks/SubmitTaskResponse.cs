using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Tasks;

namespace MaintenanceContracts.Messages.Tasks
{
    [DataContract]
    public class SubmitTaskResponse
    {
        [DataMemberAttribute]
        public SubmitTaskResult Result { get; set; }
    }
}
