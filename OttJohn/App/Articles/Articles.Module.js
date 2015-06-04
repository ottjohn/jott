angular.module('App.Articles', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

      //routeCollection.json
      //routerProvider.setCollectionUrl('http://localhost:54195/App/Home/routeCollection.html');
      $urlRouterProvider.otherwise('/Articles');

      $stateProvider
      .state('Articles', {
          url: '/App/Articles',
          templateUrl: 'App/Articles/Articles.html'
      })

      .state('Articles.PieChart1', {
          url: '/PieChart1',
          templateUrl: 'App/Articles/Articles/PieChart/PieChart1.html'
      })

        .state('Articles.PieChart2', {
            url: '/PieChart2',
            templateUrl: 'App/Articles/Articles/PieChart/PieChart2.html'
        })

        .state('Articles.PieChart3', {
            url: '/PieChart3',
            templateUrl: 'App/Articles/Articles/PieChart/PieChart3.html'
        })

        .state('Articles.PieChart4', {
            url: '/PieChart4',
            templateUrl: 'App/Articles/Articles/PieChart/PieChart4.html'
        })

        .state('Articles.PieChart5', {
            url: '/PieChart5',
            templateUrl: 'App/Articles/Articles/PieChart/PieChart5.html'
        })

        .state('Articles.FormsAuth1', {
            url: '/FormsAuth1',
            templateUrl: 'App/Articles/Articles/FormsAuth/FormsAuth1.html'
        })

        .state('Articles.FormsAuth2', {
            url: '/FormsAuth2',
            templateUrl: 'App/Articles/Articles/FormsAuth/FormsAuth2.html'
        })

        .state('Articles.FormsAuth3', {
            url: '/FormsAuth3',
            templateUrl: 'App/Articles/Articles/FormsAuth/FormsAuth3.html'
        })

        .state('Articles.FormsAuth4', {
            url: '/FormsAuth4',
            templateUrl: 'App/Articles/Articles/FormsAuth/FormsAuth4.html'
        })

        .state('Articles.FormsAuth5', {
            url: '/FormsAuth5',
            templateUrl: 'App/Articles/Articles/FormsAuth/FormsAuth5.html'
        })

      .state('Articles.SQLWCF1', {
          url: '/SQLWCF1',
          templateUrl: 'App/Articles/Articles/SQLWCF/SQLWCF1.html'
      })

        .state('Articles.SQLWCF2', {
            url: '/SQLWCF2',
            templateUrl: 'App/Articles/Articles/SQLWCF/SQLWCF2.html'
        })

        .state('Articles.SQLWCF3', {
            url: '/SQLWCF3',
            templateUrl: 'App/Articles/Articles/SQLWCF/SQLWCF3.html'
        })

        .state('Articles.SQLWCF4', {
            url: '/SQLWCF4',
            templateUrl: 'App/Articles/Articles/SQLWCF/SQLWCF4.html'
        })

      .state('Articles.WinService1', {
          url: '/WinService1',
          templateUrl: 'App/Articles/Articles/WinService/WinService1.html'
      })

        .state('Articles.WinService2', {
            url: '/WinService2',
            templateUrl: 'App/Articles/Articles/WinService/WinService2.html'
        })

        .state('Articles.WinService3', {
            url: '/WinService3',
            templateUrl: 'App/Articles/Articles/WinService/WinService3.html'
        })

        .state('Articles.WinService4', {
            url: '/WinService4',
            templateUrl: 'App/Articles/Articles/WinService/WinService4.html'
        })

        .state('Articles.WinService5', {
            url: '/WinService5',
            templateUrl: 'App/Articles/Articles/WinService/WinService5.html'
        })

      .state('Articles.Impersonate1', {
          url: '/Impersonate1',
          templateUrl: 'App/Articles/Articles/Impersonate/Impersonate1.html'
      })

        .state('Articles.Impersonate2', {
            url: '/Impersonate2',
            templateUrl: 'App/Articles/Articles/Impersonate/Impersonate2.html'
        })

        .state('Articles.Impersonate3', {
            url: '/Impersonate3',
            templateUrl: 'App/Articles/Articles/Impersonate/Impersonate3.html'
        })

        .state('Articles.BulkInsert1', {
            url: '/BulkInsert1',
            templateUrl: 'App/Articles/Articles/BulkInsert/BulkInsert1.html'
        })

        .state('Articles.BulkInsert2', {
            url: '/BulkInsert2',
            templateUrl: 'App/Articles/Articles/BulkInsert/BulkInsert2.html'
        })

        .state('Articles.BulkInsert3', {
            url: '/BulkInsert3',
            templateUrl: 'App/Articles/Articles/BulkInsert/BulkInsert3.html'
        })

        .state('Articles.BulkInsert4', {
            url: '/BulkInsert4',
            templateUrl: 'App/Articles/Articles/BulkInsert/BulkInsert4.html'
        })

        .state('Articles.BulkInsert5', {
            url: '/BulkInsert5',
            templateUrl: 'App/Articles/Articles/BulkInsert/BulkInsert5.html'
        })

        .state('Articles.LineChart1', {
            url: '/LineChart1',
            templateUrl: 'App/Articles/Articles/LineChart/LineChart1.html'
        })

        .state('Articles.LineChart2', {
            url: '/LineChart2',
            templateUrl: 'App/Articles/Articles/LineChart/LineChart2.html'
        })

        .state('Articles.LineChart3', {
            url: '/LineChart3',
            templateUrl: 'App/Articles/Articles/LineChart/LineChart3.html'
        })

        .state('Articles.LineChart4', {
            url: '/LineChart4',
            templateUrl: 'App/Articles/Articles/LineChart/LineChart4.html'
        })

        .state('Articles.LineChart5', {
            url: '/LineChart5',
            templateUrl: 'App/Articles/Articles/LineChart/LineChart5.html'
        })

        .state('Articles.ReckoningChapter1', {
            url: '/ReckoningChapter1',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter1.htm'
        })

        .state('Articles.ReckoningChapter2', {
            url: '/ReckoningChapter2',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter2.htm'
        })

        .state('Articles.ReckoningChapter3', {
            url: '/ReckoningChapter3',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter3.htm'
        })

        .state('Articles.ReckoningChapter4', {
            url: '/ReckoningChapter4',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter4.htm'
        })

        .state('Articles.ReckoningChapter5', {
            url: '/ReckoningChapter5',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter5.htm'
        })

        .state('Articles.ReckoningChapter6', {
            url: '/ReckoningChapter6',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter6.htm'
        })

        .state('Articles.ReckoningChapter7', {
            url: '/ReckoningChapter7',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter7.htm'
        })

        .state('Articles.ReckoningChapter8', {
            url: '/ReckoningChapter8',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter8.htm'
        })

        .state('Articles.ReckoningChapter9', {
            url: '/ReckoningChapter9',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter9.htm'
        })

        .state('Articles.ReckoningChapter10', {
            url: '/ReckoningChapter10',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter10.htm'
        })

        .state('Articles.ReckoningChapter11', {
            url: '/ReckoningChapter11',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter11.htm'
        })

        .state('Articles.ReckoningChapter12', {
            url: '/ReckoningChapter12',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter12.htm'
        })

        .state('Articles.ReckoningChapter13', {
            url: '/ReckoningChapter13',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter13.htm'
        })

        .state('Articles.ReckoningChapter14', {
            url: '/ReckoningChapter14',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter14.htm'
        })

        .state('Articles.ReckoningChapter15', {
            url: '/ReckoningChapter15',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter15.htm'
        })

        .state('Articles.ReckoningChapter16', {
            url: '/ReckoningChapter16',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter16.htm'
        })

        .state('Articles.ReckoningChapter17', {
            url: '/ReckoningChapter17',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter17.htm'
        })

        .state('Articles.ReckoningChapter18', {
            url: '/ReckoningChapter18',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter18.htm'
        })

        .state('Articles.ReckoningChapter19', {
            url: '/ReckoningChapter19',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter19.htm'
        })

        .state('Articles.ReckoningChapter20', {
            url: '/ReckoningChapter20',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter20.htm'
        })

        .state('Articles.ReckoningChapter21', {
            url: '/ReckoningChapter21',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter21.htm'
        })

        .state('Articles.ReckoningChapter22', {
            url: '/ReckoningChapter22',
            templateUrl: 'App/Articles/Articles/ReckoningChapter/ReckoningChapter22.htm'
        })

        .state('Articles.SSRSWithParams1', {
            url: '/SSRSWithParams1',
            templateUrl: 'App/Articles/Articles/SSRSWithParams/SSRSWithParams1.html'
        })

        .state('Articles.SSRSWithParams2', {
            url: '/SSRSWithParams2',
            templateUrl: 'App/Articles/Articles/SSRSWithParams/SSRSWithParams2.html'
        })

        .state('Articles.SSRSWithParams3', {
            url: '/SSRSWithParams3',
            templateUrl: 'App/Articles/Articles/SSRSWithParams/SSRSWithParams3.html'
        })

        .state('Articles.SSRSWithParams4', {
            url: '/SSRSWithParams4',
            templateUrl: 'App/Articles/Articles/SSRSWithParams/SSRSWithParams4.html'
        })

        .state('Articles.SSRSWithParams5', {
            url: '/SSRSWithParams5',
            templateUrl: 'App/Articles/Articles/SSRSWithParams/SSRSWithParams5.html'
        })

        .state('Articles.SSRSSecurity1', {
            url: '/SSRSSecurity1',
            templateUrl: 'App/Articles/Articles/SSRSSecurity/SSRSSecurity1.html'
        })

        .state('Articles.SSRSSecurity2', {
            url: '/SSRSSecurity2',
            templateUrl: 'App/Articles/Articles/SSRSSecurity/SSRSSecurity2.html'
        })

        .state('Articles.SSRSSecurity3', {
            url: '/SSRSSecurity3',
            templateUrl: 'App/Articles/Articles/SSRSSecurity/SSRSSecurity3.html'
        })

        .state('Articles.SSRSSecurity4', {
            url: '/SSRSSecurity4',
            templateUrl: 'App/Articles/Articles/SSRSSecurity/SSRSSecurity4.html'
        })

        .state('Articles.SSRSSecurity5', {
            url: '/SSRSSecurity5',
            templateUrl: 'App/Articles/Articles/SSRSSecurity/SSRSSecurity5.html'
        })

        .state('Articles.Paging1', {
            url: '/Paging1',
            templateUrl: 'App/Articles/Articles/Paging/Paging1.html'
        })

        .state('Articles.Paging2', {
            url: '/Paging2',
            templateUrl: 'App/Articles/Articles/Paging/Paging2.html'
        })

        .state('Articles.Paging3', {
            url: '/Paging3',
            templateUrl: 'App/Articles/Articles/Paging/Paging3.html'
        })

        .state('Articles.Paging4', {
            url: '/Paging4',
            templateUrl: 'App/Articles/Articles/Paging/Paging4.html'
        })

        .state('Articles.Paging5', {
            url: '/Paging5',
            templateUrl: 'App/Articles/Articles/Paging/Paging5.html'
        })

        .state('Articles.Transactions1', {
            url: '/Transactions1',
            templateUrl: 'App/Articles/Articles/Transactions/Transactions1.html'
        })

        .state('Articles.Transactions2', {
            url: '/Transactions2',
            templateUrl: 'App/Articles/Articles/Transactions/Transactions2.html'
        })

        .state('Articles.Transactions3', {
            url: '/Transactions3',
            templateUrl: 'App/Articles/Articles/Transactions/Transactions3.html'
        })

  });