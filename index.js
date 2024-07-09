const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const key = require('dotenv').config()
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


const questionRouter = require('./router/quesRoutes')
const answerRouter = require('./router/ansRoutes')
const userRouter = require('./router/authRoutes')


require('./db/dbCon');
require('./cronJobs'); 

// Middleware
app.use(express.json())
app.use("/api/questions",questionRouter);
app.use("/api/answers",answerRouter);
app.use("/api/auth",userRouter);


const PORT = process.env.port || 3000

// Setting up the frontend
const publicDirectoryPath = path.join(__dirname,'/public');
const viewsPath = path.join(__dirname,'/templates/views');
const partialsPath = path.join(__dirname,'/templates/partials')

app.set('view engine', 'hbs');
app.set('views',viewsPath);
app.use(express.static(publicDirectoryPath));
hbs.registerPartials(partialsPath)



app.get('*', checkUser);




// server Setup
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})