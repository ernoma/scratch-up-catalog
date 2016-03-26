
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
	    if(users[i].available = true) {
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

    
    $.each( userIdeaMatches, function( userID, match ) {
	// TODO: name user anonymous if no name or it = null || ""

	var userHTML = "";
	
	userHTML += "<button id='user_contact_button_" + userID + "' type='button' class='btn btn-success' data-toggle='tooltip' data-placement='top' title='Your email adress and link to your profile page will be sent to the talent along with the info of your idea.'>Contact talent</button>";

	userHTML += '<p><div id="user_contact_alert_' + userID + '" class="alert alert-success alert-dismissible collapse" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>Notification sent</strong></div></p>';

	$("#talents_list").append(userHTML);

	$("#user_contact_button_" + userID).on('click', function(event) {
            console.log(this.value);
            console.log(event.target.id);

            var parts = event.target.id.split("_");

            $("#user_contact_alert_" + parts[parts.length-1]).show();
        });
    });

    // TODO: show nonMatchingUsers below matching ones and do not show non available users

    $('[data-toggle="tooltip"]').tooltip(); // initialize tooltips
}
