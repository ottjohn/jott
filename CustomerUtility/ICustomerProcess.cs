using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomerUtility.Members;
using CustomerUtility.FeatureTree;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;

namespace CustomerUtility
{
    interface ICustomerProcess
    {
        FeatureTreeGroups AddFeatureTreeGroup(List<FeatureTreeItem> TreeItems, string FeatureGroupName, Guid ApplicationId);
        UserInformation AddUser(UserInformation CustInfo);
        string AssignProfile(MemberAppConfiguration MemberConfiguration, Guid UserId, bool UserApproved, Guid ApplicationId);
        PasswordManagement ChangeEmail(PasswordManagement ManagePassword);
        PasswordManagement ChangePassword(PasswordManagement ManagePassword);
        string CheckCricketConnection();
        string CheckUser(string UserName);
        CityStateList GetCityStateList(int PostalCode);
        string GetRolesOnLogin(string UserName);
        ExtMemberInfoManager GetUnapprovedMembers(int CurrentPage, int PageSize, string SortField, string SortDirection);
        ExtMemberInfoManager RetrieveSampleUsers(int CurrentPage, int PageSize, string SortField, string SortDirection);
        Guid GetUserId(string UserName);
        string MembershipMerge();
        FeatureTreeGroups RetrieveAppGroupNames(Guid ApplicationId);
        ApplicationList RetrieveAppList();
        FeatureTreeItems RetrieveFeatureList(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId);
        PasswordManagement RetrievePassword(PasswordManagement ManagePassword);
        PasswordManagement RetrieveSecurityQuestion(PasswordManagement ManagePassword);
        MemberConfigurationManager RetrieveUser(Guid UserId, string UserName, Guid ApplicationId);
        FeatureTreeGroups UpdateFeatureTreeGroup(List<FeatureTreeItem> TreeItems, int FeatureGroupNameId, Guid ApplicationId, Guid UserId);
    }
}
