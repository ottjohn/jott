(function () {

    var directive = function (AppState) {
        return {
            restrict: 'A',
            scope: {

                modalattribute: '=',
                onmodalresultready: '&'

            },

            controller: ['$scope', function ($scope) {


            }],

            link: function (scope, element, attrs) {

                this.DetermineShowTopLevelMenu = function (FeatureAccess, ParentId) {

                    var RetVal = false;
                    var iLen = FeatureAccess.length;
                    for (var i = 0; i < iLen; i++) {

                        if (FeatureAccess[i].FeatureTreeAccess && FeatureAccess[i].FeatureTreeParentId == ParentId)
                            RetVal = true;

                    }

                    return RetVal;

                }

                this.CheckFeatureAccess = function (element, FeatureAccessTree, FeatureAccessTreePipe) {

                    var LeastPriv = element.attr("tag");

                    if (LeastPriv) {

                        if (!isNaN(LeastPriv)) {

                            if (DetermineShowTopLevelMenu(FeatureAccessTree, LeastPriv))
                                element.show();
                            else
                                element.hide();

                        } else if (FeatureAccessTreePipe.indexOf("|" + LeastPriv + "|") > -1) {

                            element.show();

                        }
                    }
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////
                //  Scope watch
                ////////////////////////////////////////////////////////////////////////////////////////////////
                // decide the watched value followed by what to do when the value changes
                // Need another directive for just LoggedIn to take care of the MemberContainer stuff
                ////////////////////////////////////////////////////////////////////////////////////////////////
                scope.$watch(function () {
                    return AppState.UserCreds.FeatureAccessList;
                }, function () {

                    if (AppState.UserCreds.FeatureAccessList != null && AppState.UserCreds.FeatureAccessList) {

                        CheckFeatureAccess(element, AppState.UserCreds.FeatureAccessList, AppState.UserCreds.FeatureAccessPipe);

                    }
                });
            }
        };
    };

    angular.module('App')
        .directive('auth', directive);

}());