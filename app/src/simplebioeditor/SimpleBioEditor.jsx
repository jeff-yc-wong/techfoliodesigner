import React from 'react';
import SimpleSchema from 'simpl-schema';


export default class SimpleBioEditor extends React.Component {

  submit(data) {
    console.log('submit', data);
  }

  render() {
    const formSchema = new SimpleSchema({
      name: String,
      label: String,
      picture: String,
      email: String,
      phone: String,
      website: String,
      summary: String,
      address: String,
      city: String,
      countryCode: String,
      region: String,
      githubUsername: String,
      githubUrl: String,
      linkedinUsername: String,
      linkedInUrl: String,
    });
    return (
      <div>
        <p>bio editor goes here.</p>
      </div>
    );
  }
}
