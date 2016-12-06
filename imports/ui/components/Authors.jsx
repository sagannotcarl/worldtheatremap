import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import ProfileNameContainer from '../containers/ProfileNameContainer.jsx';

class Authors extends React.Component {
  render() {
    const { authors, noLinks } = this.props;
    const { locale } = this.props.intl;

    // @TODO: Abstract this to a function or component to reduce duplication in EventTeaser.jsx and Event.jsx
    const authorString = authors.map((author, index, array) => {
      let seperator = ', ';
      if (index == array.length - 1) {
        seperator = '';
      }
      else if (index == array.length - 2) {
        // Had to leave those extra spans to make spaces validate with the react element
        seperator = (<span><span> </span><FormattedMessage
          id="show.authorsFinalSeperator"
          description='When there are multiple authors for a show, the final seperator between names'
          defaultMessage='and'
        /><span> </span></span>);
      }

      return (
        <span key={author._id}>
          {!noLinks ?
            <Link to={`/${locale}/profiles/${ author._id }`} className="show-author">
              <ProfileNameContainer profileId={author._id} />
            </Link>
            : <ProfileNameContainer profileId={author._id} />
          }
          {seperator}
        </span>
      );
    });

    return (
      <span>
        {authorString}
      </span>
    );
  }
}

Authors.propTypes = {
  authors: React.PropTypes.array,
  noLinks: React.PropTypes.bool,
  intl: intlShape.isRequired,
};

export default injectIntl(Authors);
