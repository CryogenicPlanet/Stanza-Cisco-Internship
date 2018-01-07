var app = angular.module("quickbooks");
app.controller('signupController', function($scope, $location,$timeout, userService, signUpService) {
    $scope.verify = function() {
        signUpService.verify($scope.code)
            .then(function(token) { // Promise Succesful
                $location.path("/");
            })
            .catch(function(error) { // Promise Unsuccesful
                // Show the whole page
                Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000); // Materialised Css

            });
    }
      this.initialize = function() { // Intitialization Function
        $scope.loading = true; // Scope Variable for loading
        $scope.signupPage = false; // Scope Variable For loginPage
        $timeout(function() { // Timeout
            $scope.loading = false;
            $scope.signupPage = true;
            $scope.verifyShow = true;
        }, 3000);
    }
    this.initialize();
});
