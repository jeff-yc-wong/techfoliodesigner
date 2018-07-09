import React from 'react';
import { Tab } from 'semantic-ui-react';
import { getBioAsJson } from './SimpleBioEditorWindow';
import SimpleBioEditorTabBasics from './SimpleBioEditorTabBasics';

export default class SimpleBioEditor extends React.Component {

  render() {
    const bio = getBioAsJson();
    const panes = [
      { menuItem: 'Basics', render: () => <Tab.Pane><SimpleBioEditorTabBasics bio={bio} /></Tab.Pane> },
      { menuItem: 'Networks', render: () => <Tab.Pane>Networks</Tab.Pane> },
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
