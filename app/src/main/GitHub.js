import { BrowserWindow, net } from 'electron';
import querystring from 'querystring';
import https from 'https';
import * as action from '../redux/actions';
import mainStore from '../redux/mainstore';
import buildMainMenu from './MainMenu';

/**
 * Once authenticated to GitHub and access token is available, this function uses the https GitHub API to get username.
 */
function setGitHubUsername() {
  mainStore.dispatch(action.addLog('Requesting GitHub username'));
  const token = mainStore.getState().token;
  const requestUrl = `https://api.github.com/user?access_token=${token}`;
  const request = net.request(requestUrl);
  request.on('response', (response) => {
    let result = '';
    response.on('data', (chunk) => {
      result += chunk;
    });
    response.on('end', () => {
      if (response && (response.statusCode === 200)) {
        const json = JSON.parse(result.toString());
        const username = json.login;
        mainStore.dispatch(action.setUsername(username));
        mainStore.dispatch(action.addLog(`GitHub username is: ${username}`));
        buildMainMenu();
      } else {
        mainStore.dispatch(action.addLog(`GitHub authentication: request user failed: ${JSON.stringify(response)}`));
      }
    });
  });
  request.end();
}


/**
 * Use HTTPS API to authenticate to GitHub.
 * Based on: https://gist.github.com/paulbbauer/2add0bdf0f4342df48ea
 */
export default function runLoginToGitHub() {
  const options = {
    client_id: 'b7889850a936356ea544',
    client_secret: '607a024513937bff06fa719130f06ef1a261214d',
    scopes: ['public_repo', 'user:email'],
  };
  mainStore.dispatch(action.addLog('GitHub authentication: starting.'));
  let authWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });
  const githubUrl = 'https://github.com/login/oauth/authorize?';
  const authUrl = `${githubUrl}client_id=${options.client_id}&scope=${options.scopes}`;
  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on('will-navigate', () => {
    mainStore.dispatch(action.addLog('Please select Config | Login to GitHub one more time.'));
    authWindow.close();
  });

  authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    mainStore.dispatch(action.addLog('Redirection processing starting.'));
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
            mainStore.dispatch(action.addLog('GitHub authentication successful'));
            mainStore.dispatch(action.setToken(token));
            mainStore.dispatch(action.setAuthenticated(true));
            setGitHubUsername();
          }
        });
        response.on('error', (err) => {
          mainStore.dispatch(action.addLog(`GitHub authentication failed: ${err.message}`));
        });
      });

      req.write(postData);
      req.end();
    } else
      if (error) {
        mainStore.dispatch(action.addLog(`GitHub authentication: Error connecting to GitHub: ${error}`));
      }
  });

// Reset the authWindow on close
  authWindow.on('close', () => {
    authWindow = null;
  }, false);
}
