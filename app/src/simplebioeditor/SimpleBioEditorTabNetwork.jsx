import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Grid } from 'semantic-ui-react';
import { writeBioFile } from './BioFileIO';
import updateArray from './ArrayUpdater';

export default class SimpleBioEditorTabNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    const profiles = this.props.bio.basics.profiles;
    this.state.model.network1 = profiles[0] && profiles[0].network;
    this.state.model.network2 = profiles[1] && profiles[1].network;
    this.state.model.network3 = profiles[2] && profiles[2].network;
    this.state.model.username1 = profiles[0] && profiles[0].username;
    this.state.model.username2 = profiles[1] && profiles[1].username;
    this.state.model.username3 = profiles[2] && profiles[2].username;
    this.state.model.url1 = profiles[0] && profiles[0].url;
    this.state.model.url2 = profiles[1] && profiles[1].url;
    this.state.model.url3 = profiles[2] && profiles[2].url;
  }

  submit(data) {
    const
      { network1, network2, network3, username1, username2, username3, url1, url2, url3 } = data;
    const bio = this.props.bio;
    const entry1 = network1 && { network: network1, username: username1, url: url1 };
    const entry2 = network2 && { network: network2, username: username2, url: url2 };
    const entry3 = network3 && { network: network3, username: username3, url: url3 };
    bio.basics.profiles = updateArray(bio.basics.profiles, entry1, 0);
    bio.basics.profiles = updateArray(bio.basics.profiles, entry2, 1);
    bio.basics.profiles = updateArray(bio.basics.profiles, entry3, 2);
    writeBioFile(this.props.directory, bio, 'Updated network section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      network1: { type: String, optional: true, label: 'Network' },
      network2: { type: String, optional: true, label: 'Network' },
      network3: { type: String, optional: true, label: 'Network' },
      username1: { type: String, optional: true, label: 'Username' },
      username2: { type: String, optional: true, label: 'Username' },
      username3: { type: String, optional: true, label: 'Username' },
      url1: { type: String, optional: true, label: 'Url' },
      url2: { type: String, optional: true, label: 'Url' },
      url3: { type: String, optional: true, label: 'Url' },

    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="network1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="username1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="url1" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="network2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="username2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="url2" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="network3" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="username3" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="url3" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <SubmitField value="Save" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <ErrorsField />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </AutoForm>
      </div>
    );
  }
}

SimpleBioEditorTabNetwork.propTypes = {
  bio: PropTypes.shape({ basics: React.PropTypes.object }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
