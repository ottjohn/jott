using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using MaintenanceContracts.Contracts.MemberManagement;

namespace MaintenanceContracts.Messages.MemberManagement
{
    [DataContract]
    public class AddUpdateFeatureTreeGroupRequest
    {
        [DataMemberAttribute]
        public List<FeatureTreeItem> TreeItems { get; set; }
        [DataMemberAttribute]
        public string FeatureGroupName { get; set; }
        [DataMemberAttribute]
        public int FeatureGroupNameId { get; set; }
        [DataMemberAttribute]
        public Guid ApplicationId { get; set; }
        [DataMemberAttribute]
        public Guid UserId { get; set; }
    }
}
