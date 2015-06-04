using System;
using System.IO;
using System.Web;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MemberData;
using UtilityPot;
using System.Reflection;
using UtilityPot.CommonValidation;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;

namespace CustomerUtility.FeatureTree
{
    public class FeatureTreeProcess
    {
        public FeatureTreeGroups RetrieveAppGroupNames(Guid ApplicationId)
        {
            FeatureTreeGroups GroupList = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            GroupList.Message = TypeValidation.ValidateGUIDId(ApplicationId, "ApplicationId");
            if (GroupList.Message == "")
            {
                MemberDataManager MP = new MemberDataManager();
                GroupList = MP.RetrieveAppGroupNames(ApplicationId);  
            }           
            return GroupList;
        }

        public FeatureTreeGroups AddFeatureTreeGroup(List<FeatureTreeItem> TreeItems, string FeatureGroupName, Guid ApplicationId)
        {
            FeatureTreeGroups GroupList = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            GroupList.Message = ValidateAddFeatureTreeGroup(TreeItems, FeatureGroupName, ApplicationId);
            if(GroupList.Message == "")  
            {
                MemberDataManager MP = new MemberDataManager();
                GroupList = MP.AddFeatureTreeGroup(TreeItems, FeatureGroupName, ApplicationId);
            }
            return GroupList;
        }

        private string ValidateAddFeatureTreeGroup(List<FeatureTreeItem> TreeItems, string FeatureGroupName, Guid ApplicationId)
        {
            FeatureTreeValidator FTV = new FeatureTreeValidator();
            return FTV.ValidateAddUpdateGroup(TreeItems, FeatureGroupName, 0, ApplicationId, Guid.Empty, true);
        }

        public FeatureTreeGroups UpdateFeatureTreeGroup(List<FeatureTreeItem> TreeItems, int FeatureGroupNameId, Guid ApplicationId, Guid UserId)
        {
            FeatureTreeGroups GroupList = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            GroupList.Message = ValidateUpdateFeatureTreeGroup(TreeItems, FeatureGroupNameId, ApplicationId, UserId);
            if (GroupList.Message == "")
            {
                MemberDataManager MP = new MemberDataManager();
                GroupList = MP.UpdateFeatureTreeGroup(TreeItems, FeatureGroupNameId, ApplicationId);
            }
            return GroupList;
        }

        private string ValidateUpdateFeatureTreeGroup(List<FeatureTreeItem> TreeItems, int FeatureGroupNameId, Guid ApplicationId, Guid UserId)
        {
            FeatureTreeValidator FTV = new FeatureTreeValidator();
            return FTV.ValidateAddUpdateGroup(TreeItems, "", FeatureGroupNameId, ApplicationId, UserId, false);
        }

        /// <summary>
        /// Next
        /// </summary>
        /// <param name="UserName"></param>
        /// <param name="UserId"></param>
        /// <param name="GroupNameId"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public FeatureTreeItems RetrieveFeatureList(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId)
        {
            MemberDataManager MP = new MemberDataManager();
            return MP.RetrieveFeatureList(UserName, UserId, GroupNameId, ApplicationId);
        }
    }
}
