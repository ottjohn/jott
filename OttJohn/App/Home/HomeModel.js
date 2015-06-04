(function () {

    angular.module('App.Home').factory('HomeModel',
    ['$q', '$http', '$timeout', 'HomeService', 'HomeContracts', 'Validation', HomeModel]);

    function HomeModel($q, $http, $timeout, HomeService, HomeContracts, Validation) {

        var serviceName = 'HomeModel'; // route to the same origin Web Api controller - root directory
        var FeatureTree;
        var TaskList;
        var GetCurrentArticle;
        var VisitorData;

        var HomeModelMethods = {

            GetArticle: GetArticle,
            GetCurrentArticle: GetCurrentArticle,
            GetVisitorData: GetVisitorData,
            HydrateVisitorContract: HydrateVisitorContract,
            CheckForMessages: CheckForMessages
        };

        return HomeModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        // Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetCurrentArticle() {

            return GetCurrentArticle;

        }

        function GetVisitorItems() {

            return VisitorData;

        }

        function HydrateVisitorContract() {

            var DataArray = new Array();
            var TickArray = new Array();
            var VisitorDataContract = HomeContracts.GetLineChart();
            var iLen = VisitorData.length;

            for (var i = 0; i < iLen; i++) {

                DataArray[i] = VisitorData[i].NumberOfHits;
                TickArray[i] = VisitorData[i].VisitorDate;

            }


            VisitorDataContract.LineData.Data = DataArray;
            VisitorDataContract.LineData.Labels = TickArray;

            return VisitorDataContract;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        function GetVisitorData() {

            var deferred = $q.defer();
            $timeout(GetVisitorDataImpl, 0);

            function GetVisitorDataImpl() {

                HomeService.SendRequest(null, 'GetVisitorData').then(ShowResult, showError);

            }

            function ShowResult(data) {

                VisitorData = data.data.Visitor.Data;
                deferred.resolve(data.data.Visitor.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        // Check for messages
        //////////////////////////////////////////////////////////////////////////////////////
        function CheckForMessages() {

            var deferred = $q.defer();
            $timeout(CheckForMessagesImpl, 0);

            function CheckForMessagesImpl() {

                HomeService.SendRequest(null, 'CheckForMessages').then(ShowResult, showError);

            }

            function ShowResult(data) {

                deferred.resolve(data.data.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        // Submit task
        //////////////////////////////////////////////////////////////////////////////////////
        function GetArticle() {

            var deferred = $q.defer();
            $timeout(GetArticleImpl, 0);

            function GetArticleImpl() {

                var request = HomeContracts.GetArticleRequest();
                request.ArticleId = 5;
                HomeService.SendRequest(request, 'GetArticle').then(ShowResult, showError);

            }

            function ShowResult(data) {

                GetCurrentArticle = data.data.Topic;
                deferred.resolve(data.data.Topic.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }
    }
})();