angular.module('App.FlashCards', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/FlashCards');

      $stateProvider

      .state('FlashCards', {
          url: '/App/FlashCards',
          templateUrl: 'App/FlashCards/FlashCards.html'
      })

      .state('FlashCards.FlashCardsEntry', {
          url: 'FlashCardsEntry',
          templateUrl: 'App/FlashCards/FlashCardEntry/FlashCardEntry.html'
      })

      .state('FlashCards.FlashCardsView', {
          url: 'FlashCardsView',
          templateUrl: 'App/FlashCards/FlashCardView/FlashCardView.html'
      })

  });