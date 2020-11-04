# mean-project
Angularjs project with Nodejs

## Demonstration of MEAN Stack
Using mean stack to create a single page dashboard to manage users and article

## Database
Mongodb is used to the application

## Required file
- config.js in the root directory

## Content of config.js
module.exports = {
    'port': process.env.PORT || 8080,
    'database': 'mongodb://127.0.0.1:27017/my-db',
    'secret': 'anything-you-want-to-name-it',
};
