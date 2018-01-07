var app = angular.module("quickbooks");
app.controller("searchController", function($scope, $routeParams, searchService) {
    var search = $routeParams.search;
    searchService.finalSearch(search)
        .then(function(response) {
            $scope.books = response;
        });
});
