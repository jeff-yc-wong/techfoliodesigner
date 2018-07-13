import { dialog } from 'electron';
import OauthGithub from 'electron-oauth-github';
import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

export function loginToGitHub() {
  console.log('Starting loginToGitHub');
  const github = new OauthGithub({
    id: 'b7889850a936356ea544',
    secret: '607a024513937bff06fa719130f06ef1a261214d',
    scopes: ['public_repo', 'user'],
  });

  github.startRequest((token, err) => {
    if (err) {
      dialog.showErrorBox('Error on GitHub Login', err);
    }
    techFolioGitHubManager.set('token', token);
    dialog.showMessageBox({ message: 'Login successful', buttons: ['OK'] });
  });
}
