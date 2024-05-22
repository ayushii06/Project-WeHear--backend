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

const corsOptions = {
  origin: 'https://we-hear.vercel.app',
  optionsSuccessStatus: 200 // For legacy browser support
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://we-hear.vercel.app'); // Allow the specific origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Add any custom headers here
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow the methods you need
  next();
});

const path = require("path");

app.use(express.static(path.join(__dirname, "build")));

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