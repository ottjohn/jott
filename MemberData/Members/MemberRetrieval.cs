using System;
using System.Collections.Generic;
using System.Configuration.Provider;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using System.Web;
using UtilityPot;
using UtilityPot.Logger;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using MemberData.FeatureTree;
using System.Configuration;

namespace MemberData.Members
{
    public class MemberRetrieval
    {
        public MemberConfigurationManager RetrieveUser(ILogger Logger, Guid UserId, string UserName, Guid ApplicationId)
        {
            MemberConfigurationManager MemberAppConfig = new MemberConfigurationManager
            {
                UserInfo = new User(),
                MemberConfiguration = new MemberAppConfiguration
                {
                    UserApps = new UserApplicationList{ UserInApp = new List<UserInApplication>() },
                    Roles = new UserRolesList{ UserRoles = new List<UserInRoles>() },
                    TreeItems = new FeatureTreeItems
                    {
                        FeatureItems = new List<FeatureTreeItem>(),
                        FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>() }
                    }
                }
            };

            MemberAppConfig.Message = "Success";

            try
            {
                if (UserId != Guid.Empty)
                {
                    using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                    {
                        if (ApplicationId == Guid.Empty) ApplicationId = Guid.Parse(ConfigurationManager.AppSettings["LoginAppId"]);

                        //Get User Info 
                        MemberAppConfig.UserInfo = GetMemberDetails(UserId);
                        MemberAppConfig.Message = MemberAppConfig.UserInfo.Message;

                        //Get User Apps -- process stop if non-empty message here
                        if (MemberAppConfig.Message == "")
                        {
                            MemberAppConfig.MemberConfiguration.UserApps = GetMemberApps(UserName, ApplicationId);
                            MemberAppConfig.Message = MemberAppConfig.MemberConfiguration.UserApps.Message;
                        } 

                        //Get User Roles -- process stop if non-empty message here
                        if (MemberAppConfig.Message == "")
                        {
                            MemberAppConfig.MemberConfiguration.Roles = GetMemberRoles(UserName, ApplicationId);
                            MemberAppConfig.MemberConfiguration.Message = MemberAppConfig.MemberConfiguration.Roles.Message;
                        }

                        //Get User Roles -- process stop if non-empty message here
                        if (MemberAppConfig.Message == "")
                        {
                            MemberAppConfig.MemberConfiguration.TreeItems = GetFeatureTreeItems(Logger, ApplicationId, UserName, UserId);
                            MemberAppConfig.MemberConfiguration.Message = MemberAppConfig.MemberConfiguration.TreeItems.Message;
                        } 
                    }
                }
                else
                {
                    MemberAppConfig.Message = "User not found.";
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.RetrieveUser", ex);
                MemberAppConfig.Message = "Problem communicating with server. Please try again later.";
            }

            return MemberAppConfig;

        }

        private UserRolesList GetMemberRoles(string UserName, Guid ApplicationId)
        {
            UserRolesList Roles = new UserRolesList { UserRoles = new List<UserInRoles>() };
            Roles.Message = "";
            using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
            {
                var UserInRoles = Context.GetUserInRolesForApp(UserName, ApplicationId).ToList();
                if (UserInRoles != null && UserInRoles.Count > 0)
                {
                    Roles.UserRoles.AddRange(UserInRoles.Select(x => new UserInRoles { ApplicationId = x.ApplicationId, InRole = x.UserInRole, RoleName = x.RoleName, RoleId = x.RoleId, IsActive = x.IsActive.Value }));
                    Roles.IsDirty = false;
                    if (Roles.UserRoles[0].IsActive) Roles.RolesActiveInApp = true;
                }
                else
                {
                    Roles.RolesActiveInApp = false;
                    Roles.Message = "There appear to be no roles defined in database.";
                }
            }
            return Roles;
        }

        private UserApplicationList GetMemberApps(string UserName, Guid ApplicationId) 
        {
            UserApplicationList UserApps = new UserApplicationList { UserInApp = new List<UserInApplication>() };
            UserApps.Message = "";

            using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
            {
                var UserInApps = Context.GetUserInApps(UserName).ToList();
                if (UserInApps.Count > 0)
                {
                    UserApps.UserInApp.AddRange(UserInApps.Select(x => new UserInApplication { ApplicationID = x.ApplicationId, ApplicationName = x.ApplicationName, IsUserApproved = x.IsApproved }));
                    UserApps.DefaultApplication = ConfigurationManager.AppSettings["DefaultApplication"];
                    UserApps.SelectedApplicationId = ApplicationId;
                    UserApps.IsDirty = false;
                }
            }

            return UserApps;
        }

        private User GetMemberDetails(Guid UserId) 
        {
            User UserInfo = new User();
            UserInfo.Message = "";

            using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
            {
                var MemberDetails = Context.GetExtMemberDetails(UserId).ToList();
                if (MemberDetails.Count() > 0)
                {
                    UserInfo.FirstName = MemberDetails[0].FirstName;
                    UserInfo.LastName = MemberDetails[0].LastName;
                    UserInfo.UserName = MemberDetails[0].UserName;
                    UserInfo.UserId = UserId;
                }
                else
                {
                    UserInfo.Message = "Failed to retrieve user.";
                }
            }

            return UserInfo;

        }

