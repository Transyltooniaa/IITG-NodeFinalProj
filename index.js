const express = require('express')
const app = express()
const path = require('path')
const key = require('dotenv').config()
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


const questionRouter = require('./router/quesRoutes')
const answerRouter = require('./router/ansRoutes')
const userRouter = require('./router/authRoutes')
const exp = require('constants')
const cookieParser = require('cookie-parser')


require('./db/dbCon');
require('./cronJobs'); 

// Middleware
app.use(express.json())
app.use(cookieParser())



const PORT = process.env.port || 3000

// Setting up the frontend
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('*', checkUser);

app.get('/', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3000/api/questions'); // Use the full URL
    const data = await response.json();
    res.render('home', { questions: data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/verify', (req, res) => { 
    res.render('verify');
});

app.get('/question/:id', async(req, res) => {
    const questionId = req.params.id;
    const response = await fetch(`http://localhost:3000/api/questions/${questionId}`);
    const answerResponse = await fetch(`http://localhost:3000/api/answers/${questionId}`);
    const data = await response.json();
    const answerData = await answerResponse.json();
    console.log(data);
    console.log(answerData);
    res.render('question', { question: data , answers: answerData});
});



app.get('/', (req, res) => res.render('home'));
app.use("/api/questions",questionRouter);
app.use("/api/answers",answerRouter);
app.use("/api/auth",userRouter);




// server Setup
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})