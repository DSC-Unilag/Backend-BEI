var express = require('express');
var Model = require('./models/model');
const questioncontroller = require('./routes/questioncontroller');
const answercontroller = require('./routes/answercontroller');
const authcontroller = require('./routes/authcontroller');
const verifyToken = require('./routes/verify')

var app = express();

//Enable CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
    next();
  });


//API ENDPOINTS
app.post('/api/v1/auth/register', authcontroller.authregister )
app.post('/api/v1/auth/login',  authcontroller.authlogin )
app.get('/api/v1/auth/me',verifyToken , authcontroller.testtoken)
app.get('/api/v1/questions',verifyToken , questioncontroller.getAllQuestions);
app.post('/api/v1/questions',    questioncontroller.postQuestion);
app.delete('/api/v1/questions/:id',    questioncontroller.deleteQuestion);
app.get('/api/v1/questions/:id',    questioncontroller.getSingleQuestion);
app.get('/api/v1/questions/:id/answers',  answercontroller.getAnswersForAQuestion);
app.post('/api/v1/questions/:id/answers',  answercontroller.postAnswerToAQuestion);
app.post('/api/v1/answers/:qid/:id/comments',answercontroller.createComment);
app.get('/api/v1/answers/:qid/:id/comments', answercontroller.getUsersComments)
app.put('/api/v1/answers/:id/upvote',answercontroller.upvoteAnswer)
app.get('/api/v1/search/questions', questioncontroller.searchQuestions);

app.listen(3000,() =>{
    console.log("server started");
})
