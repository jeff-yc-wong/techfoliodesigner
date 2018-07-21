import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Grid, Divider } from 'semantic-ui-react';
import { _ } from 'underscore';
import { writeBioFile } from './BioFileIO';
import updateArray from './ArrayUpdater';

export default class SimpleBioEditorTabActivities extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    const volunteer = this.props.bio.volunteer;
    this.state.model.organization1 = volunteer[0] && volunteer[0].organization;
    this.state.model.organization2 = volunteer[1] && volunteer[1].organization;
    this.state.model.position1 = volunteer[0] && volunteer[0].position;
    this.state.model.position2 = volunteer[1] && volunteer[1].position;
    this.state.model.summary1 = volunteer[0] && volunteer[0].summary;
    this.state.model.summary2 = volunteer[1] && volunteer[1].summary;
    this.state.model.highlights1a = volunteer[0] && volunteer[0].highlights && volunteer[0].highlights[0];
    this.state.model.highlights1b = volunteer[0] && volunteer[0].highlights && volunteer[0].highlights[1];
    this.state.model.highlights1c = volunteer[0] && volunteer[0].highlights && volunteer[0].highlights[2];
    this.state.model.highlights2a = volunteer[1] && volunteer[1].highlights && volunteer[1].highlights[0];
    this.state.model.highlights2b = volunteer[1] && volunteer[1].highlights && volunteer[1].highlights[1];
    this.state.model.highlights2c = volunteer[1] && volunteer[1].highlights && volunteer[1].highlights[2];
  }

  submit(data) {
    const {
      organization1, organization2, position1, position2, summary1, summary2, highlights1a, highlights1b,
      highlights1c, highlights2a, highlights2b, highlights2c,
    } = data;
    const bio = this.props.bio;
    const entry1 = organization1 && {
      organization: organization1,
      position: position1,
      summary: summary1,
      highlights: _.compact([highlights1a, highlights1b, highlights1c]),
    };
    const entry2 = organization2 && {
      organization: organization2,
      position: position2,
      summary: summary2,
      highlights: _.compact([highlights2a, highlights2b, highlights2c]),
    };

    bio.volunteer = updateArray(bio.volunteer, entry1, 0);
    bio.volunteer = updateArray(bio.volunteer, entry2, 1);
    writeBioFile(this.props.directory, bio, 'Updated activities section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      organization1: { type: String, optional: true, label: 'Organization' },
      organization2: { type: String, optional: true, label: 'Organization' },
      position1: { type: String, optional: true, label: 'Position' },
      position2: { type: String, optional: true, label: 'Position' },
      summary1: { type: String, optional: true, label: 'Summary' },
      summary2: { type: String, optional: true, label: 'Summary' },
      highlights1a: { type: String, optional: true, label: 'Highlight' },
      highlights1b: { type: String, optional: true, label: 'Highlight' },
      highlights1c: { type: String, optional: true, label: 'Highlight' },
      highlights2a: { type: String, optional: true, label: 'Highlight' },
      highlights2b: { type: String, optional: true, label: 'Highlight' },
      highlights2c: { type: String, optional: true, label: 'Highlight' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="organization1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="position1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="summary1" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="highlights1a" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="highlights1b" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="highlights1c" />
              </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="organization2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="position2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="summary2" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="highlights2a" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="highlights2b" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="highlights2c" />
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

SimpleBioEditorTabActivities.propTypes = {
  bio: PropTypes.shape({ volunteer: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
