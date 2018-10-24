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
    this.state.model.network1 = profiles[0] && profiles[0].network;
    this.state.model.network2 = profiles[1] && profiles[1].network;
    this.state.model.network3 = profiles[2] && profiles[2].network;
    this.state.model.username1 = profiles[0] && profiles[0].username;
    this.state.model.username2 = profiles[1] && profiles[1].username;
    this.state.model.username3 = profiles[2] && profiles[2].username;
    this.state.model.url1 = profiles[0] && profiles[0].url;
    this.state.model.url2 = profiles[1] && profiles[1].url;
    this.state.model.url3 = profiles[2] && profiles[2].url;
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
    const formSchema = new SimpleSchema({
      network1: { type: String, optional: true, label: '' },
      network2: { type: String, optional: true, label: '' },
      network3: { type: String, optional: true, label: '' },
      username1: { type: String, optional: true, label: '' },
      username2: { type: String, optional: true, label: '' },
      username3: { type: String, optional: true, label: '' },
      url1: { type: String, optional: true, label: '' },
      url2: { type: String, optional: true, label: '' },
      url3: { type: String, optional: true, label: '' },
      delete1: { type: Boolean, optional: true, label: '', defaultValue: false },
      delete2: { type: Boolean, optional: true, label: '', defaultValue: false },
      delete3: { type: Boolean, optional: true, label: '', defaultValue: false },

    });
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
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField name="network1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="username1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="url1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete1" />
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField name="network2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="username2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="url2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete2" />
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField name="network3" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="username3" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="url3" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete3" />
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

SimpleBioEditorTabNetwork.propTypes = {
  bio: PropTypes.shape({ basics: React.PropTypes.object }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
