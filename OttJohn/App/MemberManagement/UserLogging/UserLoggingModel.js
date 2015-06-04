(function () {
    angular.module('App.MemberManagement').factory('UserLoggingModel',
    ['$q', '$http', '$timeout', 'ManageService', 'ManageUserContracts', 'Validation', 'AppState', UserLoggingModel]);

    function UserLoggingModel($q, $http, $timeout, ManageService, ManageUserContracts, Validation, AppState) {

        var serviceName = 'UserLoggingModel'; // route to the same origin Web Api controller - root directory

        var ManageUserModelMethods = {

            UserLogin: UserLogin,
            GetUserRoles: GetUserRoles,
            UserLogout: UserLogout,
            GetFeatureTree: GetFeatureTree,
            GetUserId: GetUserId
        };

        return ManageUserModelMethods;

        var UserInfo;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        //  User Logout
        //////////////////////////////////////////////////////////////////////////////////////
        function UserLogout() {

            var deferred = $q.defer();

            $timeout(UserLogoutImpl, 0);

            function UserLogoutImpl() {

                ManageService.Logout().then(ShowResult).error(showError);

            }

            function ShowResult(data) {

                deferred.resolve("");

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  User Login
        //////////////////////////////////////////////////////////////////////////////////////
        function UserLogin(UserCreds) {

            var deferred = $q.defer();
            var UserLoginCreds = ManageUserContracts.GetUserLoginContract();
            UserLoginCreds.username = UserCreds.UserName;
            UserLoginCreds.password = UserCreds.Password;

            $timeout(UserLoginImpl, 0);

            function UserLoginImpl() {

                ManageService.Authenticate(UserLoginCreds).then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                UserInfo = ManageUserContracts.GetUserInfoContract();
                UserInfo.UserName = UserCreds.UserName;
                deferred.resolve(data.data.d);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get UserId
        //////////////////////////////////////////////////////////////////////////////////////
        function GetUserId(UserName) {

            var deferred = $q.defer();

            $timeout(GetUserIdImpl, 0);

            function GetUserIdImpl() {

                var UserRequest = ManageUserContracts.GetUserRequest();
                UserRequest.UserName = UserName;
                ManageService.SendRequest(UserRequest, 'GetUserId').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                deferred.resolve(data.data.UserId);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Feature Tree
        //////////////////////////////////////////////////////////////////////////////////////
        function GetFeatureTree(UserName, UserId, GroupNameId) {

            var deferred = $q.defer();
            var FeatureTreeRequest = ManageUserContracts.GetFeatureTreeRequest();
            FeatureTreeRequest.UserName = UserInfo.UserName;

            $timeout(GetFeatureTreeImpl, 0);

            function GetFeatureTreeImpl() {

                ManageService.SendRequest(FeatureTreeRequest, 'GetFeatureList').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                UserInfo.FeatureAccessList = data.data.TreeItems.FeatureItems;
                deferred.resolve(data.data.TreeItems.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get User Roles. This can probably go away
        //////////////////////////////////////////////////////////////////////////////////////
        function GetUserRoles() {

            var deferred = $q.defer();
            var UserRolesRequest = ManageUserContracts.GetUserRolesRequest();
            UserRolesRequest.UserInfo = UserInfo;

            try {

                $timeout(GetUserRolesImpl, 0);

            } catch(err) {

                alert(err.message);

            }

            function GetUserRolesImpl() {

                ManageService.SendRequest(UserRolesRequest, 'GetUserRoles').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                UserInfo.UserRoles = data.data.UserInfo.UserRoles;
                UserInfo.UserId = data.data.UserInfo.UserId;

                var UserCreds = ManageUserContracts.GetUserCredsContract();
                UserCreds.UserName = UserInfo.UserName;
                UserCreds.UserId = UserInfo.UserId;
                UserCreds.UserRoles = UserInfo.UserRoles;
                UserCreds.FeatureAccessList = UserInfo.FeatureAccessList;
                AppState.SetUserCreds(UserCreds);
                deferred.resolve("");

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }
    }
})();