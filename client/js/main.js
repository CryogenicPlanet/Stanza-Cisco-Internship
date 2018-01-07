var app = angular.module("quickbooks", ["ngRoute", 'ui.materialize']); // Defining The Applications Quickbooks

// Route
app.config(function($routeProvider) { // Making the Router Provider
    $routeProvider
        .when("/login", { // Url Login
            templateUrl: "/Modules/Login/login.html", // Template Url  
            controller: "loginController" // Linked Controller
        })
        .when("/", {
            templateUrl: "/Modules/Homepage/homepage.html",
            controller: "homeController"
        })
        .when("/username/:userId/:username", {
            templateUrl: "/Modules/User/user.html",
            controller: "userController"
        })
        .when("/add", {
            templateUrl: "/Modules/addBook/addbook.html",
            controller: "addBookController"
        })
        .when("/authors/:authorId", {
            templateUrl: "/Modules/Author/authors.html",
            controller: "showAuthorController"
        })
        .when("/genres/:genreName", {
            templateUrl: "/Modules/Genre/genres.html",
            controller: "showGenreController"
        })
        .when("/books/:bookName", {
            templateUrl: "/Pages/books.html",
            controller: "showBookController"
        })
        .when("/signup",{
           templateUrl : "/Modules/SignUp/signup.html",
           controller : "signupController"
        });
});
app.controller('baseController', function($scope, userService) {

});

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

