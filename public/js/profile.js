
$(document).ready(function() {
    $('#user_nav').addClass("active");

    console.log(user);
    console.log(userRole);
    console.log(roles);
});

$( "#role_select" ).on('change', function() {
    console.log(this.value);
});

$( "#role_save_button" ).on('click', function() {
    console.log("Save pressed");
    
});
