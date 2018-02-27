var env = require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");

// Function to show my last 20 tweets.
function getMyTweets() {

	var twitter = require("twitter");

	// Passes Twitter keys into call to Twitter API.
	var twitter_keys = new twitter(keys.twitter);

	// Search parameters includes my tweets up to last 20 tweets;
	var params = {screen_name: '@ShraddhaBhatt99', count: 20};

	// Shows up to last 20 tweets and when created in terminal.
	twitter_keys.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	// Loops through tweets and prints out tweet text and creation date.
	  	var tweetoutput = "\n\n-------------------------------------------------------------------------"+"\n"+
	  	"                          Twitter                                        "+"\n"+
	  	"-------------------------------------------------------------------------"+"\n";
	  	for (var i = 0; i < tweets.length; i++) {
	  		var tweetCreationDate = tweets[i].created_at;
	  		tweetoutput += "Tweet Creation Date: " + tweetCreationDate+"\n";
	  		var tweetText = tweets[i].text;
	  		tweetoutput += (i+1)+" ) Tweet: " + tweetText+"\n";
	  		tweetoutput +="-------------------------------------------------------------------------"+"\n";
	   	}
	   	console.log(tweetoutput);
	   	log(tweetoutput);
	  }else{
	  	console.log(error);
	  }
 	});
}

function spotifyMySong(song) {

	var Spotify = require('node-spotify-api');

	var spotify = new Spotify(keys.spotify);
	
	song = (song || "The Sign");

	var spotifyoutput = "Please wait while I find '"+song+"' song.\n";

	spotify.search({ type: 'track', query: "track:" + song, limit: 2 })
	.then(function(response) {
		var foundSong = false;
		spotifyoutput+="\n\n-------------------------------------------------------------------------\n";
	  	spotifyoutput+="                          Spotify                                        \n";
	  	spotifyoutput+="-------------------------------------------------------------------------\n";
		for (var i = 0; i < response.tracks.items.length; i++) {
			if (response.tracks.items[i].name.toLowerCase() === song.toLowerCase()) {
				spotifyoutput+="I think I found the song you were looking for. Here's some information on it:\n";
				spotifyoutput+="-------------------------------------------------------------------------\n";
				if (response.tracks.items[i].artists.length > 0) {
					var artists = response.tracks.items[i].artists.length > 1 ? "  Artists: " : "  Artist: ";
					for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
						artists += response.tracks.items[i].artists[j].name;
						if (j < response.tracks.items[i].artists.length - 1) {
							artists += ", ";
						}
					}
					spotifyoutput+=artists+"\n";
				}
				spotifyoutput+="  Song: " + response.tracks.items[i].name+"\n";
				spotifyoutput+="  Album: " + response.tracks.items[i].album.name+"\n";
				spotifyoutput+=response.tracks.items[i].preview_url ? "  Preview: " + response.tracks.items[i].preview_url : "  No Preview Available"+"\n";
				spotifyoutput+="-------------------------------------------------------------------------\n";
				foundSong = true;
				break;
			}
		}
		if (!foundSong) {
			spotifyoutput+="I'm Sorry, I couldn't find any songs called '" + song + "' on Spotify.\n";
			spotifyoutput+="-------------------------------------------------------------------------\n";
		}
		console.log(spotifyoutput);
		log(spotifyoutput);
	})
	.catch(function(err) {
	    console.log("I'm sorry, but I seem to have run into an error.\n  " + err);
	    console.log("-------------------------------------------------------------------------");
	});
};

function movieInfo(moviename){

	// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
	var request = require("request");

	moviename = moviename || "Mr. Nobody";

	var movieoutput="\n\n-------------------------------------------------------------------------\n";
	movieoutput+="                          Movie Time                                     \n";
	movieoutput+="-------------------------------------------------------------------------\n";

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + moviename + "&y=&plot=short&apikey=trilogy";

	request(queryUrl, function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {
	  	var movie = JSON.parse(body);
	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    movieoutput+="\n\tTitle: " + movie.Title+"\n\n";
	    movieoutput+="\tThe movie's was in year: " + movie.Year+"\n\n";
	    movieoutput+="\tIMDB Rating: " + movie.imdbRating+"\n\n";
	    movieoutput+="\tRotten Tomatoes: " + movie.Ratings[1].Value+"\n\n";
	    movieoutput+="\tCountry: " + movie.Country+"\n\n";
	    movieoutput+="\tLanguage: " + movie.Language+"\n\n";
	    movieoutput+="\tPlot: " + movie.Plot+"\n\n";
	    movieoutput+="\tActors: " + movie.Actors+"\n\n";
	    movieoutput+="-------------------------------------------------------------------------"+"\n";
	  }
	  console.log(movieoutput);
	  log(movieoutput);

	});
	
}

function parseFileCommand() {
	var doitoutput="-------------------------------------------------------------------------\n";
	doitoutput+="                          Do What It Says                                \n";
	doitoutput+="-------------------------------------------------------------------------\n";
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return doitoutput+="I'm sorry, but I seem to have run into an error.\n  " + error;
		}
		var dataArr = data.split(",");
		parseCommand(dataArr[0], dataArr[1].replace(/"/g, ""));
	});
	console.log(doitoutput);
	log(doitoutput);
};

var arg = "";

for (var i = 3; i < process.argv.length; i++) {
	arg += process.argv[i];
	if (i < process.argv.length - 1) {
		arg += " ";
	}
};

parseCommand(process.argv[2], arg);

function parseCommand(command, arg) {
	switch (command) {

	case "my-tweets":
		getMyTweets();
		break;

	case "spotify-this-song":
		spotifyMySong(arg);
		break;

	case "movie-this":
		movieInfo(arg);
		break;

	case "do-what-it-says":
		parseFileCommand();
		break;

	case undefined:
	case "":
		console.log("Did you say something? I couldn't quite hear. Try talking a bit louder.");
		break;

	default:
		console.log("I'm sorry, but I'm not sure what you mean by that. Are you sure that was a valid command?");
		break;

	}
};

function log(loginfo) {
	 
	 fs.appendFile("log.txt", loginfo, (error) => {
	    
	    if(error) {
	      throw error;
	    }
	});
}
