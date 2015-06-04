using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Contracts.Common
{
    [DataContract]
    public class Notifications
    {
        [DataMemberAttribute]
        public string Message { get; set; }

        [DataMemberAttribute]
        public List<string> Issues { get; set; }
    }
}
