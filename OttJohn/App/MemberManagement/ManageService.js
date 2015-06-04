(function () {

    angular.module('App.MemberManagement').factory('ManageService',
    ['$http', '$timeout', ManageService]);

    function ManageService($http, $timeout) {

        var serviceName = 'ManageService'; // route to the same origin Web Api controller - root directory
        var CustomerInfo = "";
        var CurrentUserGuid;

        var service = {

            SendRequest: SendRequest,
            Authenticate: Authenticate,
            Logout: Logout

        };

        return service;

        function SendRequest(DataToSend, URL) {

            var responsePromise = $http({
                method: 'POST',
                url: 'api/UserManagement/' + URL,
                data: DataToSend,
                async: false,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return responsePromise;

        }

        function Authenticate(DataToSend) {

            var responsePromise = $http({
                method: 'POST',
                url: 'OttjohnAuth.svc/Login',
                data: DataToSend,
                async: false,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return responsePromise;

        }

        function Logout() {

            var responsePromise = $http({
                method: 'POST',
                url: 'OttjohnAuth.svc/Logout',
                data: null,
                async: false,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return responsePromise;

        }
    }

})();