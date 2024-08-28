// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const passport = require('passport');
// const user = require("../../models/User");
// require("dotenv/config")
// const googleStrategy = require("passport-google-oauth20").Strategy;
// const jwtOption = {
//     jwtFromRequest: ExtractJwt.fromExtractors([
//         ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token'),
//         ExtractJwt.fromBodyField('token'), ExtractJwt.fromAuthHeaderAsBearerToken('authorization')
//     ]),
//     secretOrKey: process.env.SERECT_KEY
// }
// // confit cho passport sử dụng midderwear 
// passport.use(new JwtStrategy(jwtOption, function (decodeToken, done) {
//     console.log("is admin")
    
//     user.findOne({ _id: decodeToken.sub })
//         .then(response => {
//             const user = JSON.parse(JSON.stringify(response))
//             if (user.role === 'admin') {
//                 // lỗi không có và có kết quả user : thành công và midewea tiếp theo đc thực hiện 
//                 return done(null, decodeToken.sub);
//             }
//             // done(err, result) 
//             done(new Error('bạn không đủ quyền hạn'), false)
//         })
//         .catch(err => {
//             done(err, null);
//             throw new Error(err)
//         })
// }))


// // config đăng nhập bằng google 
// passport.use(new googleStrategy({
//     clientID: process.env.CLIENT_ID_GOOGLE,
//     clientSecret: process.env.SERECT_KEY_GOOGLE,
//     callbackURL: 'http://localhost:3000/auth/google/redirect'
// }, function (accessToken, refreshToken, profile, cb) {
//     console.log(profile)

// }))



// const isAdmin = passport.authenticate('jwt', { session: false });

// module.exports = isAdmin;