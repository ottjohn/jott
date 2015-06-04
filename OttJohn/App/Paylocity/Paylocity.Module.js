angular.module('App.Paylocity', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/Paylocity');

      $stateProvider

      .state('Paylocity', {
          url: '/App/Paylocity',
          templateUrl: 'App/Paylocity/Paylocity.html'
      })

  });
