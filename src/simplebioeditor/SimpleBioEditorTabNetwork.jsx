import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Table, Button } from 'semantic-ui-react';
import { _ } from 'underscore';
import { writeBioFile } from './BioFileIO';
import updateArray from './ArrayUpdater';

export default class SimpleBioEditorTabNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.addRow = this.addRow.bind(this);
    const bio = this.props.bio;
    if (bio.basics === undefined) {
      bio.basics = {};
    }
    if (bio.basics.profiles === undefined) {
      bio.basics.profiles = [];
    }
    const profiles = bio.basics.profiles;
    this.state = { model: {}, entries: profiles.length };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`network${i + 1}`] = profiles[i] && profiles[i].network;
      this.state.model[`username${i + 1}`] = profiles[i] && profiles[i].username;
      this.state.model[`url${i + 1}`] = profiles[i] && profiles[i].url;
      this.state.model[`delete${i + 1}`] = false;
    }
    console.log('constructor');
    console.log(this.state.entries);
    console.log(this.state.model);
  }

  submit(data) {
    const bio = this.props.bio;
    if (bio.basics === undefined) {
      bio.basics = {};
    }
    if (bio.basics.profiles === undefined) {
      bio.basics.profiles = [];
    }
    const entries = [];
    const dataKeysByEntry = _.groupBy(Object.keys(data), field => field[field.length - 1]);
    for (let i = 0; i < Object.keys(dataKeysByEntry).length; i += 1) {
      if (!data[dataKeysByEntry[(i + 1).toString()][3]]) {
        const entry = data[dataKeysByEntry[(i + 1).toString()][0]] && {
          network: data[dataKeysByEntry[(i + 1).toString()][0]],
          username: data[dataKeysByEntry[(i + 1).toString()][1]],
          url: data[dataKeysByEntry[(i + 1).toString()][2]],
        };
        entries.push(entry);
      } else entries.push([]);
    }

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.basics.profiles = updateArray(bio.basics.profiles, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated network section of bio.');
    this.props.handleBioChange(bio);
    // this.constructor(this.props);
  }

  addRow() {
    console.log('add button clicked');
    const entries = this.state.entries + 1;
    const model = this.state.model;
    model[`network${entries}`] = '';
    model[`username${entries}`] = '';
    model[`url${entries}`] = '';
    model[`delete${entries}`] = false;
    this.state.entries = entries;
    this.state.model = model;
    console.log(this.state.entries);
    console.log(this.state.model);
  }

  render() {
    const model = {};
    // this.constructor(this.props);
    for (let i = 0; i < this.state.entries; i += 1) {
      model[`network${i + 1}`] = { type: String, optional: true, label: '' };
      model[`username${i + 1}`] = { type: String, optional: true, label: '' };
      model[`url${i + 1}`] = { type: String, optional: true, label: '' };
      model[`delete${i + 1}`] = { type: Boolean, optional: true, label: '', defaultValue: false };
    }
    const fields = _.groupBy(Object.keys(model), field => field[field.length - 1]);
    const formSchema = new SimpleSchema(model);
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Network</Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>URL</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(fields, entry => (
                <Table.Row key={entry[0]} verticalAlign="top">
                  <Table.Cell><AutoField name={entry[0]} /></Table.Cell>
                  <Table.Cell><AutoField name={entry[1]} /></Table.Cell>
                  <Table.Cell><AutoField name={entry[2]} /></Table.Cell>
                  <Table.Cell><AutoField name={entry[3]} /></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Button onClick={this.addRow}>+</Button>
          {/*<Button onClick={this.submit}>Save</Button>*/}
          <SubmitField value="Save" />
          <ErrorsField />
        </AutoForm>
      </div>
    );
  }
}

SimpleBioEditorTabNetwork.propTypes = {
  bio: PropTypes.shape({ basics: React.PropTypes.object }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
