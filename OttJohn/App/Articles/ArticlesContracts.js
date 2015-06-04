(function () {

    angular.module('App.Articles').factory('ArticlesContracts',
    ['$http', '$timeout', ArticlesContracts]);

    function ArticlesContracts() {

        var serviceName = 'ArticlesContracts'; // route to the same origin Web Api controller - root directory

        var ArticlesContracts = {

            GetArticleContract: GetArticleContract,
            GetChartContract: GetChartContract,
            GetChartItemContract: GetChartItemContract,
            GetChartCollectionContract: GetChartCollectionContract,
            GetArticleRequest: GetArticleRequest,
            GetAddUserCommentRequest: GetAddUserCommentRequest,
            GetUserCommentsContract: GetUserCommentsContract,
            GetCommentContract: GetCommentContract,
            GetArticleSynopsisRequest: GetArticleSynopsisRequest,
            GetUnapprovedMembersRequest: GetUnapprovedMembersRequest

        };

        return ArticlesContracts;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Contracts and messages
        //////////////////////////////////////////////////////////////////////////////////////
        function GetArticleRequest() {

            var ArticleRequest = {

                ArticleId: 1

            }

            return ArticleRequest;

        }

        function GetAddUserCommentRequest() {

            var AddUserCommentRequest = {

                UserComment: GetCommentContract()

            }

            return AddUserCommentRequest;

        }

        function GetArticleSynopsisRequest() {

            var ArticleSynopsisRequest = {

                CurrentPage: 1,
                PageSize: 5,
                PageCount: 0,
                CategoryFilter: null,
                ResetRecordCount: 1

            }

            return ArticleSynopsisRequest;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////
        //  Contracts
        ////////////////////////////////////////////////////////////////////////////////////////////
        function GetCommentContract() {

            var Comment = {

                UserComment: null,
                UserId: null,
                ArticleNumber: null,
                UserName: null,
                DateStamp: null

            }

            return Comment;

        }

        function GetUserCommentsContract() {

            var UserComments = {

                CommentList: null

            }

            return UserComments;

        }

        function GetChartCollectionContract() {

            var ChartCollectionContract = {

                Charts: null

            }

            return ChartCollectionContract;

        }

        function GetArticleContract() {

            var ArticleContract = {

                Synopsis: '',
                Title: '',
                ArticleId: 0,
                DateStamp: null,
                Chapters: null

            }

            return ArticleContract;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////
        //  Contract for chart collection
        ////////////////////////////////////////////////////////////////////////////////////////////
        function GetArticleChapter() {

            var ArticleChapter = {

                ChapterId: 0,
                ChapterTitle: '',
                ChapterURL: ''

            }

            return ArticleChapter;

        }
        ////////////////////////////////////////////////////////////////////////////////////////////
        //  Contract for chart
        ////////////////////////////////////////////////////////////////////////////////////////////
        function GetChartContract() {

            var ChartContract = {

                Title: '',
                ContainerHeight: 270,
                ContainerWidth: 340,
                ContainerId: '',
                CenterX: 100,
                CenterY: 150,
                Radius: 90,
                CurrentX: 0,
                CurrentY: 0,
                OldX: 0,
                OldY: 0,
                KeyWidth: 20,
                KeyHeight: 20,
                KeyCenterX: 0,
                KeyCenterY: 0,
                KeyOffsetTop: 40,
                KeyOffsetInterval: 40,
                TitleCenterX: 0,
                TitleCenterY: 0,
                ItemLabelPaddingLeft: 0,
                ChartItems: null

            }

            return ChartContract;

        }

        ////////////////////////////////////////////////////////////////////////////////////////////
        //  Contract for chart item
        ////////////////////////////////////////////////////////////////////////////////////////////
        function GetChartItemContract() {

            var ChartItemContract = {

                Proportion: 0,
                RadianPosition: 0,
                RadianMeasure: 0,
                FillColor: null,
                ItemLabel: "",
                Path: ""

            }

            return ChartItemContract;

        }

        function GetUnapprovedMembersRequest() {

            var GetUnapprovedMembersRequest = {

                CurrentPage: 0,
                PageSize: 0,
                SortField: '',
                SortDirection: ''

            }

            return GetUnapprovedMembersRequest;

        }
    }
})();