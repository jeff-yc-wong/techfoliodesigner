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
    this.state = { model: {} };
    const bio = this.props.bio;
    if (bio.basics === undefined) {
      bio.basics = {};
    }
    if (bio.basics.profiles === undefined) {
      bio.basics.profiles = [];
    }
    const profiles = bio.basics.profiles;
    for (let i = 0; i < 3; i += 1) {
      this.state.model[`network${i + 1}`] = profiles[i] && profiles[i].network;
      this.state.model[`username${i + 1}`] = profiles[i] && profiles[i].username;
      this.state.model[`url${i + 1}`] = profiles[i] && profiles[i].url;
    }
  }

  submit(data) {
    const
      { network1, network2, network3, username1, username2, username3, url1, url2, url3, delete1, delete2,
        delete3 } = data;
    const bio = this.props.bio;
    if (bio.basics === undefined) {
      bio.basics = {};
    }
    if (bio.basics.profiles === undefined) {
      bio.basics.profiles = [];
    }
    const entries = [];
    if (!delete1) {
      const entry1 = network1 && { network: network1, username: username1, url: url1 };
      entries.push(entry1);
    } else entries.push([]);
    if (!delete2) {
      const entry2 = network2 && { network: network2, username: username2, url: url2 };
      entries.push(entry2);
    } else entries.push([]);
    if (!delete3) {
      const entry3 = network3 && { network: network3, username: username3, url: url3 };
      entries.push(entry3);
    } else entries.push([]);

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
  }

  render() {
    const model = {};
    for (let i = 0; i < 3; i += 1) {
      model[`network${i + 1}`] = { type: String, optional: true, label: '' };
      model[`username${i + 1}`] = { type: String, optional: true, label: '' };
      model[`url${i + 1}`] = { type: String, optional: true, label: '' };
      model[`delete${i + 1}`] = { type: Boolean, optional: true, label: '', defaultValue: false };
    }
    const fields = _.groupBy(Object.keys(model), field => field[field.length - 1]);
    const formSchema = new SimpleSchema(model);
    this.constructor(this.props);
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
          <Button>+</Button>
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
