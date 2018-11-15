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

export default class SimpleBioEditorTabInterests extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.addRow = this.addRow.bind(this);
    this.update = this.update.bind(this);
    let interests = this.props.bio.interests;
    if (interests === undefined) {
      interests = [];
    }
    this.state = { model: {}, entries: interests.length };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`name${i + 1}`] = interests[i] && interests[i].name;
      this.state.model[`keywords${i + 1}`] = interests[i] && interests[i].keywords;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  update() {
    const bio = this.props.bio;
    if (bio.interests === undefined) {
      bio.interests = [];
    }
    const interests = bio.interests;
    const entries = this.state.entries;
    this.state = { model: {}, entries };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`name${i + 1}`] = interests[i] && interests[i].name;
      this.state.model[`keywords${i + 1}`] = interests[i] && interests[i].keywords;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  submit(data) {
    const bio = this.props.bio;
    if (bio.interests === undefined) {
      bio.interests = [];
    }
    const entries = [];
    const dataKeysByEntry = _.groupBy(Object.keys(data), field => field[field.length - 1]);
    for (let i = 0; i < Object.keys(dataKeysByEntry).length; i += 1) {
      if (!data[dataKeysByEntry[(i + 1).toString()][2]]) {
        const entry = data[dataKeysByEntry[(i + 1).toString()][0]] && {
          name: data[dataKeysByEntry[(i + 1).toString()][0]],
          keywords: _.compact(data[dataKeysByEntry[(i + 1).toString()][1]]),
        };
        entries.push(entry);
      } else entries.push([]);
    }

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.interests = updateArray(bio.interests, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated interests section of bio.');
    this.state.entries = bio.interests.length;
    this.props.handleBioChange(bio);
    this.update();
    this.forceUpdate();
  }

  addRow() {
    const entries = this.state.entries + 1;
    const model = this.state.model;
    model[`name${entries}`] = '';
    model[`keywords${entries}`] = [];
    model[`delete${entries}`] = false;
    this.setState({ model, entries });
    this.forceUpdate();
  }

  render() {
    const model = {};
    for (let i = 0; i < this.state.entries; i += 1) {
      model[`name${i + 1}`] = { type: String, optional: true, label: '' };
      model[`keywords${i + 1}`] = { type: Array, optional: true, label: '' };
      model[`keywords${i + 1}.$`] = { type: String, optional: true, label: '' };
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
                <Table.HeaderCell>Interest</Table.HeaderCell>
                <Table.HeaderCell>Keywords</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {_.map(fields, entry => (
                <Table.Row key={entry[0]} verticalAlign="top">
                  <Table.Cell><AutoField name={entry[0]} /></Table.Cell>
                  <Table.Cell>
                    <AutoField name={entry[1]} />
                    <ListAddField name={entry[2]} />
                  </Table.Cell>
                  <Table.Cell><AutoField name={entry[3]} /></Table.Cell>
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

SimpleBioEditorTabInterests.propTypes = {
  bio: PropTypes.shape({ interests: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
