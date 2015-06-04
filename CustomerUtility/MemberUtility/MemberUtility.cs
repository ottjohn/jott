using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MemberData;
using UtilityPot;
using UtilityPot.CommonValidation;
using CustomerUtility.FeatureTree;
using CustomerUtility.Cache;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using CustomerUtility.EmailHandler;
using UtilityPot.Logger;

namespace CustomerUtility.Members
{
    class MemberUtility
    {
        public ApplicationList RetrieveAppList()
        {
            MemberDataManager MP = new MemberDataManager();
            return MP.RetrieveAppList();
        }

        public string CheckCricketConnection()
        {
            MemberDataManager MP = new MemberDataManager();
            return MP.CheckCricketConnection();
        }

        public string MembershipMerge(ILogger Logger)
        {
            string RetVal = "";
            MemberDataManager MP = new MemberDataManager();
            RetVal = MP.MembershipMerge();
            int RetCode = BuildMemberManagementEmail(Logger, RetVal);
            return RetVal;
        }

        private int BuildMemberManagementEmail(ILogger Logger, string Message)
        {
            EmailProcess EP = new EmailProcess();
            return EP.BuildMessageEmail(Logger, Message);
        }

        public FeatureTreeItems RetrieveFeatureList(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId)
        {
            FeatureTreeItems TreeItems = new FeatureTreeItems { FeatureItems = new List<FeatureTreeItem>() };
            TreeItems.Message = ValidateRetrieveFeatureParams(UserName, UserId, GroupNameId, ApplicationId);
            if (TreeItems.Message == "")
            {
                FeatureTreeProcess FTP = new FeatureTreeProcess();
                TreeItems = FTP.RetrieveFeatureList(UserName, UserId, GroupNameId, ApplicationId);
                if (TreeItems.Message == "" && GroupNameId > 0) TreeItems.Message = SetFeatureListCache(TreeItems, UserId);
            }

            return TreeItems;
        }

        private string SetFeatureListCache(FeatureTreeItems TreeItems, Guid UserId)
        {
            FeatureTreeValidator FTV = new FeatureTreeValidator();
            string RetVal = FTV.ValidateFeatureTree(TreeItems, UserId, false, false);
            if (RetVal == "") CasheStore.SetCachedItem(UserId.ToString(), TreeItems);
            return RetVal;
        }

        private string ValidateRetrieveFeatureParams(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId)
        {
            MemberValidate MV = new MemberValidate();
            return MV.ValidateRetrieveFeatureParams(UserName, UserId, GroupNameId, ApplicationId);
        }
    }
}
