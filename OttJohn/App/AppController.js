(function () {

    angular.module('App').controller('GeneralController',
    ['$q', '$timeout', 'AppState', GeneralController]);

    function GeneralController($q, $timeout, AppState) {

        var GenController = this;
        GenController.UserName = AppState.UserName;
        GenController.Roles = AppState.UserRoles;

    }

})();
