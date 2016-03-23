$(document).ready(function () {
    $('#volunteer').addClass("active");

    console.log(user);

    $.getJSON("/ideas", function(ideas) {
	console.log(ideas);

	$.getJSON("/roles", function(roles) {
	    console.log(roles);

	    for (var i = 0; i < ideas.length; i++) {
	    
		var ideaHTML = "<li class='idea_list_item' id='idea_"
		    + ideas[i]._id + "'><h3>" + ideas[i].title + "</h3>";

		ideaHTML += "<p>Updated: "
		    + moment(ideas[i].updated).format('MMMM Do YYYY') + "</p><p>Status: "
		    + ideas[i].status + "</p>";

		if (ideas[i].site != "") {
		    ideaHTML += "<p>Site: <a href='" + ideas[i].site + "'>" + ideas[i].site + "</a></p><p>";
		}
		
		ideaHTML += ideas[i].description + "</p><p>Needed volunteers for roles:</p><p><ul>";

		for (var j = 0; j < ideas[i].neededRoles.length; j++) {
		    for (var k = 0; k < roles.length; k++) {
			if (ideas[i].neededRoles[j] == roles[k]._id) {
			    ideaHTML += "<li>" + roles[k].name;
			}
		    }	
		}
		ideaHTML += "</ul></p>";
		
		ideaHTML += "<button id='idea_contact_button_" + ideas[i]._id + "' type='button' class='btn btn-success' data-toggle='tooltip' data-placement='top' title='Your email adress and link to your profile page will be sent to ideator along with the info that you are interested of this idea.'>Contact ideator</button>";

		ideaHTML += '<p><div id="idea_contact_alert_' + ideas[i]._id + '" class="alert alert-success alert-dismissible collapse" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>Notification sent</strong></div></p>';

		$("#idea_list").append(ideaHTML);

		$("#idea_contact_button_" + ideas[i]._id).on('click', function(event) {
		    console.log(this.value);
		    console.log(event.target.id);

		    var parts = event.target.id.split("_");

		    $("#idea_contact_alert_" + parts[parts.length-1]).show();
		});
	    }

	    $('[data-toggle="tooltip"]').tooltip(); // initialize tooltips
	});
    });
});

$( "#role_select" ).on('change', function(event) {
    console.log(this.value);
    console.log(event);
    //console.log($(this).html());

    //$('.dropdown-toggle').html(this.value + ' <span class="caret"></span>');
    $('#role_contents p').replaceWith("<p>Relevant content for the " + this.value + " comes here</p>");
});

