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
    this.state = { model: {} };
    const bio = this.props.bio;
    if (bio.work === undefined) {
      bio.work = [];
    }
    const work = bio.work;
    this.state.model.company1 = work[0] && work[0].company;
    this.state.model.company2 = work[1] && work[1].company;
    this.state.model.company3 = work[2] && work[2].company;
    this.state.model.position1 = work[0] && work[0].position;
    this.state.model.position2 = work[1] && work[1].position;
    this.state.model.position3 = work[2] && work[2].position;
    this.state.model.website1 = work[0] && work[0].website;
    this.state.model.website2 = work[1] && work[1].website;
    this.state.model.website3 = work[2] && work[2].website;
    this.state.model.startDate1 = work[0] && work[0].startDate;
    this.state.model.startDate2 = work[1] && work[1].startDate;
    this.state.model.startDate3 = work[2] && work[2].startDate;
    this.state.model.endDate1 = work[0] && work[0].endDate;
    this.state.model.endDate2 = work[1] && work[1].endDate;
    this.state.model.endDate3 = work[2] && work[2].endDate;
    this.state.model.summary1 = work[0] && work[0].summary;
    this.state.model.summary2 = work[1] && work[1].summary;
    this.state.model.summary3 = work[2] && work[2].summary;
    this.state.model.highlights1 = work[0] && work[0].highlights;
    this.state.model.highlights2 = work[1] && work[1].highlights;
    this.state.model.highlights3 = work[2] && work[2].highlights;
  }

  submit(data) {
    const {
      company1, company2, company3, position1, position2, position3, website1, website2, website3,
      startDate1, startDate2, startDate3, endDate1, endDate2, endDate3, summary1, summary2, summary3,
      highlights1, highlights2, highlights3, delete1, delete2, delete3 } = data;
    const bio = this.props.bio;
    if (bio.work === undefined) {
      bio.work = [];
    }
    const entries = [];
    if (!delete1) {
      const entry1 = company1 && {
        company: company1,
        position: position1,
        website: website1,
        startDate: startDate1,
        endDate: endDate1,
        summary: summary1,
        highlights: _.compact(highlights1),
      };
      entries.push(entry1);
    } else entries.push([]);

    if (!delete2) {
      const entry2 = company2 && {
        company: company2,
        position: position2,
        website: website2,
        startDate: startDate2,
        endDate: endDate2,
        summary: summary2,
        highlights: _.compact(highlights2),
      };
      entries.push(entry2);
    } else entries.push([]);

    if (!delete3) {
      const entry3 = company3 && {
        company: company3,
        position: position3,
        website: website3,
        startDate: startDate3,
        endDate: endDate3,
        summary: summary3,
        highlights: _.compact(highlights3),
      };
      entries.push(entry3);
    } else entries.push([]);

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.work = updateArray(bio.work, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated work section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      company1: { type: String, optional: true, label: '' },
      company2: { type: String, optional: true, label: '' },
      company3: { type: String, optional: true, label: '' },
      position1: { type: String, optional: true, label: '' },
      position2: { type: String, optional: true, label: '' },
      position3: { type: String, optional: true, label: '' },
      website1: { type: String, optional: true, label: '' },
      website2: { type: String, optional: true, label: '' },
      website3: { type: String, optional: true, label: '' },
      startDate1: { type: String, optional: true, label: '' },
      startDate2: { type: String, optional: true, label: '' },
      startDate3: { type: String, optional: true, label: '' },
      endDate1: { type: String, optional: true, label: '' },
      endDate2: { type: String, optional: true, label: '' },
      endDate3: { type: String, optional: true, label: '' },
      summary1: { type: String, optional: true, label: '' },
      summary2: { type: String, optional: true, label: '' },
      summary3: { type: String, optional: true, label: '' },
      highlights1: { type: Array, optional: true, label: '' },
      'highlights1.$': { type: String, optional: true, label: '' },
      highlights2: { type: Array, optional: true, label: '' },
      'highlights2.$': { type: String, optional: true, label: '' },
      highlights3: { type: Array, optional: true, label: '' },
      'highlights3.$': { type: String, optional: true, label: '' },
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
                <Table.HeaderCell>Job Information</Table.HeaderCell>
                <Table.HeaderCell>Start/End Dates</Table.HeaderCell>
                <Table.HeaderCell>Highlights</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField placeholder="Company" name="company1" />
                  <AutoField placeholder="Position" name="position1" />
                  <AutoField placeholder="Website" name="website1" />
                  <AutoField placeholder="Summary" name="summary1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField placeholder="Start Date" name="startDate1" />
                  <AutoField placeholder="End Date" name="endDate1" />
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
                  <AutoField placeholder="Company" name="company2" />
                  <AutoField placeholder="Position" name="position2" />
                  <AutoField placeholder="Website" name="website2" />
                  <AutoField placeholder="Summary" name="summary2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField placeholder="Start Date" name="startDate2" />
                  <AutoField placeholder="End Date" name="endDate2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="highlights2" />
                  <ListAddField name="highlights2.$" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete2" />
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField placeholder="Company" name="company3" />
                  <AutoField placeholder="Position" name="position3" />
                  <AutoField placeholder="Website" name="website3" />
                  <AutoField placeholder="Summary" name="summary3" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField placeholder="Start Date" name="startDate3" />
                  <AutoField placeholder="End Date" name="endDate3" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="highlights3" />
                  <ListAddField name="highlights3.$" />
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

SimpleBioEditorTabWork.propTypes = {
  bio: PropTypes.shape({ work: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
