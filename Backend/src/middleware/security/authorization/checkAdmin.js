const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const user = require('../../../app/models/User');
const jwtOption = {
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token'), ExtractJwt.fromBodyField('token'),]),
    secretOrKey: process.env.SERECT_KEY
}
// confit cho passport sử dụng midderwear 
passport.use(new JwtStrategy(jwtOption, function (jwt_data, done) {
    user.findOne({ _id: jwt_data.idUser })
        .then(response => {
            const user = JSON.parse(JSON.stringify(response))
            if (user.role === 'admin') {
                // lỗi không có và có kết quả user : thành công và midewea tiếp theo đc thực hiện 
                return done(null, jwt_data.idUser);
            }
            // done(err, result) 
            done(new Error('bạn không đủ quyền hạn'), false)
        })
        .catch(err => {
            done(err, null);
            throw new Error(err)
        })
}))
const isAdmin = passport.authenticate('jwt', { session: false });

module.exports = isAdmin