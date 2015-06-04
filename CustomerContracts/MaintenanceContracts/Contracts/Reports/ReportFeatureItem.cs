using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.Reports
{
    public class ReportFeatureItem
    {
        public Guid FeatureTreeId { get; set; }
        public string FeatureTreeName { get; set; }
        public Guid FeatureTreeParentId { get; set; }
        public bool FeatureTreeAccess { get; set; }
        public int Selectable { get; set; }
    }
}
