# Cisco Internship Project
**Temp Name for Project Quick Books**
## Front-End
**Index.html**
 1. Framework Connections
    * Materialised
    * Angular
2. Angular App
3. Base Controller
    * Doesn't really do anything except structure
4. Define View
5. Call Main.js where Angular.js

## Back-End
**server.js**
Here is where the app runs from using external objects and classes
Our own classes and external dependencies
### Dependencies
1.    **"body-parser": "^1.18.2"** Library to parse incoming data
2.    **"cors": "^2.8.4"** Handles requests and authentication
3.    **"express": "~3.2.4"** **Most Important** Used for creating the app and handling all requests
4.    **"fuse.js": "^3.2.0"** Used for searching books, This the fuzzy search api
5.    **"getenv": "^0.7.0"** Used for getting environment variables
6.    **"jsonwebtoken": "^8.1.0"** Used for Authentication with Tokens
7.    **"nodemailer": "^4.2.0"** Used for sending emails
8.    **"promise-mysql": "^3.1.0"** Used for Db Connections but with promise
9.    **"randomstring": "^1.1.5"** Used for creating random strings
10.    **"sha512": "0.0.1"** Used for encrypting string with sha512

### Steps
1. Import Environment Variables
2. Import External Libraries as Objects
3. Import Internal Modules as Objects
4. Set up our server
    * Creating an app with express
    * Add Cors and Body parser
    * Set jsonwebtoken secret
    * Initialise the server with app and port
5. Setup Db Connections
    * Using Promises
    * Passing all parameters, currently using environment variables from c9
6. Setting up Event Listeners
  **When Event is Triggered** An object of a separate modules is called and data is passed here is where the requests is really handled
   1. Post Requests
      * Login
      * SignUp
      * Borrow
      * Add Book
    2. Get Requests
        * Verifying Email
        * New books, (Following)
        * Search
            1. Complete search
            2.  Search for books alone
            3. Search for genres alone
            4. Search for author alone
        * User Details

# In Depth Modules Analysis
## Login
#### Design
1. Under Login Controller
2. Basic Html Form Design with Materialised Css
3. Login Is Bound Two Ways with Modules

#### Angular
##### Controller
1. Inherits $scope, $location From Angular.
2. Inherits internal services as objects userService.
3. Has an Initialise function which activates the loader and shows the page
4. Sets an Event Listener function Login
      1. **ON Click** We call userService(type factory)
      2. Passes Modules From The page, Email and Password
      3. Set up a Promises
          * **On Success** Changes the location to "/" which goes to the router provider and goes to homeController
          * **On Failure** It prints the message why you weren't able to login
##### userService factory
1. setup an array to return
2. setup function login assigned to userService.login
      1. Takes parameters email and Password
      2. http request of type Post to the REST API
      3. A promise is created for the requests
          * **On Success**
                  * The token which returned is stored in local and session storage
                  * userService.getDetails();
          * **ON Failure**
                  * Throw an error to and send the message back to Controller
#### Backend
##### Server
1. Request is caught by server as discussed earlier.
2. Function loginUser of Object of module user is called
    * parameters passed are req, res, con, secret
        1. Req is what you get from the front-end
        2. Res is what you sent to the front-end
        3. con is the database connection
        4. secret is the secret key used for jsonwebtoken
##### User.js
1. Get variables from the req, email and Password
2. Write a query to the database
      * We get all the rows from the table Users where the Email column is the email variable
3. If there are any results to the query
      * **On Failure** We respond to front-end with message no email found
4. Check if the user is verified
5. Assign a key the salt of the user
6. Creates a hasher object with the key
7. Hashes the input password with this hasher
8. Compares this hash with the hashed password stored in the database
9. If this match create jwt token
    * Token body cotains the user UUID
    * Token is signed with a secret
10. This token is passed back to front-end
## Add Books
### Backend
#### addBook
1. Get the token from headers
2. Verify with signature with secret and decode the data which is the UUID.
3. Create an Json Object of Name book
4. From the req I check the if image was sent
**ON Success** The book.image assigned that image
**On Failure** The book.image assigned a default image file
5. If Book Id is sent from request
**On Success** function addUserBook is called an passed parameters of the db con, book's id, the user id, the book's description and book's image
**Else** Rest of Code
6. If Author Id is sent from request
    * **On Success**
      * book.uaid is assigned this value
      * Db query is written to get the Author's name.
      * The name is assigned to book.author
    * **Else**
      * book.author is assigned the value of the author from the request.
      * Db query is written to insert this Author into the Authors table
      * Another Db query is written to get this Author's Id
      * This Id is assigned to book.uaid
7. At the end of this if else, It is guaranteed to have book.author and book.uaid
8. Very similar task is performed for genres
9. At the end of this if else, It is guaranteed to have book.genre and book.ugid
10. Assign book.name, book.year and book.description all from the request database
11. function addNewBookDb with parameters con, book.name, book.uaid,book.ugid,book,year
12. **On Success of the Fuction**
13. A query is written to get the Book Id from the database
14. function addUserBook with parameters con, user id, book id, book description, book image
15. function addNewBookFile with parameters book id, book name,book author, book genre, book year
16. **If Successful** res of message Successfully added is sent back.
#### addNewBookDb
1. A db Query is written to insert books to the database passing value of name, author id, genre id and year
2. ``` "INSERT INTO Books (Name,Author,Genre,Year) VALUES ("${name}",${uaid},${ugid},${year})"" ```
#### addUserBook
1. A db Query is written to insert book as a user's book to database passing the user id, book id, description and image.
2. ```INSERT INTO ${"`User's Book`"} (User,Book,Description,Image) VALUES (${uuid},${ubid},"${description}","${image}")```

#### addNewBookFile
1. Read a file books.json and create an array from it.
2. Create a Json Object newBook with parameters book id, title, genre,Year
3. The object newBook is push the end of array created
4. This array is written to books.json
```javascript 
var newBook = {
        ubid: ubid,
        title: name,
        author: author,
        genre: genre,
        year: year
    }; 
    ```

