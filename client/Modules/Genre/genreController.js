var app = angular.module("quickbooks");
app.controller('showGenreController', function($scope, $location, $routeParams, showGenreService) {
    this.initialize = function() {
        $scope.genrepage = false;
        $scope.genreloading = true;
    }
    var genreName = $routeParams.genreName;
    showGenreService.getResponses(genreName)
        .then(function(genrebooks) {
            $scope.genreName = $routeParams.genreName;
            $scope.genrebooks = genrebooks;
        }).finally(function() {
            $scope.genreloading = false;
            $scope.genrepage = true;
        });

    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    }
});