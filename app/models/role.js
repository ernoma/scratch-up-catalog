var mongoose = require('mongoose');

var RoleSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model("Role", RoleSchema);
