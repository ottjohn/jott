using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace MaintenanceContracts.Messages.Tasks
{
    [DataContract]
    public class GetHealthcareReportResponse
    {
        [DataMemberAttribute]
        public string Message { get; set; }
    }
}
