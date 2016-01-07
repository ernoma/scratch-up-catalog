module.exports = {

    'facebookAuth' : {
        'clientID'      : '551603578325099', // your App ID
        'clientSecret'  : process.env.FACEBOOK_SECRET, // your App Secret
        'callbackURL'   : 'http://scratch-up-catalog.herokuapp.com/auth/facebook/callback'
    },
    'googleAuth' : {
        'clientID'      : '210610397451-f9b38718q039gb7gke89gim00fdjqb48.apps.googleusercontent.com',
        'clientSecret'  : process.env.GOOGLE_SECRET,
        'callbackURL'   : 'http://scratch-up-catalog.herokuapp.com/auth/google/callback'
    }

};
