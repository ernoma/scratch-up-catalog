var mongoose = require('mongoose');

var RoleSchema = mongoose.Schema({
    name: String,
    short_name: String
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
	var shortNames = ['developer', 'designer', 'admin', 'artist', 'musician', 'marketer', 'manager'];
	createInitialRoles(roleNames, shortNames);
    }
});

function createInitialRoles(roleNames, shortNames) {
    for (var i = 0; i < roleNames.length; i++) {
	var newRole = Role({
	    name: roleNames[i],
	    short_name: shortNames[i]
	});
	newRole.save(function(err) {
	    if (err) throw err;

	    console.log('Role ' + roleNames[i] + ' created!');
	});
    }
}

module.exports = Role;
