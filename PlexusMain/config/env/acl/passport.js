var LocalStrategy = require('passport-local').Strategy
  , User = require('../../../models/user');


module.exports = function (passport, config) {


passport.serializeUser(function(user, done) 
{
    if(user.data === undefined)
    {
        done(null, user.uid);
    }
    else
    {
        done(null, user.data.uid);
    }    
});
 
passport.deserializeUser(function(userId, done) {
        User.getByDocumentId(userId,function(err, user)
        {   
            if(err)
            {
                done(null,err);
            }
            else
            {
                if(user[0] === undefined)
                {
                    //after register fetch by id
                        done(null, user);
                }
                else
                {
                    //after login fetch by id
                    done(null, user[0].users);
                }    
            }   
        });
});

passport.use('local', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    },
    function(email, password, done) 
    {
        User.isValidUserPassword(email, password, done);
    }));


}



