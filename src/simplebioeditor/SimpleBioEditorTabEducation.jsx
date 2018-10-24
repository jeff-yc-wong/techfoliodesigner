import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import ListAddField from 'uniforms-semantic/ListAddField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Table, Button } from 'semantic-ui-react';
import { _ } from 'underscore';
import { writeBioFile } from './BioFileIO';
import updateArray from './ArrayUpdater';

export default class SimpleBioEditorTabEducation extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    const bio = this.props.bio;
    if (bio.education === undefined) {
      bio.education = [];
    }
    const education = bio.education;
    this.state.model.institution1 = education[0] && education[0].institution;
    this.state.model.institution2 = education[1] && education[1].institution;
    this.state.model.area1 = education[0] && education[0].area;
    this.state.model.area2 = education[1] && education[1].area;
    this.state.model.studyType1 = education[0] && education[0].studyType;
    this.state.model.studyType2 = education[1] && education[1].studyType;
    this.state.model.endDate1 = education[0] && education[0].endDate;
    this.state.model.endDate2 = education[1] && education[1].endDate;
    this.state.model.courses1 = education[0] && education[0].courses;
    this.state.model.courses2 = education[1] && education[1].courses;
  }

  submit(data) {
    const { institution1, institution2, area1, area2, studyType1, studyType2, endDate1, endDate2, courses1,
      courses2, delete1, delete2 } = data;
    const bio = this.props.bio;
    if (bio.education === undefined) {
      bio.education = [];
    }
    const entries = [];
    if (!delete1) {
      const entry1 = institution1 && {
        institution: institution1,
        area: area1,
        studyType: studyType1,
        endDate: endDate1,
        courses: _.compact(courses1),
      };
      entries.push(entry1);
    } else entries.push([]);

    if (!delete2) {
      const entry2 = institution2 && {
        institution: institution2,
        area: area2,
        studyType: studyType2,
        endDate: endDate2,
        courses: _.compact(courses2),
      };
      entries.push(entry2);
    } else entries.push([]);

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.education = updateArray(bio.education, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated education section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      institution1: { type: String, optional: true, label: '' },
      institution2: { type: String, optional: true, label: '' },
      area1: { type: String, optional: true, label: '' },
      area2: { type: String, optional: true, label: '' },
      studyType1: { type: String, optional: true, label: '' },
      studyType2: { type: String, optional: true, label: '' },
      endDate1: { type: String, optional: true, label: '' },
      endDate2: { type: String, optional: true, label: '' },
      courses1: { type: Array, optional: true, label: '' },
      'courses1.$': { type: String, optional: true, label: '' },
      courses2: { type: Array, optional: true, label: '' },
      'courses2.$': { type: String, optional: true, label: '' },
      delete1: { type: Boolean, optional: true, label: '', defaultValue: false },
      delete2: { type: Boolean, optional: true, label: '', defaultValue: false },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Institution</Table.HeaderCell>
                <Table.HeaderCell>Information</Table.HeaderCell>
                <Table.HeaderCell>Courses</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField name="institution1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField placeholder="Program" name="area1" />
                  <AutoField placeholder="Degree" name="studyType1" />
                  <AutoField placeholder="End Date" name="endDate1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="courses1" />
                  <ListAddField name="courses1.$" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete1" />
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField name="institution2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField placeholder="Program" name="area2" />
                  <AutoField placeholder="Degree" name="studyType2" />
                  <AutoField placeholder="End Date" name="endDate2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="courses2" />
                  <ListAddField name="courses2.$" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete2" />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Button>+</Button>
          <SubmitField value="Save" />
          <ErrorsField />
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
