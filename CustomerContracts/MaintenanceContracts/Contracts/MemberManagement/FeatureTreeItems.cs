using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceContracts.Contracts.MemberManagement
{
    public class FeatureTreeItems
    {
        public List<FeatureTreeItem> FeatureItems { get; set; }
        public string FeatureTreeHtml { get; set; }
        public FeatureTreeGroups FeatureGroups { get; set; }
        public int AssignGroupNameId { get; set; }
        public bool isDirty { get; set; }
        public bool areTreeItemsAvailable { get; set; }
        public string Message { get; set; }
    }
}
