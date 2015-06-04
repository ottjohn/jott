angular.module('App').directive('ottgrid', ['Validation', function (Validation) {
    return {
        restrict: 'EA',
        scope: {

            gridattribute: '='

        },

        controller: ['$scope', function ($scope) {


        }],

        templateUrl: 'App/Directives/grid/grid.html',
        link: function (scope, element, attrs) {

            var GridHtml;
            var GridCollection;


            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Scope watch/Events 
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.$watch('gridattribute', function () {
                if (scope.treeattribute && scope.treeattribute != null && scope.treeattribute != "") {

                    CheckContract(scope.treeattribute);

                } else if (scope.treeattribute == "") {

                    $("#Maingroups").html("");

                }
            });

            $(document).off("click").on("click", "#Maingroups LI", function () {

                ExpandCollapse($(this));

            });

            $(document).on("click", "#Maingroups div INPUT", function (event) {

                UpdateProfileTemplate(this);
                event.stopPropagation();

            });
        }
    };
}]);