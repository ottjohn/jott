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
using CustomerUtility.Cache;
using MaintenanceContracts.Contracts.Common;
using MaintenanceContracts.Contracts.MemberManagement;
using CustomerUtility.Validation;

namespace CustomerUtility.Members
{
    public class MemberRetrieval
    {
        public MemberConfigurationManager RetrieveUser(Guid UserId, string UserName, Guid ApplicationId)
        {
            MemberConfigurationManager MemberAppConfig = new MemberConfigurationManager();
            MemberAppConfig.Message = "";
            UserId = RetrieveUserValidate(UserId, UserName, ApplicationId);
            if (UserId != Guid.Empty)
            {
                MemberDataManager MP = new MemberDataManager();
                MemberAppConfig = MP.RetrieveUser(UserId, UserName, ApplicationId);
                if (MemberAppConfig.Message == "") MemberAppConfig.Message = SetMemberAccountCache(MemberAppConfig.MemberConfiguration, ApplicationId, UserId);
            }
            else
            {
                MemberAppConfig.Message = "Member not found! Member lookup requires either a UserId or a UserName.";
            }

            return MemberAppConfig;
        }

        private Guid RetrieveUserValidate(Guid UserId, string UserName, Guid ApplicationId)
        {
            MemberValidate MV = new MemberValidate();
            return MV.ValidateRetrieveUser(UserId, UserName, ApplicationId);
        }

        private string SetMemberAccountCache(MemberAppConfiguration MemberAppConfig, Guid ApplicationId, Guid UserId)
        {
            MemberConfigStructure MCS = new MemberConfigStructure();
            string RetVal = MCS.ValidateMemberAppConfigStructure (MemberAppConfig);
            if (RetVal == "") CasheStore.SetCachedItem(UserId.ToString(), MemberAppConfig);
            return RetVal;
        }

        public ExtMemberInfoManager GetUnapprovedMembers(int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            ExtMemberInfoManager MemberInfo = new ExtMemberInfoManager();
            MemberDataManager MP = new MemberDataManager();
            if(CurrentPage >= 0 && PageSize > 0 && SortField != null && SortDirection != null)
                MemberInfo = MP.GetUnapprovedMembers(CurrentPage, PageSize, SortField, SortDirection);

            return MemberInfo;
        }

        public ExtMemberInfoManager RetrieveSampleUsers(int CurrentPage, int PageSize, string SortField, string SortDirection)
        {
            ExtMemberInfoManager MemberInfo = new ExtMemberInfoManager();
            MemberDataManager MP = new MemberDataManager();
            if (CurrentPage >= 0 && PageSize > 0 && SortField != null && SortDirection != null)
                MemberInfo = MP.RetrieveSampleUsers(CurrentPage, PageSize, SortField, SortDirection);

            return MemberInfo;
        }

        public User GetUserShort()
        {
            MemberDataManager MP = new MemberDataManager();
            return MP.GetUserShort();
        }
    }
}
