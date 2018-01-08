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
    this.initialize = function() { // Intitialization Function
        $scope.loading = true; // Scope Variable for loading
        $scope.signupPage = false; // Scope Variable For loginPage
        $scope.followResults = false;
        $scope.followSearch = false;
        $timeout(function() { // Timeout
            $scope.loading = false;
            $scope.signupPage = true;
            $scope.verifyShow = true;
        }, 3000);
    }
    this.initialize();
    $scope.endFollow = function () {
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
