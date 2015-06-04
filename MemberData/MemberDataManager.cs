using System;
using System.Collections.Generic;
using System.Configuration.Provider;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using System.Web;
using UtilityPot;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using MemberData.FeatureTree;
using MemberData.Members;
using UtilityPot.Logger;

namespace MemberData
{
    public class MemberDataManager : IMemberDataManager
    {
        private ILogger _Logger;
        public MemberDataManager()
        {
            this._Logger = LoggerFactory.GetLogger(null);
        }

        public string CheckUser(string UserName)
        {
            MemberOps MO = new MemberOps();
            return MO.CheckUserExists(_Logger, UserName);
        }

        public string ValidateUser(Guid UserId, string Password)
        {
            MemberOps MO = new MemberOps();
            return MO.ValidateUser(_Logger, UserId, Password);
        }

        public int AddUser(UserInformation CustInfo)
        {
            Register Reg = new Register();
            return Reg.AddUser(_Logger, CustInfo, 0, Guid.Empty, 0);
        }

        public Guid GetUserId(string UserName)
        {
            MemberOps MO = new MemberOps();
            return MO.GetUserId(_Logger, UserName);
        }

        public string GetRolesOnLogin(string UserName)
        {
            MemberOps MO = new MemberOps();
            return MO.GetRolesOnLogin(_Logger, UserName);
        }

        public string CheckCricketConnection()
        {
            Register Reg = new Register();
            return Reg.CheckCricketConnection(_Logger);
        }

        public string MembershipMerge()
        {
            Register Reg = new Register();
            return Reg.MembershipMerge(_Logger);
        }

        public string ChangePassword(PasswordManagement PasswordManager)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.ChangePassword(_Logger, PasswordManager);
        }

        public string ChangeEmail(PasswordManagement PasswordManager)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.ChangeEmail(_Logger, PasswordManager);
        }

        public string RetrieveSecurityQuestion(PasswordManagement ManagePassword)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.RetrieveSecurityQuestion(_Logger, ManagePassword);
        }

        public PasswordManagement RetrievePassword(PasswordManagement ManagePassword)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.RetrievePassword(_Logger, ManagePassword);
        }

        //public string AssignProfile(MemberAppConfiguration MemberConfiguration, Guid UserId, bool UserApproved, Guid ApplicationId)
        //{
        //    //Need to do an app check to see if we need to add member to the application itself
        //    string RetVal = ApproveUser(ApplicationId, UserApproved, UserId);
        //    if (RetVal == "")
        //    {
        //        if (MemberConfiguration.TreeItems.FeatureItems.Count > 0 && MemberConfiguration.TreeItems.isDirty)
        //        {

        //        }
        //    }
        //    return RetVal;
        //}

        public string AssignFeatureTree(FeatureTreeItems TreeItems, Guid UserId, Guid ApplicationId)
        {
            FeatureTreeManager FTM = new FeatureTreeManager();
            return FTM.AssignProfile(_Logger, TreeItems, UserId, ApplicationId);
        }

        public string ApproveUser(Guid ApplicationId, bool UserApproved, Guid UserId)
        {
            MemberOps MO = new MemberOps();
            return MO.ApproveUser(_Logger, ApplicationId, UserApproved, UserId);
        }

        public FeatureTreeGroups UpdateFeatureTreeGroup(List<FeatureTreeItem> TreeItems, int FeatureGroupNameId, Guid ApplicationId)
        {
            FeatureTreeManager FTM = new FeatureTreeManager();
            return FTM.UpdateFeatureTreeGroup(_Logger, TreeItems, FeatureGroupNameId, ApplicationId);
        }

        public FeatureTreeGroups RetrieveAppGroupNames(Guid ApplicationId)
        {
            FeatureTreeManager FTM = new FeatureTreeManager();
            return FTM.RetrieveAppGroupNames(_Logger, ApplicationId);
        }

        public ApplicationList RetrieveAppList()
        {
            FeatureTreeManager FTM = new FeatureTreeManager();
            return FTM.RetrieveAppList(_Logger);
        }

        public FeatureTreeGroups AddFeatureTreeGroup(List<FeatureTreeItem> TreeItems, string FeatureGroupName, Guid ApplicationId)
        {
            FeatureTreeManager FTM = new FeatureTreeManager();
            return FTM.AddFeatureTreeGroup(_Logger, TreeItems, FeatureGroupName, ApplicationId);
        }

        public FeatureTreeItems RetrieveFeatureList(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId)
        {
            FeatureTreeManager FTM = new FeatureTreeManager();
            return FTM.RetrieveFeatureList(_Logger, UserName, UserId, GroupNameId, ApplicationId);
        }

        public MemberConfigurationManager RetrieveUser(Guid UserId, string UserName, Guid ApplicationId)
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.RetrieveUser(_Logger, UserId, UserName, ApplicationId);
        }

        //public ExtMemberInfoManager GetPendingUsers(string UserId)
        //{
        //    MemberRetrieval MR = new MemberRetrieval();
        //    return MR.GetPendingUsers(_Logger, UserId);
        //}

        public ExtMemberInfoManager GetUnapprovedMembers(int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.GetUnapprovedMembers(_Logger, CurrentPage, PageSize, SortField, SortDirection);
        }

        public ExtMemberInfoManager RetrieveSampleUsers(int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.RetrieveSampleUsers(_Logger, CurrentPage, PageSize, SortField, SortDirection);
        }

        public User GetUserShort()
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.GetUserShort(_Logger);
        }
    }
}