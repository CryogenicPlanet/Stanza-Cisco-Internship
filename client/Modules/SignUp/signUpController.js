var app = angular.module("quickbooks");
app.controller('signupController', function($scope, $location, $timeout, userService, signUpService, searchService) {
    $scope.verify = function() {
        signUpService.verify($scope.code)
            .then(function(token) { // Promise Succesful
                $scope.verifyShow = false;
                $scope.followSearch = true;
            })
            .catch(function(error) { // Promise Unsuccesful
                // Show the whole page
                Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000); // Materialised Css

            });
    }
    $scope.signup = function() {

        if ($scope.sPword != $scope.sConfirmpword) {
            Materialize.toast('<p class = "flow-text">Error, the passwords do not match</p>', 4000);
        }
        else {
            signUpService.getSalt()
                .then(function(data) {
                    var shaObj = new jsSHA("SHA-512", "TEXT");
                    shaObj.setHMACKey(data.salt, "TEXT");
                    shaObj.update($scope.sPword);
                    var hmac = shaObj.getHMAC("HEX");
                    signUpService.signup($scope.sName, $scope.sEmail, hmac, data.salt)
                        .then(function(data) {
                            console.log(data); // Promise Succesful
                            Materialize.toast('<p class = "flow-text">' + data.message + '</p>', 4000);
                            $scope.verifyShow = true;
                            $scope.signUp = false;
                        })
                        .catch(function(error) { // Promise Unsuccesful
                            // Show the whole page
                            Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000); // Materialised CSS
                        });
                });

        }
    }

    this.initialize = function() { // Intitialization Function
        $scope.loading = true; // Scope Variable for loading
        $scope.signupPage = false; // Scope Variable For loginPage
        $scope.followResults = false;
        $scope.followSearch = false;
        $scope.signUp = false;
        $timeout(function() { // Timeout
            $scope.loading = false;
            $scope.signupPage = true;
            $scope.signUp = true;
            $scope.verifyShow = false;
        }, 3000);
    }
    this.initialize();
    $scope.endFollow = function() {
        $location.path("/");

    }
    $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
            var search = document.getElementById("search").value;
            searchService.getUser(search)
                .then(function(response) {
                    $scope.users = response;
                    $scope.followResults = true;
                    if ($scope.users.length == 0) {
                        $scope.noUsers = true;
                    }
                });

        }
    }
});
