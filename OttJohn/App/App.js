var App = angular.module('App', ['App.Home', 'App.Articles', 'App.MemberManagement', 'App.Examples', 'App.FlashCards', 'App.About', 'App.Validation', 'App.AppState', 'ui.router']);
App.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/App/Home');

    $stateProvider

    .state('Home', {
        url: '/App/Home',
        templateUrl: 'App/Home/Home.html'
    })

});