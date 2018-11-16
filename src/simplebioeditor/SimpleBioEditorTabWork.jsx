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

/* eslint max-len: 0 */

export default class SimpleBioEditorTabWork extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.addRow = this.addRow.bind(this);
    this.update = this.update.bind(this);
    const bio = this.props.bio;
    if (bio.work === undefined) {
      bio.work = [];
    }
    const work = bio.work;
    this.state = { model: {}, entries: work.length };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`company${i + 1}`] = work[i] && work[i].company;
      this.state.model[`position${i + 1}`] = work[i] && work[i].position;
      this.state.model[`website${i + 1}`] = work[i] && work[i].website;
      this.state.model[`startDate${i + 1}`] = work[i] && work[i].startDate;
      this.state.model[`endDate${i + 1}`] = work[i] && work[i].endDate;
      this.state.model[`summary${i + 1}`] = work[i] && work[i].summary;
      this.state.model[`highlights${i + 1}`] = work[i] && work[i].highlights;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  update() {
    const bio = this.props.bio;
    if (bio.work === undefined) {
      bio.work = [];
    }
    const work = bio.work;
    const entries = this.state.entries;
    this.state = { model: {}, entries };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`company${i + 1}`] = work[i] && work[i].company;
      this.state.model[`position${i + 1}`] = work[i] && work[i].position;
      this.state.model[`website${i + 1}`] = work[i] && work[i].website;
      this.state.model[`startDate${i + 1}`] = work[i] && work[i].startDate;
      this.state.model[`endDate${i + 1}`] = work[i] && work[i].endDate;
      this.state.model[`summary${i + 1}`] = work[i] && work[i].summary;
      this.state.model[`highlights${i + 1}`] = work[i] && work[i].highlights;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  submit(data) {
    const bio = this.props.bio;
    if (bio.work === undefined) {
      bio.work = [];
    }
    const entries = [];
    const dataKeysByEntry = _.groupBy(Object.keys(data), field => field[field.length - 1]);
    for (let i = 0; i < Object.keys(dataKeysByEntry).length; i += 1) {
      if (!data[dataKeysByEntry[(i + 1).toString()][7]]) {
        const entry = data[dataKeysByEntry[(i + 1).toString()][0]] && {
          company: data[dataKeysByEntry[(i + 1).toString()][0]],
          position: data[dataKeysByEntry[(i + 1).toString()][1]],
          website: data[dataKeysByEntry[(i + 1).toString()][2]],
          startDate: data[dataKeysByEntry[(i + 1).toString()][3]],
          endDate: data[dataKeysByEntry[(i + 1).toString()][4]],
          summary: data[dataKeysByEntry[(i + 1).toString()][5]],
          highlights: _.compact(data[dataKeysByEntry[(i + 1).toString()][6]]),
        };
        entries.push(entry);
      } else entries.push([]);
    }

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.work = updateArray(bio.work, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated work section of bio.');
    this.state.entries = bio.work.length;
    this.props.handleBioChange(bio);
    this.update();
    this.forceUpdate();
  }

  addRow() {
    const entries = this.state.entries + 1;
    const model = this.state.model;
    model[`company${entries}`] = '';
    model[`position${entries}`] = '';
    model[`website${entries}`] = '';
    model[`startDate${entries}`] = '';
    model[`endDate${entries}`] = '';
    model[`summary${entries}`] = '';
    model[`highlights${entries}`] = [];
    model[`delete${entries}`] = false;
    this.setState({ model, entries });
    this.forceUpdate();
  }

  render() {
    const model = {};
    for (let i = 0; i < this.state.entries; i += 1) {
      model[`company${i + 1}`] = { type: String, optional: true, label: '' };
      model[`position${i + 1}`] = { type: String, optional: true, label: '' };
      model[`website${i + 1}`] = { type: String, optional: true, label: '' };
      model[`startDate${i + 1}`] = { type: String, optional: true, label: '' };
      model[`endDate${i + 1}`] = { type: String, optional: true, label: '' };
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
                <Table.HeaderCell>Job Information</Table.HeaderCell>
                <Table.HeaderCell>Start/End Dates</Table.HeaderCell>
                <Table.HeaderCell>Highlights</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {_.map(fields, entry => (
                <Table.Row key={entry[0]} verticalAlign="top">
                  <Table.Cell>
                    <AutoField placeholder="Company" name={entry[0]} />
                    <AutoField placeholder="Position" name={entry[1]} />
                    <AutoField placeholder="Website" name={entry[2]} />
                    <AutoField placeholder="Summary" name={entry[5]} />
                  </Table.Cell>
                  <Table.Cell>
                    <AutoField placeholder="Start Date" name={entry[3]} />
                    <AutoField placeholder="End Date" name={entry[4]} />
                  </Table.Cell>
                  <Table.Cell>
                    <AutoField name={entry[6]} />
                    <ListAddField name={entry[7]} />
                  </Table.Cell>
                  <Table.Cell><AutoField name={entry[8]} /></Table.Cell>
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

SimpleBioEditorTabWork.propTypes = {
  bio: PropTypes.shape({ work: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
