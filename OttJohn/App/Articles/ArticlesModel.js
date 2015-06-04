(function () {

    angular.module('App.Articles').factory('ArticlesModel',
    ['$q', '$http', '$timeout', 'ArticlesService', 'ArticlesContracts', 'Validation', ArticlesModel]);

    function ArticlesModel($q, $http, $timeout, ArticlesService, ArticlesContracts, Validation) {

        var serviceName = 'ArticlesModel'; // route to the same origin Web Api controller - root directory
        var FeatureTree;
        var TaskList;
        var GetCurrentArticle;
        var SynopsisList;
        var UsedCategoryList;
        var PageCount;
        var RecordCount;

        var ArticlesModelMethods = {

            GetArticle: GetArticle,
            GetCurrentArticle: GetCurrentArticle,
            GetSynopsisList: GetSynopsisList,
            GetArticleSynopsis: GetArticleSynopsis,
            AddComment: AddComment,
            GetArticleSearchCategories: GetArticleSearchCategories,
            GetPageCount: GetPageCount

        };

        return ArticlesModelMethods;

        //////////////////////////////////////////////////////////////////////////////////////
        // Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        function GetPageCount() {

            return PageCount;

        }

        function GetCurrentArticle() {

            return GetCurrentArticle;

        }

        function GetArticleSearchCategories() {

            return UsedCategoryList;

        }

        function GetSynopsisList() {

            return SynopsisList;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Service Calls
        //////////////////////////////////////////////////////////////////////////////////////
        // GetArticleSynopsis
        //////////////////////////////////////////////////////////////////////////////////////
        function GetArticleSynopsis(CategoriesFilter, CurrentPage, ResetRecordCount, TotalPages) {

            var deferred = $q.defer();
            $timeout(GetArticleSynopsisImpl, 0);

            function GetArticleSynopsisImpl() {

                var request = ArticlesContracts.GetArticleSynopsisRequest();
                request.CategoryFilter = CategoriesFilter;
                request.CurrentPage = CurrentPage;
                request.ResetRecordCount = ResetRecordCount;
                request.PageCount = TotalPages;
                ArticlesService.SendRequest(request, 'GetArticleSynopsis').then(ShowResult, showError);

            }

            function ShowResult(data) {

                SynopsisList = data.data.ArticleList.SynopsisList;
                PageCount = data.data.ArticleList.PageCount;

                if(UsedCategoryList == "undefined" || UsedCategoryList == null)
                    UsedCategoryList = data.data.ArticleList.SearchObject.Categories;

                deferred.resolve(data.data.ArticleList.Message);

            }

            function showError() {

                deferred.reject("Communication failed");

            }

            return deferred.promise;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        // Add Comment
        //////////////////////////////////////////////////////////////////////////////////////
        function AddComment(Comment, UserId, ArticleNumber) {

            var deferred = $q.defer();
            $timeout(AddCommentImpl, 0);

            function AddCommentImpl() {

                var request = ArticlesContracts.GetAddUserCommentRequest();
                request.UserComment.UserComment = Comment;
                request.UserComment.UserId = UserId;
                request.UserComment.ArticleNumber = ArticleNumber;
                ArticlesService.SendRequest(request, 'AddComment').then(ShowResult, showError);

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
        // GetArticle
        //////////////////////////////////////////////////////////////////////////////////////
        function GetArticle(id) {

            var deferred = $q.defer();
            $timeout(GetArticleImpl, 0);

            function GetArticleImpl() {

                var request = ArticlesContracts.GetArticleRequest();
                request.ArticleId = id;
                ArticlesService.SendRequest(request, 'GetArticle').then(ShowResult, showError);

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