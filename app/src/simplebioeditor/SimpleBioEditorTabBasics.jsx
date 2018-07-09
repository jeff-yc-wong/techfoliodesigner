import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Segment } from 'semantic-ui-react';
import { getBioAsJson } from './SimpleBioEditorWindow';

export default class SimpleBioEditorTabBasics extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { model: {} };
    this.state.model.name = this.props.bio.basics.name;
    this.state.model.label = this.props.bio.basics.label;
    this.state.model.picture = this.props.bio.basics.picture;
    this.state.model.email = this.props.bio.basics.email;
    this.state.model.phone = this.props.bio.basics.phone;
    this.state.model.website = this.props.bio.basics.website;
    this.state.model.summary = this.props.bio.basics.summary;
    this.state.model.address = this.props.bio.basics.location.address;
    this.state.model.postalCode = this.props.bio.basics.location.postalCode;
    this.state.model.city = this.props.bio.basics.location.city;
    this.state.model.countryCode = this.props.bio.basics.location.countryCode;
  }

  submit(data) { //eslint-disable-line
    const { name, label, picture, email, phone, website, summary, address, postalCode, city, countryCode } = data;
    // get most recently saved version of bio.json, just to be safe.
    const bio = getBioAsJson();
    bio.basics.name = name || '';
    bio.basics.label = label || '';
    bio.basics.picture = picture || '';
    bio.basics.email = email || '';
    bio.basics.phone = phone || '';
    bio.basics.website = website || '';
    bio.basics.summary = summary || '';
    bio.basics.location.address = address || '';
    bio.basics.location.postalCode = postalCode || '';
    bio.basics.location.city = city || '';
    bio.basics.location.countryCode = countryCode || '';
  }

  render() {
    const formSchema = new SimpleSchema({
      name: String,
      label: String,
      picture: String,
      email: String,
      phone: { type: String, optional: true },
      website: String,
      summary: String,
      address: { type: String, optional: true },
      postalCode: { type: String, optional: true, label: 'Zip Code' },
      city: { type: String, optional: true },
      countryCode: { type: String, optional: true, label: 'Country' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit}>
          <Segment>
            <AutoField name="name" />
            <AutoField name="label" />
            <AutoField name="picture" />
            <AutoField name="email" />
            <AutoField name="phone" />
            <AutoField name="website" />
            <AutoField name="summary" />
            <AutoField name="address" />
            <AutoField name="postalCode" />
            <AutoField name="city" />
            <AutoField name="countryCode" />
            <SubmitField value="Submit" />
            <ErrorsField />
          </Segment>
        </AutoForm>
      </div>
    );
  }
}

SimpleBioEditorTabBasics.propTypes = {
  bio: PropTypes.shape({ basics: {} }).isRequired,
};
