angular.module('articleService', [])
.factory('Article', function($http) {
    // create a new object
    var articleFactory = {};
    // get a single article
    articleFactory.get = function(id) {
        return $http.get('/api/articles/' + id);
    };
    // get all articles
    articleFactory.all = function() {
        return $http.get('/api/articles/');
    };
    // create a article
    articleFactory.create = function(articleData) {
        return $http.post('/api/articles/', articleData);
    };
    // update a article
    articleFactory.update = function(id, articleData) {
        return $http.put('/api/articles/' + id, articleData);
    };
    // delete a article
    articleFactory.delete = function(id) {
        return $http.delete('/api/articles/' + id);
    };
    // return our entire articleFactory object
    return articleFactory;
});