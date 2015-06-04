(function () {

    angular.module('App.Articles').controller('ArticlesController',
    ['$q', '$timeout', '$location', 'ArticlesService', 'ArticlesContracts', 'ArticlesModel', '$rootScope', 'AppState', ArticlesController]);

    function ArticlesController($q, $timeout, $location, ArticlesService, ArticlesContracts, ArticlesModel, $rootScope, AppState) {

        var Articles = this;
        var scope = $rootScope.$new();

        Articles.Message;
        Articles.ChartContract;
        Articles.ArticleTitle;
        Articles.ArticleContent;
        Articles.ArticleName;
        Articles.NewProp;
        Articles.Synopsis;
        Articles.UsedCategories;
        Articles.CurrentFilter;
        Articles.CurrentPage;
        Articles.TotalPages;
        Articles.Comment = "";
        Articles.Comments = null;
        Articles.LineChartContract = null;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        //  Controller initialization
        //////////////////////////////////////////////////////////////////////////////////////
        Articles.Init = function () {

            Articles.Message = "";
            Articles.CurrentPage = 1;
            Articles.CurrentFilter = '';
            Articles.TotalPages = 0;
            Articles.GetArticleSynopsis();

        }

        Articles.GoSearch = function () {

            var CategoryFilter = "";
            var iLen = Articles.UsedCategories.Categories.length;
            for (var i = 0; i < iLen; i++) {

                if (Articles.UsedCategories.Categories[i].CategorySelected == 1) {

                    if (CategoryFilter == "") {

                        CategoryFilter = Articles.UsedCategories.Categories[i].CategoryId;

                    } else {

                        CategoryFilter += "," + Articles.UsedCategories.Categories[i].CategoryId;

                    }
                }
            }

            Articles.CurrentPage = 1;
            Articles.CurrentFilter = CategoryFilter;
            Articles.GetFilteredArticleSynopsis(CategoryFilter, 1);
        }

        Articles.SynLast = function () {

            if (Articles.CurrentPage < Articles.TotalPages) {

                Articles.CurrentPage = Articles.TotalPages;
                Articles.GetFilteredArticleSynopsis(Articles.CurrentFilter, 0);

            }
        }

        Articles.SynNext = function () {

            if (Articles.CurrentPage < Articles.TotalPages) {

                Articles.CurrentPage += 1;
                Articles.GetFilteredArticleSynopsis(Articles.CurrentFilter, 0);

            }
        }

        Articles.SynBack = function () {

            if (Articles.CurrentPage > 1) {

                Articles.CurrentPage -= 1;
                Articles.GetFilteredArticleSynopsis(Articles.CurrentFilter, 0);

            }
        }

        Articles.SynFirst = function () {

            if (Articles.CurrentPage > 1) {

                Articles.CurrentPage = 1;
                Articles.GetFilteredArticleSynopsis(Articles.CurrentFilter, 0);

            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Article Sysnopsis Set
        //////////////////////////////////////////////////////////////////////////////////////
        Articles.GetFilteredArticleSynopsis = function (CategoryFilter, ResetRecordCount) {

            Articles.Message = "Please wait. Retrieving article synopsis list...";
            ArticlesModel.GetArticleSynopsis(CategoryFilter, Articles.CurrentPage, ResetRecordCount, Articles.TotalPages).then(GetArticleSynopsisResult).catch(GetArticleSynopsisResult);
            function GetArticleSynopsisResult(Message) { Articles.GetArticleSynopsisResult(Message) }

        }

        Articles.GetArticleSynopsis = function () {

            Articles.Message = "Please wait. Retrieving article synopsis list...";
            ArticlesModel.GetArticleSynopsis('', Articles.CurrentPage, 1, Articles.TotalPages).then(GetArticleSynopsisResult).catch(GetArticleSynopsisResult);
            function GetArticleSynopsisResult(Message) { Articles.GetArticleSynopsisResult(Message) }

        }

        Articles.GetArticleSynopsisResult = function (Message) {

            Articles.Message = Message;
            if (Message == "") {

                Articles.Synopsis = ArticlesModel.GetSynopsisList();
                Articles.UsedCategories = null;
                Articles.TotalPages = ArticlesModel.GetPageCount();
                Articles.UsedCategories = ArticlesModel.GetArticleSearchCategories();
                Articles.Message = "Please select an article from the list or use the fields below to filter your search.";

            }
        }

        Articles.GetCategoryId = function (id) {

            var iLen = Articles.UsedCategories.Categories.length;
            for (var i = 0; i < iLen; i++) {

                if (Articles.UsedCategories.Categories[i].CategoryId == id) {

                    if (Articles.UsedCategories.Categories[i].CategorySelected == 1)
                        Articles.UsedCategories.Categories[i].CategorySelected = 0;
                    else
                        Articles.UsedCategories.Categories[i].CategorySelected = 1;

                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Article Functionality
        //////////////////////////////////////////////////////////////////////////////////////
        Articles.GetArticle = function (id) {

            Articles.Comment = "";
            Articles.Comments = null;
            Articles.Message = "Please wait. Retrieving article ...";
            ArticlesModel.GetArticle(id).then(GetArticleResult).catch(GetArticleResult);
            function GetArticleResult(Message) { Articles.GetArticleResult(Message) }

        }

        Articles.GetArticleResult = function (Message) {

            Articles.Message = Message;
            if (Message == "") {

                $("#btnHomeBack").attr("disabled", true);
                Articles.ArticleContent = ArticlesModel.GetCurrentArticle();
                Articles.ArticleContent.ArticleNumber = Articles.ArticleContent.Chapters[0].ArticleNumber;
                $("#ArticleList").hide();
                $("#ArticleContent").show();
                Articles.DisplayArticle();

            }
        }

        Articles.DisplayArticle = function () {

            var CurrentChapterUrl = Articles.ArticleContent.Chapters[Articles.ArticleContent.CurrentArticleIndex].ChapterURL;
            var ArticleDateStamp = Articles.ArticleContent.Chapters[0].DateStamp;
            Articles.ArticleTitle = Articles.ArticleContent.Chapters[Articles.ArticleContent.CurrentArticleIndex].ChapterTitle + " " + ArticleDateStamp;
            Articles.ArticleName = Articles.ArticleContent.Chapters[Articles.ArticleContent.CurrentArticleIndex].ChapterURL;
            $location.url("/App/Articles/" + Articles.ArticleName);
            if (Articles.ArticleName == "PieChart5") Articles.BuildSummaryCharts();
            if (Articles.ArticleName == "LineChart5") Articles.GetLineChart();
            window.scroll(0, 0);
        }

        Articles.Back = function () {

            Articles.ChangeArticlePage(-1);

        }

        Articles.Next = function () {

            Articles.ChangeArticlePage(1);

        }

        Articles.ChangeArticlePage = function (Dir) {

            if (!((Dir == -1 && Articles.ArticleContent.CurrentArticleIndex == 0) || (Dir == 1 && Articles.ArticleContent.CurrentArticleIndex == ArticleLength))) {

                Articles.ArticleContent.CurrentArticleIndex += Dir;
                var CurrentIdx = Articles.ArticleContent.CurrentArticleIndex;
                var ArticleLength = Articles.ArticleContent.Chapters.length - 1;

                if (CurrentIdx == 0) {

                    $("#btnHomeBack").attr("disabled", true);
                    $("#btnHomeNext").removeAttr("disabled");

                } else if (CurrentIdx == ArticleLength) {

                    $("#btnHomeBack").removeAttr("disabled");
                    $("#btnHomeNext").attr("disabled", true);

                } else {

                    $("#btnHomeBack").removeAttr("disabled");
                    $("#btnHomeNext").removeAttr("disabled");

                }

                Articles.DisplayArticle();

            }
        }

        Articles.Exit = function () {

            $("#ArticleList").show();
            $("#ArticleContent").hide();
            window.scroll(0, 0);

        }

        Articles.SetNewProp = function () {

            if (isNaN(Articles.NewProp)) {

                alert("C'mon, man. Put in a real number.");

            } else {

                var NewProp = parseInt(Articles.NewProp);
                var ChartCollection = Articles.ChartContract;
                ChartCollection[0].ChartItems[0].Proportion = NewProp;
                ChartCollection[0].ChartItems[1].Proportion = 100 - NewProp;

                $timeout(ShowChart(), 1000);
                function ShowChart() {

                    Articles.ChartContract = ChartCollection;

                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Comment Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        Articles.AddComment = function () {

            var UserComment = Articles.Comment;
            if (UserComment != "" && UserComment != undefined) {

                Articles.Message = "Please wait. Adding your comment...";
                ArticlesModel.AddComment(UserComment, AppState.GetUserId(), Articles.ArticleContent.ArticleNumber).then(GetAddCommentResult).catch(GetAddCommentResult);
                function GetAddCommentResult(Message) { Articles.GetAddCommentResult(Message) }

            }
        }

        Articles.GetAddCommentResult = function (Message) {

            Articles.Message = Message;
            if (Message == "") {

                Articles.IncludeCommentInList();
                //Articles.Synopsis = ArticlesModel.GetSynopsisList();
                //Articles.Message = "Please select an article from the list.";

            }
        }

        Articles.IncludeCommentInList = function () {

            if (Articles.Comments == null) {

                Articles.CreateUserCommentList();

            }

            Articles.ArticleContent.ArticleComments.CommentList.push(Articles.FormatComment());
            //Articles.Comments.CommentList.push(Articles.FormatComment());
            Articles.Comment = "";
            scope.$apply();

        }

        Articles.CreateUserCommentList = function () {

            Articles.Comments = ArticlesContracts.GetUserCommentsContract();
            Articles.Comments.CommentList = new Array();
            
            //var UserContract = ArticlesContracts.GetCommentContract();
            //UserContract.UserComment = Articles.Comment;
            //UserContract.UserName = AppState.GetUserName();
            //UserContract.DateStamp = CurrentDate;
            //Articles.Comments.CommentList.push(UserContract);

        }

        Articles.FormatComment = function () {

            var CurrentDate = new Date();
            var UserContract = ArticlesContracts.GetCommentContract();
            UserContract.UserComment = Articles.Comment;
            UserContract.UserName = AppState.GetUserName();
            UserContract.DateStamp = CurrentDate;
            return UserContract;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Chart Example
        //////////////////////////////////////////////////////////////////////////////////////
        Articles.BuildSummaryCharts = function () {

            var ColorArray = new Array("blue", "yellow", "green", "red", "black", "orange");
            var ItemLabel = new Array("Complete", "Incomplete");
            var ChartCollection = ArticlesContracts.GetChartCollectionContract();
            ChartCollection.Charts = new Array();
            //var iLen = Articles.TasksSummary.length;
            //for (var i = 0; i < iLen; i++) {

            var Chart = ArticlesContracts.GetChartContract();
            Chart.ContainerId = "SamplePieChartholder";
            Chart.Title = "Sample Pie Chart";                       //  title for the pie chart
            Chart.KeyCenterX = Chart.CenterX + Chart.Radius + 50;   //  rectangular key center x -- pushed to right. Could be a padding left
            Chart.KeyCenterY = Chart.CenterY - Chart.Radius;        //  rectangular key center y
            Chart.TitleCenterX = Chart.CenterX - Chart.Radius;      //  title center x
            Chart.TitleCenterY = Chart.CenterY - Chart.Radius - 30; //  title center y -- pushed up from top of pie chart
            Chart.ItemLabelPaddingLeft = 0;                         //  Padding between key rectangle and label
            Chart.ChartItems = new Array();                         //  array to hold items returned from server

            //Articles.TasksSummary[0].ProportionCompleted = 40;
            //Articles.TasksSummary[1].ProportionCompleted = 30;
            //Articles.TasksSummary[2].ProportionCompleted = 80;
            for (var j = 0; j < 2; j++) {

                Chart.ChartItems[j] = ArticlesContracts.GetChartItemContract();

                if (j == 0) {

                    Chart.ChartItems[j].Proportion = 60;
                    Chart.ChartItems[j].ItemLabel = "Item 1";


                } else {

                    Chart.ChartItems[j].Proportion = 40;
                    Chart.ChartItems[j].ItemLabel = "Item 2";

                }

                Chart.ChartItems[j].FillColor = ColorArray[j];

            }

            ChartCollection.Charts[0] = Chart;
            //}

            Articles.ChartContract = ChartCollection.Charts;
        }

        Articles.GetLineChart = function () {

            var ChartData = GetLineChart();
            Articles.LineChartContract = ChartData;

        }

        function GetLineChart() {

            var LineChart = {

                GridUniqueId: "One",
                FontsAndText: GetChartFontsAndText(),
                DimsAndColor: GetChartDimsAndColor(),
                LineData: GetLineData()

            }

            return LineChart;

        }

        function GetChartFontsAndText() {

            var ChartFontsAndText = {

                Title: "Visits Over Past Week",
                TitleFont: "14pt arial",
                TitleColor: "black",
                TicMarkFont: "8pt arial",
                TicMarkColor: "black"

            }

            return ChartFontsAndText;

        }

        function GetChartDimsAndColor() {


            var ChartDimsAndColor = {

                CanvasHeight: 300,
                CanvasWidth: 800,
                GridBorderColor: "black",
                GridBorderThickness: "1",
                ChartBackColor: "#eeeeee",
                GridTopLeftX: 40,
                GridTopLeftY: 20,
                VerticalTicCount: 3,
                BottomChartOffset: 60


            }

            return ChartDimsAndColor;

        }

        function GetLineData() {

            var LineData = {

                Color: "red",
                LineWidth: 1,
                Data: new Array(1, 3, 5, 3, 7, 8, 2),
                Labels: new Array('1-17', '1-18', '1-19', '1-12', '1-21', '1-22', '1-23')

            }

            return LineData;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Navigation
        //////////////////////////////////////////////////////////////////////////////////////
        Articles.ReturnToMainScreen = function () {

            $location.url("/Articles");

        }

        Articles.RegisterRoute = function (CallingRoute) {

            //At the moment, there is nothing to return to here.
            //When there is something to return to, get the code
            //from another controller.
            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];
            //AppState.SetRoute("Index", "/");

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            Articles.Init();
            var CallingRoute = $location.$$path.replace("/", "");
            var ProcessName = Articles.RegisterRoute(CallingRoute);

        });

        scope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {

            if (toState.name == "Articles") {

                if (fromState.name.indexOf("Articles") > -1 && fromState.name != "Articles") {

                    $("#ArticleList").show();
                    $("#ArticleContent").hide();

                }
                //event.preventDefault();

            }
            // transitionTo() promise will be rejected with 
            // a 'transition prevented' error
        })
    }

})();