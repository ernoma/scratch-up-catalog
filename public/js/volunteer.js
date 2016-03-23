$(document).ready(function () {
    $('#volunteer').addClass("active");
});

$( "#role_select" ).on('change', function(event) {
    console.log(this.value);
    console.log(event);
    //console.log($(this).html());

    //$('.dropdown-toggle').html(this.value + ' <span class="caret"></span>');
    $('#role_contents p').replaceWith("<p>Relevant content for the " + this.value + " comes here</p>");
});

