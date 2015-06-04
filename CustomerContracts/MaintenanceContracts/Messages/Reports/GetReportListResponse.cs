using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.Reports;

namespace MaintenanceContracts.Messages.Reports
{
    [DataContract]
    public class GetReportListResponse
    {
        [DataMemberAttribute]
        public ReportFeatureItems Reports { get; set; }
    }
}
