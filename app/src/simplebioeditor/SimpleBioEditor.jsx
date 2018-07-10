import React from 'react';
import { Tab } from 'semantic-ui-react';
import SimpleBioEditorTabBasics from './SimpleBioEditorTabBasics';
import SimpleBioEditorTabNetwork from './SimpleBioEditorTabNetwork';
import { getBioAsJson } from './SimpleBioEditorWindow';

export default class SimpleBioEditor extends React.Component {

  render() {
    const app = require('electron').remote.app; //eslint-disable-line
    const bio = getBioAsJson(app);
    const panes = [
      { menuItem: 'Basics', render: () => <Tab.Pane><SimpleBioEditorTabBasics bio={bio} /></Tab.Pane> },
      { menuItem: 'Networks', render: () => <Tab.Pane><SimpleBioEditorTabNetwork bio={bio} /></Tab.Pane> },
      { menuItem: 'Education', render: () => <Tab.Pane>Education</Tab.Pane> },
      { menuItem: 'Work', render: () => <Tab.Pane>Work</Tab.Pane> },
      { menuItem: 'Skills', render: () => <Tab.Pane>Skills</Tab.Pane> },
      { menuItem: 'Interests', render: () => <Tab.Pane>Interests</Tab.Pane> },
      { menuItem: 'Awards', render: () => <Tab.Pane>Awards</Tab.Pane> },
      { menuItem: 'Activities', render: () => <Tab.Pane>Activities</Tab.Pane> },
    ];
    return (
      <div>
        <Tab panes={panes} />
      </div>
    );
  }
}
