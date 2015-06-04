using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class FeatureTreeItem
    {
        public int FeatureTreeId { get; set; }
        public string FeatureTreeName { get; set; }
        public int FeatureTreeParentId { get; set; }
        public bool FeatureTreeAccess { get; set; }
        public int GroupNameId { get; set; }
        public int Selectable { get; set; }
    }
}
