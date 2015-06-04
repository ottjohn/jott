(function () {
    angular.module('App.MemberManagement').controller('UserLoggingController',
    ['$q', '$timeout', '$location', 'ManageService', 'ManageUserContracts', 'UserLoggingModel', '$rootScope', 'AppState', UserLoggingController]);

    function UserLoggingController($q, $timeout, $location, ManageService, ManageUserContracts, UserLoggingModel, $rootScope, AppState) {

        var UserLogger = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        UserLogger.ModalAttribute = {};                         //  ModalAttribute                  Communicates with modal directive
        UserLogger.UserCreds;
        //////////////////////////////////////////////////////////////////////////////////////
        //  Modal Directive Communication
        //
        //  MessageFromDirective            Called from exit process in modal directive
        //////////////////////////////////////////////////////////////////////////////////////
        UserLogger.MessageFromDirective = function () {

            mdlContract = UserLogger.ModalAttribute;
            if (mdlContract.UserName != "") {

                UserLogger.UserLogin(mdlContract);

            } else {

                UserLogger.ModalAttribute = {};
                $location.url("/home");

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Handle Logout
        //
        //  ProcessLogout                   Calls backend process to logout
        //  UserLogoutResult                Callback
        //////////////////////////////////////////////////////////////////////////////////////
        UserLogger.ProcessLogout = function () {

            UserLoggingModel.UserLogout().then(UserLogoutResult).catch(UserLogoutResult);
            function UserLogoutResult(Message) { UserLogger.UserLogoutResult(Message) }

        }

        UserLogger.UserLogoutResult = function (Message) {

            if (Message != "") {

                UserLogger.Message = Message;

            } else {

                AppState.DumpUserValues();
                scope.$apply();
                $location.url("/");

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Handle Login
        //
        //  ShowLogin                       Passes loging contract to modal directive
        //  UserLogin                       Calls backend process to login
        //  GetUserLoginResult              Callback
        //////////////////////////////////////////////////////////////////////////////////////
        UserLogger.ShowLogin = function () {

            UserLogger.ModalAttribute = {UserName: '', Password: '', ModalType: 'mdlLogin', ModalMessage: '', ModalHeight: 120, ModalWidth: 350, ModalTitle: 'Please enter credentials', ValidationMessage: ''};

        }

        UserLogger.UserLogin = function (UserCreds) {

            UserLogger.UserCreds = UserCreds;
            UserLoggingModel.UserLogin(UserCreds).then(GetUserLoginResult).catch(GetUserLoginResult);
            function GetUserLoginResult(Message) { UserLogger.GetUserLoginResult(Message) }

        }

        UserLogger.GetUserLoginResult = function (Message) {

            if (!Message) {

                UserLogger.GetUserId();
                //var ValidationMessage = "User does not exist. Please check credentials and try again.";
                //UserLogger.ModalAttribute = {UserName: '', Password: '', ModalType: "mdlLogin", ModalMessage: "", ModalHeight: 120, ModalWidth: 350, ModalTitle: "Please enter credentials", ValidationMessage: ValidationMessage };

            } else {

                UserLogger.GetFeatureTree("Login", "", "");

            }
        }

        UserLogger.GetUserId = function () {

            UserLoggingModel.GetUserId(UserLogger.UserCreds.UserName).then(GetUserIdResult).catch(GetUserIdResult);
            function GetUserIdResult(Message) { UserLogger.GetUserIdResult(Message) }

        }

        UserLogger.GetUserIdResult = function (UserId) {

            var ValidationMessage = "";
            if (UserId == "00000000-0000-0000-0000-000000000000") 
                ValidationMessage = "User does not exist. Please check user name and try again.";
            else
                ValidationMessage = "Incorrect password. Please try again.";

            UserLogger.ModalAttribute = { UserName: '', Password: '', ModalType: "mdlLogin", ModalMessage: "", ModalHeight: 120, ModalWidth: 350, ModalTitle: "Please enter credentials", ValidationMessage: ValidationMessage };

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Feature Tree 
        //  
        //  GetFeatureTree                  Call to backend to get feature access for user
        //  GetFeatureTreeResult            Callback
        //////////////////////////////////////////////////////////////////////////////////////
        UserLogger.GetFeatureTree = function (UserName, UserId, GroupNameId) {

            UserLoggingModel.GetFeatureTree(UserName, UserId, GroupNameId).then(GetFeatureTreeResult).catch(GetFeatureTreeResult);
            function GetFeatureTreeResult(Message) { UserLogger.GetFeatureTreeResult(Message) }

        }

        UserLogger.GetFeatureTreeResult = function (Message) {

            if (Message == "") {

                UserLogger.GetUserRoles();

            } else {

                var ValidationMessage = "User exists but has no system access.";
                UserLogger.ModalAttribute = {UserName: '', Password: '', ModalType: "mdlLogin", ModalMessage: "", ModalHeight: 120, ModalWidth: 350, ModalTitle: "Please enter credentials", ValidationMessage: ValidationMessage };

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Roles -- need to determine if not having roles is okay
        //  
        //  GetUserRoles                    Call to get user roles. May be depricated
        //  GetUserRolesResult              Callback
        //////////////////////////////////////////////////////////////////////////////////////
        UserLogger.GetUserRoles = function () {

            UserLoggingModel.GetUserRoles().then(GetUserRolesResult).catch(GetUserRolesResult);
            function GetUserRolesResult(Message) { UserLogger.GetUserRolesResult(Message) }

        }

        UserLogger.GetUserRolesResult = function (Message) {

            if (Message == "") {

                UserLogger.ModalAttribute = {};
                $location.url(AppState.GetPreviousRoute());

            } else {

                var ValidationMessage = "User exists but has no roles.";
                UserLogger.ModalAttribute = {UserName: '', Password: '', ModalType: "mdlLogin", ModalMessage: "", ModalHeight: 120, ModalWidth: 350, ModalTitle: "Please enter credentials", ValidationMessage: ValidationMessage };

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Process
        //
        //  SetProcess                      Manages entrance process, selects function
        //  RegisterRoute                   Registers route, previous route with AppState
        //////////////////////////////////////////////////////////////////////////////////////
        UserLogger.SetProcess = function (ProcessName) {

            if (ProcessName == "Login") {

                UserLogger.ShowLogin();

            } else if (ProcessName == "Logout") {

                UserLogger.ProcessLogout();

            }
        }

        UserLogger.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "MemberManagement." + $location.$$path.replace("/App/", "");
            if (CallingRoute == "MemberManagement.") CallingRoute = "MemberManagement.Membership";
            var ProcessName = UserLogger.RegisterRoute(CallingRoute);
            UserLogger.SetProcess(ProcessName);

        });
    }
})();