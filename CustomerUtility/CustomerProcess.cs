using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomerUtility.Members;
using CustomerUtility.FeatureTree;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using UtilityPot.Logger;

namespace CustomerUtility
{
    public class CustomerProcess : CustomerUtility.ICustomerProcess
    {
        private ILogger _Logger;
        public CustomerProcess()
        {
            this._Logger = LoggerFactory.GetLogger(null);
        }

        public CityStateList GetCityStateList(int PostalCode)
        {
            ContactUtility CU = new ContactUtility();
            return CU.GetCityStateList(PostalCode);
        }

        public string GetRolesOnLogin(string UserName)
        {
            MemberOps MO = new MemberOps();
            return MO.GetRolesOnLogin(UserName);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="UserName"></param>
        /// <returns></returns>
        public Guid GetUserId(string UserName)
        {
            MemberOps MO = new MemberOps();
            return MO.GetUserId(UserName);
        }

        /// <summary>
        /// This one has been validated mostly. 
        /// Still need to incorporate roles validation and assignment
        /// </summary>
        /// <param name="MemberConfiguration"></param>
        /// <param name="UserId"></param>
        /// <param name="UserApproved"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public string AssignProfile(MemberAppConfiguration MemberConfiguration, Guid UserId, bool UserApproved, Guid ApplicationId)
        {
            MemberOps MO = new MemberOps();
            return MO.AssignProfile(MemberConfiguration, UserId, UserApproved, ApplicationId);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="UserName"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public MemberConfigurationManager RetrieveUser(Guid UserId, string UserName, Guid ApplicationId)
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.RetrieveUser(UserId, UserName, ApplicationId);
        }

        /// <summary>
        /// Validated. 
        /// </summary>
        /// <param name="UserName"></param>
        /// <param name="UserId"></param>
        /// <param name="GroupNameId"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public FeatureTreeItems RetrieveFeatureList(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId)
        {
            MemberUtility MU = new MemberUtility();
            return MU.RetrieveFeatureList(UserName, UserId, GroupNameId, ApplicationId);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="TreeItems"></param>
        /// <param name="FeatureGroupName"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public FeatureTreeGroups AddFeatureTreeGroup(List<FeatureTreeItem> TreeItems, string FeatureGroupName, Guid ApplicationId)
        {
            FeatureTreeProcess FTP = new FeatureTreeProcess();
            return FTP.AddFeatureTreeGroup(TreeItems, FeatureGroupName, ApplicationId);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="TreeItems"></param>
        /// <param name="FeatureGroupNameId"></param>
        /// <param name="ApplicationId"></param>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public FeatureTreeGroups UpdateFeatureTreeGroup(List<FeatureTreeItem> TreeItems, int FeatureGroupNameId, Guid ApplicationId, Guid UserId)
        {
            FeatureTreeProcess FTP = new FeatureTreeProcess();
            return FTP.UpdateFeatureTreeGroup(TreeItems, FeatureGroupNameId, ApplicationId, UserId);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public FeatureTreeGroups RetrieveAppGroupNames(Guid ApplicationId)
        {
            FeatureTreeProcess FTP = new FeatureTreeProcess();
            return FTP.RetrieveAppGroupNames(ApplicationId);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="UserName"></param>
        /// <returns></returns>
        public string CheckUser(string UserName)
        {
            MemberOps MO = new MemberOps();
            return MO.CheckUser(UserName);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public string ValidateUser(Guid UserId, string Password)
        {
            MemberOps MO = new MemberOps();
            return MO.ValidateUser(UserId, Password);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="CustInfo"></param>
        /// <returns></returns>
        public UserInformation AddUser(UserInformation CustInfo)
        {
            Register Reg = new Register();
            return Reg.AddUser(CustInfo);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="ManagePassword"></param>
        /// <returns></returns>
        public PasswordManagement RetrieveSecurityQuestion(PasswordManagement ManagePassword)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.RetrieveSecurityQuestion(ManagePassword);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="ManagePassword"></param>
        /// <returns></returns>
        public PasswordManagement RetrievePassword(PasswordManagement ManagePassword)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.RetrievePassword(ManagePassword);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="ManagePassword"></param>
        /// <returns></returns>
        public PasswordManagement ChangePassword(PasswordManagement ManagePassword)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.ChangePassword(ManagePassword);
        }

        /// <summary>
        /// Validated
        /// </summary>
        /// <param name="ManagePassword"></param>
        /// <returns></returns>
        public PasswordManagement ChangeEmail(PasswordManagement ManagePassword)
        {
            PasswordMgmt PM = new PasswordMgmt();
            return PM.ChangeEmail(ManagePassword);
        }

        public ApplicationList RetrieveAppList()
        {
            MemberUtility MU = new MemberUtility();
            return MU.RetrieveAppList();
        }

        public ExtMemberInfoManager GetUnapprovedMembers(int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.GetUnapprovedMembers(CurrentPage, PageSize, SortField, SortDirection);
        }

        public ExtMemberInfoManager RetrieveSampleUsers(int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.RetrieveSampleUsers(CurrentPage, PageSize, SortField, SortDirection);
        }

        public string CheckCricketConnection()
        {
            MemberUtility MU = new MemberUtility();
            return MU.CheckCricketConnection();
        }

        public string MembershipMerge()
        {
            MemberUtility MU = new MemberUtility();
            return MU.MembershipMerge(_Logger);
        }

        public User GetUserShort()
        {
            MemberRetrieval MR = new MemberRetrieval();
            return MR.GetUserShort();
        }
    }
}
