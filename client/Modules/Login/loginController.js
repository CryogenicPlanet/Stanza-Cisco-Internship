var app = angular.module("quickbooks");
app.controller('loginController', function($scope, $location, $timeout, userService, signUpService) { // Controller parameters $scope, $http, $location, $timeout From Angular Itself. userService and newBooksService are user defined Property
    this.initialize = function() { // Intitialization Function
        $scope.loading = true; // Scope Variable for loading
        $scope.loginPage = false; // Scope Variable For loginPage
        $timeout(function() { // Timeout
            $scope.loading = false;
            $scope.loginPage = true;
        }, 3000);
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
                    signUpService.signup($scope.sName, $scope.sEmail, hmac,data.salt)
                        .then(function(data) {
                            console.log(data); // Promise Succesful
                                Materialize.toast('<p class = "flow-text">' + data.message + '</p>', 4000);
                               $location("/signup")
                                
                            
                        })
                        .catch(function(error) { // Promise Unsuccesful
                            // Show the whole page
                            Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000); // Materialised CSS
                        });
                });

        }
    }
   

    $scope.login = function() { // Call Login
        userService.getSalt($scope.lEmail)
            .then(function(data) {
                var shaObj = new jsSHA("SHA-512", "TEXT");
                shaObj.setHMACKey(data.salt, "TEXT");
                shaObj.update($scope.lPassword);
                var hmac = shaObj.getHMAC("HEX");
                console.log(hmac);
                userService.login($scope.lEmail, hmac)
                    .then(function(token) { // Promise Succesful
                        $location.path("/");
                    })
                    .catch(function(error) { // Promise Unsuccesful
                        // Show the whole page
                        Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000); // Materialised Css

                    });
            });

    };
    this.initialize(); // Function called to Intitialize
});