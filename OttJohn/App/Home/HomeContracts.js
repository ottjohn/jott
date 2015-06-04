(function () {

    angular.module('App.Home').factory('HomeContracts',
    ['$http', '$timeout', HomeContracts]);

    function HomeContracts() {

        var serviceName = 'HomeContracts'; // route to the same origin Web Api controller - root directory

        var HomeContracts = {

            GetArticleContract: GetArticleContract,
            GetChartContract: GetChartContract,
            GetChartItemContract: GetChartItemContract,
            GetChartCollectionContract: GetChartCollectionContract,
            GetArticleRequest: GetArticleRequest,
            GetLineChart: GetLineChart

        };

        return HomeContracts;

        //////////////////////////////////////////////////////////////////////////////////////
        //  Contracts and messages
        //////////////////////////////////////////////////////////////////////////////////////
        function GetArticleRequest() {

            var ArticleRequest = {

                ArticleId: 1

            }

            return ArticleRequest;

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

        function GetArticleChapter() {

            var ArticleChapter = {

                ChapterId: 0,
                ChapterTitle: '',
                ChapterURL: ''

            }

            return ArticleChapter;

        }

        ////////////////////////////////////////////////////////////////////////////////////////////
        //  Contracts for line chart
        ////////////////////////////////////////////////////////////////////////////////////////////
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
                CanvasWidth: 600,
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
        ////////////////////////////////////////////////////////////////////////////////////////////
        //  Contract for chart collection PIE
        ////////////////////////////////////////////////////////////////////////////////////////////
        function GetChartCollectionContract() {

            var ChartCollectionContract = {

                Charts: null

            }

            return ChartCollectionContract;

        }
        ////////////////////////////////////////////////////////////////////////////////////////////
        //  Contract for chart PIE
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
        //  Contract for chart item PIE
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

    }
})();