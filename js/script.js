
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
    var streetviewUrl = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
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

    //load wikipedia links and first paragraphs
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&formatversion=2&prop=section=0&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
      $wikiHeader.text("Wikipedia Links Could Not be Loaded");
    }, 8000);

    $.ajax({
      url: wikiUrl,
      method: 'GET',
      dataType: 'jsonp',
    }).done(function(jsondata) {
      var articleList = jsondata[1];
      var firstParagraphs = jsondata[2];
      for (var i = 0; i < articleList.length; i++) {
        $wikiElem.append("<li><a href='https://en.wikipedia.org/wiki/" + articleList[i] + "' target='_new'>" + articleList[i] + "</a><p>" + firstParagraphs[i] + "</p></li>");
      }
      clearTimeout(wikiRequestTimeout);
    });

    /* Generate the custom Google Map for the website.
    See the documentation below for more details.
    https://developers.google.com/maps/documentation/javascript/reference
    */

    var map;    // declares a global map variable

    function initializeMap() {

      var mapOptions = {
        disableDefaultUI: true,
        scaleControl: true,
      };

      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      /*
      createMapMarker(placeData) reads Google Places search results to create map pins.
      placeData is the object returned from search results containing information
      about a single location.
      */
      function createMapMarker(placeData) {

        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.lat();  // latitude from the place service
        var lon = placeData.geometry.location.lng();  // longitude from the place service
        var name = placeData.formatted_address;   // name of the place from the place service
        var bounds = window.mapBounds;            // current boundaries of the map window

        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
          map: map,
          position: placeData.geometry.location,
          title: name
        });

        // infoWindows are the little helper windows that open when you click
        // or hover over a pin on a map. They usually contain more information
        // about a location.
        var infoWindow = new google.maps.InfoWindow({
          content: name + ": Latitude: " + lat +
          "<br>Longitude: " + lon
          });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map,marker);
        });

        // this is where the pin actually gets added to the map.
        // bounds.extend() takes in a map location object
        bounds.extend(new google.maps.LatLng(lat, lon));
        // fit the map to the new marker
        map.fitBounds(bounds);
        // center the map

        map.setCenter(bounds.getCenter());
      }

      /*
      callback(results, status) makes sure the search returned results for a location.
      If so, it creates a new map marker for that location.
      */
      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          createMapMarker(results[0]);
        }
      }

      /*
      pinPoster(location) takes city and fires off a Google place search
      */
      function pinPoster(city) {

        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
        var service = new google.maps.places.PlacesService(map);

          // Creates a search object for the city:

          // the search request object
          var request = {
            query: city
          };

          // Actually searches the Google Maps API for location data and runs the callback
          // function with the search results after each search.
          service.textSearch(request, callback);
        };

      // Sets the boundaries of the map based on pin locations
      window.mapBounds = new google.maps.LatLngBounds();

      // pinPoster(location) creates a pin on the map for the location
      pinPoster(location);
      //for just the city instead of the address, use city as the parameter
    }

    initializeMap();

    // Vanilla JS way to listen for resizing of the window
    // and adjust map bounds
    window.addEventListener('resize', function(e) {
      //Make sure the map bounds get updated on page resize
      map.fitBounds(mapBounds);
    });

    return false;
};

$('#form-container').submit(loadData);
