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

export default class SimpleBioEditorTabEducation extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    const education = this.props.bio.education;
    this.state.model.institution1 = education[0] && education[0].institution;
    this.state.model.institution2 = education[1] && education[1].institution;
    this.state.model.area1 = education[0] && education[0].area;
    this.state.model.area2 = education[1] && education[1].area;
    this.state.model.studyType1 = education[0] && education[0].studyType;
    this.state.model.studyType2 = education[1] && education[1].studyType;
    this.state.model.endDate1 = education[0] && education[0].endDate;
    this.state.model.endDate2 = education[1] && education[1].endDate;
    this.state.model.courses1a = education[0] && education[0].courses && education[0].courses[0];
    this.state.model.courses1b = education[0] && education[0].courses && education[0].courses[1];
    this.state.model.courses1c = education[0] && education[0].courses && education[0].courses[2];
    this.state.model.courses2a = education[1] && education[1].courses && education[1].courses[0];
    this.state.model.courses2b = education[1] && education[1].courses && education[1].courses[1];
    this.state.model.courses2c = education[1] && education[1].courses && education[1].courses[2];
  }

  submit(data) {
    const {
      institution1, institution2, area1, area2, studyType1, studyType2, endDate1, endDate2, courses1a, courses1b,
      courses1c, courses2a, courses2b, courses2c,
    } = data;
    const bio = this.props.bio;
    const entry1 = institution1 && {
      institution: institution1,
      area: area1,
      studyType: studyType1,
      endDate: endDate1,
      courses: _.compact([courses1a, courses1b, courses1c]),
    };
    const entry2 = institution2 && {
      institution: institution2,
      area: area2,
      studyType: studyType2,
      endDate: endDate2,
      courses: _.compact([courses2a, courses2b, courses2c]),
    };

    bio.education = updateArray(bio.education, entry1, 0);
    bio.education = updateArray(bio.education, entry2, 1);
    writeBioFile(this.props.directory, bio, 'Updated education section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      institution1: { type: String, optional: true, label: 'Institution' },
      institution2: { type: String, optional: true, label: 'Institution' },
      area1: { type: String, optional: true, label: 'Program' },
      area2: { type: String, optional: true, label: 'Program' },
      studyType1: { type: String, optional: true, label: 'Degree' },
      studyType2: { type: String, optional: true, label: 'Degree' },
      endDate1: { type: String, optional: true, label: 'End Date' },
      endDate2: { type: String, optional: true, label: 'End Date' },
      courses1a: { type: String, optional: true, label: 'Course' },
      courses1b: { type: String, optional: true, label: 'Course' },
      courses1c: { type: String, optional: true, label: 'Course' },
      courses2a: { type: String, optional: true, label: 'Course' },
      courses2b: { type: String, optional: true, label: 'Course' },
      courses2c: { type: String, optional: true, label: 'Course' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row columns={4}>
              <Grid.Column>
                <AutoField name="institution1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="area1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="studyType1" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="endDate1" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="courses1a" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="courses1b" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="courses1c" />
              </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row columns={4}>
              <Grid.Column>
                <AutoField name="institution2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="area2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="studyType2" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="endDate2" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="courses2a" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="courses2b" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="courses2c" />
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

SimpleBioEditorTabEducation.propTypes = {
  bio: PropTypes.shape({ education: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
