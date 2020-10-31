angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();

    });
    
    // navigate to login page
    vm.navigateToLogin = function() {
        $location.path('/login');
    };

    // get user info on every page load
    Auth.getUser()
        .then(function(data) {
            vm.user = data.data;
        });

    // function to handle login form
    vm.doLogin = function() {
        
        // add a processing icon when login is clicked
        vm.processing = true;

        // clear the error
        vm.error = '';

        // call the Auth.login() function
        Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data) {

            //  disable processing icon
            vm.processing = false;

            // get user information after logging in
            Auth.getUser()
            .then(function(data) {
                vm.user = data.data;
            });

            // if a user successfully logs in, redirect to users page
            if (data.success)
                $location.path('/users');
            else
                vm.error = data.message;  
                });
                 
        };


    // function to handle logging out
    vm.doLogout = function() {
        Auth.logout();
        $location.path('/');

    };

});