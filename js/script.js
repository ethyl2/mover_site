
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $('#street').val();
    var city = $('#city').val();

    console.log(street, city);
    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
    //streetviewUrl += street +", ";
    //streetviewUrl += city;
    streetviewUrl += encodeURIComponent(street + "," + city);
    console.log(streetviewUrl);
    var imgString = '<img class="bgimg" alt="Google street view of location" src=' + streetviewUrl + '>';

    $body.prepend(imgString);

    return false;
};

$('#form-container').submit(loadData);
