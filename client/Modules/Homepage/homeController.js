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
                    $scope.books = responses;
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

    $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
            searchService.finalSearch($scope.search)
                .then(function(response) {
                    $scope.searchPage = true;
                    $scope.showBooks = false;
                    $scope.view = "search";
                    var books = searchService.getResponses();
                    $scope.books = books;
                });
        }
    }

    $scope.openMineModal = function() {
        $('#modal1').modal('open');
    }
    $scope.openOtherModal = function() {
        $('#modal2').modal('open');
    }
    $scope.openBorrowedModal = function() {
        $('#modal3').modal('open');
    }
    $scope.openLentModal = function() {
        $('#modal4').modal('open');
    }


    $scope.getUserRequests = function() {
        requestsService.getRequests()
            .then(function(requests) {
                $scope.requests = requests;
                for (let request of requests) {
                    $scope.expelreplyid(request.URID);
                }
                if (requests.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You have no book <br> requests!!</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    $scope.getSentRequests = function() {
        requestsService.getSentRequests()
            .then(function(sentrequests) {
                $scope.sentrequests = sentrequests;
                if (sentrequests.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You have not sent any book <br> requests!!</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    var replyarr = [];
    $scope.ReplyUserRequests = function(response, relatedRequest) {
        var data = {
            response: response,
            request: relatedRequest
        }
        requestsService.addResponse(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                replyarr.push(relatedRequest.URID);
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">Sorry, your request to reply failed' + error.data.message + '</p>', 2000);
            });
    }

    $scope.replysuccess = function(id) {
        if (replyarr.indexOf(id) != -1)
            return true;
        else
            return false;
    }

    $scope.expelreplyid = function(id) {
        if (replyarr.indexOf(id) != -1)
            replyarr.splice(replyarr.indexOf(id));
    }

    $scope.getBorrowedBooks = function() {
        borrowedBooksService.getBorrowedBooks()
            .then(function(borrowedbooks) {
                $scope.borrowedbooks = borrowedbooks;
                for (let borrowedbook of borrowedbooks) {
                    $scope.expelreturnid(borrowedbook.UBOID);
                }
                if (borrowedbooks.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You have no borrowed books</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    var returnarr = [];
    $scope.returnBorrowedBook = function(book) { //relreq = related requests
        var data = {
            borrowedBook: book
        }
        borrowedBooksService.returnBorrowedBook(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                returnarr.push(book.UBOID);
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }

    $scope.returnreqsuccess = function(id) {
        if (returnarr.indexOf(id) != -1)
            return true;
        else
            return false;
    }

    $scope.expelreturnid = function(id) {
        if (returnarr.indexOf(id) != -1)
            returnarr.splice(returnarr.indexOf(id));
    }


    $scope.getLentBooksStatus = function() {
        borrowedBooksService.getLentBooksStatus()
            .then(function(lentbooks) {
                $scope.lentbooks = lentbooks;
                for (let lentbook of lentbooks) {
                    $scope.expeltakebackid(lentbook.UBOID);
                }
                if (lentbooks.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You haven\'t lent any books</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    var takebackarr = [];
    $scope.takeBackBook = function(book) {
        var data = {
            lentbook: book
        }
        borrowedBooksService.takeBackBorrowedBook(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                takebackarr.push(book.UBOID);
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }

    $scope.takebacksuccess = function(id) {
        if (takebackarr.indexOf(id) != -1)
            return true;
        else
            return false;
    }

    $scope.expeltakebackid = function(id) {
        if (takebackarr.indexOf(id) != -1)
            takebackarr.splice(takebackarr.indexOf(id));
    }


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