const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const path = require('path');

const app = express();

// Load client secrets from a file.
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URL = 'YOUR_REDIRECT_URL'; // This is usually 'http://localhost:3000/callback' for local development.
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
];

app.get('/auth/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const {code} = req.query;

    try {
        const {tokens} = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const userInfoResponse = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo'
        });

        const user = userInfoResponse.data;

        // Handle user data as required: save to database, create sessions, etc.
        res.json(user);

    } catch (error) {
        res.status(500).send('Authentication failed');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

module.exports = app;
