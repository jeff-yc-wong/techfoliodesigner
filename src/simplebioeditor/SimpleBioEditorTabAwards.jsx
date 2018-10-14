import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
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
    this.state = { model: {} };
    let awards = this.props.bio.awards;
    if (awards === undefined) {
      awards = [];
    }
    this.state.model.title1 = awards[0] && awards[0].title;
    this.state.model.title2 = awards[1] && awards[1].title;
    this.state.model.type1 = awards[0] && awards[0].type;
    this.state.model.type2 = awards[1] && awards[1].type;
    this.state.model.date1 = awards[0] && awards[0].date;
    this.state.model.date2 = awards[1] && awards[1].date;
    this.state.model.awarder1 = awards[0] && awards[0].awarder;
    this.state.model.awarder2 = awards[1] && awards[1].awarder;
    this.state.model.summary1 = awards[0] && awards[0].summary;
    this.state.model.summary2 = awards[1] && awards[1].summary;
  }

  submit(data) {
    const { title1, title2, type1, date1, awarder1, summary1, type2, date2, awarder2, summary2, delete1, delete2 }
    = data;
    const bio = this.props.bio;
    if (bio.awards === undefined) {
      bio.awards = [];
    }
    const entries = [];
    if (!delete1) {
      const entry1 = title1 && { title: title1, type: type1, date: date1, awarder: awarder1, summary: summary1 };
      entries.push(entry1);
    } else entries.push([]);
    if (!delete2) {
      const entry2 = title2 && { title: title2, type: type2, date: date2, awarder: awarder2, summary: summary2 };
      entries.push(entry2);
    } else entries.push([]);

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.awards = updateArray(bio.awards, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated awards section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      title1: { type: String, optional: true, label: '' },
      title2: { type: String, optional: true, label: '' },
      type1: { type: String, optional: true, label: '' },
      type2: { type: String, optional: true, label: '' },
      date1: { type: String, optional: true, label: '' },
      date2: { type: String, optional: true, label: '' },
      awarder1: { type: String, optional: true, label: '' },
      awarder2: { type: String, optional: true, label: '' },
      summary1: { type: String, optional: true, label: '' },
      summary2: { type: String, optional: true, label: '' },
      delete1: { type: Boolean, optional: true, label: '', defaultValue: false },
      delete2: { type: Boolean, optional: true, label: '', defaultValue: false },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Awarder</Table.HeaderCell>
                <Table.HeaderCell>Summary</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <AutoField name="title1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="type1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="date1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="awarder1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="summary1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete1" />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <AutoField name="title2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="type2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="date2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="awarder2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="summary2" />
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

SimpleBioEditorTabAwards.propTypes = {
  bio: PropTypes.shape({ awards: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
