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
using CustomerUtility.Cache;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;

namespace CustomerUtility.FeatureTree
{
    public class FeatureTreeValidator
    {
        /// <summary>
        /// 1. Need ApplicationId no matter what, same with TreeItems
        /// 2. If IsAdd, then need FeatureGroupName
        /// 3. If !IsAdd, then need FeatureGroupNameId
        /// </summary>
        /// <param name="TreeItems"></param>
        /// <param name="FeatureGroupName"></param>
        /// <param name="FeatureGroupNameId"></param>
        /// <param name="ApplicationId"></param>
        /// <param name="IsAdd"></param>
        /// <returns></returns>
        public string ValidateAddUpdateGroup(List<FeatureTreeItem> TreeItems, string FeatureGroupName, int FeatureGroupNameId, Guid ApplicationId, Guid UserId, bool IsAdd)
        {
            string RetVal = TypeValidation.ValidateGUIDId(ApplicationId, "ApplicationId");
            if (RetVal == "")
            {
                if (IsAdd)
                    RetVal = StringExpressionDictionary.ValidateStringExpression(FeatureGroupName, "NewGroupName");
                else
                    if (FeatureGroupNameId <= 0) RetVal = "GroupId required for group update.";

                if (RetVal == "")
                {
                    FeatureTreeItems FTI = new FeatureTreeItems { FeatureItems = TreeItems };
                    RetVal = ValidateFeatureTree(FTI, UserId, !IsAdd, false);
                }
            }

            return RetVal;
        }

        /// <summary>
        /// Need comparison under the following circumstances:
        /// 
        /// 1. Assign profile - add or update, although add is just going throug motions
        /// 2. Update named group
        /// </summary>
        /// <param name="FeatureTree"></param>
        /// <param name="UserId"></param>
        /// <param name="isAssignAccount"></param>
        /// <returns></returns>
        public string ValidateFeatureTree(FeatureTreeItems FeatureTree, Guid UserId, bool doComparison, bool isProfile)
        {
            string RetVal = "";
            if (!ValidateFeatureTreeForEntries(FeatureTree)) 
                RetVal = "Feature tree either has no items or has no selected items!";

            if (RetVal == "" && doComparison)
            {
                if(!ValidateFeatureTreeForChange(FeatureTree, UserId, isProfile)) 
                    RetVal = "Feature access profile submitted has not changed from original profile.";
            }

            return RetVal;
        }

        /// <summary>
        /// Ensures that at least one item in the tree has been selected
        /// </summary>
        /// <param name="FeatureTree"></param>
        /// <returns></returns>
        public bool ValidateFeatureTreeForEntries(FeatureTreeItems FeatureTree)
        {
            bool RetVal = true;
            FeatureTreeItem SelectedTreeItem = FeatureTree.FeatureItems.FindLast(x => x.FeatureTreeAccess == true);
            if (SelectedTreeItem == null) RetVal = false;
            return RetVal;
        }

        /// <summary>
        /// Compares inbound feature tree to the cached feature tree
        /// MIGHT WANT TO VALIDATE THIS FOR ASSIGNED GROUP AS WELL
        /// </summary>
        /// <param name="FeatureTree"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public bool ValidateFeatureTreeForChange(FeatureTreeItems FeatureTree, Guid UserId, bool isProfile)
        {
            bool RetVal = false;
            FeatureTreeItems TreeItems;

            if(isProfile) 
            {
                MemberAppConfiguration MemberConfiguration = (MemberAppConfiguration)CasheStore.GetCachedItem(UserId.ToString());
                TreeItems = MemberConfiguration.TreeItems;
            } 
            else 
            {
                TreeItems = (FeatureTreeItems)CasheStore.GetCachedItem(UserId.ToString());
            }

            int AssignGroupId = TreeItems.AssignGroupNameId;
            int OriginalGroupId = TreeItems.FeatureItems[0].GroupNameId;

            FeatureTree.FeatureItems.ForEach(delegate(FeatureTreeItem Item)
            {
                if (TreeItems.FeatureItems.Find(x => x.FeatureTreeAccess != Item.FeatureTreeAccess && x.FeatureTreeId == Item.FeatureTreeId) != null)
                {
                    RetVal = true;
                }
            });

            return RetVal;
        }
    }
}
