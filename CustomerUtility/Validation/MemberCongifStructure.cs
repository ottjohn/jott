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
using CustomerUtility.FeatureTree;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using UtilityPot.Logger;

namespace CustomerUtility.Validation
{
    public class MemberConfigStructure
    {
        public string ValidateMemberAppConfigStructure(MemberAppConfiguration MemberConfiguration)
        {
            string RetVal = ValidateAppContainer(MemberConfiguration);           //Check structure and apps
            if (MemberConfiguration.TreeItems != null) RetVal = ValidateFeatureContainer(MemberConfiguration.TreeItems);
            if (MemberConfiguration.Roles != null) RetVal = ValidateRolesContainer(MemberConfiguration.Roles);
            return RetVal;
        }

        /// <summary>
        /// ANY NONEMPTY RETURN FROM THIS SHOULD SHUT DOWN FURTHER PROCESSING
        /// </summary>
        /// <param name="MemberConfiguration"></param>
        /// <returns></returns>
        public string ValidateAppContainer(MemberAppConfiguration MemberConfiguration)
        {
            string RetVal = "";
            if (MemberConfiguration == null)
            {
                RetVal = "Member assignment contract is null.";
            }
            else if (MemberConfiguration.UserApps == null)
            {
                RetVal = "Member application container is null.";
            }
            else if (MemberConfiguration.UserApps.IsDirty && (MemberConfiguration.UserApps.UserInApp == null || MemberConfiguration.UserApps.UserInApp.Count == 0))
            {
                RetVal = "User assigned to applications, but no applications available.";
            }
            else if (MemberConfiguration.UserApps.UserInApp == null || MemberConfiguration.UserApps.UserInApp.Count == 0)
            {
                RetVal = "Member appears to not belong to any applications.";
            }

            return RetVal;
        }

        public string ValidateFeatureContainer(FeatureTreeItems TreeItems)
        {
            string RetVal = "";
            if ((TreeItems.areTreeItemsAvailable && TreeItems.FeatureItems == null)
                || (TreeItems.areTreeItemsAvailable && TreeItems.FeatureItems.Count == 0))
            {
                RetVal = "Feature items supposed to be available but are not.";
            }
            else if (TreeItems.isDirty && (TreeItems.FeatureItems == null || TreeItems.FeatureItems.Count == 0))
            {
                RetVal = "Feature tree set but no corresponding items.";
            }
            else if (TreeItems.FeatureGroups != null && TreeItems.FeatureGroups.Groups != null
              && TreeItems.FeatureGroups.Groups.Count > 0
              && (!TreeItems.areTreeItemsAvailable || TreeItems.FeatureItems == null || TreeItems.FeatureItems.Count == 0))
            {
                RetVal = "Feature groups available but no corresponding feature items.";
            }

            return RetVal;
        }

        public string ValidateRolesContainer(UserRolesList Roles)
        {
            string RetVal = "";
            if ((Roles.RolesActiveInApp && Roles.UserRoles == null)
                || (Roles.RolesActiveInApp && Roles.UserRoles.Count == 0))
            {
                RetVal = "Expected to have roles in application but none available.";
            }
            else if (Roles.IsDirty && (Roles.UserRoles == null || Roles.UserRoles.Count == 0))
            {
                RetVal = "Roles set for user but no roles available to assign.";
            }

            return RetVal;
        }
    }
}
