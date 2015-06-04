(function () {

    angular.module('App.Articles').factory('Paging5Model',
    ['$q', '$http', '$timeout', 'ArticlesService', 'ArticlesContracts', 'Validation', Paging5Model]);

    function Paging5Model($q, $http, $timeout, ArticlesService, ArticlesContracts, Validation) {

        var serviceName = 'Paging5Model'; // route to the same origin Web Api controller - root directory
        var MemberInfoManager;                                      //  Used to hold results of pending members for grid

        var ArticlesModelMethods = {

            GetSampleUsers: GetSampleUsers,
            GetMemberManager: GetMemberInfoManager

        };

        return ArticlesModelMethods;

        function GetMemberInfoManager() {

            return MemberInfoManager;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        //  GetPendingUsers
        //////////////////////////////////////////////////////////////////////////////////////
        function GetSampleUsers(CurrentPage, PageSize, SortField, SortDirection) {

            var deferred = $q.defer();
            var MemberRequest = ArticlesContracts.GetUnapprovedMembersRequest();
            MemberRequest.CurrentPage = CurrentPage;
            MemberRequest.PageSize = PageSize;
            MemberRequest.SortField = SortField;
            MemberRequest.SortDirection = SortDirection;

            $timeout(AddUserImpl, 0);

            function AddUserImpl() {

                ArticlesService.SendRequest(MemberRequest, 'GetSampleUsers').then(ShowResult).catch(showError);

            }

            function ShowResult(data) {

                MemberInfoManager = data.data.MemberInfoManager;
                deferred.resolve(data.data.ErrorMessage);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;
        }
    }
})();