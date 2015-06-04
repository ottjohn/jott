(function () {
    angular.module('App.FlashCards').controller('FlashCardsController',
    ['$q', '$timeout', '$location', 'ExamplesService', 'ExamplesContracts', '$rootScope', 'AppState', FlashCardsController]);

    function FlashCardsController($q, $timeout, $location, FlashCardsService, FlashCardsContracts, $rootScope, AppState) {

        var FlashCards = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCards.SelectedLHSItem;                         //  Cache for user selected menu item

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        FlashCards.SelectLHSItem = function (event) {

            if (FlashCards.SelectedLHSItem) FlashCards.ManageLHSITems()[FlashCards.SelectedLHSItem].removeClass("SelectSubTitleBack SelectTitleMenuFore").addClass("SubTitleBack TitleMenuFore");

            FlashCards.SelectedLHSItem = event.target.id.replace("FlashCards", "");
            FlashCards.ManageLHSITems()[FlashCards.SelectedLHSItem].removeClass("SubTitleBack TitleMenuFore").addClass("SelectSubTitleBack SelectTitleMenuFore");

        }

        FlashCards.ManageLHSITems = function () {

            var LHSItems = {

                FlashCardsEntry: $("#FlashCardsFlashCardsEntry"),
                FlashCardsView: $("#FlashCardsFlashCardsView")

            }

            return LHSItems;

        }

        FlashCards.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "FlashCards." + $location.$$path.replace("/App/FlashCards", "");
            //if (CallingRoute == "Examples.") CallingRoute = "Reporting.Reporting";
            var ProcessName = FlashCards.RegisterRoute(CallingRoute);

        });
    }
})();