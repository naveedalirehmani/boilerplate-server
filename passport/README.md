# Security and authentication with Node.js

## This Repo includes most commonly used authentication strategies and methods to maintain user sessions.

### strategies implemented in this repo are.

- oAuth 2.0 with passport.js
- oAuth 2.0 with google api's
- local authentication

### Methods for implementing user sesions.

- client side cookies with cookie-session.
- server side cookies with express-session.
- JWT.

### uAuth 2.0 flow.

- Our browser start with a get request to oAuth server (google.com) along with clientID and redirect URL(which is google will redirect us if we pass correct credentials), and the server responds with a page where we can log in to get a authorization code, this authorisation code is sent to a predefined endpoint where we then concatenate this authorization code with our client secret to which the oAuth server responds with a authorization token usually a JWT token which we then use it with our server for authentication and access confidential information on oAuth server (such as your name and email)
- There one more extra thing that google does is that when we provide our credentials in the initial step the google sets bunch of extra cookies in for some extra sites such as YouTube. This is an extra step (not part of oAuth) just to automatically sign you in, in other services that google provides.
- You might think why add an extra step to by responding back with an authorization code and not with authorisation token, this is because the authorisation code is one time use only and is valid for a short period of time, which is an extra security step. So we can use this authorisation code  along with client secret to get authorisation token. But this step for requesting a authorisation token with client secret is done by backend server to keep our client secret a secret.


