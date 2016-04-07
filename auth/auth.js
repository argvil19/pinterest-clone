var twitterStrategy = require('passport-twitter').Strategy;
var localStrategy = require('passport-local');
var twitterConfig = require('../config/oauth');

var User = require('../models/users');

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use('local-signup', new localStrategy({
        usernameField:'user',
        passwordField:'pass',
        passReqToCallback: true
    }, function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({'email':email}, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already registered'));
                } else {
                    var newUser = new User();
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.polls = [];
                    
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
    passport.use('local-login', new localStrategy({
        usernameField:'user',
        passwordField:'pass',
        passReqToCallback:true
    }, function(req, email, password, done) {
        User.findOne({'email':email}, function(err, user) {
            if (err)
                return done(err);
            if (!(user) || !(user.validPassword(password))) {
                return done(null, false, req.flash('loginMessage', 'Wrong email or password'));
            }
            return done(null, user);
        });
    }));
    
    passport.use(new twitterStrategy(twitterConfig.twitter, function(token, token_secret, profile, done) {
        process.nextTick(function() {
            User.findOne({
                'twitter.idAcc':profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                
                if (user) {
                    return done(null, user);
                } else {
                    
                    var newUser = new User();

                    newUser.twitter.idAcc = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;
                    newUser.twitter.photos = profile.photos;
                    
                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
};