var trackApp = angular.module('trackApp', ['ngRoute', 'ngMap', 'trackControllers']);

trackApp.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'templates/login.html',
            controller  : 'loginController'
        })

        .when('/register', {
            templateUrl : 'templates/register.html',
            controller  : 'registerController'
        })

        .when('/dashboard', {
            templateUrl : 'templates/dashboard.html',
            controller  : 'dashboardController'
        })

        .when('/search', {
            templateUrl : 'templates/search.html',
            controller  : 'searchController'
        })

        .otherwise({redirectTo: '/'});
});
