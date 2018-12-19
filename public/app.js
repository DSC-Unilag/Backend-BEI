'use strict';

var _verify = require('./routes/verify');

var _verify2 = _interopRequireDefault(_verify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');
var Model = require('./models/model');
var Questioncontroller = require('./routes/questioncontroller');
var Answercontroller = require('./routes/answercontroller');
var Authcontroller = require('./routes/authcontroller');
var Usercontroller = require('./routes/usercontroller');

var app = express();

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Enable Cross origin resource sharing (CORS)
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
    next();
});

//API ENDPOINTS
//purposely placed authentication routes at the top to prevent token verification
app.post('/api/v1/auth/register', Authcontroller.authRegister);
app.post('/api/v1/auth/login', Authcontroller.authLogin);

//middleware to verify token across all routes
app.use(_verify2.default);

app.get('/api/v1/auth/me', Authcontroller.testToken);

app.get('/api/v1/users/:id', Usercontroller.getUserprofile);

app.get('/api/v1/users/:id/questions', Usercontroller.getUserQuestions);

app.get('/api/v1/questions', Questioncontroller.getAllQuestions);

app.post('/api/v1/questions', Questioncontroller.postQuestion);

app.delete('/api/v1/questions/:id', Questioncontroller.deleteQuestion);

app.get('/api/v1/questions/:id', Questioncontroller.getSingleQuestion);

app.get('/api/v1/questions/:id/answers', Answercontroller.getAnswersForAQuestion);

app.post('/api/v1/questions/:id/answers', Answercontroller.postAnswerToAQuestion);

app.post('/api/v1/answers/:qid/:id/comments', Answercontroller.createComment);

app.get('/api/v1/answers/:qid/:id/comments', Answercontroller.getUsersComments);

app.put('/api/v1/answers/:id/:userid/upvote', Answercontroller.upvoteAnswer);

app.patch('/api/v1/answers/:id/accept', Answercontroller.acceptAsPreferred);

app.get('/api/v1/search/questions', Questioncontroller.searchQuestions);

app.listen(3000, function () {
    console.log("server started at port: " + 3000);
});