var User            = require('../models/user');
var Article            = require('../models/Article');
var jwt             = require('jsonwebtoken');
var config          = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

    // get an instance of the express router
    var apiRouter = express.Router();

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function(req, res) {

        // find the user
        // select the name username and password explicitly
        User.findOne({
            username: req.body.username
        }).select('_id name username password').exec(function(err, user) {

            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {

                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
        
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        _id: user._id,
                        name: user.name,
                        username: user.username
                    }, superSecret, {
                        expiresIn: '1440m' // expires in 24 hours
                });
        
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                    });
                }
            }

        });
    });

    // middleware to use for all requests
    apiRouter.use(function(req, res, next) {
        // do logging
        console.log('Somebody just came to our app!');


        // ---------------------------we'll add more to the middleware in Chapter 10-----------------------


        // -----------------------------this is where we will authenticate users---------------------------
        
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, superSecret, function(err, decoded) {
                if (err) {
                    return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;

                next();

                }
            });

        } else {
            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).send({ success: false, message: 'No token provided.' });
        
        }

        // next(); // make sure we go to the next routes and don't stop here
    });

    // test route to make sure everything is working
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // more routes for our API will happen here

    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')
        // create a user (accessed at POST http://localhost:8080/api/users)
        .post(function(req, res) {  

        // create a new instance of the User model
        var user = new User();  

            // set the users information (comes from the request)
            user.name = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;  

            // save the user and check for errors
            user.save(function(err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists. '});
                else
                    return res.send(err);
            }   
                res.json({ message: 'User created!' });
            }); 
        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {
            User.find(function(err, users) {
            if (err) res.send(err);
            
                // return the users
                res.json(users);
            });
        });


    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

        // get the user with that id
        // (accessed at GET http://localhost:8080/api/users/:user_id)
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        // update the user with this id
        // (accessed at PUT http://localhost:8080/api/users/:user_id)
        .put(function(req, res) {

            // use our user model to find the user we want
            User.findById(req.params.user_id, function(err, user) {
            
                if (err) res.send(err);
                
                // update the users info only if its new
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;
                
                // save the user
                user.save(function(err) {
                    if (err) res.send(err);
                    
                    // return a message
                    res.json({ message: 'User updated!' });
                });
            
            });
        })

        // delete the user with this id
        // (accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete(function(req, res) {
            User.deleteOne({
                    _id: req.params.user_id
            }, function(err, user) {
                    if (err) res.send(err);
                    
                    res.json({ message: 'Successfully deleted' });
                });
        });

        // route for articles
        // (accessed at http://localhost:8080/api/articles/)
        apiRouter.route('/articles')
            .post(function(req, res) {

                // create new instance of article model
                var article = new Article();

                // set the article that should be posted
                article.title = req.body.title;
                article.article_body = req.body.article_body;
                article.owner_id = req.body.owner_id;

                // save the user and check for errors
                article.save(function(err){
                    if (err) {
                        // duplicate entry
                        if (err.code == 11000)
                            return res.json({ success: false, message: 'Article already exists. '});
                        else
                            return res.send(err);
                    }   
                        res.json({ message: 'Article created!' });
                
                });
            })

            // get all the articles (accessed at GET http://localhost:8080/api/articles)
            .get(function(req, res) {
                Article.find(function(err, articles) {
                if (err) res.send(err);
                
                    // return the articles
                    res.json(articles);
                });
            });

             // on routes that end in /articles/:article_id
            // ----------------------------------------------------
            apiRouter.route('/articles/:article_id')

            // get the article with that id
            // (accessed at GET http://localhost:8080/api/articles/:article_id)
            .get(function(req, res) {
                Article.findById(req.params.article_id, function(err, article) {
                if (err) res.send(err);

                    // return that article
                    res.json(article);
                });
            })

        // update the article with this id
        // (accessed at PUT http://localhost:8080/api/articles/:article_id)
        .put(function(req, res) {

            // use our article model to find the article we want
            Article.findById(req.params.article_id, function(err, article) {
            
                if (err) res.send(err);
                
                // update the article info only if its new
                article.title = req.body.title;
                article.article_body = req.body.article_body;
                article.owner_id = req.body.owner_id;
                
                // save the article
                article.save(function(err) {
                    if (err) res.send(err);
                    
                    // return a message
                    res.json({ message: 'Article updated!' });
                });
            
            });
        })

        // delete the article with this id
        // (accessed at DELETE http://localhost:8080/api/articles/:article_id)
        .delete(function(req, res) {
            Article.deleteOne({
                    _id: req.params.article_id
            }, function(err, article) {
                    if (err) res.send(err);
                    
                    res.json({ message: 'Successfully deleted' });
                });
        });

        return apiRouter;

};