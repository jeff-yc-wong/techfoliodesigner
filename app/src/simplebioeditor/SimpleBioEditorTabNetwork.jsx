import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Grid } from 'semantic-ui-react';
import { writeBioFile, readBioFile } from './BioFileIO';

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

  submit(data) { //eslint-disable-line
    const
      { network1, network2, network3, username1, username2, username3, url1, url2, url3 } = data;
    // get most recently saved version of bio.json, just to be safe.
    const bio = readBioFile();
    let profiles = bio.basics.profiles;
    const entry1 = network1 && { network: network1, username: username1, url: url1 };
    const entry2 = network2 && { network: network2, username: username2, url: url2 };
    const entry3 = network3 && { network: network3, username: username3, url: url3 };
    // ensure that profiles is an array if we're going to put stuff into it.
    if (entry1 || entry2 || entry3) {
      if (!profiles) {
        profiles = [];
      }
    }
    // Update just the first three elements of profiles if available. Remember there may be more than three,
    // So must leave elements 4, 5, etc alone.
    if (entry1) {
      if (profiles.length > 0) {
        profiles[0] = entry1;
      } else {
        profiles.push(entry1);
      }
    }
    if (entry2) {
      if (profiles.length > 1) {
        profiles[1] = entry2;
      } else {
        profiles.push(entry2);
      }
    }
    if (entry3) {
      if (profiles.length > 2) {
        profiles[2] = entry3;
      } else {
        profiles.push(entry3);
      }
    }
    writeBioFile(bio, 'Updated network section of bio.');
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
};
