(function () {

    angular.module('App.Home').controller('HomeController',
    ['$q', '$timeout', '$location', 'HomeService', 'HomeContracts', 'HomeModel', '$rootScope', 'AppState', HomeController]);

    function HomeController($q, $timeout, $location, HomeService, HomeContracts, HomeModel, $rootScope, AppState) {

        var Home = this;
        var scope = $rootScope.$new();
        //$scope.reload = function () {
        //    router.setUpRoutes();
        //};
        Home.Message;
        Home.ChartContract;
        Home.ArticleTitle;
        Home.ArticleContent;
        Home.ArticleName;
        Home.NewProp;
        Home.LineChartContract;
        Home.LineChartCallBack;
        Home.CurrentJottMessage;
 
        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////
        //  Controller initialization
        //////////////////////////////////////////////////////////////////////////////////////
        Home.Init = function () {

            Home.Message = "Welcome to my website. I know it's a little messy. Please bear with me for a while.";
            //Home.GetArticle();
            if (AppState.FrontPageLineChart == null)
                Home.GetVisitorData();
            else
                Home.LineChartContract = AppState.FrontPageLineChart;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Check for messages
        //////////////////////////////////////////////////////////////////////////////////////
        Home.CheckForMessages = function () {

            Home.Message = "Please wait. Checking for messages from my creator ...";
            HomeModel.CheckForMessages().then(CheckForMessagesResult).catch(CheckForMessagesResult);
            function CheckForMessagesResult(Message) { Home.CheckForMessagesResult(Message) }

        }

        Home.CheckForMessagesResult = function (Message) {

            if (Message == "") {

                if (Home.CurrentJottMessage != undefined & Home.CurrentJottMessage != null) {

                    Home.Message = Home.CurrentJottMessage;

                } else {

                    Home.Message = "No messages from John. He must be busy today.";

                }

            } else {

                Home.CurrentJottMessage = Message;
                Home.Message = Message;

            }

            var CurrentPath = $location.$$path;
            if (CurrentPath.indexOf("Home") > -1)
                setTimeout(function () { Home.CheckForMessages(); }, 20000);
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Visitor Data
        //////////////////////////////////////////////////////////////////////////////////////
        Home.GetVisitorData = function () {

            Home.Message = "Please wait. Retrieving visitor information ...";
            HomeModel.GetVisitorData().then(GetVisitorDataResult).catch(GetVisitorDataResult);
            function GetVisitorDataResult(Message) { Home.GetVisitorDataResult(Message) }

        }

        Home.GetVisitorDataResult = function (Message) {

            if (Message == "") {

                Home.Message = "Welcome to my website!";
                Home.LineChartContract = HomeModel.HydrateVisitorContract();
                AppState.FrontPageLineChart = Home.LineChartContract

            } else {

                Home.Message = Message;

            }

            Home.CheckForMessages();

        }

        Home.GetLineChart = function () {

            var ChartData = GetLineChart();
            Home.LineChartContract = ChartData;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Get Article Functionality
        //////////////////////////////////////////////////////////////////////////////////////
        Home.GetArticle = function () {

            Home.Message = "Please wait. Retrieving article ...";
            HomeModel.GetArticle().then(GetArticleResult).catch(GetArticleResult);
            function GetArticleResult(Message) { Home.GetArticleResult(Message) }

        }

        Home.GetArticleResult = function (Message) {

            Home.Message = Message;
            if (Message == "") {

                Home.ArticleContent = HomeModel.GetCurrentArticle();
                Home.DisplayArticle();

            } 
        }

        Home.DisplayArticle = function () {

            var CurrentChapterUrl = Home.ArticleContent.Chapters[Home.ArticleContent.CurrentArticleIndex].ChapterURL;
            var ArticleDateStamp = Home.ArticleContent.Chapters[0].DateStamp;
            Home.ArticleTitle = Home.ArticleContent.Chapters[Home.ArticleContent.CurrentArticleIndex].ChapterTitle + " " + ArticleDateStamp;
            Home.ArticleName = Home.ArticleContent.Chapters[Home.ArticleContent.CurrentArticleIndex].ChapterURL;
            $location.url("/App/Home/" + Home.ArticleName);
            if(Home.ArticleName == "PieChart5") Home.BuildSummaryCharts();

        }

        Home.Back = function () {

            Home.ChangeArticlePage(-1);

        }

        Home.Next = function () {

            Home.ChangeArticlePage(1);

        }

        Home.ChangeArticlePage = function (Dir) {

            var CurrentIdx = Home.ArticleContent.CurrentArticleIndex;
            var ArticleLength = Home.ArticleContent.Chapters.Length;
            if (!(Dir == -1 && CurrentIdx == 0) && !(Dir == 1 && CurrentIdx == ArticleLength)) {

                Home.ArticleContent.CurrentArticleIndex += Dir;
                Home.DisplayArticle();

            }
        }

        Home.SetNewProp = function () {

            if (isNaN(Home.NewProp)) {

                alert("C'mon, man. Put in a real number.");

            } else {

                var NewProp = parseInt(Home.NewProp);
                var ChartCollection = Home.ChartContract;
                ChartCollection[0].ChartItems[0].Proportion = NewProp;
                ChartCollection[0].ChartItems[1].Proportion = 100 - NewProp;

                $timeout(ShowChart(), 1000);
                function ShowChart() {

                    Home.ChartContract = ChartCollection;

                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Chart Example
        //////////////////////////////////////////////////////////////////////////////////////
        //Home.BuildSummaryCharts = function () {

        //    var ColorArray = new Array("blue", "yellow", "green", "red", "black", "orange");
        //    var ItemLabel = new Array("Complete", "Incomplete");
        //    var ChartCollection = HomeContracts.GetChartCollectionContract();
        //    ChartCollection.Charts = new Array();
        //    //var iLen = Home.TasksSummary.length;
        //    //for (var i = 0; i < iLen; i++) {

        //        var Chart = HomeContracts.GetChartContract();
        //        Chart.ContainerId = "SamplePieChartholder";
        //        Chart.Title = "Sample Pie Chart";                       //  title for the pie chart
        //        Chart.KeyCenterX = Chart.CenterX + Chart.Radius + 50;   //  rectangular key center x -- pushed to right. Could be a padding left
        //        Chart.KeyCenterY = Chart.CenterY - Chart.Radius;        //  rectangular key center y
        //        Chart.TitleCenterX = Chart.CenterX - Chart.Radius;      //  title center x
        //        Chart.TitleCenterY = Chart.CenterY - Chart.Radius - 30; //  title center y -- pushed up from top of pie chart
        //        Chart.ItemLabelPaddingLeft = 0;                         //  Padding between key rectangle and label
        //        Chart.ChartItems = new Array();                         //  array to hold items returned from server

        //        //Home.TasksSummary[0].ProportionCompleted = 40;
        //        //Home.TasksSummary[1].ProportionCompleted = 30;
        //        //Home.TasksSummary[2].ProportionCompleted = 80;
        //        for (var j = 0; j < 2; j++) {

        //            Chart.ChartItems[j] = HomeContracts.GetChartItemContract();

        //            if (j == 0) {

        //                Chart.ChartItems[j].Proportion = 60;
        //                Chart.ChartItems[j].ItemLabel = "Item 1";


        //            } else {

        //                Chart.ChartItems[j].Proportion = 40;
        //                Chart.ChartItems[j].ItemLabel = "Item 2";

        //            }

        //            Chart.ChartItems[j].FillColor = ColorArray[j];

        //        }

        //        ChartCollection.Charts[0] = Chart;
        //    //}

        //    Home.ChartContract = ChartCollection.Charts;
        //}

        //////////////////////////////////////////////////////////////////////////////////////
        //  Navigation
        //////////////////////////////////////////////////////////////////////////////////////
        Home.ReturnToMainScreen = function () {

            $location.url("/home");

        }

        Home.RegisterRoute = function (CallingRoute) {

            //At the moment, there is nothing to return to here.
            //When there is something to return to, get the code
            //from another controller.
            AppState.SetRoute("Index", "/");

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            Home.Init();
            var CallingRoute = $location.$$path.replace("/", "");
            var ProcessName = Home.RegisterRoute(CallingRoute);

        });

        //Home.Init();

    }

})();