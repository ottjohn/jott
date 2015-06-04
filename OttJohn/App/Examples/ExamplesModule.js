angular.module('App.Examples', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/Examples');

      $stateProvider

      .state('Examples', {
          url: '/App/Examples',
          templateUrl: 'App/Examples/Examples.html'
      })

    .state('Examples.DailySummary', {
        url: 'SummaryReport',
        templateUrl: 'App/Examples/DailySummary/DailySummary.html'
    })

    .state('Examples.DropDeposit', {
        url: 'DropDeposit',
        templateUrl: 'App/Examples/DropDeposit/DropDeposit.html'
    })

    .state('Examples.StateLocalTax', {
        url: 'StateLocalTax',
        templateUrl: 'App/Examples/StateLocalTax/StateLocalTax.html'
    })

    .state('Examples.Membership', {
        url: 'Membership',
        templateUrl: 'App/Examples/Membership/Membership.html'
    })

  });