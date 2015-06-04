angular.module('App.About', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/About');

    $stateProvider

    .state('About', {
        url: '/App/About',
        templateUrl: 'App/About/About.html'
    })

    .state('About.Developer', {
        url: '/App/About/Developer',
        templateUrl: 'App/About/Developer/Developer.html'
    })

    .state('About.Educator', {
        url: '/App/About/Educator',
        templateUrl: 'App/About/Educator/Educator.html'
    })

    .state('About.Writer', {
        url: '/App/About/Writer',
        templateUrl: 'App/About/Writer/Writer.html'
    })

    .state('About.Resume', {
        url: '/App/About/Resume',
        templateUrl: 'App/About/Resume/Resume.html'
    })

  });

