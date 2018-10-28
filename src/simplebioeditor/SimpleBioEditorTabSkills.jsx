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

export default class SimpleBioEditorTabSkills extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    let skills = this.props.bio.skills;
    if (skills === undefined) {
      skills = [];
    }
    this.state.model.name1 = skills[0] && skills[0].name;
    this.state.model.name2 = skills[1] && skills[1].name;
    this.state.model.keywords1a = skills[0] && skills[0].keywords && skills[0].keywords[0];
    this.state.model.keywords1b = skills[0] && skills[0].keywords && skills[0].keywords[1];
    this.state.model.keywords1c = skills[0] && skills[0].keywords && skills[0].keywords[2];
    this.state.model.keywords2a = skills[1] && skills[1].keywords && skills[1].keywords[0];
    this.state.model.keywords2b = skills[1] && skills[1].keywords && skills[1].keywords[1];
    this.state.model.keywords2c = skills[1] && skills[1].keywords && skills[1].keywords[2];
  }

  submit(data) {
    const { name1, name2, keywords1a, keywords1b, keywords1c, keywords2a, keywords2b, keywords2c } = data;
    const bio = this.props.bio;
    if (bio.skills === undefined) {
      bio.skills = [];
    }
    const skills = bio.skills;
    const entries = [];
    let newKeywords1 = [keywords1a, keywords1b, keywords1c];
    if (bio.skills[0]) {
      skills[0].keywords.splice(0, newKeywords1.length, ...newKeywords1);
      newKeywords1 = skills[0].keywords;
    }
    const entry1 = name1 && {
      name: name1,
      keywords: _.compact(newKeywords1),
    };
    entries.push(entry1);

    let newKeywords2 = [keywords2a, keywords2b, keywords2c];
    if (bio.skills[1]) {
      skills[1].keywords.splice(0, newKeywords2.length, ...newKeywords2);
      newKeywords2 = skills[1].keywords;
    }
    const entry2 = name2 && {
      name: name2,
      keywords: _.compact(newKeywords2),
    };
    entries.push(entry2);
    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.skills = updateArray(bio.skills, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated skills section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      name1: { type: String, optional: true, label: 'Skill' },
      name2: { type: String, optional: true, label: 'Skill' },
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

SimpleBioEditorTabSkills.propTypes = {
  bio: PropTypes.shape({ skills: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
