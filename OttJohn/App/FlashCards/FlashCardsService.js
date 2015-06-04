(function () {

    angular.module('App.FlashCards').factory('FlashCardsService',
    ['$http', '$timeout', FlashCardsService]);

    function FlashCardsService($http, $timeout) {

        var serviceName = 'FlashCardsService'; // route to the same origin Web Api controller - root directory
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