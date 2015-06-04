(function () {

    angular.module('App.Examples').factory('ExamplesService',
    ['$http', '$timeout', ExamplesService]);

    function ExamplesService($http, $timeout) {

        var serviceName = 'ExamplesService'; // route to the same origin Web Api controller - root directory
        var service = {

            SendRequest: SendRequest
        };

        return service;

        function SendRequest(DataToSend, URL) {

            var responsePromise = $http({
                method: 'POST',
                url: 'api/Examples/' + URL,
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