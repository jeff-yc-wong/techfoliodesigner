import electron, { BrowserWindow } from 'electron';
import querystring from 'querystring';
import https from 'https';
import setGitHubUsername from './GitHubCommands';

const app = electron.app;


/* Based on: https://gist.github.com/paulbbauer/2add0bdf0f4342df48ea */

const options = {
  client_id: 'b7889850a936356ea544',
  client_secret: '607a024513937bff06fa719130f06ef1a261214d',
  scopes: ['public_repo', 'user:email'],
};

export default function loginToGitHub() { //eslint-disable-line
  let authWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
  const githubUrl = 'https://github.com/login/oauth/authorize?';
  const authUrl = `${githubUrl}client_id=${options.client_id}&scope=${options.scopes}`;
  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    console.log('starting webContents.on');
    const rawCode = /code=([^&]*)/.exec(newUrl) || null;
    const code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
    const error = /\?error=(.+)$/.exec(newUrl);

    if (code || error) {
      // Close the browser since we now have the data.
      authWindow.close();
    }

    // If there is a code in the callback, proceed to get token from github
    if (code) {
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

      const req = https.request(post, (response) => {
        let result = '';
        response.on('data', (data) => {
          result += data;
        });
        response.on('end', () => {
          if (response && (response.statusCode === 200)) {
            const json = JSON.parse(result.toString());
            const token = json.access_token;
            app.techFolioGitHubManager.set('token', token);
            setGitHubUsername();
          }
        });
        response.on('error', (err) => {
          console.log('Oauth request error ', err.message);
        });
      });

      req.write(postData);
      req.end();
    } else
      if (error) {
        console.log('Error connecting to GitHub.');
      }
  });

// Reset the authWindow on close
  authWindow.on('close', () => {
    authWindow = null;
  }, false);
}

// function loginToGitHubold() { //eslint-disable-line
//   let token;
//
//   const windowParams = { alwaysOnTop: true, autoHideMenuBar: true, webPreferences: { nodeIntegration: false } };
//   const scopes = ['public_repo', 'user'];
//
//   const oauthOptions = {
//     scope: scopes.join(' '),
//     accessType: 'online',
//   };
//
//   const myApiOauth = electronOauth2(options, windowParams);
//
//   return myApiOauth.getAccessToken(oauthOptions)
//     .then((t) => {
//       token = t;
//       // window.localStorage.setItem('githubtoken', token.access_token);
//       console.log('access token', token.access_token);
//     });
// }
