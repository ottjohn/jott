using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
//using Maintenance;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http.Description;
using System.Threading.Tasks;
using CustomerUtility;
using MaintenanceContracts.Messages.MemberManagement;
//using StoreMaintenance.MaintService;
using System.Text.RegularExpressions;
//using Payday;

namespace AngularAJAX
{
    public class UserManagementController : ApiController
    {
        [Route("api/UserManagement/GetUserRoles")]
        [ResponseType(typeof(GetUserRolesResponse))]
        public async Task<IHttpActionResult> RetrieveUserRoles(GetUserRolesRequest request)
        {
            GetUserRolesResponse response = new GetUserRolesResponse();

            try
            {
                HttpCookie AuthCookie = HttpContext.Current.Request.Cookies.Get(".ASPXAUTH");
                FormsAuthenticationTicket AuthTicket = FormsAuthentication.Decrypt(AuthCookie.Value);
                request.UserInfo.UserRoles = AuthTicket.UserData;
                request.UserInfo.UserId = GetUserIdQuick(request.UserInfo.UserName);
                response.UserInfo = request.UserInfo;

                //This is for testing only. Remove this once the system is working
                //TestCCValidator();
                //TestPaymentHandler();
            }
            catch (Exception ex)
            {
            }

            return Ok(response);
        }

        //private void TestPaymentHandler()
        //{
        //    PaydayProcess PP = new PaydayProcess();
        //    PP.SetupCustomerPayment("1", "4109024249809486");
        //}

        private void TestCCValidator()
        {
            Dictionary<string, string> CCDef;
            CCDef = new Dictionary<string, string>();
            CCDef.Add("Visa", "^4[0-9]{12}(?:[0-9]{3})?$");
            CCDef.Add("MasterCard", "^5[1-5][0-9]{14}$");
            CCDef.Add("AmericanExpress", "^3[47][0-9]{13}$");
            CCDef.Add("DinersClub", "^3(?:0[0-5]|[68][0-9])[0-9]{11}$");
            CCDef.Add("Discover", "^6(?:011|5[0-9]{2})[0-9]{12}$");
            string CCExpiry = "0515";

            string CCType = CheckCardNumber("4190024249809486", CCDef);

            if (CCType != "" && CCExpiry.Length == 4)
            {
                if (!CheckCCDate(CCExpiry)) CCType = "";
            }
        }

        private string CheckCardNumber(string CardNumber, Dictionary<string, string> CCDef)
        {
            string CCType = "";
            var RetVal = CCDef.Where(X => new Regex(X.Value).IsMatch(CardNumber)).ToList();
            if (RetVal.Count > 0) CCType = RetVal[0].Key;
            return CCType;
        }

        private bool CheckCCDate(string CCDate)
        {
            bool RetVal = false;
            DateTime CurrentDate = DateTime.Now;
            int CurrentMonth = CurrentDate.Month;
            int CurrentYear = Convert.ToInt32(CurrentDate.Year.ToString().Substring(2, 2));
            int CardMonth = Convert.ToInt32(CCDate.Substring(0, 2));
            int CardYear = Convert.ToInt32(CCDate.Substring(2, 2));

            if (CardYear > CurrentYear)
            {
                RetVal = true;
            }
            else if (CardYear == CurrentYear)
            {
                if (CardMonth >= CurrentMonth)
                    RetVal = true;
            }

            return RetVal;
        }

        [Route("api/UserManagement/GetUserId")]
        [ResponseType(typeof(GetUserIdResponse))]
        public async Task<IHttpActionResult> RetrieveUserId(RetrieveUserRequest request)
        {
            GetUserIdResponse response = new GetUserIdResponse();
            CustomerProcess CP = new CustomerProcess();
            response.UserId = CP.GetUserId(request.UserName); ;
            return Ok(response);
        }

        private Guid GetUserIdQuick(string UserName)
        {
            CustomerProcess CP = new CustomerProcess();
            return CP.GetUserId(UserName);
        }

        [Route("api/UserManagement/GetAppList")]
        [ResponseType(typeof(GetApplicationListResponse))]
        public async Task<IHttpActionResult> RetrieveAppList()
        {
            GetApplicationListResponse response = new GetApplicationListResponse();
            CustomerProcess CP = new CustomerProcess();
            response.AppList = CP.RetrieveAppList();
            return Ok(response);
        }

        [Route("api/UserManagement/GetAppGroupNames")]
        [ResponseType(typeof(GetApplicationGroupsResponse))]
        public async Task<IHttpActionResult> RetrieveAppGroupNames(GetApplicationGroupsRequest request)
        {
            GetApplicationGroupsResponse response = new GetApplicationGroupsResponse();
            CustomerProcess CP = new CustomerProcess();
            response.AppGroupNames = CP.RetrieveAppGroupNames(request.ApplicationId);
            return Ok(response);
        }

        [Route("api/UserManagement/AddFeatureTreeGroup")]
        [ResponseType(typeof(AddUpdateFeatureTreeGroupResponse))]
        public async Task<IHttpActionResult> AddFeatureTreeGroup(AddUpdateFeatureTreeGroupRequest request)
        {
            AddUpdateFeatureTreeGroupResponse response = new AddUpdateFeatureTreeGroupResponse();
            CustomerProcess CP = new CustomerProcess();
            response.FeatureTreeGroups = CP.AddFeatureTreeGroup(request.TreeItems, request.FeatureGroupName, request.ApplicationId);
            return Ok(response);
        }

