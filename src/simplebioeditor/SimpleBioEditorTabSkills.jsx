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

export default class SimpleBioEditorTabSkills extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    let skills = this.props.bio.skills;
    if (skills === undefined) {
      skills = [];
    }
    this.state.model.name1 = skills[0] && skills[0].name;
    this.state.model.name2 = skills[1] && skills[1].name;
    this.state.model.keywords1 = skills[0] && skills[0].keywords;
    this.state.model.keywords2 = skills[1] && skills[1].keywords;
  }

  submit(data) {
    const { name1, delete1, name2, delete2, keywords1, keywords2 } = data;
    const bio = this.props.bio;
    if (bio.skills === undefined) {
      bio.skills = [];
    }
    const entries = [];
    if (!delete1) {
      const entry1 = name1 && {
        name: name1,
        keywords: _.compact(keywords1),
      };
      entries.push(entry1);
    } else entries.push([]);

    if (!delete2) {
      const entry2 = name2 && {
        name: name2,
        keywords: _.compact(keywords2),
      };
      entries.push(entry2);
    } else entries.push([]);

    for (let i = 0, j = 0; i < entries.length; i += 1) {
      bio.skills = updateArray(bio.skills, entries[i], j);
      // if entry is defined and not null nor empty string
      // otherwise, updatedArray deletes the element at position j so j should not increment
      if (entries[i] && !_.isEmpty(entries[i])) {
        j += 1;
      }
    }
    writeBioFile(this.props.directory, bio, 'Updated skills section of bio.');
    this.props.handleBioChange(bio);
  }

  render() {
    const formSchema = new SimpleSchema({
      name1: { type: String, optional: true, label: '' },
      delete1: { type: Boolean, optional: true, label: '', defaultValue: false },
      name2: { type: String, optional: true, label: '' },
      delete2: { type: Boolean, optional: true, label: '', defaultValue: false },
      keywords1: { type: Array, optional: true, label: '' },
      'keywords1.$': { type: String, optional: true, label: '' },
      keywords2: { type: Array, optional: true, label: '' },
      'keywords2.$': { type: String, optional: true, label: '' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Skill</Table.HeaderCell>
                <Table.HeaderCell>Keywords</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField name="name1" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="keywords1" />
                  <ListAddField name="keywords1.$" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="delete1" />
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell>
                  <AutoField name="name2" />
                </Table.Cell>
                <Table.Cell>
                  <AutoField name="keywords2" />
                  <ListAddField name="keywords2.$" />
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

SimpleBioEditorTabSkills.propTypes = {
  bio: PropTypes.shape({ skills: React.PropTypes.array }).isRequired,
  handleBioChange: PropTypes.func.isRequired,
  directory: PropTypes.string.isRequired,
};
