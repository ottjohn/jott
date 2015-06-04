using System;
using System.Collections.Generic;
using System.Configuration.Provider;
using System.Configuration;
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

namespace MemberData.Members
{
    public class MemberOps
    {
        public string CheckUserExists(ILogger Logger, string UserName)
        {
            string RetVal = "";
            try
            {
                MembershipUser GenericUser = Membership.GetUser(UserName);
                if (GenericUser != null) RetVal = "User already exists.";
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.MemberOps.CheckUser", ex);
            }
            return RetVal;
        }

        public string ValidateUser(ILogger Logger, Guid UserId, string Password)
        {
            string RetVal = "Credentials provided are not valid.";
            try
            {
                MembershipUser User = Membership.GetUser(UserId);
                Membership.ValidateUser(User.UserName, Password);
                RetVal = "";
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.MemberOps.ValidateUser", ex);
            }
            return RetVal;
        }

        public Guid GetUserId(ILogger Logger, string UserName)
        {
            Guid UserId = Guid.Empty;
            try
            {
                MembershipUser GenericUser = Membership.GetUser(UserName);
                if (GenericUser != null) UserId = (Guid)GenericUser.ProviderUserKey;
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.GetUserId", ex);
            }
            return UserId;
        }

        public string GetRolesOnLogin(ILogger Logger, string UserName)
        {
            string RolesString = "";
            List<string> UserRoles = new List<string>();
            ;
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    var RetUserInRoles = Context.aspnet_UsersInRoles_GetRolesForUser("Cricket", UserName);
                    UserRoles.AddRange(RetUserInRoles.Select(x => x.RoleName));

                    int RoleLength = UserRoles.Count;
                    string[] UserRolesArray = new string[RoleLength];
                    for (int i = 0; i < RoleLength; i++)
                    {
                        UserRolesArray[i] = UserRoles[i];
                    }

                    RolesString = string.Join(",", UserRolesArray);
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.GetRolesOnLogin", ex);
            }

            return RolesString;
        }

        public string ApproveUser(ILogger Logger, Guid ApplicationId, bool UserApproved, Guid UserId)
        {
            string RetMessage = "";
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    string RetAppName = "";
                    string UserInApp = "";
                    MembershipUser User = Membership.GetUser(UserId);
                    Context.GetApplicationName(ApplicationId, User.UserName, ref RetAppName, ref UserInApp);

                    if (UserInApp == "")
                    {
                        Register Reg = new Register();
                        MembershipCreateStatus MembershipStatus = Reg.AddUserToApplication(Logger, RetAppName, User);
                        if (MembershipStatus != MembershipCreateStatus.Success) RetMessage = "Failed to create member in selected application.";
                    }
                    else
                    {
                        Membership.ApplicationName = RetAppName;
                        User.IsApproved = UserApproved;
                        Membership.UpdateUser(User);
                    }
                }

                Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.ApproveUser", ex);
                RetMessage = "Failed to approve user.";
            }
            return RetMessage;
        }

        public string UpdateUserInRoleForApp(ILogger Logger, string UserName, UserInRoles UserInRole, string ApplicationName)
        {
            string ReturnMessage = "";
            if (Roles.IsUserInRole(UserName, UserInRole.RoleName) && UserInRole.InRole == Guid.Empty)
            {
                try
                {
                    Roles.RemoveUserFromRole(UserName, UserInRole.RoleName);
                }
                catch (Exception ex)
                {
                    Logger.LogEvent("MemberData.Members.UpdateUserInRoleForApp", ex);
                    ReturnMessage = "Failed to remove user from role " + UserInRole.RoleName + " in application " + ApplicationName + ".";
                }
            }
            else if (!Roles.IsUserInRole(UserName, UserInRole.RoleName) && UserInRole.InRole != Guid.Empty)
            {
                try
                {
                    Roles.AddUserToRole(UserName, UserInRole.RoleName);
                }
                catch (Exception ex)
                {
                    Logger.LogEvent("MemberData.Members.UpdateUserInRoleForApp", ex);
                    ReturnMessage = "Failed to add user to role " + UserInRole.RoleName + " in application " + ApplicationName + ".";
                }
            }
            return ReturnMessage;
        }
    }
}
