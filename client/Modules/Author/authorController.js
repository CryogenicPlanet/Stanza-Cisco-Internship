
var app = angular.module("quickbooks");
app.controller('showAuthorController', function($scope, $location, $routeParams, showAuthorService) {
    this.initialize = function() {
        $scope.authorpage = false;
        $scope.authorloading = true;
    }
    var authorId = $routeParams.authorId;
    showAuthorService.getResponses(authorId).then(function(authorbooks) {
        $scope.authorName = authorbooks[0].author.Name;
        $scope.authorbooks = authorbooks;
    }).finally(function() {
        $scope.authorloading = false;
        $scope.authorpage = true;
    });

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    }

});