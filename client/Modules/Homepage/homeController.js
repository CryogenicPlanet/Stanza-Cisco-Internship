var app = angular.module("quickbooks");
app.controller('homeController', function($scope, $location, newBooksService, borrowService, userService, searchService, requestsService, borrowedBooksService) {
    $scope.homepage = false;
    $scope.openUser = function(user) {
        $location.path("/username/" + user.uuid + "/" + user.name);
    }
    $scope.addBook = function() {
        $location.path("/add");
    }

    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    }

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    }
    $scope.openBook = function(book) {
        $location.path("/books/" + book.bookname);
    }

    $scope.openUser = function(username) {
        $location.path("/username/" + userService.getUuid() + "/" + userService.getUsername());
    }

    $scope.initialize = function() { // Function Defined here
        var token = userService.getToken();
        $scope.loading = true;
        $scope.page = false;
        if (token) {
            $scope.homepage = true;
            newBooksService.get()
                .then(function(responses) {
                    $scope.view = "books";
                    var rows = [];
                    for(var x = 0;x< responses.length;){
                      var books = [];
                      books.push(responses[x]);
                      books.push(responses[x+1]);
                      x = x+2;
                      rows.push(books);
                    }
                    console.log(rows);
                    $scope.books = rows;
                    $scope.page = true;
                    $scope.loading = false;
                    $(document).ready(function() {
                        $('.tooltipped').tooltip({ delay: 50 });
                        $('.dropdown-button').dropdown({
                            inDuration: 300,
                            outDuration: 225,
                            constrainWidth: false, // Does not change width of dropdown to that of the activator
                            hover: false, // Activate on hover
                            gutter: 10, // Spacing from edge
                            belowOrigin: true, // Displays dropdown below the button
                            alignment: 'left', // Displays dropdown with edge aligned to the left of button
                            stopPropagation: false // Stops event propagation
                        });
                        $('.modal').modal({
                            dismissible: true, // Modal can be dismissed by clicking outside of the modal
                            opacity: 1, // Opacity of modal background
                            inDuration: 300, // Transition in duration
                            outDuration: 200, // Transition out duration
                            startingTop: '4%', // Starting top style attribute
                            endingTop: '10%', // Ending top style attribute
                            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                                console.log(modal, trigger);
                            },
                            complete: function() {} // Callback for Modal close
                        });
                    });
                });
        }
        else {
            $location.path("/login");
        }

    };
    $scope.borrow = function(book) {
        borrowService.borrow(book.uuid, book.ubid)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response.data.message + '</p>', 2000);

            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    };
    //Here
    $scope.initialize();
});