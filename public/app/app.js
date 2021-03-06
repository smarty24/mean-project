angular.module('userApp', [
    'ngAnimate',
    'appRoutes',
    'authService',
    'mainCtrl',
    'userCtrl',
    'userService',
    'articleService',
    'articleCtrl'
])

// application configuration to integrate token into requests
.config(function($httpProvider) {

    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');

});



