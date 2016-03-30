
var skillCount = 0;
var siteCount = 0;

$(document).ready(function() {
    $('#user_nav').addClass("active");

    console.log(user);

    //$("#profile_tab_ideas_div").hide();

    addSiteDiv();

    addSkillDiv();
    addSkillDiv();
    addSkillDiv();

    fillProfileInfo();

    showUserIdeas();
});

$("#tab_profile_nav a").click(function(event){
    event.preventDefault();
    $(this).tab('show');
    console.log($(this)[0].id);
    if ($(this)[0].id == "a_tab_ideas") {
	$("#profile_tab_profile_div").hide();
	$("#profile_tab_ideas_div").show();
    }
    else {
	$("#profile_tab_ideas_div").hide();
	$("#profile_tab_profile_div").show();
    }
});

function showRoles() {
    $.getJSON('/roles', function(roles) {
	for(var i = 0; i < roles.length; i++) {
	    var interesting = false;
	    for (var j = 0; j < user.interestingRoles.length; j++) {
		if (roles[i]._id == user.interestingRoles[j]) {
		    $("#list_profile_roles").append('<label class="checkbox"><input type="checkbox" value="' + roles[i]._id + '" id="role_' + roles[i].short_name + '" checked>' + roles[i].name + '</label>');
		    interesting = true;
		}
	    }
	    if (!interesting) {
		$("#list_profile_roles").append('<label class="checkbox"><input type="checkbox" value="' + roles[i]._id + '" id="role_' + roles[i].short_name + '">' + roles[i].name + '</label>');
	    }
	}
    });
}

function fillProfileInfo() {
    if (user.available != undefined) {
	if (user.available == true) {
	    $("#userAvailableYes").prop( "checked", true );
	}
	else {
	    $("#userAvailableNo").prop( "checked", true );
	}
    }
    if (user.name != undefined) {
	$("#userRealName").val(user.name);
    }
    if (user.description != undefined) {
	$("#userDescription").val(user.description);
    }
    if (user.skills != undefined) {
	while (skillCount < user.skills.length) {
	    addSkillDiv();
	}
	for (var i = 0; i < user.skills.length; i++) {
	    $("#skill_" + (i+1)).val(user.skills[i].name);
	}
    }

    showRoles();

    if (user.sites != undefined) {
        while (siteCount < user.sites.length) {
            addSiteDiv();
        }
        for (var i = 0; i < user.sites.length; i++) {
            $("#site_title_" + (i+1)).val(user.sites[i].title);
	    $("#site_url_" + (i+1)).val(user.sites[i].siteURL);
        }
    }
}

