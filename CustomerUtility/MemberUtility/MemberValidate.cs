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
using CustomerUtility.FeatureTree;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using UtilityPot.Logger;
using CustomerUtility.Cache;

namespace CustomerUtility.Members
{
    public class MemberValidate
    {
        public string ValidateGUIDId(Guid GUIDValue, string GUIDType)
        {
            string RetVal = "";
            if (GUIDValue == Guid.Empty) RetVal = "Process requires a valid " + GUIDType + ".";
            return RetVal;
        }

        /// <summary>
        /// Validate retrieve feature profile params
        /// </summary>
        /// <param name="UserName"></param>
        /// <param name="UserId"></param>
        /// <param name="GroupNameId"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public string ValidateRetrieveFeatureParams(string UserName, Guid UserId, int GroupNameId, Guid ApplicationId)
        {
            string RetVal = "";

            if (UserName != "")
                RetVal = StringExpressionDictionary.ValidateStringExpression(UserName, "UserName");
            else if (GroupNameId <= 0)
                RetVal = ValidateGuids(UserId, ApplicationId);

            return RetVal;
        }

        private string ValidateGuids(Guid UserId, Guid ApplicationId)
        {
            string RetVal = ValidateGUIDId(UserId, "UserId");
            if (RetVal == "") ValidateGUIDId(ApplicationId, "ApplicationId");
            return RetVal;
        }

        /// <summary>
        /// I THINK I MAY HAVE DONE THIS SOMEWHERE ELSE...SHOULD JUST CHECK BASIC OBJECT FIRST FOR COMPLETENESS
        /// </summary>
        /// <param name="MemberConfiguration"></param>
        /// <param name="UserId"></param>
        /// <param name="UserApproved"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public bool CheckUserInactivated(Guid UserId, bool UserApproved, Guid ApplicationId) 
        {
            bool RetVal = false;
            MemberAppConfiguration MemberConfiguration = (MemberAppConfiguration)CasheStore.GetCachedItem(UserId.ToString());
            UserInApplication UserApp = MemberConfiguration.UserApps.UserInApp.Find(x => x.ApplicationID == ApplicationId);
            if (UserApp != null)
            {
                if (UserApp.IsUserApproved != UserApproved) RetVal = true;
            }
            return RetVal;
        }

        /// <summary>
        /// Can be
        /// 
        /// 1. UserName alone with empty UserId and ApplicationId   -- FindUser
        /// 2. UserName with ApplicationId                          -- UpdateUser return with specified app
        /// 3. UserId alone with empty UserName and ApplicationId   -- Get unapproved member lookup
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="UserName"></param>
        /// <param name="ApplicationId"></param>
        /// <returns></returns>
        public Guid ValidateRetrieveUser(Guid UserId, string UserName, Guid ApplicationId)
        {
            Guid RetVal = Guid.Empty;
            if (UserName != "")
            {
                if (StringExpressionDictionary.ValidateStringExpression(UserName, "UserName") == "")
                {
                    MemberDataManager MDM = new MemberDataManager();
                    RetVal = MDM.GetUserId(UserName);
                }
            }
            else
            {
                if (TypeValidation.ValidateGUIDId(UserId, "UserId") == "") RetVal = UserId;
                //if (TypeValidation.ValidateGUIDId(ApplicationId, "ApplicationId") == "")
                //{
                //    if (TypeValidation.ValidateGUIDId(UserId, "UserId") == "") RetVal = UserId;
                //}
            }

            return RetVal;
        }

        public string ValidatePMData(ILogger Logger, PasswordManagement ManagePassword)
        {
            string RetMsg = "";

            try
            {
                Type T = ManagePassword.GetType();
                foreach (PropertyInfo info in T.GetProperties())
                {
                    //Get FieldTemplate property name
                    string PropertyName = info.Name;

                    if (PropertyName != "Message" && PropertyName != "Issues")
                    {
                        //Get FieldTemplate Type
                        Type FieldT = T.GetProperty(PropertyName).PropertyType;

                        //Get 'Boxed' FieldTemplate object
                        object BFTO = T.GetProperty(PropertyName).GetValue(ManagePassword, null);

                        //Get property values and mapping key
                        var TestVar = FieldT.GetProperty("Value").GetValue(BFTO, null);
                        var MapToKey = FieldT.GetProperty("MapToKey").GetValue(BFTO, null);
                        bool Required = Convert.ToBoolean(FieldT.GetProperty("Required").GetValue(BFTO, null));
                        if (MapToKey != null) PropertyName = Convert.ToString(MapToKey);

                        //May need subtype for branching
                        Type SubType = FieldT.GetProperty("Value").PropertyType;

                        //Validate Value
                        if (!((string)TestVar == "" && !Required))
                            RetMsg = StringExpressionDictionary.ValidateStringExpression((string)TestVar, PropertyName);
                    }
                }
            }
            catch (Exception ex)
            {
                RetMsg = "Error reading password properties.";
                Logger.LogEvent("CustomerUtility.Members.ValidatePMData", ex);
            }

            return RetMsg;
        }

        public string ValidateRegistrationData(ILogger Logger, RegistrationInformation RegInfo)
        {
            string RetMsg = "";

            try
            {
                Type T = RegInfo.GetType();
                foreach (PropertyInfo info in T.GetProperties())
                {
                    //Get FieldTemplate property name
                    string PropertyName = info.Name;

                    //Get FieldTemplate Type
                    Type FieldT = T.GetProperty(PropertyName).PropertyType;

                    //Get 'Boxed' FieldTemplate object
                    object BFTO = T.GetProperty(PropertyName).GetValue(RegInfo, null);

                    //Get property values and mapping key
                    var TestVar = FieldT.GetProperty("Value").GetValue(BFTO, null);
                    var MapToKey = FieldT.GetProperty("MapToKey").GetValue(BFTO, null);
                    if (MapToKey != null) PropertyName = Convert.ToString(MapToKey);

                    //May need subtype for branching
                    Type SubType = FieldT.GetProperty("Value").PropertyType;

                    //Validate Value
                    RetMsg = StringExpressionDictionary.ValidateStringExpression((string)TestVar, PropertyName);
                }

                if (RetMsg == "")
                {
                    if (CheckUser(RegInfo.UserName.Value) != "") RetMsg = "User name has already been taken.";
                }
            }
            catch (Exception ex)
            {
                RetMsg = "Error reading registration properties.";
                Logger.LogEvent("CustomerUtility.Members.ValidateRegistrationData", ex);
            }

            return RetMsg;
        }

        private string CheckUser(string UserName)
        {
            MemberDataManager MP = new MemberDataManager();
            return MP.CheckUser(UserName);
        }
    }
}
