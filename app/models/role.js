var mongoose = require('mongoose');

var RoleSchema = mongoose.Schema({
    name: String,
    infos: [{
	url: String,
	description: String
    }]
});

module.exports = mongoose.model("Role", RoleSchema);
