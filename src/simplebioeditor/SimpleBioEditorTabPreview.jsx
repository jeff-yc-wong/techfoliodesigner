import React from 'react';
import { _ } from 'underscore';
import PropTypes from 'prop-types';
import { getBioAsJson } from './SimpleBioEditorWindow';

/* eslint max-len: 0 */

export default class SimpleBioEditorTabPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bio: getBioAsJson(this.props.directory) };
  }

  render() {
    return (
      <div>
        <div style={{ marginTop: '10px' }} className="ui stackable grid container">

          <div className="sixteen wide column no-bottom">
            <h2 className="ui center aligned header no-bottom">{this.props.bio.basics.name || ''}</h2>
          </div>

          <div className="eight wide left aligned column">
            <p className="ui no-bottom">
              <i className="large home icon " />
              {this.props.bio.basics.website.replace(/^https?:\/\//, '')} <br />
              <i className="large mail outline icon " />
              {this.props.bio.basics.email} <br />
              {_.map(this.props.bio.basics.profiles, (entry, i) => (
                <div key={i}>
                  <i className={`large icon ${entry.network.toLowerCase()}`} />
                  {entry.username}
                </div>
              ))}
            </p>
          </div>

          <div className="eight wide right aligned column">
            <p className="ui no-bottom">
              { this.props.bio.basics.location.address } <br />
              { this.props.bio.basics.location.city },&nbsp;
              { this.props.bio.basics.location.region }&nbsp;
              { this.props.bio.basics.location.postalCode }&nbsp;
              { this.props.bio.basics.location.countryCode } <br />
              { this.props.bio.basics.phone }
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }} className="ui stackable grid container">
          <div className="row">
            <div className="two wide column">
              {this.props.bio.interests ? <h3 className="ui left aligned header no-bottom">Interests</h3> : '' }
            </div>

            <div className="fourteen wide column no-bottom">
              <p className="ui no-bottom">
                {_.map(this.props.bio.interests, (entry, index) => (
                    index === 0 ?
                        `${entry.name}${entry.keywords[0] ? ` (${_.map(entry.keywords, keyword => `${keyword}`)})` : ''}` :
                        `, ${entry.name}${entry.keywords[0] ? ` (${_.map(entry.keywords, keyword => `${keyword}`)})` : ''}`
                ))}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="two wide column">
              {this.props.bio.skills ? <h3 className="ui left aligned header no-bottom">Skills</h3> : '' }
            </div>

            <div className="fourteen wide column no-bottom">
              {_.map(this.props.bio.skills, (entry, i) => (
                <p key={i} className="ui no-bottom">
                  <b>{entry.name}: </b>
                  {_.map(entry.keywords, (keyword, index) => (index === 0 ? `${keyword}` : `, ${keyword}`))}
                </p>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="two wide column">
              {this.props.bio.education ? <h3 className="ui left aligned header no-bottom">Education</h3> : '' }
            </div>

            <div className="fourteen wide column no-bottom">
              {_.map(this.props.bio.education, (entry, i) => (
                <div key={i} className="ui grid">
                  <div className="twelve wide column no-bottom">
                    <p className="ui no-bottom"><b>{ entry.institution }</b></p>
                    <p className="ui no-bottom">{ entry.studyType }, { entry.area }</p>
                    <ul style={{ margin: '0px' }}>
                      {_.map(entry.courses, (course, index) => (
                        <li key={index}>{ course }</li>
                      ))}
                    </ul>
                  </div>
                  <div className="four wide right aligned column no-bottom">
                    <p className="ui no-bottom"><b>
                      { entry.startDate.slice(0, 4) }&nbsp;-&nbsp;
                      { entry.endDate !== 'Present' ? entry.endDate.slice(0, 4) : entry.endDate }
                    </b></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="two wide column">
              {this.props.bio.work ? <h3 className="ui left aligned header no-bottom">Work</h3> : '' }
            </div>

            <div className="fourteen wide column no-bottom">
              {_.map(this.props.bio.work, (entry, i) => (
                <div key={i} className="ui grid">
                  <div className="twelve wide column no-bottom">
                    <p className="ui no-bottom">
                      <b>{ entry.position }, { entry.company }</b> <br />
                      { entry.website.replace(/^https?:\/\//, '') } <br />
                      { entry.summary }
                    </p>
                    <ul style={{ margin: '0px' }}>
                      {_.map(entry.highlights, (highlight, index) => (
                        <li key={index}>{ highlight }</li>
                      ))}
                    </ul>
                  </div>
                  <div className="four wide right aligned column no-bottom">
                    <p className="ui no-bottom"><b>
                      { entry.startDate.slice(0, 4) }&nbsp;-&nbsp;
                      { entry.endDate !== 'Present' ? entry.endDate.slice(0, 4) : entry.endDate }
                    </b></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="two wide column">
              {this.props.bio.volunteer ? <h3 className="ui left aligned header no-bottom">Activities</h3> : '' }
            </div>

            <div className="fourteen wide column no-bottom">
              {_.map(this.props.bio.volunteer, (entry, i) => (
                <div key={i} className="ui grid">
                  <div className="twelve wide column no-bottom">
                    <p className="ui no-bottom">
                      <b>{ entry.position }, { entry.organization }</b> <br />
                      { entry.website.replace(/^https?:\/\//, '') } <br />
                      { entry.summary }
                    </p>
                    <ul style={{ margin: '0px' }}>
                      {_.map(entry.highlights, (highlight, index) => (
                        <li key={index}>{ highlight }</li>
                      ))}
                    </ul>
                  </div>
                  <div className="four wide right aligned column no-bottom">
                    <p className="ui no-bottom"><b>
                      { entry.startDate.slice(0, 4) }&nbsp;-&nbsp;
                      { entry.endDate !== 'Present' ? entry.endDate.slice(0, 4) : entry.endDate }
                    </b></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* {% include bio-publications-1.html %} */}


          <div className="row">
            <div className="two wide column">
              {this.props.bio.awards ? <h3 className="ui left aligned header no-bottom">Awards</h3> : '' }
            </div>

            <div className="fourteen wide column no-bottom">
              {_.map(this.props.bio.awards, (entry, i) => (
                <div key={i} className="ui grid">
                  <div className="sixteen wide column no-bottom">
                    <p className="ui no-bottom">
                      <b>{ entry.title }</b>, { entry.awarder }, { entry.date } <br />
                      { entry.summary }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="two wide column">
              {this.props.bio.references ? <h3 className="ui left aligned header no-bottom">References</h3> : '' }
            </div>

            <div className="fourteen wide column no-bottom">
              {_.map(this.props.bio.references, (entry, i) => (
                <p key={i} className="ui no-bottom">
                  { entry.name }
                  <em>{ entry.reference }</em>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SimpleBioEditorTabPreview.propTypes = {
  bio: PropTypes.shape({ basics: React.PropTypes.object,
    interests: React.PropTypes.array,
    skills: React.PropTypes.array,
    education: React.PropTypes.array,
    work: React.PropTypes.array,
    volunteer: React.PropTypes.array,
    awards: React.PropTypes.array,
    references: React.PropTypes.array,
  }).isRequired,
  directory: PropTypes.string.isRequired,
};
