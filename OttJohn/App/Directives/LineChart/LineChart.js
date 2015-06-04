angular.module('App').directive('linechart', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        scope: {

            linechartcontract: '=',
            callback: '&'

        },

        controller: ['$scope', function ($scope) {


        }],

        link: function (scope, element, attrs) {

            var Contract;
            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Scope watch
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // decide the watched value followed by what to do when the value changes
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.$watch('linechartcontract', function () {
                if (scope.linechartcontract && scope.linechartcontract != null && scope.linechartcontract != "") {

                    CheckContract(scope.linechartcontract);

                }
            }, true);

            function CheckContract(linechartcontract) {

                //if (linechartcontract.length > 0) {

                    var MyChart = new LineChartObject();
                    MyChart.BuildChart(linechartcontract);

                //}
            }

            var LineChartObject = function () {

                var Chart = this;
                var ChartContext = null;

                Chart.BuildChart = function (ChartData) {

                    Chart.GetContext(ChartData);
                    Chart.DrawContentRect(ChartData);

                }

                ///////////////////////////////////////////////////////////////////////////////////////////////
                //  Get a reference to the container
                ///////////////////////////////////////////////////////////////////////////////////////////////
                Chart.GetContext = function (ChartData) {

                    ChartContext = element[0].getContext('2d');
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////
                //  Draw chart area helper
                ///////////////////////////////////////////////////////////////////////////////////////////////
                Chart.DrawChartArea = function (ChartData, RectWidth, RectHeight) {

                    ChartContext.beginPath();
                    ChartContext.rect(ChartData.DimsAndColor.GridTopLeftX, ChartData.DimsAndColor.GridTopLeftY, RectWidth, RectHeight);
                    ChartContext.fillStyle = ChartData.DimsAndColor.ChartBackColor;
                    ChartContext.fill();
                    ChartContext.stroke();

                }

                ///////////////////////////////////////////////////////////////////////////////////////////////
                //  Draw horizontal grid lines and vertical markings
                ///////////////////////////////////////////////////////////////////////////////////////////////
                Chart.DrawHorizontalLinesAndVerticalMarks = function (ChartData, VertGridSpacing, RectTickLineVert, RectWidth, VertTickMarkIncrement) {

                    ChartContext.beginPath();
                    ChartContext.rect(ChartData.DimsAndColor.GridTopLeftX - 20, ChartData.DimsAndColor.GridTopLeftY - 10, 20, 300);
                    ChartContext.lineWidth = 0;
                    ChartContext.strokeStyle = "white";
                    ChartContext.fillStyle = "white";
                    ChartContext.fill();
                    ChartContext.stroke();
                    ChartContext.lineWidth = ChartData.LineData.LineWidth;

                    var StartVertNumber = VertGridSpacing;
                    for (var i = 0; i < ChartData.DimsAndColor.VerticalTicCount; i++) {

                        ChartContext.beginPath();
                        ChartContext.moveTo(ChartData.DimsAndColor.GridTopLeftX, RectTickLineVert);
                        ChartContext.lineTo(ChartData.DimsAndColor.GridTopLeftX + RectWidth, RectTickLineVert);
                        ChartContext.strokeStyle = ChartData.FontsAndText.TicMarkColor;
                        ChartContext.stroke();

                        ChartContext.font = ChartData.FontsAndText.TicMarkFont;
                        ChartContext.strokeText(StartVertNumber, ChartData.DimsAndColor.GridTopLeftX - 15, RectTickLineVert + 5);

                        StartVertNumber += VertGridSpacing;
                        RectTickLineVert -= VertTickMarkIncrement;

                    }
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////
                //  Build grid horizontal ticks and markers
                ///////////////////////////////////////////////////////////////////////////////////////////////
                Chart.DrawBottomChartMarkers = function (ChartData, RectWidth, RectHeight) {

                    var HorizValuesLen = ChartData.LineData.Labels.length;
                    var HorizTickIncrement = Math.floor(RectWidth / HorizValuesLen);
                    var HorizStart = HorizTickIncrement;

                    for (var i = 0; i < HorizValuesLen; i++) {

                        ChartContext.beginPath();
                        ChartContext.moveTo(ChartData.DimsAndColor.GridTopLeftX + HorizStart - HorizTickIncrement / 2, ChartData.DimsAndColor.GridTopLeftY + RectHeight);
                        ChartContext.lineTo(ChartData.DimsAndColor.GridTopLeftX + HorizStart - HorizTickIncrement / 2, ChartData.DimsAndColor.GridTopLeftY + RectHeight + 5);
                        ChartContext.strokeStyle = ChartData.FontsAndText.TicMarkColor;
                        ChartContext.stroke();
                        ChartContext.textAlign = "center";
                        ChartContext.strokeStyle = ChartData.FontsAndText.TicMarkColor;
                        ChartContext.strokeText(ChartData.LineData.Labels[i], ChartData.DimsAndColor.GridTopLeftX + HorizStart - HorizTickIncrement / 2, ChartData.DimsAndColor.GridTopLeftY + RectHeight + 20);
                        HorizStart += HorizTickIncrement;

                    }
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////
                //  Build line
                ///////////////////////////////////////////////////////////////////////////////////////////////
                Chart.DrawLine = function (ChartData, FullNumericHeight, RectWidth, RectHeight) {

                    var HorizValuesLen = ChartData.LineData.Labels.length;
                    var HorizTickIncrement = Math.floor(RectWidth / HorizValuesLen);
                    var HorizStart = HorizTickIncrement;
                    var DataPointScale = RectHeight + ChartData.DimsAndColor.GridTopLeftY - Math.round((ChartData.LineData.Data[0] / FullNumericHeight) * RectHeight);

                    ChartContext.beginPath();
                    var FirstLeftPoint = ChartData.DimsAndColor.GridTopLeftX + HorizStart - HorizTickIncrement / 2;
                    ChartContext.moveTo(ChartData.DimsAndColor.GridTopLeftX + HorizStart - HorizTickIncrement / 2, DataPointScale);

                    for (var i = 1; i < HorizValuesLen; i++) {

                        DataPointScale = RectHeight + ChartData.DimsAndColor.GridTopLeftY - Math.round((ChartData.LineData.Data[i] / FullNumericHeight) * RectHeight);
                        HorizStart += HorizTickIncrement;
                        ChartContext.lineTo(ChartData.DimsAndColor.GridTopLeftX + HorizStart - HorizTickIncrement / 2, DataPointScale);
                        ChartContext.strokeStyle = ChartData.LineData.Color;
                        ChartContext.lineWidth = ChartData.LineData.LineWidth;
                        ChartContext.stroke();

                    }
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////
                //  Draw Title
                ///////////////////////////////////////////////////////////////////////////////////////////////
                Chart.DrawTitle = function (ChartData, RectWidth, RectHeight) {

                    var ChartCenterX = ChartData.DimsAndColor.GridTopLeftX + Math.floor(RectWidth / 2);
                    ChartContext.textAlign = "center";
                    ChartContext.strokeStyle = ChartData.FontsAndText.TicMarkColor;
                    ChartContext.font = ChartData.FontsAndText.TitleFont;
                    ChartContext.lineWidth = 1;
                    ChartContext.strokeText(ChartData.FontsAndText.Title, ChartCenterX, ChartData.DimsAndColor.GridTopLeftY + RectHeight + 50);

                }

                ///////////////////////////////////////////////////////////////////////////////////////////////
                //  Draw the chart
                ///////////////////////////////////////////////////////////////////////////////////////////////
                Chart.DrawContentRect = function (ChartData) {

                    ////////////////////////////////////////////////////////////////////////////////////////////
                    //  Variable creation that will be used throughout building process
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    var RectWidth = ChartData.DimsAndColor.CanvasWidth - 2 * ChartData.DimsAndColor.GridTopLeftX;
                    var RectHeight = ChartData.DimsAndColor.CanvasHeight - ChartData.DimsAndColor.GridTopLeftY - ChartData.DimsAndColor.BottomChartOffset;
                    var RectBottom = ChartData.DimsAndColor.GridTopLeftY + RectHeight;
                    var VertTickMarkIncrement = Math.floor(RectHeight / ChartData.DimsAndColor.VerticalTicCount);
                    var RectTickLineVert = RectBottom - VertTickMarkIncrement;
                    var MinY = Math.min.apply(Math, ChartData.LineData.Data);
                    var MaxY = Math.max.apply(Math, ChartData.LineData.Data);
                    var VertGridSpacing = Math.floor((MaxY - MinY) / (ChartData.DimsAndColor.VerticalTicCount - 1));
                    var FullNumericHeight = VertGridSpacing * ChartData.DimsAndColor.VerticalTicCount;

                    ////////////////////////////////////////////////////////////////////////////////////////////
                    //  Build Chart Area
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    Chart.DrawChartArea(ChartData, RectWidth, RectHeight);

                    ////////////////////////////////////////////////////////////////////////////////////////////
                    //  Build grid lines and vertical, numberic markings
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    Chart.DrawHorizontalLinesAndVerticalMarks(ChartData, VertGridSpacing, RectTickLineVert, RectWidth, VertTickMarkIncrement);

                    ////////////////////////////////////////////////////////////////////////////////////////////
                    //  Build grid horizontal ticks and markers
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    Chart.DrawBottomChartMarkers(ChartData, RectWidth, RectHeight);

                    ////////////////////////////////////////////////////////////////////////////////////////////
                    //  Draw the line
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    Chart.DrawLine(ChartData, FullNumericHeight, RectWidth, RectHeight);

                    ////////////////////////////////////////////////////////////////////////////////////////////
                    //  Draw Title
                    ////////////////////////////////////////////////////////////////////////////////////////////
                    Chart.DrawTitle(ChartData, RectWidth, RectHeight);

                }

                return Chart;

            }
        }
    };
}]);