const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const userHelper = require('../dbHelper/users');
const localStrategy = require('passport-local').Strategy;
require("dotenv/config");
const googleStrategy = require("passport-google-oauth20").Strategy;
const jwtOption = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromBodyField('token'), ExtractJwt.fromAuthHeaderAsBearerToken('authorization')
    ]),
    secretOrKey: process.env.SERECT_KEY
}
//confit cho passport sử dụng midderwear 
passport.use(new jwtStrategy(jwtOption, async (payload, done) => {
    try {
        const user = await User.findOne({ _id: payload.sub });
        if (!user) {
            const error = new Error("Not Found user");
            error.status = 401;
            return done(error, false);
        }
        done(null, user)
    } catch (error) {
        console.log(error)
        done(error, false);
    }

}))

// config loggin with form
passport.use('local-strategy', new localStrategy({
    passwordField: 'passWord',
    usernameField: 'userName'
}, async (userName, passWord, done) => {

    const result = await userHelper.checkUserIsCorrect(userName, passWord);
    if (result.type) {
        return done(null, result.data)
    }
    const error = new Error(result.message);
    error.status = result.status;
    return done(error, false)
}))


// config đăng nhập bằng google 
passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.SERECT_KEY_GOOGLE,
    callbackURL: 'http://localhost:3000/auth/google/redirect'
}, function (accessToken, refreshToken, profile, cb) {
    console.log(profile)

}))

