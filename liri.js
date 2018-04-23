
//Used to set variables
require("dotenv").config();

//Used to call twitter npm
var Twitter = require("twitter");

//Used to call Spotify npm
var Spotify = require("node-spotify-api");

//Used to call API Keys for twitter and spotify
var keys = require("./keys");

//Used to request npm pacakges
var request = require("request");

//Used to call fs npm for reading and writing to text files
var fs = require("fs");

//Setting up comman line keyword search with switch condition
var pick = function(dataSearch, Parameters) {
  switch (dataSearch) {
  case "my-tweets":
    twitterSearch();
    break;
  case "movie-this":
    movieSearch(Parameters);
    break;
  case "spotify-this-song":
    spotifySearch(Parameters);
    break;
  case "do-what-it-says":
    tellMeWhat();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

//Function To log to text file using fs npm
var logToText = function(data) {
  fs.appendFile("log.tx", JSON.stringify(data) + "\n" + function(err){
    if (err) {
      throw (err);
    } else {
      consolge.log("log.txt was updated, look at you go!")
    }
  });
};

//Creating function for Twitter search
var twitterSearch = function() {
  var twitterUser = new Twitter(keys.twitter);
  var params = { screen_name: "Coding1987" };
  twitterUser.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      var data = [];

      for (var i = 0; i < tweets.length; i++) {
        data.push({
          created_at: tweets[i].created_at,
          text: tweets[i].text
        });
      }
      //Writing data to text file and logging to the console
      console.log(data);
      logToText(data);
    }
  });
};

//Setting up the movie search function
var movieSearch = function(userMovieInput) {
  if (userMovieInput === undefined) {
    userMovieInput = "Mr Nobody";
  }

  var url = "http://www.omdbapi.com/?t=" + userMovieInput + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      var data = {
        "Title:": jsonData.Title,
        "Year:": jsonData.Year,
        "Rated:": jsonData.Rated,
        "IMDB Rating:": jsonData.imdbRating,
        "Country:": jsonData.Country,
        "Language:": jsonData.Language,
        "Plot:": jsonData.Plot,
        "Actors:": jsonData.Actors,
        "Rotten Tomatoes Rating:": jsonData.Ratings[1].Value
      };
      //Writing movie input to text file and the console
      console.log(data);
      logToText(data);
    }
  });
};

//Setting up artist name search to work with for loop
var artistArray = function(artist) {
  return artist.name;
};

//Setting up new spotify object with API Keys
var newSpotify = new Spotify(keys.spotify);

//Creating Spotify function
var spotifySearch = function(userSongSearch) {
  if (userSongSearch === undefined) {
    userSongSearch = "The Sign";
  }

  newSpotify.search({ type: "track", query: userSongSearch }, function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }

    var songs = data.tracks.items;
    var data = [];

    for (var i = 0; i < songs.length; i++) {
      data.push({
        "artist(s)": songs[i].artists.map(artistArray),
        "song name: ": songs[i].name,
        "preview song: ": songs[i].preview_url,
        "album: ": songs[i].album.name
      });
    }
    //Writing spotify songs to text file and console log
    console.log(data);
    logToText(data);
  });
};

//Creating do-what-it-says function
var tellMeWhat = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataLength = data.split(",");

    if (dataLength.length === 2) {
      pick(dataLength[0], dataLength[1]);
    }
    else if (dataLength.length === 1) {
      pick(dataLength[0]);
    }
  });
};

//Running the command line commands based of second and third index in node
doThisForMe(process.argv[2], process.argv[3]);

//Command line function that produces the correct argument
var doThisForMe = function(firstArgument, secondArgument) {
  pick(firstArgument, secondArgument);
};



