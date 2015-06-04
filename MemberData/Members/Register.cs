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
using System.IO;

namespace MemberData.Members
{
    public class Register
    {
        public int AddUser(ILogger Logger, UserInformation CustInfo, int StoreId, Guid ApplicationId, int AppUserId)
        {
            int RetVal = 0;
            MembershipCreateStatus MembershipStatus = AddUserToMembership(Logger, CustInfo);
            if (MembershipStatus == MembershipCreateStatus.Success)
            {
                MembershipUser GenericUser = Membership.GetUser(CustInfo.RegInfo.UserName.Value);
                MembershipStatus = AddUserInformation(Logger, CustInfo, (Guid)GenericUser.ProviderUserKey, StoreId, ApplicationId, AppUserId);
            }

            if (MembershipStatus == MembershipCreateStatus.Success || MembershipStatus == MembershipCreateStatus.DuplicateUserName) RetVal = 1;

            return RetVal;
        }

        /// <summary>
        /// TAKE TRUE OUT WHEN CRICKET MEMBERS MIGRATED
        /// </summary>
        /// <param name="CustInfo"></param>
        /// <returns></returns>
        private MembershipCreateStatus AddUserToMembership(ILogger Logger, UserInformation CustInfo)
        {
            MembershipCreateStatus MembershipStatus = MembershipCreateStatus.Success;
            Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            try
            {
                //int TestThis = Membership.MinRequiredPasswordLength;
                //string TestThis1 = Membership.PasswordStrengthRegularExpression;
                //int TestThis2 = Membership.MinRequiredNonAlphanumericCharacters;

                MembershipUser NewMember = Membership.CreateUser(
                    CustInfo.RegInfo.UserName.Value, CustInfo.RegInfo.Password.Value, CustInfo.RegInfo.Email.Value,
                    CustInfo.RegInfo.Question.Value, CustInfo.RegInfo.Answer.Value, false, out MembershipStatus);
                return MembershipStatus;
            }
            catch (MembershipCreateUserException ex)
            {
                Logger.LogEvent("MemberData.Members.AddUserToMembership", ex);
                MembershipStatus = ex.StatusCode;
            }
            return MembershipStatus;
        }

        private MembershipCreateStatus AddUserInformation(ILogger Logger, UserInformation CustInfo, Guid UserId, int StoreId, Guid ApplicationId, int AppUserId)
        {
            MembershipCreateStatus MembershipStatus = MembershipCreateStatus.Success;

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Context.InsertExtendedMemberInfo(CustInfo.RegInfo.FirstName.Value, CustInfo.RegInfo.LastName.Value, CustInfo.RegInfo.Email.Value, UserId, ApplicationId, CustInfo.RegInfo.UserName.Value, StoreId, AppUserId);
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.AddUserInformation", ex);
                MembershipStatus = MembershipCreateStatus.ProviderError;
            }

            return MembershipStatus;
        }

        public MembershipCreateStatus AddUserToApplication(ILogger Logger, string ApplicationName, MembershipUser User)
        {
            MembershipCreateStatus MembershipStatus = MembershipCreateStatus.Success;
            string UserName = User.UserName;
            string Password = User.GetPassword();
            string Email = User.Email;
            
            try
            {
                Membership.ApplicationName = ApplicationName;
                MembershipUser NewMember = Membership.CreateUser(
                    UserName, Password, Email,
                    ApplicationName, ApplicationName, true, out MembershipStatus);
                return MembershipStatus;
            }
            catch (MembershipCreateUserException ex)
            {
                Logger.LogEvent("MemberData.Members.AddUserToMembership", ex);
                MembershipStatus = ex.StatusCode;
            }
            return MembershipStatus;
        }

