var Pin = require('../models/pins');

module.exports = function(app, passport) {
    
    app.get('/', function(req, res) {
        var toSend = {};
        if (req.isAuthenticated()) {
            toSend.user = req.user;
        } 
        return res.render('index', toSend);
    });
    
    app.get('/myPins', isLoggedIn, function(req, res) {
        var toSend = {};
        if (req.flash('newPinAdded').length) {
            toSend.message = req.flash('newPinAdded')[0];
        }
        return res.render('mypins');
    })
    
    /* LOGIN AREA */
    
    app.get('/auth/twitter', passport.authenticate('twitter'));
    
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/nope' }));
    
    /* USERS */
    
    app.get('/user/:u', function(req, res) {
        var toSend = {};
        toSend.userProfile = req.params.u;
        if (req.isAuthenticated()) {
            toSend.user = req.user;
        }
        return res.render('userPins', toSend);
    })
    
    
    /* PINS */
    
    app.get('/allPins', function(req, res) {
        Pin.find({}, {_id:0, __v:0}, function(err, data) {
            if (err) {
                throw err;
            }
            return res.send(data);
        });
    });
    
    app.post('/removePin', isLoggedIn, function(req, res) {
        var pinId = req.body.pinId;
        var author = req.user.twitter.username || req.user.email;
        Pin.find({_id:pinId, author:author}).remove(function(err, result) {
            if (err) {
                throw err;
            }
            return res.send({'status':'OK'});
        });
    });
    
    app.get('/getPins?', function(req, res) {
        var author = req.body.author || req.user.twitter.username || req.user.email;
        Pin.find({author:author}, {__v:0}, function(err, data) {
            if (err) {
                throw err;
            }
            return res.send(data);
        });
    });
    
    app.get('/newPin', isLoggedIn, function(req, res) {
        var toSend = {};
        if (req.flash('newPinAdded').length) {
            toSend.newPin = req.flash('newPinAdded')[0];
        }
        return res.render('newPin', toSend);
    });
    
    app.post('/newPin', isLoggedIn, function(req, res) {
        var author = req.user.email || req.user.twitter.username;
        var pinName = req.body.pinName;
        var pinURL = req.body.pinURL;
        var newPin = new Pin();
        
        newPin.name = pinName;
        newPin.author = author;
        newPin.imgURL = pinURL;
        
        newPin.save(function(err) {
            if (err) {
                throw err;
            }
            return res.redirect('/mypins');
        });
    });
    
    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/');
    }
}