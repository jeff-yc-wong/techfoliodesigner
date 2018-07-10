import React from 'react';
import SimpleSchema from 'simpl-schema';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import LongTextField from 'uniforms-semantic/LongTextField';
import { Grid } from 'semantic-ui-react';
import Notify from 'notifyjs';
import fs from 'fs-extra';
import path from 'path';
import { getBioAsJson } from './SimpleBioEditorWindow';

export function writeBioAsJson(bio) {
  const app = require('electron').remote.app; //eslint-disable-line
  const directory = app.techFolioWindowManager.getDirectory();
  const fileType = '_data';
  const fileName = 'bio.json';
  const filePath = path.join(directory, fileType, fileName);
  const bioString = JSON.stringify(bio, null, 2);
  fs.writeFile(filePath, bioString, 'utf8', (err) => {
    const body = (err) ? `File write error: ${err}` : 'File saved.';
    const notification = new Notify('bio.json', { body, renotify: true, tag: 'bio.json' });
    if (!Notify.needsPermission) {
      notification.show();
    } else if (Notify.isSupported()) {
      Notify.requestPermission(() => notification.show(), () => console.log('notification denied'));
    }
  });
}

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
    this.state.model.region = this.props.bio.basics.location.region;
    this.state.model.countryCode = this.props.bio.basics.location.countryCode;
  }

  submit(data) { //eslint-disable-line
    const
      { name, label, picture, email, phone, website, summary, address, postalCode, city, countryCode, region } = data;
    // get most recently saved version of bio.json, just to be safe.
    const app = require('electron').remote.app; //eslint-disable-line
    const bio = getBioAsJson(app);
    bio.basics.name = name || '';
    bio.basics.label = label || '';
    bio.basics.picture = picture || '';
    bio.basics.email = email || '';
    bio.basics.website = website || '';
    bio.basics.summary = summary || '';
    if (phone) bio.basics.phone = phone;
    if (address && bio.basics.location) bio.basics.location.address = address;
    if (postalCode && bio.basics.location) bio.basics.location.postalCode = postalCode;
    if (city && bio.basics.location) bio.basics.location.city = city;
    if (region && bio.basics.location) bio.basics.location.region = region;
    if (countryCode && bio.basics.location) bio.basics.location.countryCode = countryCode;
    writeBioAsJson(bio);
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
      region: { type: String, optional: true, label: 'State' },
      countryCode: { type: String, optional: true, label: 'Country' },
    });
    return (
      <div>
        <AutoForm schema={formSchema} onSubmit={this.submit} model={this.state.model}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column>
                <AutoField name="name" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="label" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="email" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <AutoField name="picture" />
              </Grid.Column>
              <Grid.Column>
                <AutoField name="website" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <LongTextField name="summary" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={3}>
                <AutoField name="phone" />
              </Grid.Column>
              <Grid.Column width={4}>
                <AutoField name="address" />
              </Grid.Column>
              <Grid.Column width={3}>
                <AutoField name="city" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="region" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="postalCode" />
              </Grid.Column>
              <Grid.Column width={2}>
                <AutoField name="countryCode" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <SubmitField value="Submit" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <ErrorsField />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </AutoForm>
      </div>
    );
  }
}

SimpleBioEditorTabBasics.propTypes = {
  bio: PropTypes.shape({ basics: React.PropTypes.object }).isRequired,
};
