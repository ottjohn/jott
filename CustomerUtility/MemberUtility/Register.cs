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
    public class Register
    {
        private ILogger _Logger;
        public Register()
        {
            this._Logger = LoggerFactory.GetLogger(null);
        }

        public UserInformation AddUser(UserInformation UserInfo)
        {
            MemberDataManager MP = new MemberDataManager();
            UserInfo.ErrorMessage = ValidateRegistrationData(UserInfo.RegInfo);
            UserInfo.UserCreateSuccess = 0;

            if (UserInfo.ErrorMessage == "")
            {
                UserInfo.UserCreateSuccess = MP.AddUser(UserInfo);
                if (UserInfo.UserCreateSuccess == 1) {

                    UserInfo.UserCreateSuccess = BuildRegEmail(UserInfo);
                    if (UserInfo.UserCreateSuccess != 1)
                        UserInfo.ErrorMessage = "User successfully registered, but notification email failed to send. ";
                    else
                        UserInfo.ErrorMessage = "User successfully registered. ";

                } else {

                    UserInfo.ErrorMessage = "Problem registering user. Please try again later. ";

                }   
            }

            return UserInfo;
        }

        private string ValidateRegistrationData(RegistrationInformation RegInfo)
        {
            MemberValidate MV = new MemberValidate();
            return MV.ValidateRegistrationData(_Logger, RegInfo);
        }
        
        private int BuildRegEmail(UserInformation UserInfo)
        {
            EmailProcess EP = new EmailProcess();
            return EP.BuildRegEmail(_Logger, UserInfo);
        }
    }
}
