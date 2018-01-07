var app = angular.module("quickbooks");
app.service('requestsService', function($http, userService) {
    var requests = [];
    requests.getRequests = function() {
        return $http({
            method: "GET",
            url: `./requests`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            console.log(responses.data.arr_requests);
            return responses.data.arr_requests;
        });
    }
    
    requests.getSentRequests = function() {
        return $http({
            method: "GET",
            url: `./userrequests`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken()},
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            console.log(responses.data.usr_arr);
            return responses.data.usr_arr;
        });
    }
    
    requests.addResponse = function (data) {
        { 
            return $http({ 
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
                data: JSON.stringify(data),
                cache: true,
                url: `./postresponse` // Url
            }).then(function(responses) {
                console.log(responses.data.message);
                return responses.data.message;
            });
        }
    }
    return requests;
});