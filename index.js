const express = require('express')
require('dotenv').config();
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const bodyParser = require('body-parser')
const db=require('./config/connection.js');
const authRouter = require('./routes/auth.js')
const cors = require('cors')


db();

const api = process.env.API_URL;
//http://localhost:5050/api/shico
const PORT = process.env.PORT || 4000;
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.static(__dirname));
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(`${api}/user`,authRouter)



app.use(notFound);
app.use(errorHandler);
// start the Express server
app.listen(PORT, () => {
  console.log(api)
  console.log(`Server listening on port localhost "http://localhost:${PORT}"`);
});