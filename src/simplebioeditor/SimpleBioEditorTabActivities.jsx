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
    this.state = { model: {} };
    let volunteer = this.props.bio.volunteer;
    if (volunteer === undefined) {
      volunteer = [];
    }
    this.state.model.organization1 = volunteer[0] && volunteer[0].organization;
    this.state.model.organization2 = volunteer[1] && volunteer[1].organization;
    this.state.model.position1 = volunteer[0] && volunteer[0].position;
    this.state.model.position2 = volunteer[1] && volunteer[1].position;
    this.state.model.summary1 = volunteer[0] && volunteer[0].summary;
    this.state.model.summary2 = volunteer[1] && volunteer[1].summary;
    this.state.model.highlights1 = volunteer[0] && volunteer[0].highlights;
    this.state.model.highlights2 = volunteer[1] && volunteer[1].highlights;
  }

  submit(data) {
    const {
      organization1, organization2, position1, position2, summary1, summary2, highlights1, highlights2, delete1,
      delete2 } = data;
    const bio = this.props.bio;
    if (bio.volunteer === undefined) {
      bio.volunteer = [];
    }
    const entries = [];
    if (!delete1) {
      const entry1 = organization1 && {
        organization: organization1,
        position: position1,
        summary: summary1,
        highlights: _.compact(highlights1),
      };
      entries.push(entry1);
    } else entries.push([]);

    if (!delete2) {
      const entry2 = organization2 && {
        organization: organization2,
        position: position2,
        summary: summary2,
        highlights: _.compact(highlights2),
      };
      entries.push(entry2);
    } else entries.push([]);

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.volunteer = updateArray(bio.volunteer, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated activities section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      organization1: { type: String, optional: true, label: '' },
      organization2: { type: String, optional: true, label: '' },
      position1: { type: String, optional: true, label: '' },
      position2: { type: String, optional: true, label: '' },
      summary1: { type: String, optional: true, label: '' },
      summary2: { type: String, optional: true, label: '' },
      highlights1: { type: Array, optional: true, label: '' },
      'highlights1.$': { type: String, optional: true, label: '' },
      highlights2: { type: Array, optional: true, label: '' },
      'highlights2.$': { type: String, optional: true, label: '' },
      delete1: { type: Boolean, optional: true, label: '', defaultValue: false },
      delete2: { type: Boolean, optional: true, label: '', defaultValue: false },
    });
    this.constructor(this.props);
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
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField placeholder="Organization" name="organization1" />
                  <AutoField placeholder="Position" name="position1" />
                </Table.Cell>
                <Table.Cell>
                  <LongTextField name="summary1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="highlights1" />
                  <ListAddField name="highlights1.$" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete1" />
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField placeholder="Organization" name="organization2" />
                  <AutoField placeholder="Position" name="position2" />
                </Table.Cell>
                <Table.Cell>
                  <LongTextField name="summary2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="highlights2" />
                  <ListAddField name="highlights2.$" />
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

SimpleBioEditorTabActivities.propTypes = {
  bio: PropTypes.shape({ volunteer: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
