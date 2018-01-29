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
            templateUrl: "/Modules/Books/books.html",
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
app.controller('baseController', function($scope, $location,$route, newBooksService, borrowService, userService, searchService, requestsService, borrowedBooksService) {
    var uuid, name;
    $scope.side_mine_selected;
    $scope.side_user_selected;
    $scope.side_borrow_selected;
    $scope.side_lent_selected;
    $scope.token = userService.getToken();
    $scope.navready = false;
    // console.log($scope.token);
    $scope.$on('$routeChangeStart', function($event, next, current) {
        // ... you could trigger something here ...
        //console.log("Triggered")
        $scope.token = userService.getToken();
    });
    this.initialize = function() {
        userService.getDetails();
        uuid = userService.getUuid();
        name = userService.getUsername();
        $scope.name = name;
        $scope.email = userService.getEmail();
        $scope.picture = userService.getPicture();
        angular.element(document).ready(function() {
            $('.button-collapse').sideNav({
                menuWidth: 300, // Default is 300
                edge: 'right', // Choose the horizontal origin
                closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                draggable: false, // Choose whether you can drag to open on touch screens,
                onOpen: function(el) {
                    /* Do Stuff */
                }, // A function to be called when sideNav is opened
                onClose: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is closed
            });
        });
        $scope.navready = true;
    }
    $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
            console.log($scope.toSearch);
            var search = document.getElementById("search").value;
            $location.path(`/search/${search}`);
        }
    }
    $scope.openUser = function() {
        // console.log(uuid + name);
        $location.path("/username/" + uuid + "/" + name);
    }
    $scope.addBook = function() {
        $location.path("/add");
    }
    $scope.openMineModal = function() {
        //  $('#modal1').modal('open');
        //  $('.button-collapse').sideNav('show');
    }
    $scope.openOtherModal = function() {
        //$('#modal2').modal('open');
    }
    $scope.openBorrowedModal = function() {
        $('#modal3').modal('open');
    }
    $scope.openLentModal = function() {
        $('#modal4').modal('open');
    }
    $scope.logout = function() {
        localStorage.clear();
        sessionStorage.clear();
        Materialize.toast('<p class="flow-text red-text">' + "You have been logged out" + '</p>', 2000);
        var path = $location.path();
        if (path != "/"){
             $location.path("/");
        } else {
            $route.reload();
        }
       
        
    }
    $scope.getUserRequests = function() {
        requestsService.getRequests()
            .then(function(requests) {
                $scope.requests = requests;
                for (let request of requests) {
                    $scope.expelreplyid(request.URID);
                }
                if (requests.length == 0) {
                    //Materialize.toast('<p class="flow-text green-text">You have no book <br> requests!!</p>', 2000);
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
                    //Materialize.toast('<p class="flow-text green-text">You have not sent any book <br> requests!!</p>', 2000);
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
                console.log(borrowedbooks);
                for (let borrowedbook of borrowedbooks) {
                    $scope.expelreturnid(borrowedbook.UBOID);
                }
                if (borrowedbooks.length == 0) {
                    // Materialize.toast('<p class="flow-text green-text">You have no borrowed books</p>', 2000);
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
                    // Materialize.toast('<p class="flow-text green-text">You haven\'t lent any books</p>', 2000);
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
