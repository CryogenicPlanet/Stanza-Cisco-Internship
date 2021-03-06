var app = angular.module("quickbooks");
app.controller("searchController", function($scope, $location, $routeParams, searchService,followService) {
    var search = $routeParams.search;
    $scope.initialize = function() {
        angular.element(document).ready(function() { //what is this?
            $(document).ready(function() {
                $('ul.tabs').tabs();
            });
        });
        $scope.followed = [];
    }
    $scope.follow = function(user) {
        var uuid = user.UUID;
        if ($scope.followed[uuid] != true) {
            followService.follow(uuid)
                .then(function(data) {
                    $scope.followed[uuid] = true;
                });
        }
        else {
            followService.unfollow(uuid)
                .then(function(data) {
                    $scope.followed[uuid] = false;
                });
        }
    }
    searchService.finalSearch(search)
        .then(function(response) {
            $scope.books = response.books;
            $scope.users = response.users;
            if ($scope.users.length == 0) {
                $scope.noUsers = true;
            }
            if ($scope.books.length == 0) {
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
