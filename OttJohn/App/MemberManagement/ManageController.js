(function () {
    angular.module('App.MemberManagement').controller('ManageController',
    ['$q', '$timeout', '$location', 'ManageService', 'ManageUserContracts', '$rootScope', 'AppState', ManageController]);

    function ManageController($q, $timeout, $location, ManageService, ManageUserContracts, $rootScope, AppState) {

        var Manage = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        Manage.SelectedLHSItem;                         //  Cache for user selected menu item

        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        Manage.SelectLHSItem = function (event) {

            if (Manage.SelectedLHSItem) Manage.ManageLHSITems()[Manage.SelectedLHSItem].removeClass("SelectSubTitleBack SelectTitleMenuFore").addClass("SubTitleBack TitleMenuFore");

            Manage.SelectedLHSItem = event.target.id.replace("Membership", "");
            Manage.ManageLHSITems()[Manage.SelectedLHSItem].removeClass("SubTitleBack TitleMenuFore").addClass("SelectSubTitleBack SelectTitleMenuFore");

        }

        Manage.ManageLHSITems = function () {

            var LHSItems = {

                ManageMembers: $("#MembershipManageMembers"),
                ChangeEmail: $("#MembershipChangeEmail"),
                FindUser: $("#MembershipFindUser"),
                GetPassword: $("#MembershipGetPassword"),
                ChangePassword: $("#MembershipChangePassword"),
                MembershipMerge: $("#MembershipMerge"),
                FeatureManagement: $("#MembershipFeatureManagement")

            }

            return LHSItems;

        }

        Manage.UserManageButtons = function () {

            var UserManageButtons = {

                Exit: $("#btnManageExit"),
                
            }

            return UserManageButtons;

        }

        Manage.ReturnToMainScreen = function () {

            $location.url(AppState.GetPreviousRoute());

        }

        Manage.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "MemberManagement." + $location.$$path.replace("/App/MemberManagement", "");
            if (CallingRoute == "MemberManagement.") CallingRoute = "MemberManagement.Membership";
            var ProcessName = Manage.RegisterRoute(CallingRoute);

        });
    }
})();