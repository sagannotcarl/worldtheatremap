import { Meteor } from 'meteor/meteor';
import React from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router';
import { displayError } from '../helpers/errors.js';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

// Components
import ShowTeaser from '../components/ShowTeaser.jsx';
import ShowsByRole from '../components/ShowsByRole.jsx';
import HowlRoundPosts from '../components/HowlRoundPosts.jsx';

// Containers
import ProfileNameContainer from '../containers/ProfileNameContainer.jsx';

// API
import { updateImage } from '../../api/profiles/methods.js';
import { remove } from '../../api/affiliations/methods.js';
import { remove as removeFestivalAffiliation } from '../../api/festivalOrganizers/methods.js';

marked.setOptions({
  tables: false,
});

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      uploading: false,
      uploadError: false,
      newImageLoaded: false,
      uploadAttempts: 0,
    };

    this.renderShowsByRoles = this.renderShowsByRoles.bind(this);
    this.removeAffiliation = this.removeAffiliation.bind(this);
    this.renderAffiliatedProfiles = this.renderAffiliatedProfiles.bind(this);
    this.renderFestivalProfiles = this.renderFestivalProfiles.bind(this);
    this.renderPhotoAndUploader = this.renderPhotoAndUploader.bind(this);
    this.checkResizedImage = this.checkResizedImage.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.setState({ newImageLoaded: false });

    // Upload file using Slingshot Directive
    const uploader = new Slingshot.Upload('myFileUploads');

    // Track Progress
    const computation = Tracker.autorun(() => {
      if (!isNaN(uploader.progress())) {
        const progressNumber = Math.floor(uploader.progress() * 100);
        this.setState({ progress: progressNumber });

        if (progressNumber > 0 && progressNumber < 100) {
          this.setState({ uploading: true });
        } else {
          this.setState({ uploading: false });
        }
      }
    });

    uploader.send(files[0], (error, url) => {
      computation.stop(); // Stop progress tracking on upload finish
      if (error) {
        this.setState({ progress: 0 }); // reset progress state
        this.setState({ uploadError: true });
      } else {
        // Wait until the Lambda script has finished resizing
        this.checkResizedImage(url);
      }
    });
  }

  checkResizedImage(src) {
    const { profile } = this.props;
    const { uploadAttempts } = this.state;

    const originalSrc = src;
    const resizedImageSrc = src.replace('https://wtm-dev-images', 'https://wtm-dev-images-resized');

    const cycleTime = 1000;

    const img = new Image();
    img.onload = function () {
      // code to set the src on success
      const newImage = {
        profileId: profile._id,
        image: originalSrc,
      };
      updateImage.call(
        newImage
      , displayError);

      // Reset the upload counter in case the user tries again
      this.setState({ uploadAttempts: 0 });

      // Remove the Almost done... message
      this.setState({ newImageLoaded: true });
    };

    img.onload = img.onload.bind(this);
    img.onerror = function () {
      const nextAttempt = uploadAttempts + 1;
      this.setState({ uploadAttempts: nextAttempt });
      // doesn't exist or error loading
      if (uploadAttempts < 10) {
        setTimeout(() => {
          this.checkResizedImage(originalSrc);
        }, cycleTime, originalSrc);
      } else {
        this.setState({ uploadError: true });
      }
    };
    img.onerror = img.onerror.bind(this);

    img.src = resizedImageSrc; // fires off loading of image
  }

  removeAffiliation(affiliationId) {
    remove.call({
      affiliationId,
    }, displayError);
  }

  removeFestivalAffiliation(festivalOrganizerId) {
    removeFestivalAffiliation.call({
      festivalOrganizerId,
    }, displayError);
  }

  renderPhotoAndUploader() {
    const { progress, uploading, newImageLoaded, uploadError } = this.state;
    const { profile } = this.props;
    const DropzoneStyleOverride = {};
    const targetClasses = classNames('dropzone-target', {
      'existing-image': profile.imageWide,
      'empty-image': !profile.imageWide,
    });

    if (Meteor.user()) {
      return (
        <div className="profile-image-wrapper">
          <Dropzone
            onDrop={this.onDrop}
            style={DropzoneStyleOverride}
            className={targetClasses}
            activeClassName="dropzone-target-active"
          >
            {profile.imageWide ?
              <img className="profile-image" src={profile.imageWide} />
              : ''}
            <div className="dropzone-help-text">
              <FormattedMessage
                id="profile.imageDropHelpText"
                description="Help text for adding an image to a profile"
                defaultMessage="To upload a new photo click or drag a photo here."
              />
            </div>
          </Dropzone>
          {uploading ?
            <div className="profile-image-uploading">Uploading: {progress}%</div> : ''}
          {(uploading === false &&
            progress === 100 &&
            newImageLoaded === false &&
            uploadError === false) ?
            <div className="profile-image-uploading">Almost done...</div> : ''}
          {(uploadError === true) ?
            <div className="profile-image-uploading error">
              <FormattedMessage
                id="profile.imageUploadingError"
                description="Help text when there is an error uploading an image to a profile"
                defaultMessage="There was an error, please try again"
              />
            </div> : ''}
        </div>
      );
    } else if (profile.imageWide) {
      return (
        <div className="profile-image-wrapper">
          <img className="profile-image" src={profile.imageWide} />
        </div>
      );
    } else {
      return '';
    }
  }

  renderShowsByRoles() {
    const { profile, roles, eventsByShowByRole } = this.props;

    return (
      roles.map(role => (
        <ShowsByRole
          key={role}
          role={role}
          profile={profile}
          eventsByShow={eventsByShowByRole[role]}
        />
      ))
    );
  }

  renderAffiliatedProfiles() {
    const { affiliatedProfiles, user } = this.props;
    const { locale } = this.props.intl;

    let affiliatedProfilesList = affiliatedProfiles.map(affiliation => (
      <li key={affiliation.profile._id}>
        <ProfileNameContainer profileId={affiliation.profile._id} />
        {user ?
          <span
            className="delete-affiliation"
            onClick={this.removeAffiliation.bind(this, affiliation._id)}
            title="Delete affiliation"
          >
            &times;
          </span>
        : ''}
      </li>
    ));

    return <ul className="affiliated-profiles">{affiliatedProfilesList}</ul>;
  }

  renderFestivalProfiles() {
    const { festivalProfiles, user } = this.props;
    const { locale } = this.props.intl;

    let festivalProfilesList = festivalProfiles.map(festival => (
      <li key={festival.profile._id}>
        <h3>
          <ProfileNameContainer profileId={festival.profile._id} />
        </h3>
        {user ?
          <span
            className="delete-affiliation"
            onClick={this.removeFestivalAffiliation.bind(this, festival._id)}
            title="Delete festival affiliation"
          >
            &times;
          </span>
        : ''}
      </li>
    ));

    return <ul className="affiliated-festivals">{festivalProfilesList}</ul>;
  }

  render() {
    const {
      profile,
      user,
      showsForAuthor,
      showsForOrg,
      eventsByShowByOrg,
      roles,
      affiliatedProfiles,
      festivalProfiles,
    } = this.props;
    const { formatMessage, locale } = this.props.intl;

    const editLink = (user) ?
      <Link
        to={`/${locale}/profiles/${profile._id}/edit`}
        key={`${profile._id}-edit`}
        title={`Edit ${profile.name}`}
        className="edit-link"
      >
        <FormattedMessage
          id="ui.edit"
          description="Generic edit link"
          defaultMessage="Edit"
        />
      </Link>
    : '';

    let Shows;
    if (showsForAuthor && showsForAuthor.length) {
      Shows = showsForAuthor.map(show => (
        <li key={show._id}>
          <ShowTeaser
            show={show}
          />
        </li>
      ));
    }

    let ShowsByOrg;
    if (showsForOrg && showsForOrg.length) {
      ShowsByOrg = showsForOrg.map(show => (
        <li key={show._id}>
          <ShowTeaser
            show={show}
            eventsByShow={eventsByShowByOrg[show._id]}
          />
        </li>
      ));
    }

    const interests = (profile.interests) ? profile.interests.map((interest, index, array) => {
      let seperator = ', ';
      if (index === array.length - 1) {
        seperator = '';
      } else if (index === array.length - 2) {
        if (array.length > 2) {
          seperator = ', and ';
        } else {
          seperator = ' and ';
        }
      }
      return (
        <span key={interest}>
          {
            formatMessage({
              id: `interest.${interest}`,
              defaultMessage: interest,
              description: `Interests option: ${interest}`,
            })
          }
          {seperator}
        </span>
      );
    }) : false;

    let orgTypes = (profile.orgTypes) ? profile.orgTypes.map((orgType, index, array) => {
      let seperator = ', ';
      if (index === array.length - 1) {
        seperator = '';
      } else if (index === array.length - 2) {
        if (array.length > 2) {
          seperator = ', and ';
        } else {
          seperator = ' and ';
        }
      }
      return (
        <span key={orgType}>
          {
            formatMessage({
              id: `orgType.${orgType}`,
              defaultMessage: orgType,
              description: `Interests option: ${orgType}`,
            })
          }
          {seperator}
        </span>
      );
    }) : false;

    let selfDefinedRoles = (profile.selfDefinedRoles) ?
      profile.selfDefinedRoles.map((selfDefinedRole, index, array) => {
        let seperator = ', ';
        if (index === array.length - 1) {
          seperator = '';
        } else if (index === array.length - 2) {
          if (array.length > 2) {
            seperator = ', and ';
          } else {
            seperator = ' and ';
          }
        }
        return (
          <span key={selfDefinedRole}>
            {
              formatMessage({
                id: `role.${selfDefinedRole}`,
                defaultMessage: selfDefinedRole,
                description: `Roles option: ${selfDefinedRole}`,
              })
            }
            {seperator}
          </span>
        );
      }) : false;

    let gendersArray = [];
    if (!_.isEmpty(profile.gender)) {
      gendersArray = _.filter(profile.gender, gender => {
        return gender !== 'Another Identity';
      });

      if (!_.isEmpty(profile.genderOther)) {
        _.each(profile.genderOther, gender => {
          gendersArray.push(gender);
        })
      }
    }

    // Make sure new genders list is alphabetized
    gendersArray.sort();

    let genders = (!_.isEmpty(gendersArray)) ? gendersArray.map((gender, index, array) => {
      let seperator = ', ';
      if (index === array.length - 1) {
        seperator = '';
      } else if (index === array.length - 2) {
        if (array.length > 2) {
          seperator = ', and ';
        } else {
          seperator = ' and ';
        }
      }
      return (<span key={gender}>{gender}{seperator}</span>);
    }) : false;

    let ethnicityRaceDisplay = (profile.ethnicityRace) ? profile.ethnicityRace.map((ethnicityRace, index, array) => {
      let seperator = ', ';
      if (index === array.length - 1) {
        seperator = '';
      } else if (index === array.length - 2) {
        if (array.length > 2) {
          seperator = ', and ';
        } else {
          seperator = ' and ';
        }
      }
      return (<span key={ethnicityRace}>{ethnicityRace}{seperator}</span>);
    }) : false;

    const cityState = [
      profile.locality,
      profile.administrativeArea,
    ].filter((val) => val).join(', ');
    const locationBlock = (<div className="profile-location">
      {cityState ? <div>{cityState}</div> : ''}
      {profile.country ?
        <div className="profile-country">
          {
            formatMessage({
              id: `country.${profile.country}`,
              description: `Country options: ${profile.country}`,
              defaultMessage: profile.country,
            })
          }
        </div> : ''}
      </div>);

    return (
      <article className="profile full">
        <section>
          {this.renderPhotoAndUploader()}
          <div className="profile-content-wrapper">
            <h1 className="profile-name page-title">
              {profile.name}
            </h1>
            {typeof locationBlock !== 'undefined' ?
                <div className="profile-location">{locationBlock}</div> : ''}
            <div className="profile-metadata metadata">
              {!_.isEmpty(profile.selfDefinedRoles) ?
                <div className="profile-roles" title="Roles">{selfDefinedRoles}</div> : ''}
              {!_.isEmpty(profile.gender) ?
                <div className="profile-gender" title="Gender">{genders}</div> : ''}
              {!_.isEmpty(ethnicityRaceDisplay) ?
                <div className="profile-ethnicity-race-display" title="Ethnicity/Race">
                  {ethnicityRaceDisplay}
                </div> : ''}
              {!_.isEmpty(profile.orgTypes) ?
                <div
                  className="profile-organization-types"
                  title="Organization Type"
                >
                  {orgTypes}
                </div> : ''}
              {!_.isEmpty(profile.foundingYear) ?
                <div className="profile-founding-year">
                  <FormattedMessage
                    id="profile.foundedDate"
                    description="Founded date metadata"
                    defaultMessage={`Founded {foundingYear}`}
                    values={{ foundingYear: profile.foundingYear }}
                  />
                </div> : ''}
              {!_.isEmpty(profile.interests) ?
                <div className="profile-interests" title="Interests">{interests}</div> : ''}
            </div>
          </div>
          {editLink ?
            <div className="edit-links">
              {editLink}
            </div>
            : ''
          }
        </section>
        {!_.isEmpty(profile.about) ?
          <section className="profile-about">
            <h2>
              <FormattedMessage
                id="profile.aboutSectionHeader"
                description="Section header for the profile about section"
                defaultMessage="About"
              />
            </h2>
            <div
              className="markdown-formatted"
              dangerouslySetInnerHTML={{__html: sanitizeHtml(marked(profile.about))}}
            />
            {editLink ?
              <div className="edit-links">
                {editLink}
              </div>
              : ''
            }
            {!_.isEmpty(profile.source) && profile.source !== locale ?
              <div className="machine-translation-warning">
                <FormattedMessage
                  id="translation.possibleMachineTranslationWarning"
                  description="Text informing user that the text was possibly machine translated"
                  defaultMessage="This text was written in another language and was originally machine translated. If you would like to make improvements to the translation please edit this page."
                />
              </div> : ''
            }
          </section> : ''
        }
        {festivalProfiles.length > 0 ?
          <section className="profile-festival-profiles">
            <h2>
              <FormattedMessage
                id="profile.festivalProfilesHeader"
                description="Header for festival profiles"
                defaultMessage="Festivals"
              />
            </h2>
            <div className="content">
              {this.renderFestivalProfiles()}
            </div>
          </section> : ''}
        {(showsForAuthor && showsForAuthor.length) ?
          <section className="profile-shows">
            <h2>
              <FormattedMessage
                id="profile.primaryAuthorship"
                description="Section header for show for which this user is the primary author"
                defaultMessage="Primary Authorship or Playwright"
              />
            </h2>
            <ul>
              {Shows}
            </ul>
          </section>
          : ''
        }
        {(showsForOrg && showsForOrg.length) ?
          <section className="profile-shows">
            <h2>
              <FormattedMessage
                id="show.history"
                description="Section header for show for which this profile is the local organization"
                defaultMessage="Show History"
              />
            </h2>
            <ul>
              {ShowsByOrg}
            </ul>
          </section>
          : ''
        }
        {roles ? this.renderShowsByRoles() : ''}
        {affiliatedProfiles.length > 0 ?
          <section className="profile-affiliated-profiles">
            <h2>
              <FormattedMessage
                id="profile.affiliatedProfilesHeader"
                description="Header for affiliated profiles"
                defaultMessage="Members"
              />
            </h2>
            <div className="content">
              {this.renderAffiliatedProfiles()}
            </div>
          </section> : ''}
        {!_.isEmpty(profile.howlroundPostSearchText) ?
          <HowlRoundPosts
            searchText={profile.howlroundPostSearchText}
            existingPosts={profile.savedHowlroundPosts}
            _id={profile._id}
            url={profile.howlroundPostsUrl}
          />
          : ''
        }
      </article>
    );
  }
}

Profile.propTypes = {
  profile: React.PropTypes.object,
  user: React.PropTypes.object,
  showsForAuthor: React.PropTypes.array,
  showsForOrg: React.PropTypes.array,
  eventsByShowByOrg: React.PropTypes.array,
  eventsByShowByRole: React.PropTypes.array,
  roles: React.PropTypes.array,
  affiliatedProfiles: React.PropTypes.array,
  festivalProfiles: React.PropTypes.array,
  intl: intlShape.isRequired,
};

Profile.contextTypes = {
  router: React.PropTypes.object,
};

export default injectIntl(Profile);
