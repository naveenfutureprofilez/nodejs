const express = require('express');
const app = express();

const morgan = require('morgan')
app.use(morgan('dev')); 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const globalErrorHandler = require("./middlewares/gobalErrorHandler");
const cors = require('cors');
const AppError = require('./utils/AppError');
require('./db/config');
 

// MIDDLE-WARES 
app.use(cors()); 
app.use(express.json()); 
// app.use(errorHandler);  

// ROUTES
app.use("/user", require('./routes/authRoutes'));
app.use("/product", require('./routes/productsRoutes'));
app.use("/user", require('./routes/userRoutes'));
  

// TEST CHECK
app.get('/', (req, res)=>{ 
    res.send({
        status:"Active",  
        Status :200
    });   
}); 

const Pusher = require('pusher');
const pusher = new Pusher({
    appId: '1569306',
    key: '35a80b2b96010f87b14f',
    secret: '90644451264fded8b7b0',
    cluster: 'eu',
    useTLS: true
});

app.post('/pusher/auth', (req, res) => {

    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const user = req.body.user_id; // replace this with your own user authentication logic
    
    console.log("req.body",req.body);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    
    const auth = pusher.authenticate(socketId, channel, user);
    console.log("Auth",auth);
    res.send(auth);
});


app.all('*', (req, res, next) => { 
    next(new AppError("page not found !!", 404    ));         
});

app.use(globalErrorHandler); 
  
const port = 8080;
app.listen(port, ()=>{ console.log(`On PORT ${port} SERVER RUNNINGGGGG.....`) });