
var skillCount = 0;
var siteCount = 0;

$(document).ready(function() {
    $('#user_nav').addClass("active");

    console.log(user);

    addSiteDiv();

    addSkillDiv();
    addSkillDiv();
    addSkillDiv();

    fillProfileInfo();

    getUserIdeas();
});

function fillProfileInfo() {
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

function getUserIdeas() {
    $.getJSON('/ideas', function (ideas) {
	console.log(ideas);

	var userIdeas = [];

	if (ideas != null) {
	    for (var i = 0; i < ideas.length; i++) {
		if (ideas[i].creator == user._id) {
		    userIdeas.push(ideas[i]);
		}
	    }
	}

	if (userIdeas.length > 0) {
	    var ideaListHTML = '';

	    for (var i = 0; i < userIdeas.length; i++) {
		ideaListHTML += '<li>' + userIdeas[i].title;
	    }
	    
	    $("#idea_list").empty();
	    $("#idea_list").append(ideaListHTML);
	}
    });
}

$( "#user_profile_skill_button" ).on('click', function() {
    console.log("Add skill button pressed");

    addSkillDiv();
});

function addSkillDiv() {
    skillCount++;
    var skillHTML = '<div class="row profile_div_form_list_item" id="div_skill_' + skillCount + '">';
    skillHTML += '<div class="col-md-12"><div class="profile_list_item_info">Skill</div> <input id="skill_' + skillCount + '" type="text" class="form-control" placeholder="Name of the skill"></div></div>';
    
    $('#div_skills').append(skillHTML);
}

$( "#user_profile_site_button" ).on('click', function() {
    console.log("Add site button pressed");

    addSiteDiv();
});

function addSiteDiv() {
    siteCount++;
    var siteHTML = '<div class="row profile_div_form_list_item" id="div_site_' + siteCount + '">';
    siteHTML += '<div class="col-md-5"><div class="profile_list_item_info">Title</div> <input id="site_title_' + siteCount + '" type="text" class="form-control" placeholder="Page title"></div><div class="col-md-7"><div class="profile_list_item_info">Web site address</div> <input id="site_url_' + siteCount + '" type="text" class="form-control" placeholder="http://www.example.org/people/me"></div></div>';
    $('#div_sites').append(siteHTML);
}

$( "#profile_save_button" ).on('click', function() {
    console.log("Save pressed");

    console.log($('#userRealName').val());
    console.log($('#userDescription').val());

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
	name: $('#userRealName').val() != "" ? $('#userRealName').val() : null,
	description: $('#userDescription').val() != "" ? $('#userDescription').val() : null,
	skills: skills,
	sites: sites
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
