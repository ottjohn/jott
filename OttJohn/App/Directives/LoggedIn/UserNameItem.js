(function () {

    var directive = function (AppState) {
        return {
            restrict: 'A',
            scope: {


            },

            controller: ['$scope', function ($scope) {


            }],

            link: function (scope, element, attrs) {

                ////////////////////////////////////////////////////////////////////////////////////////////////
                //  Scope watch
                ////////////////////////////////////////////////////////////////////////////////////////////////
                // decide the watched value followed by what to do when the value changes
                // Need another directive for just LoggedIn to take care of the MemberContainer stuff
                ////////////////////////////////////////////////////////////////////////////////////////////////
                scope.$watch(function () {
                    return AppState.UserCreds.UserId;
                }, function () {

                    if (AppState.UserCreds != null && AppState.UserCreds.UserId != "") {

                        element.show();
                        element.text("Welcome, " + AppState.UserCreds.UserName);

                    }
                });
            }
        };
    };

    angular.module('App')
        .directive('usernameitem', directive);

}());