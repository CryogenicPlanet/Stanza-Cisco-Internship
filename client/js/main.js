var app = angular.module("quickbooks", ["ngRoute", 'ui.materialize']); // Defining The Applications Quickbooks

// Route
app.config(function($routeProvider) { // Making the Router Provider
    $routeProvider
        .when("/login", { // Url Login
            templateUrl: "/Modules/Login/login.html", // Template Url  
            controller: "loginController" // Linked Controller
            //  resolve: { activetab: "login" }
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
            controller: "showAuthorController",

        })
        .when("/genres/:genreName", {
            templateUrl: "/Modules/Genre/genres.html",
            controller: "showGenreController"

        })
        .when("/books/:bookName", {
            templateUrl: "/Pages/books.html",
            controller: "showBookController"
        })
        .when("/signup", {
            templateUrl: "/Modules/SignUp/signup.html",
            controller: "signupController"
        })
        .when("/search/:search", {
            templateUrl: "/Modules/Search/search.html",
            controller: "searchController"
        });
});
app.controller('baseController', function($scope, $location, newBooksService, borrowService, userService, searchService, requestsService, borrowedBooksService) {
    var uuid, name;
    $scope.token = userService.getToken();
    console.log($scope.token);
    $scope.$on('$routeChangeStart', function($event, next, current) {
        // ... you could trigger something here ...
        console.log("Triggered")
        $scope.token = userService.getToken();
    });
    this.initialize = function() {
        userService.getDetails();
        uuid = userService.getUuid();
        name = userService.getUsername();
    }
    $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
            $location.path(`/search/${$scope.search}`);
        }
    }
    $scope.openUser = function() {
        // console.log(uuid + name);
        $location.path("/username/" + uuid + "/" + name);
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
    this.initialize();
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
