$(document).ready(function () {
    $.getJSON('/users', function(users) {
	$.getJSON('/ideas', function(ideas) {
	    $.getJSON('/roles', function(roles) {
		console.log(roles);
		console.log(ideas);

		var LIST_LENGTH = 4;
		var count = 0;
		var shuffledUsers = shuffleArray(users);
		console.log(shuffledUsers);
		for (var i = 0; i < shuffledUsers.length && count < LIST_LENGTH; i++) {
		    if (shuffledUsers[i].interestingRoles.length > 0) {
			var index = Math.floor(Math.random() * shuffledUsers[i].interestingRoles.length);
			var role = shuffledUsers[i].interestingRoles[index];
			for (var j = 0; j < roles.length; j++) {
			    if (role == roles[j]._id) {
				var html = '<p>';
				if (shuffledUsers[i].name != null && shuffledUsers[i].name != "") {
				    html += shuffledUsers[i].name + ", ";
				}
				else {
				     html += "Anonymous, ";
				}
				html += roles[j].short_name + '</p>';
				$("#volunteers_div").append(html);
				count++;
				break;
			    }
			}
		    }
		}
		$("#volunteers_div").append('<p>...</p>');

		var shuffledIdeas = shuffleArray(ideas);
		for (var i = 0; i < shuffledIdeas.length && i < LIST_LENGTH; i++) {
		    var html = '<p>' + shuffledIdeas[i].title + '</p>';
		    $("#ideas_div").append(html);
		}
		$("#ideas_div").append('<p>...</p>');
	    });
	});
    });
});

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
	
	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;
	
	// And swap it with the current element.
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
    }

    return array;
}
