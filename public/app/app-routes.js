
angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider

    // home page route
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    // login page
    .when('/login', {
        templateUrl : 'app/views/pages/login.html',
        controller : 'mainController',
        controllerAs: 'login'
     })

    // show all users
    .when('/users', {
        templateUrl: 'app/views/pages/users/all.html',
        controller: 'userController',
        controllerAs: 'user'
    })

    // form to create a new user
    // same view as edit page
    .when('/users/create', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userCreateController',
        controllerAs: 'user'
    })

    // page to edit a user
    .when('/users/:user_id', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userEditController',
        controllerAs: 'user'
    })

    // page to an article
    .when('/articles/view/:article_id', {
        templateUrl: 'app/views/pages/articles/single.html',
        controller: 'articleViewController',
        controllerAs: 'article'
    })
    
    // page to all articles
    .when('/articles', {
        templateUrl: 'app/views/pages/articles/all.html',
        controller: 'articleController',
        controllerAs: 'article'
    })

    // form to create a new article
    // same view as edit page
    .when('/articles/create', {
        templateUrl: 'app/views/pages/articles/single.html',
        controller: 'articleCreateController',
        controllerAs: 'article'
    })

    // page to edit a user
    .when('/articles/:article_id', {
        templateUrl: 'app/views/pages/articles/single.html',
        controller: 'articleEditController',
        controllerAs: 'article'
    })

    // get rid of the hash in the URL
    $locationProvider.html5Mode(true);
});