var app = angular.module("quickbooks");
app.service('followService', function($http, userService) {
    var followService = [];
    followService.follow = function(user) {
        var data = { user: user }
        return $http({ // Returning the function of http to the previous function login()
            method: "POST", // Type POST
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
            data: JSON.stringify(data), // Data here
            cache: true, // Cache
            url: "./follow" // Url
        });
    }
    followService.unfollow = function(user) {
        var data = { user: user }
        return $http({ // Returning the function of http to the previous function login()
            method: "POST", // Type POST
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
            data: JSON.stringify(data), // Data here
            cache: true, // Cache
            url: "./unfollow" // Url
        });
    }
    followService.followed = function(user) {
        var data = { user: user }
        console.log(data);
        return $http({ // Returning the function of http to the previous function login()
            method: "POST", // Type POST
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
            data: JSON.stringify(data), // Data here
            cache: true, // Cache
            url: "./followed" // Url
        }).then(function(response) {
            return response.data
        });
    }
    return followService
});
