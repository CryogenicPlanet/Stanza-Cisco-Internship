var app = angular.module("quickbooks");
app.controller('userController', function($scope, $location, $routeParams, userService, featuredBooksService, profileService, followService, borrowService) {
    $scope.userPage = false;
    $scope.userloading = true;
    var userID = -1;
    $scope.followed;
    $scope.follow = function() {
        let user = $routeParams.userId;
        if ($scope.followed == false) {
            followService.follow(user)
                .then(function(data) {
                    $scope.followed = true;
                });
            profileService.getDetails(user, userService.getToken())
                .then(function(details) {
                    $scope.profilePicture = details.response.user.Picture;
                    $scope.name = details.response.user.Name;
                    $scope.books = details.response.books;
                    $scope.following = details.response.following;
                    $scope.followers = details.response.followers;
                });
        }
        else {
            followService.unfollow(user)
                .then(function(data) {
                    $scope.followed = false;
                });
            profileService.getDetails(user, userService.getToken())
                .then(function(details) {
                    $scope.profilePicture = details.response.user.Picture;
                    $scope.name = details.response.user.Name;
                    $scope.books = details.response.books;
                    $scope.following = details.response.following;
                    $scope.followers = details.response.followers;
                });
        }
    }
    $scope.borrow = function(book) {
        console.log(book);
        borrowService.borrow(userID, book.ubid)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response.data.message + '</p>', 2000);

            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }

    $scope.getFeaturedBooks = function() {
        if ($scope.isMe == true) {
            userService.updateBooks()
                .then(function(books) {
                    console.log(books)
                    $scope.books = books
                });
        }
        else {
            profileService.getDetails(userID, userService.getToken())
                .then(function(details) {
                    $scope.profilePicture = details.response.user.Picture;
                    $scope.name = details.response.user.Name;
                    $scope.books = details.response.books;
                    $scope.following = details.response.following;
                    $scope.followers = details.response.followers;
                });
            followService.followed(userID)
                .then(function(response) {
                    $scope.followed = response.status;
                });
        }
        featuredBooksService.getBooks(userID) // NAME
            .then(function(featuredbooks) {
                if (featuredbooks.length == 0) {
                    $scope.featured = 0;

                }
                else {
                    $scope.featured = featuredbooks.length;
                }
                if (featuredbooks.length > 3) {
                    var temparr = [];
                    var temparr2 = [];
                    for (let iter = 0; iter < featuredbooks.length; iter++) {
                        if (iter < 3) {
                            temparr.push(featuredbooks[iter]);
                        }
                        else if (iter < featuredbooks.length) {
                            temparr2.push(featuredbooks[iter]);
                        }
                    }
                    $scope.firsthalffeaturedbooks = temparr;
                    $scope.lasthalffeaturedbooks = temparr2;
                }
                else {
                    $scope.featuredbooks = featuredbooks;
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            })
            .finally(function() {

            });
    }
    $scope.addFeaturedBooks = function(book) {
        var data = {
            featuredbook: book
        }
        featuredBooksService.addFeaturedBooks(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                $scope.getFeaturedBooks();
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }
    $scope.removeFeaturedBooks = function(book) {
        var data = {
            featuredbook: book
        }
        featuredBooksService.removeFeaturedBooks(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                $scope.getFeaturedBooks();

            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }
    $scope.initialize = function() {
        //Page
        let user = $routeParams.userId;
        if (user == userService.getUuid()) {
            $scope.profilePicture = userService.getPicture();
            $scope.name = userService.getUsername();
            $scope.books = userService.getBooks();
            $scope.following = userService.getFollowing();
            $scope.followers = userService.getFollowers();
            $scope.isMe = true;
        }
        else {
            $scope.isMe = false;
            userID = user;
            profileService.getDetails(userID, userService.getToken())
                .then(function(details) {
                    $scope.profilePicture = details.response.user.Picture;
                    $scope.name = details.response.user.Name;
                    $scope.books = details.response.books;
                    $scope.following = details.response.following;
                    $scope.followers = details.response.followers;
                });
            followService.followed(userID)
                .then(function(response) {
                    $scope.followed = response.status;
                });
        }
        $scope.getFeaturedBooks();
    }
    if (!(userService.getBooks())) {
        userService.getDetails()
            .then(function(data) {
                $scope.initialize();
            })
            .finally(function(data) {
                $scope.userloading = false;
                $scope.userPage = true;
                angular.element(document).ready(function() { //what is this?
                    $(document).ready(function() {
                        $('ul.tabs').tabs();
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
            });
    }
    else {
        $scope.initialize();
        $scope.userloading = false;
        $scope.userPage = true;
        $scope.getFeaturedBooks();
        angular.element(document).ready(function() { //what is this?
            $(document).ready(function() {
                $('ul.tabs').tabs();
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

    $scope.openModal = function(book, isFeatured) {
        $scope.modalfeatured = isFeatured;
        $scope.modalbook = book;
        $('#modal').modal('open');
    };

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    };


    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    };
    $scope.openUser = function(user) {
        $location.path("/username/" + user.uuid + "/" + user.name);
    };
});
