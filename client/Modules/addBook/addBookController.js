var app = angular.module("quickbooks");
app.controller('addBookController', function($scope, userService, addBookService) {
    var data = {}; //what does this do?
    var isNew = false;
    angular.element(document).ready(function() {
        $('select').material_select();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: true // Close upon selecting a date,
        });
        $(document).ready(function() {
            $('input#year').characterCounter();
        });


    });
    $scope.bookSearch = function(keyEvent) {
        var searchBook = document.getElementById("book").value;
        if (searchBook.length >= 2) {
            $scope.book = true;
            $scope.loading = true;
            addBookService.getBooks(searchBook)
                .then(function(response) {
                    $scope.books = response;
                    $scope.listBooks = true
                })
                .catch(function(err) {
                    $scope.cardMsg = "This book is unavailable";
                    $scope.newBook = true;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }
    }
    $scope.authorSearch = function(keyEvent) {
        var searchAuthor = document.getElementById("author").value;
        if (searchAuthor.length > 2) {
            $scope.author = true;
            $scope.loadingAuthor = true;
            addBookService.getAuthors(searchAuthor)
                .then(function(response) {
                    $scope.authors = response.data;
                    $scope.listAuthors = true;
                })
                .catch(function(err) {
                    $scope.cardAuthorMsg = "This author is not there in the database";
                })
                .finally(function() {
                    $scope.loadingAuthor = false;
                });
        }
    }
    $scope.genreSearch = function(keyEvent) {
        var searchGenre = document.getElementById("genre").value;
        if (searchGenre.length > 2) {
            $scope.genre = true;
            $scope.loadingGenre = true;
            addBookService.getGenre(searchGenre)
                .then(function(response) {
                    $scope.genres = response.data;
                    $scope.listGenre = true;
                })
                .catch(function(err) {
                    $scope.cardGenreMsg = "This genre is not there in the database";
                })
                .finally(function() {
                    $scope.loadingGenre = false;
                });
        }
    }
    var newBookRadio = document.getElementById("newBook"); //why newBookRadio
    $scope.newBookClick = function() {
        data.name = document.getElementById("book").value;
        console.log("New book");
        isNew = true;
        document.getElementById("book").disabled = true;
        $scope.book = false;
        $scope.newBook = true;
    }
    $scope.newAuthorClick = function() {
        data.author = document.getElementById("author").value;
        document.getElementById("author").disabled = true;
        $scope.author = false;
    }
    $scope.newGenreClick = function() {
        data.genre = document.getElementById("genre").value
        document.getElementById("genre").disabled = true;
        $scope.genre = false;
    }
    $scope.addBook = function() {
        console.log("In Function");
        if (isNew === false) {
            var ubid = $("input[name=books]:checked").val();
            var data = {
                ubid: ubid,
                description: document.getElementById("description").value
            }
            addBookService.addBook(data);
        }
        else {
            data.year = document.getElementById("year").value;
            if (!($("input[name=authors]:checked").val() == 'undefined')) {
                var uaid = $("input[name=authors]:checked").val();
                data.uaid = uaid;
            }
            if (!($("input[name=genres]:checked").val() == 'undefined')) {
                var ugid = $("input[name=genres]:checked").val();
                data.ugid = ugid;
            }
            addBookService.addBook(data);
        }
    }
});