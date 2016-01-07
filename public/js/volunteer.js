$(document).ready(function () {
    $('#volunteer').addClass("active");
});

$('.dropdown-menu a').on('click', function(event){
    console.log(event);
    console.log($(this).html());

    $('.dropdown-toggle').html($(this).html() + ' <span class="caret"></span>');
    $('#role_contents p').replaceWith("<p>Relevant content for the " + $(this).html() + " comes here</p>");

});
