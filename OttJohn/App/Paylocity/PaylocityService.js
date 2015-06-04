/* dataservice: data access and model Homement layer 
 * relies on Angular injector to provide:
 *     $timeout - Angular equivalent of 'setTimeout'
 *     breeze - the Breeze.Angular service (which is breeze itself)
 *     logger - the application's logging facility
 */
(function () {

    angular.module('App.Paylocity').factory('PaylocityService',
    ['$http', '$timeout', PaylocityService]);

    function PaylocityService($http, $timeout) {

        var serviceName = 'PaylocityService'; // route to the same origin Web Api controller - root directory
        var service = {

            SendRequest: SendRequest
        };

        return service;

        function SendRequest(DataToSend, URL) {

            var responsePromise = $http({
                method: 'POST',
                url: 'api/Tasks/' + URL,
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