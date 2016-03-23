$(document).ready(function () {
    $('#idea').addClass("active");
});

$( "#submit_button" ).on('click', function() {
    console.log("Submit pressed");
    
    console.log($("#title").val());
    console.log($("#description").val());
    //console.log($("#photo").val());
    console.log($("#site").val());
    console.log($("#status option:selected").val());
    //console.log($("#").val());
    //console.log($("#").val());
    //console.log($("#").val());
    console.log(user._id);

    var neededRoles = [];

    for (var i = 0; i < roles.length; i++) {
	if ($("#role_" + roles[i].short_name).is(':checked')) {
	    neededRoles.push($("#role_" + roles[i].short_name).val());
	}

	console.log($("#role_" + roles[i].short_name).is(':checked'));
	console.log($("#role_" + roles[i].short_name).val());
    }
    
    var idea = {
	title: $("#title").val(),
	description: $("#description").val(),
	status: $("#status option:selected").val(),
	site: $("#site").val(),
	user_id: user._id,
	neededRoles: neededRoles
    };

    $.post('/idea', idea, function (data) {
	console.log("posted");
	console.log(data);
    });
});
