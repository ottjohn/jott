angular.module('App').directive('comments', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        scope: {

            comment: '=',
            callback: '&'

        },

        controller: ['$scope', function ($scope) {


        }],

        templateUrl: 'App/Directives/Comments/Comments.html',
        link: function (scope, element, attrs) {

            var Contract;
            ////////////////////////////////////////////////////////////////////////////////////////////////
            //  Scope watch
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // decide the watched value followed by what to do when the value changes
            ////////////////////////////////////////////////////////////////////////////////////////////////
            scope.$watch('comment', function () {

                if (scope.comment && scope.comment != null && scope.comment != "") {

                    CheckContract(scope.comment);

                } else {

                    $("#UserComment").text("");

                }

            }, true);

            function CheckContract(comment) {

                if (comment.length > 0) {

                    AddComment(comment);

                }
            }

            function AddComment(comment) {

                //alert(comment);

            }

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // Event Handlers
            ////////////////////////////////////////////////////////////////////////////////////////////////
            $("#btnAddComment").off("click").on("click", function () {

                scope.comment = $("#UserComment").text();
                scope.$apply();
                $timeout(CallAddComment, 1);

                function CallAddComment() {

                    scope.callback();

                }
                //scope.$apply();

            });

            $("#btnCancelComment").off("click").on("click", function () {

                scope.comment = "";
                $("#UserComment").text("");
                scope.$apply();
                scope.callback();

            });
        }
    };
}]);