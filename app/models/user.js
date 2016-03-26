var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var SiteSchema = new mongoose.Schema({
    title: String,
    siteURL: String
});

var SkillSchema = new mongoose.Schema({
    name: String,
    level: Number
});

var userSchema = mongoose.Schema({
    name: String,
    description: String,
    available: Boolean,
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    sites: [SiteSchema],
    skills: [SkillSchema],
    interestingRoles: [
	{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
