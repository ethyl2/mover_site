
function loadData() {

    var $body = $('body');
    var $wikiHeader = $('#wikipedia-header');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $bgImg = $('.bgimg');

    // Capitalizes first letter of each word
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    // clear out old data before new request
    $bgImg.remove();
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var location = street + ", " + city.capitalize();
    $greeting.text("So, you want to live at " + location + "?");
    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
    streetviewUrl += encodeURIComponent(location);
    var imgString = '<img class="bgimg" alt="Google street view of ' + location + '" src=' + streetviewUrl + '>';
    $body.prepend(imgString);

    // Prep the city variable for better results from NY Times:

    // This function takes a state abbreviation and returns the corresponding
    // full state name. It is modified from
    // https://gist.github.com/CalebGrove/c285a9510948b633aa47

    function nameState(input){

        var states = [
            ['Arizona', 'AZ'],
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['Arizona', 'AZ'],
            ['Arkansas', 'AR'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY'],
        ];

        if (input.length == 2){
            input = input.toUpperCase();
            for(i = 0; i < states.length; i++){
                if(states[i][1] == input){
                    return(states[i][0]);
                }
            }
        }
    }

    // 1. Select the state component of the city string.
    if (city.indexOf(',') > -1) {
      var afterComma = city.substr(city.indexOf(",") + 1).replace(/\s+/g, '');
      var beforeComma = city.substr(0, city.indexOf(',') + 1);
      // 2. If the resulting string has 2 characters, assume it is a state
      // abbreviation and convert it to a full state name.
      if (afterComma.length == 2) {
          var stateName = nameState(afterComma);
          // 3. Combine the city name with the full state name.
          city = beforeComma + ' ' + stateName;
      }
    }

    //load NY Times articles
    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytUrl += '?' + $.param({
      'api-key': "bc8fe802089b40a5a66c4ebb427cce69",
      'q': city,
      'sort': "newest",
      'fl': "web_url,headline,lead_paragraph"
    });

    $.getJSON(nytUrl, function (data) {

      $nytHeaderElem.text('New York Times Articles About ' + city.capitalize());
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
    }).fail(function() {
    $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    //load wikipedia links
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&formatversion=2&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
      $wikiHeader.text("Wikipedia Links Could Not be Loaded");
    }, 8000);

    $.ajax({
      url: wikiUrl,
      method: 'GET',
      dataType: 'jsonp',
      success: function(jsondata) {
        console.log(jsondata);
        var articleList = jsondata[1];
        for (var i = 0; i < articleList.length; i++) {
          $wikiElem.append("<li><a href='http://en.wikipedia.org/wiki/" + articleList[i] + "' target='_new'>" + articleList[i] + "</a></li>");
        }
        clearTimeout(wikiRequestTimeout);
    }
    });

    return false;
};

$('#form-container').submit(loadData);
