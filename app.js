require('dotenv').config();
require('express-async-errors');


const express = require('express');
const app = express();
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const {errorHandler} = require('./middleware')

const connectDB = require('./db/connect');


app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(morgan('dev'))
app.get('/', (req, res)=> {
  res.send('hello world')
})
app.use(errorHandler)

const port = process.env.PORT || 5000;

const start =  async() => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, ()=> console.log(`Server is listening at port ${port}`))
  } catch (err) {
    console.log(err)
  }
}

start()