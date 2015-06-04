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
    interface IMemberDataManager
    {
        string CheckUser(string UserName);
        string ValidateUser(Guid UserId, string Password);
        int AddUser(UserInformation CustInfo);
        Guid GetUserId(string UserName);
        string GetRolesOnLogin(string UserName);
        string ChangePassword(PasswordManagement PasswordManager);
        string ChangeEmail(PasswordManagement ManagePassword);
        PasswordManagement RetrievePassword(PasswordManagement ManagePassword);
        string RetrieveSecurityQuestion(PasswordManagement ManagePassword);
        FeatureTreeItems RetrieveFeatureList(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId);
        //Notifications UpdateUser(MemberConfigurationManager MemberUpdate);
        MemberConfigurationManager RetrieveUser(Guid UserId, string UserName, Guid ApplicationId);
        //ExtMemberInfoManager GetPendingUsers(string UserId);
        ExtMemberInfoManager GetUnapprovedMembers(int CurrentPage, int PageSize, string SortField, string SortDirection);
        ExtMemberInfoManager RetrieveSampleUsers(int CurrentPage, int PageSize, string SortField, string SortDirection);
        FeatureTreeGroups AddFeatureTreeGroup(List<FeatureTreeItem> TreeItems, string FeatureGroupName, Guid ApplicationId);
        FeatureTreeGroups UpdateFeatureTreeGroup(List<FeatureTreeItem> TreeItems, int FeatureGroupNameId, Guid ApplicationId);
        //string AssignProfile(MemberAppConfiguration MemberConfiguration, Guid UserId, bool UserApproved, Guid ApplicationId);
        string AssignFeatureTree(FeatureTreeItems TreeItems, Guid UserId, Guid ApplicationId);
        string MembershipMerge();
        ApplicationList RetrieveAppList();
        string CheckCricketConnection();
        FeatureTreeGroups RetrieveAppGroupNames(Guid ApplicationId);
        User GetUserShort();
    }
}
