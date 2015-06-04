(function () {

    angular.module('App.MemberManagement').factory('ManageUserContracts',
    ['$http', '$timeout', ManageUserContracts]);

    function ManageUserContracts() {

        var serviceName = 'ManageUserContracts'; // route to the same origin Web Api controller - root directory

        var ManageUserContracts = {

            GetUserRequest: GetUserRequest,
            GetUnapprovedMembersRequest: GetUnapprovedMembersRequest,
            GetUpdateUserRequest: GetUpdateUserRequest,
            GetPasswordManagementRequest: GetPasswordManagementRequest,
            GetAddUserReqeust: GetAddUserReqeust,
            GetUserRolesRequest: GetUserRolesRequest,
            GetFeatureTreeRequest: GetFeatureTreeRequest,
            GetAddUpdateFeatureTreeGroupRequest: GetAddUpdateFeatureTreeGroupRequest,
            GetAssignFeatureItemsRequest: GetAssignFeatureItemsRequest,
            GetApplicationGroupsRequest: GetApplicationGroupsRequest,
            GetUnapprovedUserContract: GetUnapprovedUserContract,
            GetPasswordManagmentContract: GetPasswordManagmentContract,
            GetRegistrationContract: GetRegistrationContract,
            GetUserLoginContract: GetUserLoginContract,
            GetUserInfoContract: GetUserInfoContract,
            GetMemberConfigurationManagerContract: GetMemberConfigurationManagerContract,
            GetProcessHelperContract: GetProcessHelperContract,
            GetUserCredsContract: GetUserCredsContract,
            GetRegistrationDirections: GetRegistrationDirections,
            GetMembershipMergeRequest: GetMembershipMergeRequest

        };

        return ManageUserContracts;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Contracts and messages
        //////////////////////////////////////////////////////////////////////////////////////
        //  Requests
        //////////////////////////////////////////////////////////////////////////////////////
        function GetMembershipMergeRequest() {

            var MembershipMergeRequest = {

                ApplicationName:  null

            }

            return MembershipMergeRequest;

        }

        function GetUserRequest() {

            var GetUserRequest = {

                UserId: '',
                UserName: ''

            }

            return GetUserRequest;

        }

        function GetUnapprovedMembersRequest() {

            var GetUnapprovedMembersRequest = {

                CurrentPage: 0,
                PageSize: 0,
                SortField: '',
                SortDirection: ''

            }

            return GetUnapprovedMembersRequest;

        }

        function GetUpdateUserRequest() {

            var UpdateUserRequest = {

                MemberManager: null

            }

            return UpdateUserRequest;

        }

        function GetPasswordManagementRequest() {

            var PasswordManagementRequest = {

                ManagePasswords: null

            }

            return PasswordManagementRequest;

        }

        function GetAddUserReqeust() {

            var AddUserRequest = {

                UserInfo: GetRegistrationInformation()
            }

            return AddUserRequest;

        }

        function GetUserRolesRequest() {

            var UserRolesRequest = {

                UserInfo: null

            }

            return UserRolesRequest;

        }

        function GetFeatureTreeRequest() {

            var FeatureTreeRequest = {

                UserId: '',
                UserName: '',
                GroupNameId: '',
                ApplicationId: ''

            }

            return FeatureTreeRequest;

        }

        function GetAddUpdateFeatureTreeGroupRequest() {

            var AddUpdateFeatureTreeGroupRequest = {

                TreeItems: null,
                FeatureGroupName: null,
                FeatureGroupId: 0,
                ApplicationId: null,
                UserId: null

            }

            return AddUpdateFeatureTreeGroupRequest;

        }

        function GetAssignFeatureItemsRequest() {

            var AssignFeatureItemsRequest = {

                UserId: null,
                UserApproved: null,
                ApplicationId: null,
                MemberConfiguration: null

            }

            return AssignFeatureItemsRequest;

        }

        function GetApplicationGroupsRequest() {

            var GetApplicationGroupsRequest = {

                ApplicationId: null

            }

            return GetApplicationGroupsRequest;

        }
        
        //////////////////////////////////////////////////////////////////////////////////////
        //  Level One Contracts
        //////////////////////////////////////////////////////////////////////////////////////
        function GetUnapprovedUserContract() {

            var UnapprovedUser = {

                UnapprovedFirstName: null,
                UnapprovedLastName: null,
                UnapprovedUserName: null,
                UnapprovedUserId: null,
                UserApproved: false,
                ApplicationId: null,
                ApplicationName: null

            }

            return UnapprovedUser;

        }

        function GetPasswordManagmentContract() {

            var PasswordManagementContract = {

                UserName: { Value: '', MapToKey: null, Required: true },
                SecurityQuestion: { Value: '', MapToKey: null, Required: false },
                SecurityAnswer: { Value: '', MapToKey: null, Required: false },
                OldPassword: { Value: '', MapToKey: 'Password', Required: false },
                NewPassword: { Value: '', MapToKey: 'Password', Required: false },
                NewEmail: { Value: '', MapToKey: 'Email', Required: false }
            }

            return PasswordManagementContract;
        }

        function GetRegistrationContract() {

            var RegistrationContract = {

                RegInfo: GetRegistrationInformation()

            }

            return RegistrationContract;

        }

        function GetRegistrationInformation() {

            var RegistrationInformation = {

                FirstName: { Value: '', MapToKey: null, Required: true },
                LastName: { Value: '', MapToKey: null, Required: true },
                Email: { Value: '', MapToKey: null, Required: true },
                UserName: { Value: '', MapToKey: null, Required: true },
                Password: { Value: '', MapToKey: 'Password', Required: true },
                Password1: { Value: '', MapToKey: 'Password', Required: true },
                Question: { Value: '', MapToKey: 'SecurityQuestion', Required: true },
                Answer: { Value: '', MapToKey: 'SecurityAnswer', Required: true }

            }

            return RegistrationInformation;

        }

        function GetUserLoginContract() {

            var UserLogin = {

                username: null,
                password: null,
                customerCredential: '',
                isPersistent: 'true'

            }

            return UserLogin;

        }

        function GetUserInfoContract() {

            var UserInfo = {

                UserName: null,
                UserId: null,
                FeatureAccessList: null,
                UserRoles: null

            }

            return UserInfo;

        }

        function GetMemberConfigurationManagerContract() {

            var MemberConfigurationManager = {

                MemberConfiguration: GetMemberAppConfigurationContract(),
                UserInfo: GetUserContract(),
                DeleteUser: false

            }

            return MemberConfigurationManager;

        }

        function GetMemberAppConfigurationContract() {

            var MemberAppConfiguration = {

                UserRoles: null,
                UserInApp: null

            }

            return MemberAppConfiguration;

        }

        function GetUserContract() {

            var User = {

                UserName: '',
                UserId: null

            }

            return User;

        }

        function GetProcessHelperContract() {

            var ProcessHelper = {

                Process: null,
                PreviousProcess: null,
                CurrentKey: null,
                ValidationMessage: null

            }

            return ProcessHelper;

        }

        function GetUserCredsContract() {

            var UserCreds = {

                UserName: null,
                UserRoles: null,
                UserId: null,
                FeatureAccessList: null,
                FeatureAccessPipe: null

            }

            return UserCreds;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Directions
        //////////////////////////////////////////////////////////////////////////////////////
        function GetRegistrationDirections() {

            var RegistrationDirections = {

                FirstName: "Please enter your first name",
                LastName: "Please enter your last name",
                Email: "Please enter a valid email address",
                UserName: "Please enter your desired user name",
                Password: "Please enter a password for your account",
                Password1: "Please retype your password",
                Question: "Please enter a question for password retrieval",
                Answer: "Please provide an answer for your password retrieval question"

            }

            return RegistrationDirections;

        }
    }

})();