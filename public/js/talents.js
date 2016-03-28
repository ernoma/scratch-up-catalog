
var users = null;
var roles = null;
var ideas = null;

$(document).ready(function () {
    $('#talents').addClass("active");
    
    console.log(user);

    $.getJSON('/users', function(userData) {
	console.log(userData);
	users = userData;

	 $.getJSON('/roles', function(roleData) {
             //console.log(roleData);
	     roles = roleData;

	     $.getJSON('/ideas', function(ideaData) {
		 //console.log(ideaData);
		 ideas = ideaData;

		 checkIdeaNeeds();
	     });
	 });
    });
});

function checkIdeaNeeds() {

    var userIdeas = [];

    var parts = window.location.pathname.split('/');
    var ideaID = null;
    if (parts[parts.length-1] != "talents") {
	ideaID = parts[parts.length-1];
	//console.log(ideaID);
	for (var i = 0; i < ideas.length; i++) {
	    if (ideas[i].creator == user._id && ideaID == ideas[i]._id) {
		userIdeas.push(ideas[i]);
		break;
	    }
	}
    }
    else {
	for (var i = 0; i < ideas.length; i++) {
	    if (ideas[i].creator == user._id) {
		userIdeas.push(ideas[i]);
	    }
	}
    }

    //console.log(userIdeas);

    var nonMatchingUsers = [];
    var userIdeaMatches = {};
    var nonAvailableUsers = [];

    for (var i = 0; i < users.length; i++) {
	var foundMatch = false;
	if (users[i]._id != user._id) {
	    if(users[i].available == true) {
		for (var j = 0; j < userIdeas.length; j++) {
		    for (var k = 0; k < users[i].interestingRoles.length; k++) {
			for (var m = 0; m < userIdeas[j].neededRoles.length; m++) {
			    if (users[i].interestingRoles[k] == userIdeas[j].neededRoles[m]) {
				foundMatch = true;
				if (userIdeaMatches[users[i]._id] == undefined) {
				    userIdeaMatches[users[i]._id] =
					{ user: users[i],
					  matches: [{
					      idea: userIdeas[j],
					      role: users[i].interestingRoles[k]
					  }]
					};
				}
				else {
				    userIdeaMatches[users[i]._id].matches.push(
					{
                                            idea: userIdeas[j],
                                            role: users[i].interestingRoles[k]
					});
				}
			    }
			}
		    }
		}
	    }
	    if (!foundMatch) {
		if (users[i].available) {
		    nonMatchingUsers.push(users[i]);
		}
		else {
		    nonAvailableUsers.push(users[i]);
		}
	    }
	}
    }

    console.log(userIdeaMatches);
    console.log(nonMatchingUsers);
    console.log(nonAvailableUsers);

    if (!$.isEmptyObject(userIdeaMatches)) {

	$("#matching_talents_div").append('<h3 id="matching_talents_h">Talents Matching Your Idea Needs</h3>');
	$("#matching_talents_div").append('<ul id="talents_list" class="talents_list"></ul>');

	$.each( userIdeaMatches, function( userID, match ) {
	    // TODO: name user anonymous if no name or it = null || ""
	    var userHTML = "";
	
	    userHTML += '<li class="talents_list_item" id="user_' + userID + '">';
	    
	    if (match.user.name == null || match.user.name == "") {
		userHTML += '<h3>Anonymous</h3>';
	    }
	    else {
		userHTML += '<h3>' + match.user.name + '</h3>';
	    }

	    if (match.user.description != null && match.user.description != "") {
		userHTML += '<p>' + match.user.description + '</p>';
	    }

	    userHTML += '<h4>Matched Roles</h4><ul>';
	    for (var i = 0; i < match.matches.length; i++) {
		for (var j = 0; j < roles.length; j++) {
		    if (roles[j]._id == match.matches[i].role) {
			userHTML += '<li>' + roles[j].name + ' &rarr; <b>' +  match.matches[i].idea.title + '</b>';
			break;
		    }
		}
	    }
	    userHTML += '</ul></p>';

	    if (match.user.skills.length > 0) {
		userHTML += '<h4>Main Skills</h4><p><ul>';
		for (var i = 0; i < match.user.skills.length; i++) {
		    userHTML += '<li>' + match.user.skills[i].name;
		}
		userHTML += '</ul></p>';
	    }

	    if (match.user.sites.length > 0) {
		userHTML += '<h4>More Info</h4><p><ul>';
		for (var i = 0; i < match.user.sites.length; i++) {
		    userHTML += '<li><a href="' +  match.user.sites[i].siteURL + '" target="_blank">' + match.user.sites[i].title + '</a>';
		}
		userHTML += '</ul></p>';
	    }

	    userHTML += "<button id='user_contact_button_" + userID + "' type='button' class='btn btn-success' data-toggle='tooltip' data-placement='top' title='Your email adress and link to your profile page will be sent to the talent along with the info of your ideas that match talent roles.'>Contact talent</button>";

	    userHTML += '<p><div id="user_contact_alert_' + userID + '" class="alert alert-success alert-dismissible collapse" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>Notification sent</strong></div></p>';

	    $("#talents_list").append(userHTML);

	    $("#user_contact_button_" + userID).on('click', function(event) {
		console.log(this.value);
		console.log(event.target.id);
		
		var parts = event.target.id.split("_");
		
		$("#user_contact_alert_" + parts[parts.length-1]).show();
            });
	});

	$("#matching_talents_div").append('<hr>');
    }

    // TODO: show nonMatchingUsers below matching ones and do not show non available users

    if (nonMatchingUsers.length > 0) {

	$('#nonmatching_talents_div').append('<h3 id="nonmatching_talents_h">Talents Not Matching Your Idea Needs</h3>');

	$('#nonmatching_talents_div').append('<ul id="nonmatching_talents_list" class="talents_list"></ul>');

	for (var i = 0; i < nonMatchingUsers.length; i++) {
	   var userHTML = "";
	
	    userHTML += '<li class="talents_list_item" id="user_' + nonMatchingUsers[i]._id + '">';
	    
	    if (nonMatchingUsers[i].name == null || nonMatchingUsers[i].name == "") {
		userHTML += '<h3>Anonymous</h3>';
	    }
	    else {
		userHTML += '<h3>' + nonMatchingUsers[i].name + '</h3>';
	    }

	    if (nonMatchingUsers[i].description != null && nonMatchingUsers[i].description != "") {
		userHTML += '<p>' + nonMatchingUsers[i].description + '</p>';
	    }

	    if (nonMatchingUsers[i].interestingRoles.length > 0) {
		userHTML += '<h4>Interesting Roles</h4><ul>';
		for (var k = 0; k < nonMatchingUsers[i].interestingRoles.length; k++) {
		    for (var j = 0; j < roles.length; j++) {
			if (roles[j]._id == nonMatchingUsers[i].interestingRoles[k]) {
			    userHTML += '<li>' + roles[j].name;
			    break;
			}
		    }
		}
		userHTML += '</ul></p>';
	    }
	    
	    if (nonMatchingUsers[i].skills.length > 0) {
		userHTML += '<h4>Main Skills</h4><p><ul>';
		for (var j = 0; j < nonMatchingUsers[i].skills.length; j++) {
		    userHTML += '<li>' + nonMatchingUsers[i].skills[j].name;
		}
		userHTML += '</ul></p>';
	    }

	    if (nonMatchingUsers[i].sites.length > 0) {
		userHTML += '<h4>More Info</h4><p><ul>';
		for (var j = 0; j < nonMatchingUsers[i].sites.length; j++) {
		    userHTML += '<li><a href="' + nonMatchingUsers[i].sites[j].siteURL + '" target="_blank">' + nonMatchingUsers[i].sites[j].title + '</a>';
		}
		userHTML += '</ul></p>';
	    }

	    userHTML += "<button id='user_contact_button_" + nonMatchingUsers[i]._id + "' type='button' class='btn btn-success' data-toggle='tooltip' data-placement='top' title='Your email adress and link to your profile page will be sent to the talent along with the info of your ideas.'>Contact talent</button>";

	    userHTML += '<p><div id="user_contact_alert_' + nonMatchingUsers[i]._id + '" class="alert alert-success alert-dismissible collapse" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>Notification sent</strong></div></p>';

	    $("#nonmatching_talents_list").append(userHTML);

	    $("#user_contact_button_" + nonMatchingUsers[i]._id).on('click', function(event) {
		console.log(this.value);
		console.log(event.target.id);
		
		var parts = event.target.id.split("_");
		
		$("#user_contact_alert_" + parts[parts.length-1]).show();
            }); 
	}
    }

    $('[data-toggle="tooltip"]').tooltip(); // initialize tooltips
}
