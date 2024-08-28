
const handlebars = require('express-handlebars');
const express = require('express');
const path = require('path');
require('dotenv').config({ path: ['.env.local', '.env'] })
const morgan = require('morgan');
const cors = require('cors');   // chính sách trình duyệt
const methodOverride = require('method-override')   // ghi đè method
var cookieParser = require('cookie-parser')   // hổ trợ nhận cooki gởi lên từ trình duyệt
const passport = require('passport');    // authencation
const websocket = require('./config/webSocket/websocket.js')
const route = require('./routes/index.js');
const app = express();
const mongodb = require('./config/db/connectdb.js');
mongodb.connect();
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());    // đọc và gởi dữ liệu dạng json
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true })); // xử lý dữ liệu từ client gởi lên từ form khi submit mặc định
app.use(methodOverride('_method'));
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
    origin: "*",
    methods: 'GET, POST, PUT, DELETE, OPTIONS,PATCH',
    allowedHeaders: "Accept,authorization,Authorization, Content-Type"
}));

app.use(cookieParser())
// app.use(morgan('combined'));     // log lại những yêu cầu request
const PORT = 3000;
route(app);
const server = websocket.createWebsocket(app)   // tạo một sever gắn kết với ứng dụng express
server.listen(PORT, () => console.log(`lang nghe tren cong${PORT}`));
module.exports = app;
