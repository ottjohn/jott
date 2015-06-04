(function () {
    angular.module('App.Articles').controller('Paging5Controller',
    ['$q', '$timeout', '$location', 'ArticlesService', 'ArticlesContracts', 'Paging5Model', '$rootScope', 'AppState', Paging5Controller]);

    function Paging5Controller($q, $timeout, $location, ArticlesService, ArticlesContracts, Paging5Model, $rootScope, AppState) {

        var PagingExample = this;
        var scope = $rootScope.$new();

        //////////////////////////////////////////////////////////////////////////////////////
        //  Global variables
        //////////////////////////////////////////////////////////////////////////////////////
        PagingExample.DataGrid;                                        //  Data grid global variable
        //////////////////////////////////////////////////////////////////////////////////////
        //  Accessors
        //////////////////////////////////////////////////////////////////////////////////////
        PagingExample.ManageMemberGrid = function () {

            var ManageMemberGrid = {

                Grid: $("#SampleGridContainer")

            }

            return ManageMemberGrid;

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Pending User Functionality. 
        //
        //  GetPendingUsers                 Retrieves all non--approved users
        //                                  Initializes grid
        //  GetPendingUsersResult           Callback, sets evnironment for users view
        //////////////////////////////////////////////////////////////////////////////////////
        PagingExample.GetPendingUsers = function () {

            if (PagingExample.DataGrid == null) PagingExample.DataGrid = new GridConfigObject(PagingExample.GetMemberAttribs());

            var CurrentPage;
            if (PagingExample.DataGrid.LocalAttributes.Pager == null)
                CurrentPage = 1;
            else
                CurrentPage = PagingExample.DataGrid.LocalAttributes.Pager.GetCurrentPage();

            Paging5Model.GetSampleUsers(CurrentPage, PagingExample.DataGrid.GridAttributes.PageSize, PagingExample.DataGrid.GetSortField(), PagingExample.DataGrid.GetSortDirection()).then(GetPendingUsersResult).catch(GetPendingUsersResult);
            function GetPendingUsersResult(Message) { PagingExample.GetPendingUsersResult(Message) }

        }

        PagingExample.GetPendingUsersResult = function (Message) {

            if (Message != "") {

                PagingExample.Message = Message;

            } else {

                var MemberManager = Paging5Model.GetMemberManager();
                if (MemberManager.RecordCount > 0) {

                    PagingExample.DataGrid.BuildGrid(MemberManager.ExtendedMemberInfo);
                    PagingExample.DataGrid.LocalAttributes.Pager.SetTotalPages(MemberManager.RecordCount);
                    PagingExample.ManageMemberGrid().Grid.show();

                } else {

                    PagingExample.ManageMemberGrid().Grid.children().hide();

                }
            }
        }

        PagingExample.RegisterRoute = function (CallingRoute) {

            var AppName = CallingRoute.split(".");
            AppState.SetRoute(AppName[1], CallingRoute);
            return AppName[1];

        }

        //////////////////////////////////////////////////////////////////////////////////////
        //  Event Handlers --- Need to ensure that user name is begin shown!!!!
        //////////////////////////////////////////////////////////////////////////////////////
        scope.$watch('$viewContentLoaded', function (event, viewConfig) {

            var CallingRoute = "Articles." + $location.$$path.replace("/App/Articles", "");
            var ProcessName = PagingExample.RegisterRoute(CallingRoute);
            PagingExample.GetPendingUsers();

        });

        $(function () {
            $(document).on("OnSortFieldChange", function () {
                PagingExample.GetPendingUsers();
            });
        });

        $(function () {
            $(this).off("OnPageChanged").on("OnPageChanged", function (EventArgs) {
                PagingExample.GetPendingUsers(EventArgs.ReturnedContext);
            });
        });

        $(function () {
            $(this).off("OnGridItemSelected").on("OnGridItemSelected", function (EventArgs) {
                var EventProperty = EventArgs.ReturnedContext;
                PagingExample.GotoUpdateUser(EventArgs.ReturnedContext);
            });
        });

        PagingExample.GetMemberAttribs = function () {

            var GridAttributes = {

                GridParent: 'SampleGridContainer',
                GridListContainer: 'GridListProduct',
                GridListIdField: 'Id',
                GridWidth: 0,
                GridListHeight: 150,
                CellPadding: 30,
                CellHeight: 5,
                UseDefaultStyle: false,
                AutoComputeCellWidths: true,
                AutoComputeCellAlignment: true,
                ContentOverflow: false,
                ShowPager: true,
                PageSize: 5,
                PagerAlign: 'right',
                PagerStyle: 'flat',
                PagerButtonMargin: 0,
                PagerShowEndButtons: true,
                PagerShowGotoField: true,
                GridInitialSortField: 'LastName',
                CellBordersOn: true,
                GridFont: 'verdana',
                GridFontSize: 8,
                GridBackColor: '#dcdabc',
                HeaderBackColor: '#dcdabc',
                HeaderFontColor: 'gray',
                HeaderBorderColor: '#dddddd',
                GridListBackColor: 'silver',
                CellBackColor: '#fefefe',
                CellFontColor: 'gray',
                AltCellBackColor: '#eeeeee',
                AltCellFontColor: 'gray',
                CellBorderColor: '#dedede',
                ButtonBackground: null,
                ButtonForeground: null,
                CellAlign: new Array(),
                CellWidth: new Array(),
                HeaderAliasList: new Array("Id", "User Name", "First Name", "Last Name", "Email"),
                GridColumnArrange: new Array("Id", "UserName", "FirstName", "LastName", "Email"),
                GridColumnExcludeList: new Array("Id")

            }

            return GridAttributes;

        }
    }
})();