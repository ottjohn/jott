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
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using CustomerUtility.EmailHandler;
using UtilityPot.Logger;

namespace CustomerUtility.Members
{
    public class PasswordMgmt
    {
        private ILogger _Logger;
        public PasswordMgmt()
        {
            this._Logger = LoggerFactory.GetLogger(null);
        }

        public PasswordManagement ChangeEmail(PasswordManagement ManagePassword)
        {
            MemberDataManager MP = new MemberDataManager();
            ManagePassword.Message = ValidatePMData(ManagePassword);
            if (ManagePassword.Message == "")
            {
                ManagePassword.Message = MP.ChangeEmail(ManagePassword);
                if (ManagePassword.Message.IndexOf("failed") == -1)
                {
                    string AccountManageTitle = ConfigurationManager.AppSettings["ChangeEmailTitle"].ToString();
                    ManagePassword.Message = BuildNotificationEmail(ManagePassword, AccountManageTitle, ManagePassword.NewEmail.Value);
                }
            }
            return ManagePassword;
        }

        public PasswordManagement ChangePassword(PasswordManagement ManagePassword)
        {
            MemberDataManager MP = new MemberDataManager();
            ManagePassword.Message = ValidatePMData(ManagePassword);
            if (ManagePassword.Message == "")
            {
                ManagePassword.Message = MP.ChangePassword(ManagePassword);
                if (ManagePassword.Message.IndexOf("failed") == -1)
                {
                    string AccountManageTitle = ConfigurationManager.AppSettings["ChangePasswordTitle"].ToString();
                    ManagePassword.Message = BuildNotificationEmail(ManagePassword, AccountManageTitle, ManagePassword.Message);
                }
            }
            return ManagePassword;
        }

        public PasswordManagement RetrievePassword(PasswordManagement ManagePassword)
        {
            MemberDataManager MP = new MemberDataManager();
            ManagePassword.Message = ValidatePMData(ManagePassword);
            if (ManagePassword.Message == "")
            {
                ManagePassword = MP.RetrievePassword(ManagePassword);
                if (ManagePassword.NewEmail.Value != "" && ManagePassword.OldPassword.Value != "")
                {
                    string AccountManageTitle = ConfigurationManager.AppSettings["GetPasswordTitle"].ToString();
                    ManagePassword.Message = BuildNotificationEmail(ManagePassword, AccountManageTitle, ManagePassword.NewEmail.Value);
                }
            }
            return ManagePassword;
        }

        public PasswordManagement RetrieveSecurityQuestion(PasswordManagement ManagePassword)
        {
            MemberDataManager MP = new MemberDataManager();
            ManagePassword.Message = ValidatePMData(ManagePassword);
            if (ManagePassword.Message == "") ManagePassword.Message = MP.RetrieveSecurityQuestion(ManagePassword);
            return ManagePassword;
        }

        private string ValidatePMData(PasswordManagement ManagePassword)
        {
            MemberValidate MV = new MemberValidate();
            return MV.ValidatePMData(_Logger, ManagePassword);
        }

        public string BuildNotificationEmail(PasswordManagement PasswordManager, string Title, string Email)
        {
            EmailProcess EP = new EmailProcess();
            return EP.BuildNotificationEmail(_Logger, PasswordManager, Title, Email);

        }
    }
}
