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
    public class PasswordMgmt
    {
        public string ChangeEmail(ILogger Logger, PasswordManagement PasswordManager)
        {
            string OldEmail = "Email change failed. Please try again.";
            try
            {
                Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
                MembershipUser user = Membership.GetUser(PasswordManager.UserName.Value);
                OldEmail = user.Email;
                user.Email = PasswordManager.NewEmail.Value;
                Guid MemberId = (Guid)user.ProviderUserKey;
                Membership.UpdateUser(user);

                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Context.ChangeMemberEmail(MemberId, PasswordManager.NewEmail.Value);
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.ChangeEmail", ex);
            }

            return OldEmail;
        }

        public string ChangePassword(ILogger Logger, PasswordManagement PasswordManager)
        {
            PasswordManager.Message = "";
            try
            {
                Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
                MembershipUser user = Membership.GetUser(PasswordManager.UserName.Value);

                if (!user.ChangePassword(PasswordManager.OldPassword.Value, PasswordManager.NewPassword.Value))
                {
                    PasswordManager.Message = "Password change failed. Please try again.";
                }
                else
                {
                    PasswordManager.Message = user.Email;
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.ChangePassword", ex);
                PasswordManager.Message = "Password change failed. Problem communicating with system.";
            }

            return PasswordManager.Message;
        }

        public PasswordManagement RetrievePassword(ILogger Logger, PasswordManagement ManagePassword)
        {
            Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            MembershipUser user = Membership.GetUser(ManagePassword.UserName.Value);

            try
            {
                string Password = user.GetPassword(ManagePassword.SecurityAnswer.Value);
                string Email = user.Email;
                if (Password != "")
                {
                    ManagePassword.OldPassword.Value = Password;
                    ManagePassword.NewEmail.Value = Email;
                }
            }
            catch (MembershipPasswordException Mex)
            {
                Logger.LogEvent("MemberData.Members.RetrievePassword", Mex);
                ManagePassword.Message = Mex.Message;
            }
            catch (ProviderException Pex)
            {
                Logger.LogEvent("MemberData.Members.RetrievePassword", Pex);
                ManagePassword.Message = Pex.Message;
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.RetrievePassword", ex);
                ManagePassword.Message = "Problem communicating with server. Please try again later.";
            }

            return ManagePassword;
        }

        public string RetrieveSecurityQuestion(ILogger Logger, PasswordManagement ManagePassword)
        {
            ManagePassword.Message = "";
            Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            try
            {
                MembershipUser user = Membership.GetUser(ManagePassword.UserName.Value);
                if (user != null)
                    ManagePassword.SecurityQuestion.Value = user.PasswordQuestion;
                else
                    ManagePassword.Message = "User name not found. Please check it and try again.";
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.RetrieveSecurityQuestion", ex);
                ManagePassword.Message = "Problem communicating with the server. Please try again later.";
            }
            return ManagePassword.Message;
        }

    }
}
