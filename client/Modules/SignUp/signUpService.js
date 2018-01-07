var app = angular.module("quickbooks");
app.service('signUpService', function($http, userService) {
    var signUpService = [];
    signUpService.signup = function(username, email, password, salt) { // Well, what does this suggest?
        var url = "./Signup"; // Url 
        var user = { name: username, email: email, pword: password, salt: salt }; // Data is email and passsword
        console.log(JSON.stringify(user));
        return $http({ // Returning the function of http to the previous function login()
                method: "POST", // Type POST
                headers: { 'Content-Type': 'application/json' }, // Datatype
                data: JSON.stringify(user), // Data here
                url: url // Url
            }).then(function(responses) { // Promise, Basically the program promises to come here when the function is succesfull and gets data back
                return responses.data; //return message
            })
            .catch(function(response) { // Promise, Basically the program promises to come here when the function is unsucessful and throws an error
                throw Error(response.data.message); // This throws an error
            });
    };
    signUpService.getSalt = function() {
        return $http({
            method: "GET",
            url: `./getSalt`,
            headers: { 'Content-Type': 'application/json', 'x-login-email': "new" } // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) { // Promise Success
            return responses.data;
        });

    };
    signUpService.verify = function(token) {
        return $http({
            method: "GET",
            url: `./verify`,
            headers: { 'Content-Type': 'application/json', 'x-verify-token': token , 'x-source' : "code" } // Setting Headers, Function call to get getToken() to send to db
        }).then(function(response) { // Promise Success
            console.log(response);
            localStorage.setItem("token", response.data.token); // This is Local Storage which is like cookies to keep you logged so you don't need to keep logging in
            sessionStorage.setItem('token', response.data.token);
            userService.getDetails(); // This calls a function to get all the user's details
            return response.data.token;
        });
    };
    return signUpService;
});
