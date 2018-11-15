import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import LongTextField from 'uniforms-semantic/LongTextField';
import ListAddField from 'uniforms-semantic/ListAddField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Table, Button } from 'semantic-ui-react';
import { _ } from 'underscore';
import { writeBioFile } from './BioFileIO';
import updateArray from './ArrayUpdater';

export default class SimpleBioEditorTabActivities extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.addRow = this.addRow.bind(this);
    this.update = this.update.bind(this);
    let volunteer = this.props.bio.volunteer;
    if (volunteer === undefined) {
      volunteer = [];
    }
    this.state = { model: {}, entries: volunteer.length };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`organization${i + 1}`] = volunteer[i] && volunteer[i].organization;
      this.state.model[`position${i + 1}`] = volunteer[i] && volunteer[i].position;
      this.state.model[`summary${i + 1}`] = volunteer[i] && volunteer[i].summary;
      this.state.model[`highlights${i + 1}`] = volunteer[i] && volunteer[i].highlights;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  update() {
    const bio = this.props.bio;
    if (bio.volunteer === undefined) {
      bio.volunteer = [];
    }
    const volunteer = bio.volunteer;
    const entries = this.state.entries;
    this.state = { model: {}, entries };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`organization${i + 1}`] = volunteer[i] && volunteer[i].organization;
      this.state.model[`position${i + 1}`] = volunteer[i] && volunteer[i].position;
      this.state.model[`summary${i + 1}`] = volunteer[i] && volunteer[i].summary;
      this.state.model[`highlights${i + 1}`] = volunteer[i] && volunteer[i].highlights;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  submit(data) {
    const bio = this.props.bio;
    if (bio.volunteer === undefined) {
      bio.volunteer = [];
    }
    const entries = [];
    const dataKeysByEntry = _.groupBy(Object.keys(data), field => field[field.length - 1]);
    for (let i = 0; i < Object.keys(dataKeysByEntry).length; i += 1) {
      if (!data[dataKeysByEntry[(i + 1).toString()][4]]) {
        const entry = data[dataKeysByEntry[(i + 1).toString()][0]] && {
          organization: data[dataKeysByEntry[(i + 1).toString()][0]],
          position: data[dataKeysByEntry[(i + 1).toString()][1]],
          summary: data[dataKeysByEntry[(i + 1).toString()][2]],
          highlights: _.compact(data[dataKeysByEntry[(i + 1).toString()][3]]),
        };
        entries.push(entry);
      } else entries.push([]);
    }

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.volunteer = updateArray(bio.volunteer, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated activities section of bio.');
    this.state.entries = bio.volunteer.length;
    this.props.handleBioChange(bio);
    this.update();
    this.forceUpdate();
  }

  addRow() {
    const entries = this.state.entries + 1;
    const model = this.state.model;
    model[`organization${entries}`] = '';
    model[`position${entries}`] = '';
    model[`summary${entries}`] = '';
    model[`highlights${entries}`] = [];
    model[`delete${entries}`] = false;
    this.setState({ model, entries });
    this.forceUpdate();
  }

  render() {
    const model = {};
    for (let i = 0; i < this.state.entries; i += 1) {
      model[`organization${i + 1}`] = { type: String, optional: true, label: '' };
      model[`position${i + 1}`] = { type: String, optional: true, label: '' };
      model[`summary${i + 1}`] = { type: String, optional: true, label: '' };
      model[`highlights${i + 1}`] = { type: Array, optional: true, label: '' };
      model[`highlights${i + 1}.$`] = { type: String, optional: true, label: '' };
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
                <Table.HeaderCell>Organization/Position</Table.HeaderCell>
                <Table.HeaderCell>Summary</Table.HeaderCell>
                <Table.HeaderCell>Highlights</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {_.map(fields, entry => (
                <Table.Row key={entry[0]} verticalAlign="top">
                  <Table.Cell>
                    <AutoField placeholder="Organization" name={entry[0]} />
                    <AutoField placeholder="Position" name={entry[1]} />
                  </Table.Cell>
                  <Table.Cell>
                    <LongTextField name={entry[2]} />
                  </Table.Cell>
                  <Table.Cell>
                    <AutoField name={entry[3]} />
                    <ListAddField name={entry[4]} />
                  </Table.Cell>
                  <Table.Cell>
                    <AutoField name={entry[5]} />
                  </Table.Cell>
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

SimpleBioEditorTabActivities.propTypes = {
  bio: PropTypes.shape({ volunteer: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