        private string CreateNewMembersPayday(ILogger Logger, ExternalMembers Items)
        {
            string RetMessage = "";
            try
            {
                MemberOps MO = new MemberOps();
                UserInRoles UserRoles = new UserInRoles();
                UserRoles.ApplicationId = new Guid("6B77B6CE-8E8F-40C4-A6F0-1A6CAC499232");
                UserRoles.InRole = new Guid("0AF7E546-C594-448B-BD61-CB7A4B50E77D");
                UserRoles.RoleName = "User";

                int iLen = Items.Members.Count;
                for (int i = 0; i < iLen; i++)
                {
                    string LastName = "";
                    string FirstName = "";

                    if (Items.Members[i].Username.Trim().IndexOf(" ") > -1)
                    {
                        string[] NameParts = Items.Members[i].Username.Split(' ');
                        LastName = NameParts[0].Trim();
                        FirstName = NameParts[NameParts.Length - 1].Trim();
                    }
                    else
                    {
                        LastName = Items.Members[i].Username.Trim();
                        FirstName = "NFN";
                    }

                    string UserName = Items.Members[i].Username.Replace(" ", "");

                    UserInformation UserInfo = new UserInformation
                    {
                        RegInfo = new RegistrationInformation
                        {
                            Answer = new FieldTemplate<string> { Value = "Employee" },
                            Question = new FieldTemplate<string> { Value = "Payday" },
                            Email = new FieldTemplate<string> { Value = "iteachrrr@hotmail.com" },
                            FirstName = new FieldTemplate<string> { Value = FirstName },
                            LastName = new FieldTemplate<string> { Value = LastName },
                            Password = new FieldTemplate<string> { Value = "1@" + Items.Members[i].Password },
                            UserName = new FieldTemplate<string> { Value = UserName }
                        }
                    };

                    //Add user to Membership
                    int Success = AddUser(Logger, UserInfo, Items.Members[i].StoreId, UserRoles.ApplicationId, Items.Members[i].UserId);

                    if (Success == 1)
                    {
                        //Add userid from Membership to tblAccount table
                        RetMessage = AddMembershipIdToPayday(Logger, Items.Members[i].UserId, UserName);

                        if (RetMessage == "")
                        {
                            //Add user to the Cricket application
                            Success = AddPaydayUserToPaydayApp(Logger, UserInfo);

                            if (Success == 1)
                            {
                                //Update user roles in Cricket
                                RetMessage = MO.UpdateUserInRoleForApp(Logger, UserName, UserRoles, "Payday");
                            }
                            else
                            {
                                RetMessage = "Failed to add Cricket use to Cricket app.";
                            }
                        }
                        else
                        {
                            RetMessage = "Failed to add MembershipId to Cricket database.";
                        }
                    }
                    else
                    {
                        RetMessage = "Failed to add user to Membership.";
                    }
                    
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.CreateNewMembers", ex);
            }

            return RetMessage;
        }

        private string AddMembershipIdToPayday(ILogger Logger, int UserId, string UserName)
        {
            string RetVal = "";
            try
            {
                MembershipUser User = Membership.GetUser(UserName);
                Guid MemberShipId = (Guid)User.ProviderUserKey;

                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Context.UpdatePaydayUserTable(UserId, MemberShipId);
                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to update Payday users table.";
                Logger.LogEvent("MemberData.Members.AddMembershipIdToCricket", ex);
            }

            return RetVal;
        }

        /// <summary>
        /// combine these two
        /// </summary>
        /// <param name="Logger"></param>
        /// <param name="CustInfo"></param>
        /// <returns></returns>
        private int AddPaydayUserToPaydayApp(ILogger Logger, UserInformation CustInfo)
        {
            int RetVal = 0;
            MembershipCreateStatus MembershipStatus = MembershipCreateStatus.Success;
            Membership.ApplicationName = "Payday";
            try
            {
                MembershipUser NewMember = Membership.CreateUser(
                    CustInfo.RegInfo.UserName.Value, CustInfo.RegInfo.Password.Value, CustInfo.RegInfo.Email.Value,
                    CustInfo.RegInfo.Question.Value, CustInfo.RegInfo.Answer.Value, true, out MembershipStatus);

                if (MembershipStatus == MembershipCreateStatus.Success) RetVal = 1; ;
            }
            catch (MembershipCreateUserException ex)
            {
                Logger.LogEvent("MemberData.Members.AddPaydayUserToPaydayApp", ex);
                MembershipStatus = ex.StatusCode;
            }
            return RetVal;
        }

        /// <summary>
        /// THE METHOD BELOW IS TEMPORARY
        /// IT'S FUNCTION IS TO RETRIEVE CURRENT CRICKET MEMBERSHIP AND
        /// IMPORT THAT MEMBERSHIP INTO THE NEW MEMBERSHIP DATABASE.
        /// </summary>
        /// <returns></returns>
        private string CreateNewMembersCricket(ILogger Logger, ExternalMembers Items)
        {
            string RetMessage = "";
            try
            {
                MemberOps MO = new MemberOps();
                UserInRoles UserRoles = new UserInRoles();
                UserRoles.ApplicationId = new Guid("8B483989-9E88-444D-AA19-688DCA94A064");
                UserRoles.InRole = new Guid("BF2B761D-2484-40DA-BF26-EA9A7D964D11");
                UserRoles.RoleName = "User";

                int iLen = Items.Members.Count;
                for (int i = 0; i < iLen; i++)
                {
                    if (Items.Members[i].Username == "Megan Ott")
                    {

                    }
                    else
                    {
                        string LastName = "";
                        if (Items.Members[i].LastName != null)
                        {
                            LastName = Items.Members[i].LastName;
                        }
                        else
                        {
                            string[] NameParts = Items.Members[i].Username.Split(' ');
                            if (NameParts.Length > 1)
                            {
                                LastName = Items.Members[i].Username.Replace(NameParts[0], "");
                                LastName = LastName.Trim();
                            }
                            else
                            {
                                LastName = Items.Members[i].Username;
                            }
                        }

                        string UserName = Items.Members[i].Username.Replace(" ", "");

                        UserInformation UserInfo = new UserInformation
                        {
                            RegInfo = new RegistrationInformation 
                            {
                                Answer = new FieldTemplate<string> { Value = "Employee" },
                                Question = new FieldTemplate<string> { Value = "Cricket" },
                                Email = new FieldTemplate<string> { Value = "iteachrrr@hotmail.com" },
                                FirstName = new FieldTemplate<string> { Value = Items.Members[i].SaleName },
                                LastName = new FieldTemplate<string> { Value = LastName },
                                Password = new FieldTemplate<string> { Value = "1@" + Items.Members[i].Password },
                                UserName = new FieldTemplate<string> { Value = UserName }
                            }
                        };

                        //Add user to Membership
                        int Success = AddUser(Logger, UserInfo, Items.Members[i].StoreId, UserRoles.ApplicationId, Items.Members[i].UserId);

                        if (Success == 1)
                        {
                            //Add userid from Membership to Cricket table
                            RetMessage = AddMembershipIdToCricket(Logger, Items.Members[i].UserId, UserName);

                            if (RetMessage == "")
                            {
                                //Add user to the Cricket application
                                Success = AddCricketUserToCricketApp(Logger, UserInfo);

                                if (Success == 1)
                                {
                                    //Update user roles in Cricket
                                    RetMessage = MO.UpdateUserInRoleForApp(Logger, UserName, UserRoles, "Cricket");
                                }
                                else
                                {
                                    RetMessage = "Failed to add Cricket use to Cricket app.";
                                }
                            }
                            else
                            {
                                RetMessage = "Failed to add MembershipId to Cricket database.";
                            }
                        }
                        else
                        {
                            RetMessage = "Failed to add user to Membership.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.CreateNewMembers", ex);
            }

            return RetMessage;
        }

        /// <summary>
        /// TAKE OUT WHEN CRICKET MEMBERS MIGRATED
        /// </summary>
        /// <param name="CustInfo"></param>
        /// <returns></returns>
        private int AddCricketUserToCricketApp(ILogger Logger, UserInformation CustInfo)
        {
            int RetVal = 0;
            MembershipCreateStatus MembershipStatus = MembershipCreateStatus.Success;
            Membership.ApplicationName = "Cricket";
            try
            {
                MembershipUser NewMember = Membership.CreateUser(
                    CustInfo.RegInfo.UserName.Value, CustInfo.RegInfo.Password.Value, CustInfo.RegInfo.Email.Value,
                    CustInfo.RegInfo.Question.Value, CustInfo.RegInfo.Answer.Value, true, out MembershipStatus);

                if (MembershipStatus == MembershipCreateStatus.Success) RetVal = 1; ;
            }
            catch (MembershipCreateUserException ex)
            {
                Logger.LogEvent("MemberData.Members.AddCricketUserToCricketApp", ex);
                MembershipStatus = ex.StatusCode;
            }
            return RetVal;
        }

        private string AddMembershipIdToCricket(ILogger Logger, int UserId, string UserName)
        {
            string RetVal = "";
            try
            {
                MembershipUser User = Membership.GetUser(UserName);
                Guid MemberShipId = (Guid)User.ProviderUserKey;

                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Context.UpdateCricketUserTable(UserId, MemberShipId);
                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to update Cricket users table.";
                Logger.LogEvent("MemberData.Members.AddMembershipIdToCricket", ex);
            }

            return RetVal;
        }

        /// <summary>
        /// Put member retire calls in here.
        /// </summary>
        /// <param name="Logger"></param>
        /// <param name="ApplicationName"></param>
        /// <returns></returns>
        public string MembershipMerge(ILogger Logger)
        {
            string RetVal = "";
            RetVal = MembershipMerge_Cricket(Logger, "Cricket");
            RetVal += RetireInactiveCricketUsers(Logger);
            RetVal += "<p />" + MembershipMerge_Payday(Logger, "Payday");
            RetVal += RetireInactivePaydayUsers(Logger);
            return RetVal;
        }

        private string PasswordUpdateForApps(ILogger Logger, string ApplicationName)
        {
            string RetVal = "";
            List<MemberPswdUpdate> PasswordUpdateList = new List<MemberPswdUpdate>();

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext()) 
                {
                    var ReturnedItems = Context.GetActiveMembersForPswdUpdate(ApplicationName);
                    PasswordUpdateList.AddRange(ReturnedItems.Select(x => new MemberPswdUpdate
                    {
                        AppUserId = x.AppUserId.Value,
                        NewPassword = x.NewPassword,
                        UserId = x.UserId.Value,
                        UserName = x.UserName
                    }));
                }

                if (PasswordUpdateList.Count > 0)
                {
                    RetVal = UpdatePasswords(Logger, ApplicationName, PasswordUpdateList);
                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to update user passwords for application " + ApplicationName + ".";
                Logger.LogEvent("MemberData.Members.PasswordUpdateForApps", ex);
            }

            return RetVal;
        }

        private string UpdatePasswords(ILogger Logger, string ApplicationName, List<MemberPswdUpdate> PasswordUpdateList)
        {
            string RetVal = "";
            int Count = 0;
            int ListLen = PasswordUpdateList.Count;
            for (var i = 0; i < ListLen; i++)
            {
                MembershipUser user = Membership.GetUser(PasswordUpdateList[i].UserName);
                string Password = user.GetPassword("Employee");
                if(Password != PasswordUpdateList[i].NewPassword) 
                {
                    if (user.ChangePassword(Password, PasswordUpdateList[i].NewPassword))
                    {
                        Count++;
                    }
                }
            }

            RetVal = Convert.ToString(Count) + " of " + Convert.ToString(ListLen + 1) + " Passwords updated.";
            LogMemberManagementAction(ApplicationName, "PasswordChange", Count, Logger);
            return RetVal;
        }

        private string RetireInactivePaydayUsers(ILogger Logger)
        {
            string RetVal = "";

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Nullable<int> ReturnedCount = 0;
                    Context.RetireInactivePaydayMembers(ref ReturnedCount);
                    RetVal = " " + Convert.ToString(ReturnedCount) + " Payday users retired.";
                    LogMemberManagementAction("Cricket", "Retire", Convert.ToInt32(ReturnedCount), Logger);
                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to inactivate Payday users.";
                Logger.LogEvent("MemberData.Members.RetireInactiveCricketUsers", ex);
            }

            return RetVal;
        }

        private string RetireInactiveCricketUsers(ILogger Logger)
        {
            string RetVal = "";

            try
            {
                using(GenericMembershipDataContext Context = new GenericMembershipDataContext()) 
                {
                    Nullable<int> ReturnedCount = 0;
                    Context.RetireInactiveCricketMembers(ref ReturnedCount);
                    RetVal = " " + Convert.ToString(ReturnedCount) + " Cricket users retired.";
                    LogMemberManagementAction("Cricket", "Retire", Convert.ToInt32(ReturnedCount), Logger);
                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to inactivate Cricket users.";
                Logger.LogEvent("MemberData.Members.RetireInactiveCricketUsers", ex);
            }

            return RetVal;
        }

        public string MembershipMerge_Payday(ILogger Logger, string ApplicationName)
        {
            string RetVal = "Payday membership merge was successful. ";
            Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            ExternalMembers MemberItems = new ExternalMembers { Members = new List<ExternalMemberData>() };
            ExternalMembers MemberItemsTemp = new ExternalMembers { Members = new List<ExternalMemberData>() };

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    var ReturnedMembers = Context.GetCurrentPaydayEmployees();
                    MemberItems.Members.AddRange(ReturnedMembers.Select(x => new ExternalMemberData
                    {
                        Username = x.user_name,
                        UserId = x.user_id,
                        Password = x.password,
                        StoreId = x.StoreId
                    }));

                    if (MemberItems.Members.Count > 0)
                    {
                        RetVal += " " + Convert.ToString(MemberItems.Members.Count) + " new members added. ";
                        CreateNewMembersPayday(Logger, MemberItems);
                        LogMemberManagementAction("Cricket", "Add", MemberItems.Members.Count, Logger);
                    }
                    else
                    {
                        RetVal += " 0 new members added. ";
                        LogMemberManagementAction("Cricket", "Add", MemberItems.Members.Count, Logger);
                    }

                    RetVal += " " + PasswordUpdateForApps(Logger, ApplicationName);

                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to merge Payday members." + ex.Message;
                Logger.LogEvent("MemberData.Members.MembershipMerge", ex);
            }

            Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            return RetVal;
        }

        /// <summary>
        /// THE METHOD BELOW IS TEMPORARY
        /// IT'S FUNCTION IS TO RETRIEVE CURRENT CRICKET MEMBERSHIP AND
        /// IMPORT THAT MEMBERSHIP INTO THE NEW MEMBERSHIP DATABASE.
        /// </summary>
        /// <returns></returns>
        public string MembershipMerge_Cricket(ILogger Logger, string ApplicationName)
        {
            string RetVal = "Cricket membership merge was successful. ";
            Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            ExternalMembers MemberItems = new ExternalMembers { Members = new List<ExternalMemberData>() };

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    var ReturnedMembers = Context.GetCurrentCricketEmployees();
                    MemberItems.Members.AddRange(ReturnedMembers.Select(x => new ExternalMemberData
                    {
                        LastName = x.last_name,
                        SaleName = x.sale_name,
                        Username = x.user_name,
                        UserId = x.user_id,
                        Password = x.password,
                        StoreId = x.StoreId
                    }));

                    if (MemberItems.Members.Count > 0)
                    {
                        RetVal += " " + Convert.ToString(MemberItems.Members.Count) + " new members added. ";
                        CreateNewMembersCricket(Logger, MemberItems);
                        LogMemberManagementAction("Cricket", "Add", MemberItems.Members.Count, Logger);
                    }
                    else
                    {
                        RetVal += " 0 new members added. ";
                        LogMemberManagementAction("Cricket", "Add", MemberItems.Members.Count, Logger);
                    }

                    RetVal += " " + PasswordUpdateForApps(Logger, ApplicationName);

                }
            }
            catch (Exception ex)
            {
                RetVal = "Failed to merge Cricket members.";
                Logger.LogEvent("MemberData.Members.MembershipMerge", ex);
            }

            Membership.ApplicationName = ConfigurationManager.AppSettings["RegistrationApplication"];
            return RetVal;
        }

        public void LogMemberManagementAction(string ApplicationName, string MemberAction, int Count, ILogger Logger)
        {
            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Context.LogMemberManagementAction(ApplicationName, MemberAction, Count);
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.LogMemberManagementAction", ex);
            }
        }

        public string CheckCricketConnection(ILogger Logger)
        {
            string RetVal = "Failed";

            try
            {
                using (GenericMembershipDataContext Context = new GenericMembershipDataContext())
                {
                    Nullable<int> ReturnedVal = null;
                    Context.CheckCricketConnection(ref ReturnedVal);
                    if (ReturnedVal.Value != null) RetVal = "success";
                }
            }
            catch (Exception ex)
            {
                Logger.LogEvent("MemberData.Members.AddUserInformation", ex);
            }

            return RetVal;
        }
    }
}
