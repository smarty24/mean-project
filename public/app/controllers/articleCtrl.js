// start our angular module and inject userService
angular.module('articleCtrl', ['userService'])

// article controller for the main page
// inject the User factory
.controller('articleController', function(Article) {

    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    // grab all the articles at page load
    Article.all()
    .success(function(data) {

        // when all the articles come back, remove the processing variable
        vm.processing = false;

        // bind the articles that come back to vm.articles
        vm.articles = data;
    });

    // function to delete a article
    vm.deleteArticle = function(id) {
        vm.processing = true;
        
        // accepts the article id as a parameter
        Article.delete(id)
        .success(function(data) {
        
            // get all articles to update the table
            // you can also set up your api to return the list of articles with the delete call
            
            Article.all()
            .success(function(data) {
                vm.processing = false;
                vm.articles = data;
            });
        
        });
     };


 })

// controller applied to article creation page
.controller('articleCreateController', function(Article) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'create';

    // function to create a article
    vm.saveArticle = function() {
        vm.processing = true;

        // clear the message
        vm.message = '';

        // use the create function in the articleService
        Article.create(vm.articleData)
        .success(function(data) {
            vm.processing = false;

            // clear the form
            vm.articleData = {};
            vm.message = data.message;
        });
    }
})


// controller applied to user edit page
.controller('articleViewController', function($routeParams, Article) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'view';

    // get the article data for the article you want to edit
    // $routeParams is the way we grab data from the URL
    Article.get($routeParams.article_id)
        .success(function(data) {
            vm.articleData = data;
            console.log(vm.articleData);
        });


})

// controller applied to user edit page
.controller('articleEditController', function($routeParams, Article) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'edit';

    // get the article data for the article you want to edit
    // $routeParams is the way we grab data from the URL
    Article.get($routeParams.article_id)
        .success(function(data) {
            vm.articleData = data;
        });

    // function to save the article
    vm.saveArticle = function() {
        vm.processing = true;
        vm.message = '';

        // call the articleService function to update
        Article.update($routeParams.article_id, vm.articleData)
        .success(function(data) {
            vm.processing = false;

            // clear the form
            vm.articleData = {};

            // bind the message from our API to vm.message
            vm.message = data.message;
        });
    };

});