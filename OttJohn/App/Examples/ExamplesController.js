(function () {
    angular.module('App.Examples').controller('ExamplesController',
    ['$q', '$timeout', '$location', 'ExamplesService', 'ExamplesContracts', '$rootScope', 'AppState', ExamplesController]);

    function ExamplesController($q, $timeout, $location, ExamplesService, ExamplesContracts, $rootScope, AppState) {

        var Examples = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        Examples.SelectedLHSItem;                         //  Cache for user selected menu item

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        Examples.SelectLHSItem = function (event) {

            if (Examples.SelectedLHSItem) Examples.ManageLHSITems()[Examples.SelectedLHSItem].removeClass("SelectSubTitleBack SelectTitleMenuFore").addClass("SubTitleBack TitleMenuFore");

            Examples.SelectedLHSItem = event.target.id.replace("Examples", "");
            Examples.ManageLHSITems()[Examples.SelectedLHSItem].removeClass("SubTitleBack TitleMenuFore").addClass("SelectSubTitleBack SelectTitleMenuFore");

        }

        Examples.ManageLHSITems = function () {

            var LHSItems = {

                DailySummary: $("#ExamplesDailySummary"),
                DropDeposit: $("#ExamplesDropDeposit"),
                StateLocalTax: $("#ExamplesStateLocalTax"),
                Membership: $("#ExamplesMembership")

            }

            return LHSItems;

        }

        Examples.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "Examples." + $location.$$path.replace("/App/Examples", "");
            //if (CallingRoute == "Examples.") CallingRoute = "Reporting.Reporting";
            var ProcessName = Examples.RegisterRoute(CallingRoute);

        });
    }
})();