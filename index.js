const express = require('express')
require('dotenv').config();
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const bodyParser = require('body-parser')
const db=require('./config/connection.js');
const authRouter = require('./routes/auth.js')
const cors = require('cors')
const productRouter = require('./routes/ProductRoute.js')
const cartRouter = require('./routes/CartRoutes.js')



db();

const api = process.env.API_URL;
//http://localhost:5050/api/shico
const PORT =  5050;
const app = express();
const cors = require('cors');
// Allow all origins
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://we-hear.vercel.app/"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(`${api}/user`,authRouter)
app.use(`${api}/product`,productRouter)
app.use(`${api}/cart`,cartRouter)


app.use(notFound);
app.use(errorHandler);
// start the Express server
app.listen(PORT, () => {
  console.log(api)
  console.log(`Server listening on port localhost "http://localhost:${PORT}"`);
});