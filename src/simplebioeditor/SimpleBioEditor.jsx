import React from 'react';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SimpleBioEditorTabBasics from './SimpleBioEditorTabBasics';
import SimpleBioEditorTabNetwork from './SimpleBioEditorTabNetwork';
import SimpleBioEditorTabWork from './SimpleBioEditorTabWork';
import SimpleBioEditorTabEducation from './SimpleBioEditorTabEducation';
import SimpleBioEditorTabSkills from './SimpleBioEditorTabSkills';
import SimpleBioEditorTabInterests from './SimpleBioEditorTabInterests';
import SimpleBioEditorTabAwards from './SimpleBioEditorTabAwards';
import SimpleBioEditorTabActivities from './SimpleBioEditorTabActivities';
import { getBioAsJson } from './SimpleBioEditorWindow';


/* eslint max-len: 0 */

export default class SimpleBioEditor extends React.Component {

  constructor(props) {
    super(props);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.state = { bio: getBioAsJson(this.props.directory) };
  }

  handleBioChange(bio) {
    this.setState({ bio });
  }

  render() {
    const panes = [
      { menuItem: 'Basics', render: () => <Tab.Pane><SimpleBioEditorTabBasics directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Networks', render: () => <Tab.Pane><SimpleBioEditorTabNetwork directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Education', render: () => <Tab.Pane><SimpleBioEditorTabEducation directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Work', render: () => <Tab.Pane><SimpleBioEditorTabWork directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Skills', render: () => <Tab.Pane><SimpleBioEditorTabSkills directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Interests', render: () => <Tab.Pane><SimpleBioEditorTabInterests directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Awards', render: () => <Tab.Pane><SimpleBioEditorTabAwards directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
      { menuItem: 'Activities', render: () => <Tab.Pane><SimpleBioEditorTabActivities directory={this.props.directory} bio={this.state.bio} handleBioChange={this.handleBioChange} /></Tab.Pane> },
    ];
    return (
      <div>
        <Tab panes={panes} />
      </div>
    );
  }
}

SimpleBioEditor.propTypes = {
  directory: PropTypes.string.isRequired,
};
