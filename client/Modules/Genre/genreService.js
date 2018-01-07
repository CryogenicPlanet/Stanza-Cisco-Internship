var app = angular.module("quickbooks");
app.service('showGenreService', function($http) {
    var genrebooks = [];
    genrebooks.getResponses = function(genreName) {
        return $http({
            method: "GET",
            url: `./showGenre?genre=${genreName}`, 
            //Books is variable which is passed to the function. also you can pass it to that url it will be a different url with author id not the name  
            headers: { 'Content-Type': 'application/json' },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            console.log(responses.data.books);
            return responses.data.books;
        });
    }
    return genrebooks;
});