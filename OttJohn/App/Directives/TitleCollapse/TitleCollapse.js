angular.module('App').directive('collapsedtitle', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        scope: {

            collapsetitlecontract: '=',
            idx: '=',
            callback: '&'

        },

        controller: ['$scope', function ($scope) {


        }],

        templateUrl: 'App/Directives/TitleCollapse/TitleCollapse.html',
        link: function (scope, element, attrs) {

            var Contract;
            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Scope watch
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // decide the watched value followed by what to do when the value changes
            // Need another directive for just LoggedIn to take care of the MemberContainer stuff
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.$watch('collapsetitlecontract', function () {
                if (scope.collapsetitlecontract && scope.collapsetitlecontract != null && scope.collapsetitlecontract != "") {

                    CheckContract(scope.collapsetitlecontract);

                }
            });

            function CheckContract(collapsetitlecontract) {

                var idx = GetIndex(collapsetitlecontract);
                Contract = collapsetitlecontract[idx];
                element.find(">:first-child").css({ "width": element.parent().width() });
                element.find(">:first-child table tr td div").text(Contract.Title);
                element.find(">:first-child table tr td span").off("click").on("click", function () {

                    ExpandCollapseChild(idx);
                    $timeout(OpenCloseSection, 1)

                });
            }

            function GetIndex(collapsetitlecontract) {

                var idx = 0;
                var iLen = collapsetitlecontract.length;
                for (var i = 0; i < iLen; i++) {

                    var AttrId = element.attr("id");
                    if (AttrId.indexOf(collapsetitlecontract[i].Title.replace(/ /g, "")) > -1) {

                        idx = collapsetitlecontract[i].Idx;
                        break;

                    }
                }

                return idx;

            }

            function OpenCloseSection() {

                scope.callback();

            }

            function ExpandCollapseChild(idx) {

                var CollapseFlag = element.find(">:first-child table tr td span");

                if (CollapseFlag.text().indexOf("-") > -1) {

                    CollapseFlag.text("[+]");
                    scope.collapsetitlecontract[idx].WindowState = "0";

                } else {

                    CollapseFlag.text("[-]");
                    scope.collapsetitlecontract[idx].WindowState = "1";

                }
            }
        }
    };
}]);