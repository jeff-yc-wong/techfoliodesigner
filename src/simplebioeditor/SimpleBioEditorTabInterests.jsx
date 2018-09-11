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

/* eslint max-len: 0 */

export default class SimpleBioEditorTabInterests extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    const interests = this.props.bio.interests;
    this.state.model.name1 = interests[0] && interests[0].name;
    this.state.model.name2 = interests[1] && interests[1].name;
    this.state.model.keywords1a = interests[0] && interests[0].keywords && interests[0].keywords[0];
    this.state.model.keywords1b = interests[0] && interests[0].keywords && interests[0].keywords[1];
    this.state.model.keywords1c = interests[0] && interests[0].keywords && interests[0].keywords[2];
    this.state.model.keywords2a = interests[1] && interests[1].keywords && interests[1].keywords[0];
    this.state.model.keywords2b = interests[1] && interests[1].keywords && interests[1].keywords[1];
    this.state.model.keywords2c = interests[1] && interests[1].keywords && interests[1].keywords[2];
  }

  submit(data) {
    const { name1, name2, keywords1a, keywords1b, keywords1c, keywords2a, keywords2b, keywords2c } = data;
    const bio = this.props.bio;
    const entries = [];
    const newKeywords1 = _.compact([keywords1a, keywords1b, keywords1c]);
    const entry1 = name1 && {
      name: name1,
      keywords: bio.interests[0].keywords.splice(0, bio.interests[0].keywords.length, ...newKeywords1),
    };
    entries.push(entry1);
    const newKeywords2 = _.compact([keywords2a, keywords2b, keywords2c]);
    const entry2 = name2 && {
      name: name2,
      keywords: bio.interests[1].keywords.splice(0, bio.interests[1].keywords.length, ...newKeywords2),
    };
    entries.push(entry2);
    for (let i = 0; i < entries.length; i += 1) {
      bio.interests = updateArray(bio.interests, entries[i], i);
    }
    writeBioFile(this.props.directory, bio, 'Updated interests section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      name1: { type: String, optional: true, label: 'Interest' },
      name2: { type: String, optional: true, label: 'Interest' },
      keywords1a: { type: String, optional: true, label: 'Keyword' },
      keywords1b: { type: String, optional: true, label: 'Keyword' },
      keywords1c: { type: String, optional: true, label: 'Keyword' },
      keywords2a: { type: String, optional: true, label: 'Keyword' },
      keywords2b: { type: String, optional: true, label: 'Keyword' },
      keywords2c: { type: String, optional: true, label: 'Keyword' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row columns={4}>
              <Grid.Column>
                <AutoField name="name1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="keywords1a" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="keywords1b" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="keywords1c" />
              </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row columns={4}>
              <Grid.Column>
                <AutoField name="name2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="keywords2a" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="keywords2b" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="keywords2c" />
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

SimpleBioEditorTabInterests.propTypes = {
  bio: PropTypes.shape({ interests: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
