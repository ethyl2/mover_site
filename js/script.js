
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $bgImg = $('.bgimg');

    // clear out old data before new request
    $bgImg.remove();
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var location = street + ", " + city;
    $greeting.text("So, you want to live at " + location + "?");
    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
    streetviewUrl += encodeURIComponent(location);
    var imgString = '<img class="bgimg" alt="Google street view of ' + location + '" src=' + streetviewUrl + '>';
    $body.prepend(imgString);

    return false;
};

$('#form-container').submit(loadData);
