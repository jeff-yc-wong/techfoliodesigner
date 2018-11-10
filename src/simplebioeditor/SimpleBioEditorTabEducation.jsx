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
    this.addRow = this.addRow.bind(this);
    this.update = this.update.bind(this);
    const bio = this.props.bio;
    if (bio.education === undefined) {
      bio.education = [];
    }
    const education = bio.education;
    this.state = { model: {}, entries: education.length };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`institution${i + 1}`] = education[i] && education[i].institution;
      this.state.model[`area${i + 1}`] = education[i] && education[i].area;
      this.state.model[`studyType${i + 1}`] = education[i] && education[i].studyType;
      this.state.model[`endDate${i + 1}`] = education[i] && education[i].endDate;
      this.state.model[`courses${i + 1}`] = education[i] && education[i].courses;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  update() {
    const bio = this.props.bio;
    if (bio.education === undefined) {
      bio.education = [];
    }
    const education = bio.education;
    const entries = this.state.entries;
    this.state = { model: {}, entries };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`institution${i + 1}`] = education[i] && education[i].institution;
      this.state.model[`area${i + 1}`] = education[i] && education[i].area;
      this.state.model[`studyType${i + 1}`] = education[i] && education[i].studyType;
      this.state.model[`endDate${i + 1}`] = education[i] && education[i].endDate;
      this.state.model[`courses${i + 1}`] = education[i] && education[i].courses;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  submit(data) {
    const bio = this.props.bio;
    if (bio.education === undefined) {
      bio.education = [];
    }
    const entries = [];
    const dataKeysByEntry = _.groupBy(Object.keys(data), field => field[field.length - 1]);
    for (let i = 0; i < Object.keys(dataKeysByEntry).length; i += 1) {
      if (!data[dataKeysByEntry[(i + 1).toString()][5]]) {
        const entry = data[dataKeysByEntry[(i + 1).toString()][0]] && {
          institution: data[dataKeysByEntry[(i + 1).toString()][0]],
          area: data[dataKeysByEntry[(i + 1).toString()][1]],
          studyType: data[dataKeysByEntry[(i + 1).toString()][2]],
          endDate: data[dataKeysByEntry[(i + 1).toString()][3]],
          courses: _.compact(data[dataKeysByEntry[(i + 1).toString()][4]]),
        };
        entries.push(entry);
      } else entries.push([]);
    }

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.education = updateArray(bio.education, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated education section of bio.');
    this.state.entries = bio.education.length;
    this.props.handleBioChange(bio);
    this.update();
    this.forceUpdate();
  }

  addRow() {
    const entries = this.state.entries + 1;
    const model = this.state.model;
    model[`institution${entries}`] = '';
    model[`area${entries}`] = '';
    model[`studyType${entries}`] = '';
    model[`endDate${entries}`] = '';
    model[`courses${entries}`] = [];
    model[`delete${entries}`] = false;
    this.setState({ model, entries });
    this.forceUpdate();
  }

  render() {
    const model = {};
    for (let i = 0; i < this.state.entries; i += 1) {
      model[`institution${i + 1}`] = { type: String, optional: true, label: '' };
      model[`area${i + 1}`] = { type: String, optional: true, label: '' };
      model[`studyType${i + 1}`] = { type: String, optional: true, label: '' };
      model[`endDate${i + 1}`] = { type: String, optional: true, label: '' };
      model[`courses${i + 1}`] = { type: Array, optional: true, label: '' };
      model[`courses${i + 1}.$`] = { type: String, optional: true, label: '' };
      model[`delete${i + 1}`] = { type: Boolean, optional: true, label: '', defaultValue: false };
    }
    const fields = _.groupBy(Object.keys(model), field => field.match(/\d+/)[0]);
    const formSchema = new SimpleSchema(model);
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
              {_.map(fields, entry => (
                <Table.Row key={entry[0]} verticalAlign="top">
                  <Table.Cell><AutoField name={entry[0]} /></Table.Cell>
                  <Table.Cell>
                    <AutoField placeholder="Program" name={entry[1]} />
                    <AutoField placeholder="Degree" name={entry[2]} />
                    <AutoField placeholder="End Date" name={entry[3]} />
                  </Table.Cell>
                  <Table.Cell>
                    <AutoField name={entry[4]} />
                    <ListAddField name={entry[5]} />
                  </Table.Cell>
                  <Table.Cell><AutoField name={entry[6]} /></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Button type="button" onClick={this.addRow}>+</Button>
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
