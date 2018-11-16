import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { _ } from 'underscore';
import { Table, Button } from 'semantic-ui-react';
import { writeBioFile } from './BioFileIO';
import updateArray from './ArrayUpdater';

export default class SimpleBioEditorTabAwards extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.addRow = this.addRow.bind(this);
    this.update = this.update.bind(this);
    let awards = this.props.bio.awards;
    if (awards === undefined) {
      awards = [];
    }
    this.state = { model: {}, entries: awards.length };
    this.state.model.title1 = awards[0] && awards[0].title;
    this.state.model.type1 = awards[0] && awards[0].type;
    this.state.model.date1 = awards[0] && awards[0].date;
    this.state.model.awarder1 = awards[0] && awards[0].awarder;
    this.state.model.summary1 = awards[0] && awards[0].summary;

    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`title${i + 1}`] = awards[i] && awards[i].title;
      this.state.model[`type${i + 1}`] = awards[i] && awards[i].type;
      this.state.model[`date${i + 1}`] = awards[i] && awards[i].date;
      this.state.model[`awarder${i + 1}`] = awards[i] && awards[i].awarder;
      this.state.model[`summary${i + 1}`] = awards[i] && awards[i].summary;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  update() {
    const bio = this.props.bio;
    if (bio.awards === undefined) {
      bio.awards = [];
    }
    const awards = bio.awards;
    const entries = this.state.entries;
    this.state = { model: {}, entries };
    for (let i = 0; i < this.state.entries; i += 1) {
      this.state.model[`title${i + 1}`] = awards[i] && awards[i].title;
      this.state.model[`type${i + 1}`] = awards[i] && awards[i].type;
      this.state.model[`date${i + 1}`] = awards[i] && awards[i].date;
      this.state.model[`awarder${i + 1}`] = awards[i] && awards[i].awarder;
      this.state.model[`summary${i + 1}`] = awards[i] && awards[i].summary;
      this.state.model[`delete${i + 1}`] = false;
    }
  }

  submit(data) {
    const bio = this.props.bio;
    if (bio.awards === undefined) {
      bio.awards = [];
    }
    const entries = [];
    const dataKeysByEntry = _.groupBy(Object.keys(data), field => field[field.length - 1]);
    for (let i = 0; i < Object.keys(dataKeysByEntry).length; i += 1) {
      if (!data[dataKeysByEntry[(i + 1).toString()][5]]) {
        const entry = data[dataKeysByEntry[(i + 1).toString()][0]] && {
          title: data[dataKeysByEntry[(i + 1).toString()][0]],
          type: data[dataKeysByEntry[(i + 1).toString()][1]],
          date: data[dataKeysByEntry[(i + 1).toString()][2]],
          awarder: data[dataKeysByEntry[(i + 1).toString()][3]],
          summary: data[dataKeysByEntry[(i + 1).toString()][4]],
        };
        entries.push(entry);
      } else entries.push([]);
    }

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.awards = updateArray(bio.awards, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated awards section of bio.');
    this.state.entries = bio.awards.length;
    this.props.handleBioChange(bio);
    this.update();
    this.forceUpdate();
  }

  addRow() {
    const entries = this.state.entries + 1;
    const model = this.state.model;
    model[`title${entries}`] = '';
    model[`type${entries}`] = '';
    model[`date${entries}`] = '';
    model[`awarder${entries}`] = '';
    model[`summary${entries}`] = '';
    model[`delete${entries}`] = false;
    this.setState({ model, entries });
    this.forceUpdate();
  }

  render() {
    const model = {};
    for (let i = 0; i < this.state.entries; i += 1) {
      model[`title${i + 1}`] = { type: String, optional: true, label: '' };
      model[`type${i + 1}`] = { type: String, optional: true, label: '' };
      model[`date${i + 1}`] = { type: String, optional: true, label: '' };
      model[`awarder${i + 1}`] = { type: String, optional: true, label: '' };
      model[`summary${i + 1}`] = { type: String, optional: true, label: '' };
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
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Award Information</Table.HeaderCell>
                <Table.HeaderCell>Summary</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {_.map(fields, entry => (
                <Table.Row key={entry[0]} verticalAlign="top">
                  <Table.Cell>
                    <AutoField name={entry[0]} />
                  </Table.Cell>
                  <Table.Cell>
                    <AutoField placeholder="Type" name={entry[1]} />
                    <AutoField placeholder="Date" name={entry[2]} />
                    <AutoField placeholder="Awarder" name={entry[3]} />
                  </Table.Cell>
                  <Table.Cell>
                    <LongTextField name={entry[4]} />
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

SimpleBioEditorTabAwards.propTypes = {
  bio: PropTypes.shape({ awards: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
