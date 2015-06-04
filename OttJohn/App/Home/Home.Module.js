angular.module('App.Home', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

      //routeCollection.json
      //routerProvider.setCollectionUrl('http://localhost:54195/App/Home/routeCollection.html');

      $stateProvider
      .state('Home.PieChart1', {
          url: '/PieChart1',
          templateUrl: 'App/Home/Articles/PieChart/PieChart1.html'
      })

        .state('Home.PieChart2', {
            url: '/PieChart2',
            templateUrl: 'App/Home/Articles/PieChart/PieChart2.html'
        })

        .state('Home.PieChart3', {
            url: '/PieChart3',
            templateUrl: 'App/Home/Articles/PieChart/PieChart3.html'
        })

        .state('Home.PieChart4', {
            url: '/PieChart4',
            templateUrl: 'App/Home/Articles/PieChart/PieChart4.html'
        })

        .state('Home.PieChart5', {
            url: '/PieChart5',
            templateUrl: 'App/Home/Articles/PieChart/PieChart5.html'
        })

        .state('Home.FormsAuth1', {
            url: '/FormsAuth1',
            templateUrl: 'App/Home/Articles/FormsAuth/FormsAuth1.html'
        })

        .state('Home.FormsAuth2', {
            url: '/FormsAuth2',
            templateUrl: 'App/Home/Articles/FormsAuth/FormsAuth2.html'
        })

        .state('Home.FormsAuth3', {
            url: '/FormsAuth3',
            templateUrl: 'App/Home/Articles/FormsAuth/FormsAuth3.html'
        })

        .state('Home.FormsAuth4', {
            url: '/FormsAuth4',
            templateUrl: 'App/Home/Articles/FormsAuth/FormsAuth4.html'
        })

        .state('Home.FormsAuth5', {
            url: '/FormsAuth5',
            templateUrl: 'App/Home/Articles/FormsAuth/FormsAuth5.html'
        })

      .state('Home.SQLWCF1', {
          url: '/SQLWCF1',
          templateUrl: 'App/Home/Articles/SQLWCF/SQLWCF1.html'
      })

        .state('Home.SQLWCF2', {
            url: '/SQLWCF2',
            templateUrl: 'App/Home/Articles/SQLWCF/SQLWCF2.html'
        })

        .state('Home.SQLWCF3', {
            url: '/SQLWCF3',
            templateUrl: 'App/Home/Articles/SQLWCF/SQLWCF3.html'
        })

        .state('Home.SQLWCF4', {
            url: '/SQLWCF4',
            templateUrl: 'App/Home/Articles/SQLWCF/SQLWCF4.html'
        })

      .state('Home.WinService1', {
          url: '/WinService1',
          templateUrl: 'App/Home/Articles/WinService/WinService1.html'
      })

        .state('Home.WinService2', {
            url: '/WinService2',
            templateUrl: 'App/Home/Articles/WinService/WinService2.html'
        })

        .state('Home.WinService3', {
            url: '/WinService3',
            templateUrl: 'App/Home/Articles/WinService/WinService3.html'
        })

        .state('Home.WinService4', {
            url: '/WinService4',
            templateUrl: 'App/Home/Articles/WinService/WinService4.html'
        })

        .state('Home.WinService5', {
            url: '/WinService5',
            templateUrl: 'App/Home/Articles/WinService/WinService5.html'
        })

      .state('Home.Impersonate1', {
          url: '/Impersonate1',
          templateUrl: 'App/Home/Articles/Impersonate/Impersonate1.html'
      })

        .state('Home.Impersonate2', {
            url: '/Impersonate2',
            templateUrl: 'App/Home/Articles/Impersonate/Impersonate2.html'
        })

        .state('Home.Impersonate3', {
            url: '/Impersonate3',
            templateUrl: 'App/Home/Articles/Impersonate/Impersonate3.html'
        })

      $urlRouterProvider.otherwise('/Home');



  });

//angular.module('Routing', ['ui.router'])
//    .provider('router', function ($stateProvider) {

//        var urlCollection;

//        this.$get = function ($http, $state) {
//            return {
//                setUpRoutes: function () {
//                    $http.get(urlCollection).success(function (collection) {
//                        for (var routeName in collection) {
//                            alert(routeName);
//                            if (!$state.get(routeName)) {
//                                $stateProvider.state(routeName, collection[routeName]);
//                            }
//                        }
//                    }).error(function () { alert("Error Retrieving document"); });
//                }
//            }
//        };

//        this.setCollectionUrl = function (url) {
//            urlCollection = url;
//        }
//    })

//    .run(function (router) {
//        router.setUpRoutes();
//    });
