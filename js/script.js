
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


    //load NY Times articles
    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytUrl += '?' + $.param({
      'api-key': "bc8fe802089b40a5a66c4ebb427cce69",
      'q': city,
      'sort': "newest",
      'fl': "web_url,headline,lead_paragraph"
    });

    $.getJSON(nytUrl, function (data) {
      var results = data.response.docs;
      for (var i = 0; i < results.length; i++) {
        var articleUrl = results[i].web_url;
        var headline = results[i].headline.main;
        var leadParagraph = results[i].lead_paragraph;

        var $articleLi = $('<li>', {
          "class": "article"
          });

        $('<a>', {
          href: articleUrl,
          text: headline,
          target: "_new"
          }).appendTo($articleLi);

        $('<p>', {
          text: leadParagraph
          }).appendTo($articleLi);

        $nytElem.append($articleLi);
      }
    })

    return false;
};

$('#form-container').submit(loadData);
