angular.module('App').directive('piechart', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        scope: {

            piechartcontract: '=',
            callback: '&'

        },

        controller: ['$scope', function ($scope) {


        }],

        //templateUrl: 'App/Directives/PieChart/PieChart.html',
        link: function (scope, element, attrs) {

            var Contract;
            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Scope watch
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // decide the watched value followed by what to do when the value changes
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.$watch('piechartcontract', function () {
                if (scope.piechartcontract && scope.piechartcontract != null && scope.piechartcontract != "") {

                    CheckContract(scope.piechartcontract);

                }
            }, true);

            function CheckContract(piechartcontract) {

                if (piechartcontract.length > 0) {

                    DrawPieCharts(piechartcontract);

                }
            }

            function BuildContainers(ChartCollection) {

                var ChartCollectionHtml = "";
                var iLen = ChartCollection.length;
                for (var i = 0; i < iLen; i++) {

                    var BuildHolder = "<div id='$ID$' style='width:$WIDTH$px; height:$HEIGHT$px; border: solid; float: left; Margin: 10px;' />";
                    var BuildHolder = BuildHolder.replace("$WIDTH$", ChartCollection[i].ContainerWidth);
                    var BuildHolder = BuildHolder.replace("$HEIGHT$", ChartCollection[i].ContainerHeight);
                    var BuildHolder = BuildHolder.replace("$ID$", ChartCollection[i].ContainerId);
                    ChartCollectionHtml += BuildHolder;
                }

                $("#ChartContainer").html(ChartCollectionHtml);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////
            //  Get value for x coord
            ////////////////////////////////////////////////////////////////////////////////////////////
            function GetXValue(CenterX, Radius, Radians) {

                return Radius * Math.cos(Radians) + CenterX;

            }

            ////////////////////////////////////////////////////////////////////////////////////////////
            //  Get value for y coord
            ////////////////////////////////////////////////////////////////////////////////////////////
            function GetYValue(CenterY, Radius, Radians) {

                return CenterY + Radius * Math.sin(Radians);

            }

            function DrawPieCharts(ChartCollection) {

                BuildContainers(ChartCollection);

                var iLen = ChartCollection.length;
                for (var k = 0; k < iLen; k++) {

                    var Chart = ChartCollection[k];
                    DrawPieChart(Chart);

                }
            }

            function DrawPieChart(Chart) {

                var Paper = Raphael(Chart.ContainerId);                 //  holder refers to the DIV element below
                var Arc;                                                //  refers to the arc being drawn during the iterations
                var ItemKey;                                            //  refers to the key rectangle for the pie chart
                var ItemTextLabel;                                      //  refers to the label associated with the key
                var ItemTextTitle;                                      //  title for the chart
                var ArcLong;                                            //  pushes arc in or out depending on its size

                ////////////////////////////////////////////////////////////////////////////////////////////
                //  Render chart
                ////////////////////////////////////////////////////////////////////////////////////////////
                var iLen = Chart.ChartItems.length;
                var iSum = 0;
                for (var i = 0; i < iLen; i++) {

                    Chart.ChartItems[i].RadianMeasure = (((Chart.ChartItems[i].Proportion) / 100) * 360) * (Math.PI / 180);
                    Chart.ChartItems[i].RadianPosition = (((Chart.ChartItems[i].Proportion + iSum) / 100) * 360) * (Math.PI / 180);

                    if (Chart.ChartItems[i].RadianMeasure >= Math.PI)
                        ArcLong = 1;
                    else
                        ArcLong = 0

                    Chart.OldX = Chart.CurrentX;
                    Chart.OldY = Chart.CurrentY;
                    Chart.CurrentX = GetXValue(Chart.CenterX, Chart.Radius, Chart.ChartItems[i].RadianPosition);
                    Chart.CurrentY = GetYValue(Chart.CenterY, Chart.Radius, Chart.ChartItems[i].RadianPosition);

                    if (i == 0) {

                        Chart.ChartItems[i].Path = "M" + Chart.CenterX + "," + Chart.CenterY + " L" + (Chart.CenterX + Chart.Radius) + "," + Chart.CenterY + " A" + Chart.Radius + "," + Chart.Radius + " 0 " + ArcLong + ",1 " + Chart.CurrentX + "," + Chart.CurrentY + " L" + Chart.CenterX + "," + Chart.CenterY;

                    } else if (i == iLen - 1) {

                        Chart.ChartItems[i].Path = "M" + Chart.OldX + "," + Chart.OldY + " A" + Chart.Radius + "," + Chart.Radius + " 0 " + ArcLong + ",1 " + (Chart.CenterX + Chart.Radius) + "," + Chart.CenterY + " L " + Chart.CenterX + "," + Chart.CenterY;

                    } else {

                        Chart.ChartItems[i].Path = "M" + Chart.OldX + "," + Chart.OldY + " A" + Chart.Radius + "," + Chart.Radius + " 0 " + ArcLong + ",1 " + Chart.CurrentX + "," + Chart.CurrentY + " L " + Chart.CenterX + "," + Chart.CenterY;

                    }

                    Arc = Paper.path(Chart.ChartItems[i].Path);
                    Arc.attr("fill", Chart.ChartItems[i].FillColor);
                    ItemKey = Paper.rect(Chart.KeyCenterX - Chart.KeyWidth / 2, Chart.KeyOffsetTop + Chart.KeyCenterY - Chart.KeyHeight / 2 + i * Chart.KeyOffsetInterval, Chart.KeyWidth, Chart.KeyHeight);
                    ItemKey.attr("fill", Chart.ChartItems[i].FillColor);
                    ItemTextLabel = Paper.text(Chart.KeyCenterX + Chart.KeyWidth, Chart.KeyOffsetTop + Chart.KeyCenterY + i * Chart.KeyOffsetInterval, Chart.ChartItems[i].ItemLabel + " " + Chart.ChartItems[i].Proportion + "%");
                    ItemTextLabel.attr('text-anchor', 'start');
                    ItemTextTitle = Paper.text(Chart.TitleCenterX, Chart.TitleCenterY, Chart.Title);
                    ItemTextTitle.attr("font-size", "16");
                    ItemTextTitle.attr('text-anchor', 'start');
                    iSum += Chart.ChartItems[i].Proportion;

                }
            }
        }
    };
}]);