function showUserIdeas() {
    $.getJSON('/ideas', function (ideas) {
	console.log(ideas);

	$.getJSON("/roles", function(roles) {

	    var userIdeas = [];
	    
	    if (ideas != null) {
		for (var i = 0; i < ideas.length; i++) {
		    if (ideas[i].creator == user._id) {
			userIdeas.push(ideas[i]);
		    }
		}
	    }

	    if (userIdeas.length > 0) {
		$("#idea_list").empty();

		for (var i = 0; i < userIdeas.length; i++) {
		    var ideaHTML = "";

		    ideaHTML += "<form><li class='idea_list_item' id='idea_"
			+ userIdeas[i]._id + "'><div class='form-group'>Title: <input type='text' class='form-control' id='title_"
			+ userIdeas[i]._id + "' placeholder='Title for the idea' value='" + userIdeas[i].title + "'></div>";

		    ideaHTML += '<div class="form-group">Status: <select id="status_' + userIdeas[i]._id + '" name="status" class="form-control">'

		    if (userIdeas[i].status == "Cat gold - Just idea") {
			ideaHTML += '<option selected>Cat gold - Just idea</option>';
		    }
		    else {
			ideaHTML += '<option>Cat gold - Just idea</option>';
		    }
		    if (userIdeas[i].status == "Gold - Under implementation") {
                        ideaHTML += '<option selected>Gold - Under implementation</option>';
                    }
                    else {
                        ideaHTML += '<option>Gold - Under implementation</option>';
                    }
		    if (userIdeas[i].status == "Platinium - Implemented") {
                        ideaHTML += '<option selected>Platinium - Implemented</option>';
                    }
                    else {
                        ideaHTML += '<option>Platinium - Implemented</option>';
                    }
		    if (userIdeas[i].status == "Diamond - Happy customers") {
                        ideaHTML += '<option selected>Diamond - Happy customers</option>';
                    }
                    else {
                        ideaHTML += '<option>Diamond - Happy customers</option>';
                    }
		    ideaHTML += '</select></div>';
		    

		    /*ideaHTML += "<p>Updated: "
			+ moment(ideas[i].updated).format('MMMM Do YYYY') + "</p><p>Status: "
			+ ideas[i].status + "</p>";*/
		    
		    ideaHTML += '<div class="form-group">Site: <input type="text" class="form-control" id="site_' + userIdeas[i]._id + '" placeholder="http://yourideasite.com/" value="' + userIdeas[i].site + '"></div>';
		    ideaHTML += '<div class="form-group">Development site: <input type="text" class="form-control" id="dev_site_' + userIdeas[i]._id + '" placeholder="http://githobby.com/your/project" value="' + (userIdeas[i].developmentSite != undefined ? userIdeas[i].developmentSite : "") + '"></div>';

		    ideaHTML += '<div class="form-group">Description: <textarea class="form-control" rows="10" id="description_' + userIdeas[i]._id + '" placeholder="Detailed description of the idea">' + userIdeas[i].description + '</textarea></div>'; 

		    ideaHTML += "<div class='form-group' id='roles_div_" + userIdeas[i]._id + "'><p>Needed volunteers for roles:</p><p><ul>";

		    for (var k = 0; k < roles.length; k++) {
			var html = '<label class="checkbox"><input type="checkbox" value="' + roles[k]._id + '" id="role_' + roles[k]._id + '_' + userIdeas[i]._id + '"'

			for (var j = 0; j < userIdeas[i].neededRoles.length; j++) {
			    if (userIdeas[i].neededRoles[j] == roles[k]._id) {
				html += " checked";
				break;
			    }
			}
			ideaHTML += html + ">" + roles[k].name + "</label>";
		    }

		    ideaHTML += "</ul></p></div>";

		    ideaHTML += '<div class="btn-group" role="group" aria-label="Idea actions">'
		    ideaHTML += "<a href='#' id='idea_save_button_" + userIdeas[i]._id + "' type='button' class='btn btn-primary'>Save Changes</button>";
		    ideaHTML += "<a href='/talents/" + userIdeas[i]._id + "' id='idea_volunteers_button_" + userIdeas[i]._id + "' type='button' class='btn btn-primary'>Find Volunteers</a>"
		    ideaHTML += '</div></form>';

		    $("#idea_list").append(ideaHTML);

		    
		    $("#idea_volunteers_button_" + userIdeas[i]._id).on('click', function(event) {
			// TODO	
			console.log(this.value);
                        console.log(event.target.id);
		    });			


		    $("#idea_save_button_" + userIdeas[i]._id).on('click', function(event) {
			console.log(this.value);
			console.log(event.target.id);
			event.preventDefault();

			var parts = event.target.id.split('_');
			var id = parts[parts.length - 1];

			var neededRoles = $("#roles_div_" + id + " input:checkbox:checked").map(function(){
			    return $(this).val();
			}).get();
			//console.log(neededRoles);

			var idea = {
			    _id: id,
			    title: $("#title_" + id).val(),
			    description: $("#description_" + id).val(),
			    status: $("#status_" + id).val(),
			    site: $("#site_" + id).val(),
			    developmentSite: $("#dev_site_" + id).val(),
			    neededRoles: neededRoles
			};

			console.log(idea);

			$.ajax({
			    url: '/idea/' + id,
			    type: 'POST',
			    data: JSON.stringify(idea),
			    contentType: 'application/json; charset=utf-8',
			    dataType: 'json'
			}).done(function(data) {
			    console.log("posted");
			    console.log(data);
			});
                    });
		}
	    }

	    if (window.location.hash == "#ideas") {
		//console.log("ideas");
		$('html, body').animate({
		    scrollTop: ($("#ideas").offset().top - 50)
		}, 50);
		event.preventDefault();
	    }
	});
    });
}

