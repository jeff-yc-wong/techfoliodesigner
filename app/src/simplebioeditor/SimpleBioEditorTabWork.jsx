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

export default class SimpleBioEditorTabWork extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    const work = this.props.bio.work;
    this.state.model.company1 = work[0] && work[0].company;
    this.state.model.company2 = work[1] && work[1].company;
    this.state.model.company3 = work[2] && work[2].company;
    this.state.model.position1 = work[0] && work[0].position;
    this.state.model.position2 = work[1] && work[1].position;
    this.state.model.position3 = work[2] && work[2].position;
    this.state.model.website1 = work[0] && work[0].website;
    this.state.model.website2 = work[1] && work[1].website;
    this.state.model.website3 = work[2] && work[2].website;
    this.state.model.startDate1 = work[0] && work[0].startDate;
    this.state.model.startDate2 = work[1] && work[1].startDate;
    this.state.model.startDate3 = work[2] && work[2].startDate;
    this.state.model.endDate1 = work[0] && work[0].endDate;
    this.state.model.endDate2 = work[1] && work[1].endDate;
    this.state.model.endDate3 = work[2] && work[2].endDate;
    this.state.model.summary1 = work[0] && work[0].summary;
    this.state.model.summary2 = work[1] && work[1].summary;
    this.state.model.summary3 = work[2] && work[2].summary;
    this.state.model.highlights1a = work[0] && work[0].highlights && work[0].highlights[0];
    this.state.model.highlights1b = work[0] && work[0].highlights && work[0].highlights[1];
    this.state.model.highlights1c = work[0] && work[0].highlights && work[0].highlights[2];
    this.state.model.highlights2a = work[1] && work[1].highlights && work[1].highlights[0];
    this.state.model.highlights2b = work[1] && work[1].highlights && work[1].highlights[1];
    this.state.model.highlights2c = work[1] && work[1].highlights && work[1].highlights[2];
    this.state.model.highlights3a = work[2] && work[2].highlights && work[2].highlights[0];
    this.state.model.highlights3b = work[2] && work[2].highlights && work[2].highlights[1];
    this.state.model.highlights3c = work[2] && work[2].highlights && work[2].highlights[2];
  }

  submit(data) {
    const {
      company1, company2, company3, position1, position2, position3, website1, website2, website3,
      startDate1, startDate2, startDate3, endDate1, endDate2, endDate3, summary1, summary2, summary3,
      highlights1a, highlights1b, highlights1c, highlights2a, highlights2b, highlights2c,
      highlights3a, highlights3b, highlights3c,
    } = data;
    const bio = this.props.bio;
    const entry1 = company1 && {
      company: company1,
      position: position1,
      website: website1,
      startDate: startDate1,
      endDate: endDate1,
      summary: summary1,
      highlights: _.compact([highlights1a, highlights1b, highlights1c]),
    };
    const entry2 = company2 && {
      company: company2,
      position: position2,
      website: website2,
      startDate: startDate2,
      endDate: endDate2,
      summary: summary2,
      highlights: _.compact([highlights2a, highlights2b, highlights2c]),
    };
    const entry3 = company3 && {
      company: company3,
      position: position3,
      website: website3,
      startDate: startDate3,
      endDate: endDate3,
      summary: summary3,
      highlights: _.compact([highlights3a, highlights3b, highlights3c]),
    };

    bio.work = updateArray(bio.work, entry1, 0);
    bio.work = updateArray(bio.work, entry2, 1);
    bio.work = updateArray(bio.work, entry3, 2);
    writeBioFile(this.props.directory, bio, 'Updated work section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      company1: { type: String, optional: true, label: 'First Company' },
      company2: { type: String, optional: true, label: 'Second Company' },
      company3: { type: String, optional: true, label: 'Third Company' },
      position1: { type: String, optional: true, label: 'Position' },
      position2: { type: String, optional: true, label: 'Position' },
      position3: { type: String, optional: true, label: 'Position' },
      website1: { type: String, optional: true, label: 'Website' },
      website2: { type: String, optional: true, label: 'Website' },
      website3: { type: String, optional: true, label: 'Website' },
      startDate1: { type: String, optional: true, label: 'Start Date' },
      startDate2: { type: String, optional: true, label: 'Start Date' },
      startDate3: { type: String, optional: true, label: 'Start Date' },
      endDate1: { type: String, optional: true, label: 'End Date' },
      endDate2: { type: String, optional: true, label: 'End Date' },
      endDate3: { type: String, optional: true, label: 'End Date' },
      summary1: { type: String, optional: true, label: 'Summary' },
      summary2: { type: String, optional: true, label: 'Summary' },
      summary3: { type: String, optional: true, label: 'Summary' },
      highlights1a: { type: String, optional: true, label: 'Highlight' },
      highlights1b: { type: String, optional: true, label: 'Highlight' },
      highlights1c: { type: String, optional: true, label: 'Highlight' },
      highlights2a: { type: String, optional: true, label: 'Highlight' },
      highlights2b: { type: String, optional: true, label: 'Highlight' },
      highlights2c: { type: String, optional: true, label: 'Highlight' },
      highlights3a: { type: String, optional: true, label: 'Highlight' },
      highlights3b: { type: String, optional: true, label: 'Highlight' },
      highlights3c: { type: String, optional: true, label: 'Highlight' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="company1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="position1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="website1" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <AutoField name="summary1" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="startDate1" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="endDate1" />
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
                <AutoField name="company2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="position2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="website2" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <AutoField name="summary2" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="startDate2" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="endDate2" />
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
            <Divider />
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="company3" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="position3" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="website3" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={10}>
                <AutoField name="summary3" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="startDate3" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="endDate3" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="highlights3a" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="highlights3b" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="highlights3c" />
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

SimpleBioEditorTabWork.propTypes = {
  bio: PropTypes.shape({ work: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
