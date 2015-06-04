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
using CustomerUtility.Validation;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;

namespace CustomerUtility.Members
{
    public class MemberOps
    {
        public string CheckUser(string UserName)
        {
            string RetVal = "";
            RetVal = StringExpressionDictionary.ValidateStringExpression(UserName, "UserName");
            if (RetVal == "")
            {
                MemberDataManager MP = new MemberDataManager();
                RetVal = MP.CheckUser(UserName);
            } 
            return RetVal;
        }

        public string ValidateUser(Guid UserId, string Password)
        {
            string RetVal = "";
            RetVal = StringExpressionDictionary.ValidateStringExpression(Password, "Password");

            if (RetVal == "")
            {
                MemberDataManager MP = new MemberDataManager();
                RetVal = MP.ValidateUser(UserId, Password);
            }

            return RetVal;
        }

        public Guid GetUserId(string UserName)
        {
            Guid UserId = Guid.Empty;
            if (StringExpressionDictionary.ValidateStringExpression(UserName, "UserName") == "")
            {
                MemberDataManager MP = new MemberDataManager();
                UserId = MP.GetUserId(UserName);
            }
            return UserId;
        }

        public string GetRolesOnLogin(string UserName)
        {
            string RetVal = "";
            RetVal = StringExpressionDictionary.ValidateStringExpression(UserName, "UserName");
            if (RetVal == "")
            {
                MemberDataManager MP = new MemberDataManager();
                RetVal = MP.GetRolesOnLogin(UserName);
            }
            return RetVal;
        }

        /// <summary>
        /// 0. Check object for completeness first. Also, try to incorporate your checksum idea.
        /// 
        /// set flags based upon what's available
        /// 
        /// 0. Check for inactivating member -> if inactivating, then there is nothing else to do
        /// 
        /// if NOT inactivating ... Validate both FIRST
        /// 
        /// 1. Validate profile tree --> if isDirty, apply changes
        /// 2. Validate roles -->   if is Dirty, apply changes
        /// </summary>
        /// <param name="MemberConfiguration"></param>
        /// <param name="UserId"></param>
        /// <param name="UserApproved"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public string AssignProfile(MemberAppConfiguration MemberConfiguration, Guid UserId, bool UserApproved, Guid ApplicationId)
        {
            string RetVal = CheckUserAndAppId(UserId, ApplicationId);
            if (RetVal == "") RetVal = ValidateMemberAppConfigStructure(MemberConfiguration);
            if (RetVal == "")
            {
                if (CheckUserInactivated(UserId, UserApproved, ApplicationId)) 
                    ApproveUser(UserApproved, ApplicationId, UserId);

                if (MemberConfiguration.TreeItems != null && MemberConfiguration.TreeItems.areTreeItemsAvailable && MemberConfiguration.TreeItems.isDirty)
                {
                    RetVal = AssignFeatureTree(MemberConfiguration.TreeItems, UserId, ApplicationId);
                }
            }

            return RetVal;
        }

        private string CheckUserAndAppId(Guid UserId, Guid ApplicationId)
        {
            MemberValidate MV = new MemberValidate();
            string RetVal = MV.ValidateGUIDId(UserId, "UserId");
            if (RetVal == "") RetVal = MV.ValidateGUIDId(ApplicationId, "ApplicationId");
            return RetVal;
        }

        private string ValidateMemberAppConfigStructure(MemberAppConfiguration MemberConfiguration)
        {
            MemberConfigStructure MCS = new MemberConfigStructure();
            return MCS.ValidateMemberAppConfigStructure(MemberConfiguration);
        }

        private bool CheckUserInactivated(Guid UserId, bool UserApproved, Guid ApplicationId)
        {
            MemberValidate MV = new MemberValidate();
            return MV.CheckUserInactivated(UserId, UserApproved, ApplicationId);
        }

        /// <summary>
        /// Under ValidateFeatureTree, true refers to isCompare, in which the incoming 
        /// feature tree needs to be compared against the cached feature tree
        /// </summary>
        /// <param name="TreeItems"></param>
        /// <param name="UserId"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        private string AssignFeatureTree(FeatureTreeItems TreeItems, Guid UserId, Guid ApplicationId)
        {
            FeatureTreeValidator FTV = new FeatureTreeValidator();
            string RetVal = FTV.ValidateFeatureTree(TreeItems, UserId, true, true);
            if (RetVal == "")
            {
                MemberDataManager MP = new MemberDataManager();
                RetVal = MP.AssignFeatureTree(TreeItems, UserId, ApplicationId);
            }

            return RetVal;
        }

        private string ApproveUser(bool UserApproved, Guid ApplicationId, Guid UserId)
        {
            MemberDataManager MDM = new MemberDataManager();
            return MDM.ApproveUser(ApplicationId, UserApproved, UserId);
        }
    }
}
