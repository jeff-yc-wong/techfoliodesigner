import React from 'react';
import { Tab } from 'semantic-ui-react';
import SimpleBioEditorTabBasics from './SimpleBioEditorTabBasics';
import SimpleBioEditorTabNetwork from './SimpleBioEditorTabNetwork';
import SimpleBioEditorTabWork from './SimpleBioEditorTabWork';
import SimpleBioEditorTabEducation from './SimpleBioEditorTabEducation';
import SimpleBioEditorTabSkills from './SimpleBioEditorTabSkills';
import SimpleBioEditorTabInterests from './SimpleBioEditorTabInterests';
import { getBioAsJson } from './SimpleBioEditorWindow';

/* eslint max-len: 0 */

export default class SimpleBioEditor extends React.Component {

  constructor(props) {
    super(props);
    this.handleBioChange = this.handleBioChange.bind(this);
    const app = require('electron').remote.app; //eslint-disable-line
    this.state = { bio: getBioAsJson(app) };
  }

  handleBioChange(bio) {
    this.setState({ bio });
  }

  render() {
    const panes = [
      { menuItem: 'Basics', render: () => <Tab.Pane><SimpleBioEditorTabBasics bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Networks', render: () => <Tab.Pane><SimpleBioEditorTabNetwork bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Education', render: () => <Tab.Pane><SimpleBioEditorTabEducation bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Work', render: () => <Tab.Pane><SimpleBioEditorTabWork bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Skills', render: () => <Tab.Pane><SimpleBioEditorTabSkills bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Interests', render: () => <Tab.Pane><SimpleBioEditorTabInterests bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
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
