var app = angular.module("quickbooks");
app.controller('showBookController', function($scope, $location, $routeParams, addBookService) {
    this.initialize = function() {
        $scope.bookpage = false;
        $scope.bookloading = true;
    }
    var bookname = $routeParams.bookName;
    console.log(bookname);
    var data = {
        name: bookname
    }
    addBookService.getBookDetails(data)
        .then(function(bookdetails) {
            console.log(bookdetails);
            $scope.bookname = bookname;
            $scope.authorname = bookdetails[0].authorname;
            $scope.genrename = bookdetails[0].genrename;
            $scope.year = bookdetails[0].year;
            $scope.owners = bookdetails[0].owners;
            $scope.image - bookdetails[0].owners[0].image;
            console.log(bookdetails[0].owners[0].image);
            // $scope.authorbooks = authorbooks;
        }).finally(function() {
            $scope.bookloading = false;
            $scope.bookpage = true;
        });


    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    }

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    }
});