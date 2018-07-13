// based on:
// http://iamemmanouil.com/blog/electron-oauth-with-github/
// https://github.com/ekonstantinidis/gitify

// this version uses https rather than superagent
import { BrowserWindow } from 'electron';

const querystring = require('querystring');
const https = require('https');

// Your GitHub Applications Credentials
const options = {
  client_id: 'b7889850a936356ea544',
  client_secret: '607a024513937bff06fa719130f06ef1a261214d',
  scopes: ['public_repo', 'user'],
};

export function loginToGitHub() {
  let authWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
  const githubUrl = 'https://github.com/login/oauth/authorize?';
  const authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    const rawCode = /code=([^&]*)/.exec(newUrl) || null,
      code = (rawCode && rawCode.length > 1) ? rawCode[1] : null,
      error = /\?error=(.+)$/.exec(newUrl);

    if (code || error) {
      // Close the browser if code found or error
      authWindow.close();
    }

    // If there is a code in the callback, proceed to get token from github
    if (code) {
      console.log(`code received: ${code}`);

      const postData = querystring.stringify({
        client_id: options.client_id,
        client_secret: options.client_secret,
        code,
      });

      const post = {
        host: 'github.com',
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length,
          Accept: 'application/json',
        },
      };

      var req = https.request(post, function (response) {
        var result = '';
        response.on('data', function (data) {
          result = result + data;
        });
        response.on('end', function () {
          var json = JSON.parse(result.toString());
          console.log("access token recieved: " + json.access_token);
          if (response && response.ok) {
            // Success - Received Token.
            // Store it in localStorage maybe?
            console.log(response.body.access_token);
          }
        });
        response.on('error', function (err) {
          console.log('GITHUB OAUTH REQUEST ERROR: ' + err.message);
        });
      });

      req.write(postData);
      req.end();
    } else
      if (error) {
        alert("Oops! Something went wrong and we couldn't log you in using Github. Please try again.");
      }
  });

// Reset the authWindow on close
  authWindow.on('close', function () {
    authWindow = null;
  }, false);

}