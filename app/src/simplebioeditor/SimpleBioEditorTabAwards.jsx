import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Grid, Divider } from 'semantic-ui-react';
import { writeBioFile } from './BioFileIO';
import updateArray from './ArrayUpdater';

export default class SimpleBioEditorTabAwards extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    const awards = this.props.bio.awards;
    this.state.model.title1 = awards[0] && awards[0].title;
    this.state.model.title2 = awards[1] && awards[1].title;
    this.state.model.type1 = awards[0] && awards[0].type;
    this.state.model.type2 = awards[1] && awards[1].type;
    this.state.model.date1 = awards[0] && awards[0].date;
    this.state.model.date2 = awards[1] && awards[1].date;
    this.state.model.awarder1 = awards[0] && awards[0].awarder;
    this.state.model.awarder2 = awards[1] && awards[1].awarder;
    this.state.model.summary1 = awards[0] && awards[0].summary;
    this.state.model.summary2 = awards[1] && awards[1].summary;
  }

  submit(data) {
    const { title1, title2, type1, date1, awarder1, summary1, type2, date2, awarder2, summary2 } = data;
    const bio = this.props.bio;
    const entry1 = title1 && { title: title1, type: type1, date: date1, awarder: awarder1, summary: summary1 };
    const entry2 = title2 && { title: title2, type: type2, date: date2, awarder: awarder2, summary: summary2 };

    bio.awards = updateArray(bio.awards, entry1, 0);
    bio.awards = updateArray(bio.awards, entry2, 1);
    writeBioFile(this.props.directory, bio, 'Updated awards section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      title1: { type: String, optional: true, label: 'Title' },
      title2: { type: String, optional: true, label: 'Title' },
      type1: { type: String, optional: true, label: 'Type' },
      type2: { type: String, optional: true, label: 'Type' },
      date1: { type: String, optional: true, label: 'Date' },
      date2: { type: String, optional: true, label: 'Date' },
      awarder1: { type: String, optional: true, label: 'Awarder' },
      awarder2: { type: String, optional: true, label: 'Awarder' },
      summary1: { type: String, optional: true, label: 'Summary' },
      summary2: { type: String, optional: true, label: 'Summary' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <AutoField name="title1" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="type1" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="date1" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="awarder1" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <AutoField name="summary1" />
              </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row>
              <Grid.Column width={8}>
                <AutoField name="title2" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="type2" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="date2" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="awarder2" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <AutoField name="summary2" />
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

SimpleBioEditorTabAwards.propTypes = {
  bio: PropTypes.shape({ awards: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