        private FeatureTreeItems GetFeatureTreeItems(ILogger Logger, Guid ApplicationId, string UserName, Guid UserId) {

            Nullable<int> GroupId = null;
            FeatureTreeItems TreeItems = new FeatureTreeItems
            {
                FeatureItems = new List<FeatureTreeItem>(),
                FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>(), Message = "" }
            };

            FeatureTreeManager FTM = new FeatureTreeManager();
            TreeItems = FTM.RetrieveFeatureList(Logger, UserName, UserId, GroupId, ApplicationId);
            if (TreeItems.Message == "" && TreeItems.FeatureItems != null && TreeItems.FeatureItems.Count > 0)
            {
                TreeItems.areTreeItemsAvailable = true;
                TreeItems.FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
                TreeItems.AssignGroupNameId = TreeItems.FeatureItems[0].GroupNameId;
                TreeItems.FeatureGroups = FTM.GetFeatureTreeGroups(Logger, ApplicationId);
                if (TreeItems.FeatureGroups.Message != "") TreeItems.Message = TreeItems.FeatureGroups.Message;
            }
            else
            {
                TreeItems.areTreeItemsAvailable = false;
            }

            return TreeItems;
        }

        private FeatureTreeGroups GetFeatureTreeGroups(ILogger Logger, Guid ApplicationId)
        {
            FeatureTreeGroups FeatureGroups = new FeatureTreeGroups { Groups = new List<FeatureGroup>() };
            try
            {
                FeatureTreeManager FTM = new FeatureTreeManager();
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    FeatureGroups = FTM.GetFeatureTreeGroups(Logger, ApplicationId);
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.GetFeatureTreeGroups", ex);
                FeatureGroups.Message = "Failed to retrieve feature groups.";
            }

            return FeatureGroups;

        }

        public ExtMemberInfoManager RetrieveSampleUsers(ILogger Logger, int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            ExtMemberInfoManager MemberManager = new ExtMemberInfoManager { ExtendedMemberInfo = new List<ExtendedMemberInfo>() };
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    //int RecordCount = 0;

                    //if (Convert.ToInt32(CurrentPage) == 1)
                    //{
                    //RecordCount = GetRecordCount(Logger, ConfigurationManager.AppSettings["RegistrationApplication"]);
                    //}

                    //if (RecordCount != 0) 
                    MemberManager.RecordCount = 16;

                    var ReturnedCricketMemberList = Context.GetSampleData(CurrentPage, PageSize, SortField, SortDirection);
                    MemberManager.ExtendedMemberInfo.AddRange(ReturnedCricketMemberList.Select(x => new ExtendedMemberInfo
                    {
                        Id = x.id.Value,
                        UserName = x.UserName,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        Email = x.email
                    }));
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.GetUnapprovedMembers", ex);
            }

            return MemberManager;
        }

        public ExtMemberInfoManager GetUnapprovedMembers(ILogger Logger, int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            ExtMemberInfoManager MemberManager = new ExtMemberInfoManager { ExtendedMemberInfo = new List<ExtendedMemberInfo>() };
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext()) 
                {
                    int RecordCount = 0;

                    //if (Convert.ToInt32(CurrentPage) == 1)
                    //{
                        RecordCount = GetRecordCount(Logger, ConfigurationManager.AppSettings["RegistrationApplication"]);
                    //}

                    if (RecordCount != 0) MemberManager.RecordCount = RecordCount;

                    var ReturnedCricketMemberList = Context.GetAllUnapprovedMembers(CurrentPage, PageSize, SortField, SortDirection);
                    MemberManager.ExtendedMemberInfo.AddRange(ReturnedCricketMemberList.Select(x => new ExtendedMemberInfo
                    {
                        UserId = (Guid)x.MemberUserId,
                        UserName = x.UserName,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        Email = x.email
                    }));
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.GetUnapprovedMembers", ex);
            }

            return MemberManager;
        }

        private int GetRecordCount(ILogger Logger, string AppName)
        {
            int RecordCount = 0;

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Nullable<int> iRecordCount = 0;
                    Context.GetRecordCount(AppName, 0, ref iRecordCount);
                    RecordCount = iRecordCount.Value;
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.GetRecordCount", ex);
            }

            return RecordCount;

        }

        public User GetUserShort(ILogger Logger)
        {
            User MembershipUser = new User();
            try
            {
                string UserName = HttpContext.Current.User.Identity.Name.ToString();
                MembershipUser Member = Membership.GetUser(UserName);
                MembershipUser.UserEmail = Member.Email;
                MembershipUser.UserName = UserName;
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.GetRecordCount", ex);
            }

            return MembershipUser;
        }
    }
}
