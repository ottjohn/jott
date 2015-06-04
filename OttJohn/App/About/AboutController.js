(function () {
    angular.module('App.About').controller('AboutController',
    ['$q', '$timeout', '$location', 'AboutService', 'AboutContracts', '$rootScope', 'AppState', AboutController]);

    function AboutController($q, $timeout, $location, AboutService, AboutContracts, $rootScope, AppState) {

        var About = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        About.SelectedLHSItem;                         //  Cache for user selected menu item

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        About.SelectLHSItem = function (event) {

            if (About.SelectedLHSItem) About.AboutLHSItems()[About.SelectedLHSItem].removeClass("SelectSubTitleBack SelectTitleMenuFore").addClass("SubTitleBack TitleMenuFore");

            About.SelectedLHSItem = event.target.id.replace("About", "");
            About.AboutLHSItems()[About.SelectedLHSItem].removeClass("SubTitleBack TitleMenuFore").addClass("SelectSubTitleBack SelectTitleMenuFore");

        }

        About.AboutLHSItems = function () {

            var LHSItems = {

                Developer: $("#AboutDeveloper"),
                Educator: $("#AboutEducator"),
                Writer: $("#AboutWriter"),
                Resume: $("#AboutResume")

            }

            return LHSItems;

        }

        About.AboutButtons = function () {

            var AboutButtons = {

                Exit: $("#btnAboutExit"),

            }

            return AboutButtons;

        }

        About.ReturnToMainScreen = function () {

            $location.url(AppState.GetPreviousRoute());

        }

        About.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "About." + $location.$$path.replace("/App/About", "");
            if (CallingRoute == "About.") CallingRoute = "About";
            var ProcessName = About.RegisterRoute(CallingRoute);
            if (CallingRoute == "About") {

                $("#AboutDeveloper").click();
                $("#AboutDeveloper").addClass("SelectSubTitleBack SelectTitleMenuFore");
                About.SelectedLHSItem = "Developer"

            }
        });
    }
})();