$( "#user_profile_skill_button" ).on('click', function(e) {
    console.log("Add skill button pressed");
    e.preventDefault();
    
    addSkillDiv();
});

function addSkillDiv() {
    skillCount++;
    var skillHTML = '<div class="row profile_div_form_list_item" id="div_skill_' + skillCount + '">';
    skillHTML += '<div class="col-md-12"><div class="profile_list_item_info">Skill</div> <input id="skill_' + skillCount + '" type="text" class="form-control" placeholder="Name of the skill"></div></div>';
    
    $('#div_skills').append(skillHTML);
}

$( "#user_profile_site_button" ).on('click', function(e) {
    console.log("Add site button pressed");
    e.preventDefault();
    addSiteDiv();
});

function addSiteDiv() {
    siteCount++;
    var siteHTML = '<div class="row profile_div_form_list_item" id="div_site_' + siteCount + '">';
    siteHTML += '<div class="col-md-5"><div class="profile_list_item_info">Title</div> <input id="site_title_' + siteCount + '" type="text" class="form-control" placeholder="Page title"></div><div class="col-md-7"><div class="profile_list_item_info">Web site address</div> <input id="site_url_' + siteCount + '" type="text" class="form-control" placeholder="http://www.example.org/people/me"></div></div>';
    $('#div_sites').append(siteHTML);
}

$( "#profile_save_button" ).on('click', function(e) {
    console.log("Save pressed");
    e.preventDefault();
    console.log($('#userRealName').val());
    console.log($('#userDescription').val());

    var availableVal = $('input[name=userAvailable]:checked').val();
    console.log(availableVal);
    var available = availableVal == "yes" ? true : false; 

    // Go through skill inputs and site inputs and add them to the profileInfo
    
    var $inputs = $('#profile_form :input');
    console.log($inputs);
    var skills = [];
    var siteValues = [];
    
    $inputs.each(function() {
	if (this.type != 'button') {
	    var idParts = this.id.split('_');
	    if (idParts[0] == 'skill' && $(this).val() != "") {
		skills.push({name: $(this).val(), level: -1 });
	    }
	    else if (idParts[0] == 'site' && $(this).val() != "") {
		//var key = idParts[1] + idParts[2];
		siteValues.push({ type: idParts[1], index: parseInt(idParts[2]) - 1, value:  $(this).val()});
	    }
	}
    });

    console.log(skills);
    console.log(siteValues);

    var interestingRoles = $("#div_profile_roles input:checkbox:checked").map(function(){
        return $(this).val();
    }).get();
    console.log(interestingRoles);

    var sites = [];
    for (var i = 0; i < siteValues.length / 2; i++) {
	sites.push({title: "", siteURL: ""});
    }
    
    for (var i = 0; i < siteValues.length; i++) {
	if (siteValues[i].type == "title") {
	    sites[siteValues[i].index].title = siteValues[i].value;
	}
	else {
	    sites[siteValues[i].index].siteURL = siteValues[i].value;
	}
    }

    console.log(sites);

    var profileInfo = {
	user_id: user._id,
	available: available,
	name: $('#userRealName').val() != "" ? $('#userRealName').val() : null,
	description: $('#userDescription').val() != "" ? $('#userDescription').val() : null,
	skills: skills,
	sites: sites,
	interestingRoles: interestingRoles
    }

    // Send data to server

    $.ajax({
	url: '/profile',
	type: 'POST',
	data: JSON.stringify(profileInfo),
	contentType: 'application/json; charset=utf-8',
	dataType: 'json'
    }).done(function(data) {
	console.log("posted");
        console.log(data);
    });

});
