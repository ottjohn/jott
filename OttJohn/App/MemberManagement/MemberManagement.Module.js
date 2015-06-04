angular.module('App.MemberManagement', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/MemberManagement');

    $stateProvider
    
    .state('MemberManagement', {
        url: '/App/MemberManagement',
        templateUrl: 'App/MemberManagement/ManageUsersNew.html'
    })

    .state('MemberManagement.GetPassword', {
        url: 'GetPassword',
        templateUrl: 'App/MemberManagement/PasswordManagement/PasswordManagement.html'
    })

    .state('MemberManagement.ChangeEmail', {
        url: 'ChangeEmail',
        templateUrl: 'App/MemberManagement/PasswordManagement/PasswordManagement.html'
    })

    .state('MemberManagement.ChangePassword', {
        url: 'ChangePassword',
        templateUrl: 'App/MemberManagement/PasswordManagement/PasswordManagement.html'
    })

    .state('MemberManagement.FindUser', {
        url: 'FindUser',
        templateUrl: 'App/MemberManagement/MemberEdit/MemberEdit.html'
    })

    .state('MemberManagement.ManageMembers', {
        url: 'ManageMembers',
        templateUrl: 'App/MemberManagement/MemberEdit/MemberEdit.html'
    })

    .state('MemberManagement.FeatureManagement', {
        url: 'FeatureManagement',
        templateUrl: 'App/MemberManagement/FeatureManagement/FeatureManagement.html'
    })

    .state('MemberManagement.MembershipMergeCricket', {
        url: 'MembershipMergeCricket',
        templateUrl: 'App/MemberManagement/MemberEdit/MemberEdit.html'
    })

    .state('MemberManagement.MembershipMergePayday', {
        url: 'MembershipMergePayday',
        templateUrl: 'App/MemberManagement/MemberEdit/MemberEdit.html'
    })

    .state('Register', {
        url: '/App/Registration',
        templateUrl: 'App/MemberManagement/Registration/Registration.html'
    })

    .state('Login', {
        url: '/App/Login',
        templateUrl: 'App/MemberManagement/UserLogging/UserLogging.html'
    })

    .state('Logout', {
        url: '/App/Logout',
        templateUrl: 'App/MemberManagement/UserLogging/UserLogging.html'
    })
  });

