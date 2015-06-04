(function () {

    angular.module('App.About').factory('AboutService',
    ['$http', '$timeout', AboutService]);

    function AboutService($http, $timeout) {

        var serviceName = 'AboutService'; // route to the same origin Web Api controller - root directory
        var CustomerInfo = "";
        var CurrentUserGuid;

        var service = {

            SendRequest: SendRequest,

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
    }

})();