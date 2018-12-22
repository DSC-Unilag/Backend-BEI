const express = require('express');
const bodyParser = require('body-parser');
const Questioncontroller = require('./routes/questioncontroller');
const Answercontroller = require('./routes/answercontroller');
const Authcontroller = require('./routes/authcontroller');
const Usercontroller = require('./routes/usercontroller');
const verifyToken = require('./middleware/verify');
var app = express();

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Enable Cross origin resource sharing (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
    next();
  });

//API ENDPOINTS
//purposely placed authentication routes at the top to prevent token verification
app.post('/api/v1/auth/register', Authcontroller.authRegister )
app.post('/api/v1/auth/login',  Authcontroller.authLogin )

//middleware to verify token across all routes
app.use(verifyToken);

app.get('/api/v1/auth/me' , Authcontroller.testToken)

app.get('/api/v1/users/:id',  Usercontroller.getUserprofile);

app.get('/api/v1/users/:id/questions',  Usercontroller.getUserQuestions);

app.get('/api/v1/questions' , Questioncontroller.getAllQuestions);

app.post('/api/v1/questions',  Questioncontroller.postQuestion);

app.delete('/api/v1/questions/:id',  Questioncontroller.deleteQuestion);

app.get('/api/v1/questions/:id',  Questioncontroller.getSingleQuestion);

app.get('/api/v1/questions/:id/answers',  Answercontroller.getAnswersForAQuestion);

app.post('/api/v1/questions/:id/answers',  Answercontroller.postAnswerToAQuestion);

app.post('/api/v1/answers/:qid/:id/comments', Answercontroller.createComment);

app.get('/api/v1/answers/:qid/:id/comments', Answercontroller.getUsersComments)

app.put('/api/v1/answers/:id/:userid/upvote', Answercontroller.upvoteAnswer)

app.put('/api/v1/answers/:id/accept', Answercontroller.acceptAsPreferred)

app.get('/api/v1/search/questions', Questioncontroller.searchQuestions);


app.listen(process.env.PORT ||  8000  ,() =>{
    console.log("server started at port: " + 8000);
})
