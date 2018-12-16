var express = require('express');
var Model = require('./models/model');
const Questioncontroller = require('./routes/questioncontroller');
const Answercontroller = require('./routes/answercontroller');
const Authcontroller = require('./routes/authcontroller');
const Usercontroller = require('./routes/usercontroller');
const verifyToken = require('./routes/verify')

var app = express();

//Enable CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
    next();
  });


//API ENDPOINTS
app.post('/api/v1/auth/register', Authcontroller.authregister )
app.post('/api/v1/auth/login',  Authcontroller.authlogin )
app.get('/api/v1/auth/me',verifyToken , Authcontroller.testtoken)
app.get('/api/v1/users/:id',  Usercontroller.getUserprofile);
app.get('/api/v1/users/:id/questions',  Usercontroller.getUserQuestions);
app.get('/api/v1/questions',verifyToken , Questioncontroller.getAllQuestions);
app.post('/api/v1/questions',    Questioncontroller.postQuestion);
app.delete('/api/v1/questions/:id',    Questioncontroller.deleteQuestion);
app.get('/api/v1/questions/:id',    Questioncontroller.getSingleQuestion);
app.get('/api/v1/questions/:id/answers',  Answercontroller.getAnswersForAQuestion);
app.post('/api/v1/questions/:id/answers',  Answercontroller.postAnswerToAQuestion);
app.post('/api/v1/answers/:qid/:id/comments',Answercontroller.createComment);
app.get('/api/v1/answers/:qid/:id/comments', Answercontroller.getUsersComments)
app.put('/api/v1/answers/:id/upvote',Answercontroller.upvoteAnswer)
app.get('/api/v1/search/questions', Questioncontroller.searchQuestions);


app.listen(3000,() =>{
    console.log("server started at port:" + 3000);
})
