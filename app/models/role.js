var mongoose = require('mongoose');

var RoleSchema = mongoose.Schema({
    name: String
});

var Role = mongoose.model("Role", RoleSchema);

Role.find({}, function(err, roles) {
    if (err) throw err;
    
    // object of all the users
    console.log(roles);

    //
    // if no roles add them
    //
    if (roles.length == 0) {
	var roleNames = ['Software Developer / Designer', 'UI / UX / Graphic Designer', 'Sysadmin', 'Visual Artist', 'Musician', 'Marketing', 'Leading / Management'];
	createInitialRoles(roleNames);
    }
});

function createInitialRoles(roleNames) {
    for (var i = 0; i < roleNames.length; i++) {
	var newRole = Role({
	    name: roleNames[i]
	});
	newRole.save(function(err) {
	    if (err) throw err;

	    console.log('Role ' + roleNames[i] + ' created!');
	});
    }
}

module.exports = Role;
