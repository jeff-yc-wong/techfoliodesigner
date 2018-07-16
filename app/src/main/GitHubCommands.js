import electron, { net } from 'electron';

const app = electron.app;

export default function setGitHubUsername() {
  const token = app.techFolioGitHubManager.get('token');
  const requestUrl = `https://api.github.com/user?access_token=${token}`;
  const request = net.request(requestUrl);
  request.on('response', (response) => {
    let result = '';
    console.log(`getGitHubUserName status code: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      result += chunk;
    });
    response.on('end', () => {
      if (response && (response.statusCode === 200)) {
        const json = JSON.parse(result.toString());
        const username = json.login;
        console.log('setting username to', username);
        app.techFolioGitHubManager.set('username', username);
      }
    });
  });
  request.end();
}