        [Route("api/UserManagement/UpdateFeatureTreeGroup")]
        [ResponseType(typeof(AddUpdateFeatureTreeGroupResponse))]
        public async Task<IHttpActionResult> UpdateFeatureTreeGroup(AddUpdateFeatureTreeGroupRequest request)
        {
            AddUpdateFeatureTreeGroupResponse response = new AddUpdateFeatureTreeGroupResponse();
            CustomerProcess CP = new CustomerProcess();
            response.FeatureTreeGroups = CP.UpdateFeatureTreeGroup(request.TreeItems, request.FeatureGroupNameId, request.ApplicationId, request.UserId);
            return Ok(response);
        }

        [Route("api/UserManagement/AssignProfile")]
        [ResponseType(typeof(AssignProfileResponse))]
        public async Task<IHttpActionResult> AssignProfile(AssignProfileRequest request)
        {
            AssignProfileResponse response = new AssignProfileResponse();
            CustomerProcess CP = new CustomerProcess();
            response.Message = CP.AssignProfile(request.MemberConfiguration, request.UserId, request.UserApproved, request.ApplicationId);
            return Ok(response);
        }

        [Route("api/UserManagement/GetFeatureList")]
        [ResponseType(typeof(GetFeatureTreeResponse))]
        public async Task<IHttpActionResult> RetrieveFeatureList(GetFeatureTreeRequest request)
        {
            GetFeatureTreeResponse response = new GetFeatureTreeResponse();
            CustomerProcess CP = new CustomerProcess();
            response.TreeItems = CP.RetrieveFeatureList(request.UserName, request.UserId, request.GroupNameId, request.ApplicationId);
            return Ok(response);
        }

        [Route("api/UserManagement/AddUser")]
        [ResponseType(typeof(UserAddResponse))]
        public async Task<IHttpActionResult> AddUser(UserAddRequest request)
        {
            UserAddResponse response = new UserAddResponse();
            CustomerProcess CP = new CustomerProcess();
            response.CustInfo = CP.AddUser(request.UserInfo);
            return Ok(response);
        }

        [Route("api/UserManagement/GetSecurityQuestion")]
        [ResponseType(typeof(PasswordManagementResponse))]
        public async Task<IHttpActionResult> RetrieveSecurityQuestion(PasswordManagementRequest request)
        {
            PasswordManagementResponse response = new PasswordManagementResponse();
            CustomerProcess CP = new CustomerProcess();
            response.ManagePasswords = CP.RetrieveSecurityQuestion(request.ManagePasswords);
            return Ok(response);
        }

        [Route("api/UserManagement/GetPassword")]
        [ResponseType(typeof(PasswordManagementResponse))]
        public async Task<IHttpActionResult> RetrievePassword(PasswordManagementRequest request)
        {
            PasswordManagementResponse response = new PasswordManagementResponse();
            CustomerProcess CP = new CustomerProcess();
            response.ManagePasswords = CP.RetrievePassword(request.ManagePasswords);
            return Ok(response);
        }

        [Route("api/UserManagement/ChangePassword")]
        [ResponseType(typeof(PasswordManagementResponse))]
        public async Task<IHttpActionResult> ChangePassword(PasswordManagementRequest request)
        {
            PasswordManagementResponse response = new PasswordManagementResponse();
            CustomerProcess CP = new CustomerProcess();
            response.ManagePasswords = CP.ChangePassword(request.ManagePasswords);
            return Ok(response);
        }

        [Route("api/UserManagement/ChangeEmail")]
        [ResponseType(typeof(PasswordManagementResponse))]
        public async Task<IHttpActionResult> ChangeEmail(PasswordManagementRequest request)
        {
            PasswordManagementResponse response = new PasswordManagementResponse();
            CustomerProcess CP = new CustomerProcess();
            response.ManagePasswords = CP.ChangeEmail(request.ManagePasswords);
            return Ok(response);
        }

        [Route("api/UserManagement/CheckCricketConnection")]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> CheckCricketConnection()
        {
            CustomerProcess CP = new CustomerProcess();
            string Message = CP.CheckCricketConnection();
            return Ok(Message);
        }

        [Route("api/UserManagement/MembershipMerge")]
        [ResponseType(typeof(MembershipMergeResponse))]
        public async Task<IHttpActionResult> MembershipMerge(MembershipMergeRequest request)
        {
            MembershipMergeResponse response = new MembershipMergeResponse();
            CustomerProcess CP = new CustomerProcess();
            response.Message = CP.MembershipMerge();
            return Ok(response);
        }

        [Route("api/UserManagement/GetUser")]
        [ResponseType(typeof(RetrieveUserResponse))]
        public async Task<IHttpActionResult> RetrieveUser(RetrieveUserRequest request)
        {
            RetrieveUserResponse response = new RetrieveUserResponse();
            CustomerProcess CP = new CustomerProcess();
            response.MemberManager = CP.RetrieveUser(request.UserId, request.UserName, request.ApplicationId);
            return Ok(response);
        }

        //[Authorize]
        [Route("api/UserManagement/GetUnapprovedMembers")]
        [ResponseType(typeof(GetPendingUsersResponse))]
        public async Task<IHttpActionResult> RetrieveUnapprovedMembers(GetUnapprovedMembersRequest request)
        {
            GetPendingUsersResponse response = new GetPendingUsersResponse();
            CustomerProcess CP = new CustomerProcess();
            response.MemberInfoManager = CP.GetUnapprovedMembers(request.CurrentPage, request.PageSize, request.SortField, request.SortDirection);
            if (response.MemberInfoManager == null)
                response.ErrorMessage = "Failed to retrieve pending user list.";
            else
                response.ErrorMessage = "";

            return Ok(response);
        }
    }
}