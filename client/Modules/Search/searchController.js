var app = angular.module("quickbooks");
app.controller("searchController", function($scope, $location, $routeParams, searchService) {
    var search = $routeParams.search;
    $scope.initialize = function() {
        angular.element(document).ready(function() { //what is this?
            $(document).ready(function() {
                $('ul.tabs').tabs();
            });
        });
    }
    searchService.finalSearch(search)
        .then(function(response) {
            $scope.books = response.books;
            $scope.users = response.users;
            if($scope.users.length == 0){
                $scope.noUsers = true;
            }
            if($scope.books.length == 0){
                $scope.noBooks = true;
            }
            $scope.initialize();
        });
    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    }

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    }

    $scope.openBook = function(book) {
        $location.path("/books/" + book.item.title);
    }

    $scope.openUser = function(user) {
        $location.path("/username/" + user.UUID + "/" + user.Name);
    }
    $scope.initialize();
});
