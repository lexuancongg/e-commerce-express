
const handlebars = require('express-handlebars');
const express = require('express');
const path = require('path');
dotenv =  require('dotenv');
const morgan = require('morgan');
const cors = require('cors');   // chính sách trình duyệt
const methodOverride = require('method-override')   // ghi đè method
var cookieParser = require('cookie-parser')   // hổ trợ nhận cooki gởi lên từ trình duyệt
const passport = require('passport');    // authencation
const websocket = require('./config/webSocket/websocket.js')
const route = require('./routes/index.js');
const mongodb = require('./config/db/connectdb.js');
const rateLimit = require('express-rate-limit').rateLimit
const app = express();

 dotenv.config({ path: ['.env.local', '.env'] })
mongodb.connect();
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
    origin: "*",
    methods: 'GET, POST, PUT, DELETE, OPTIONS,PATCH',
    allowedHeaders: "Accept,authorization,Authorization, Content-Type",
    credentials:true
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit:5000
  })


// const hide_fields = [
//   {url:"/login",method:"POST",field:"passWord"},
//   {url:"/register",method:"POST",field:"passWord"},
//   {url:"/register",method:"POST",field:"phoneNumber"}
// ]
// app.use(function(req,res,next){
//   res.on("finish",()=>{
//     const request_log = {
//       url:req.url,
//       method:req.method,
//       query: req.query,
//       params: req.params,
//       body: req.body,
//     }
//     const  req_hide_fields = hide_fields.filter(hide_field => hide_field.url == request_log.url && hide_field.method == request_log.method)
//     for(let i = 0 ; i< req_hide_fields.length;i++){
//       if(request_log.body[req_hide_fields[i].field]){
//         request_log.body[req_hide_fields[i].field]="****"
//       }
//     }
//     // dùng forEach
//     req_hide_fields.forEach(req_hide_field => {
//       if(request_log.body[req_hide_field.field]){
//         request_log.body[req_hide_field.field]="****"
//       }
//     })
//     console.log("Request: " + JSON.stringify({
//       url: req.url,
//       query: req.query,
//       params: req.params,
//       body: req.body
//   }));
//   console.log("Response: " + JSON.stringify({statusCode: res.statusCode, statusMessage: res.statusMessage}))
//   })
//   next()
// })


app.use(express.static(path.join(__dirname, 'public')))
// đọc và gởi dữ liệu dạng json
app.use(express.json());    
app.use(passport.initialize());
// xử lý dữ liệu từ client gởi lên từ form khi submit mặc định
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));
app.use(cookieParser())
// app.use(apiLimiter)
// app.use(morgan('combined'));     // log lại những yêu cầu request
const PORT = 3000;
route(app);
// tạo một sever gắn kết với ứng dụng express
const server = websocket.createWebsocket(app)   
server.listen(PORT, () => console.log(`lang nghe tren cong${PORT}`));
module.exports = app;
 