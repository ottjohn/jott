(function () {

    angular.module('App.MemberManagement').factory('RegisterUserModel',
    ['$q', '$http', '$timeout', 'ManageService', 'ManageUserContracts', 'Validation', RegisterUserModel]);

    function RegisterUserModel($q, $http, $timeout, ManageService, ManageUserContracts, Validation) {

        var serviceName = 'RegisterUserModel'; // route to the same origin Web Api controller - root directory

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //
        //  RegFields                           Maintains all values for requests by this app
        //////////////////////////////////////////////////////////////////////////////////////
        var RegFields;

        var ManageUserModelMethods = {

            SubmitAddUser: SubmitAddUser,
            GetRegContract: GetRegContract,
            GetRegDirections: GetRegDirections,
            ValidateFieldEntry: ValidateFieldEntry

        };

        return ManageUserModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetRegContract() {

            if (RegFields == null) {

                RegFields = ManageUserContracts.GetRegistrationContract();

            }

            return RegFields;

        }

        function GetRegDirections() {

            return ManageUserContracts.GetRegistrationDirections();

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        // SubmitAddUser
        //////////////////////////////////////////////////////////////////////////////////////
        function SubmitAddUser(RegInfo) {

            var deferred = $q.defer();
            var ServiceMessage = "";
            $timeout(AddUserImpl, 0);

            var AddUserRequest = ManageUserContracts.GetAddUserReqeust();
            AddUserRequest.UserInfo.RegInfo = RegInfo;

            function AddUserImpl() {

                ManageService.SendRequest(AddUserRequest, 'AddUser').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                ServiceMessage = data.data.CustInfo.ErrorMessage;
                deferred.resolve(data.data.CustInfo.ErrorMessage);

            }

            function showError() {

                ServiceMessage = "Communication failed";
                deferred.reject();

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