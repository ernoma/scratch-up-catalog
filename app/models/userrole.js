var mongoose = require('mongoose');

var UserRoleSchema = mongoose.Schema({
    user: {
	type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    role: {
	type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    infos: [{
        url: String,
        description: String
    }]
});

module.exports = mongoose.model("UserRole", UserRoleSchema);
