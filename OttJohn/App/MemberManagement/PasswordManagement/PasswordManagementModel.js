(function () {
    angular.module('App.MemberManagement').factory('PasswordManagementModel',
    ['$q', '$http', '$timeout', 'ManageService', 'ManageUserContracts', 'Validation', 'AppState', PasswordManagementModel]);

    function PasswordManagementModel($q, $http, $timeout, ManageService, ManageUserContracts, Validation, AppState) {

        var serviceName = 'PasswordManagementModel'; // route to the same origin Web Api controller - root directory

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //
        //  PasswordManager                 Maintains all values for requests by this app
        //////////////////////////////////////////////////////////////////////////////////////
        var PasswordManager;

        var PasswordManagementModelMethods = {

            GetSecurityQuestion: GetSecurityQuestion,
            GetSecurityQuestionValue: GetSecurityQuestionValue,
            GetPassword: GetPassword,
            ChangePassword: ChangePassword,
            GetManagePasswordContract: GetManagePasswordContract,
            ValidateFieldEntry: ValidateFieldEntry,
            ChangeEmail: ChangeEmail,
            GetProcessHelperContract: GetProcessHelperContract
        };

        return PasswordManagementModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetSecurityQuestionValue() {

            return PasswordManager.SecurityQuestion.Value;

        }

        function GetManagePasswordContract() {

            return ManageUserContracts.GetPasswordManagmentContract();

        }

        function GetProcessHelperContract() {

            return ManageUserContracts.GetProcessHelperContract();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        //  Retrieve Password
        //////////////////////////////////////////////////////////////////////////////////////
        function GetSecurityQuestion(UserName) {

            var deferred = $q.defer();
            PasswordManager = ManageUserContracts.GetPasswordManagmentContract();
            PasswordManager.UserName = UserName;
            var PasswordManagementRequest = ManageUserContracts.GetPasswordManagementRequest();
            PasswordManagementRequest.ManagePasswords = PasswordManager;

            $timeout(GetSecurityQuestionImpl, 0);

            function GetSecurityQuestionImpl() {

                ManageService.SendRequest(PasswordManagementRequest, 'GetSecurityQuestion').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                PasswordManager = data.data.ManagePasswords;
                deferred.resolve(data.data.ManagePasswords.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Password
        //////////////////////////////////////////////////////////////////////////////////////
        function GetPassword(SecurityAnswer) {

            var deferred = $q.defer();
            PasswordManager.SecurityAnswer = SecurityAnswer;
            var PasswordManagementRequest = ManageUserContracts.GetPasswordManagementRequest();
            PasswordManagementRequest.ManagePasswords = PasswordManager;

            $timeout(GetSecurityQuestionImpl, 0);

            function GetSecurityQuestionImpl() {

                ManageService.SendRequest(PasswordManagementRequest, 'GetPassword').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                PasswordManager = data.data.ManagePasswords;
                deferred.resolve(data.data.ManagePasswords.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Change Password
        //////////////////////////////////////////////////////////////////////////////////////
        function ChangePassword(PasswordManager) {

            var deferred = $q.defer();
            var PasswordManagementRequest = ManageUserContracts.GetPasswordManagementRequest();
            PasswordManagementRequest.ManagePasswords = PasswordManager;

            $timeout(ChangePasswordImpl, 0);

            function ChangePasswordImpl() {

                ManageService.SendRequest(PasswordManagementRequest, 'ChangePassword').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                PasswordManager = data.data.ManagePasswords;
                deferred.resolve(data.data.ManagePasswords.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Change Email
        //////////////////////////////////////////////////////////////////////////////////////
        function ChangeEmail(PasswordManager) {

            var deferred = $q.defer();
            var PasswordManagementRequest = ManageUserContracts.GetPasswordManagementRequest();
            PasswordManagementRequest.ManagePasswords = PasswordManager;

            $timeout(ChangeEmailImpl, 0);

            function ChangeEmailImpl() {

                ManageService.SendRequest(PasswordManagementRequest, 'ChangeEmail').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                PasswordManager = data.data.ManagePasswords;
                deferred.resolve(data.data.ManagePasswords.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Model Validators -- Cannot do the update at this level. This is just a validator
        //////////////////////////////////////////////////////////////////////////////////////
        function ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value) {

            return Validation.ValidateFieldEntry(ContractEntryField, key, MapToKey, Required, value);

        }
    }
})();