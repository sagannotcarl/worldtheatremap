import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Components
import ShowName from '../components/ShowName.jsx';

// Collections
import { Shows } from '../../api/shows/shows.js';

const ShowNameContainer = createContainer((props) => {
  const { showId, defaultName } = props;
  // const showsSub = TAPi18n.subscribe('shows.singleNameById', showId);
  // const loading = !(showsSub.ready());
  const loading = false;

  const showName = Shows.find(
    {
      _id: showId,
    }, {
      fields: { name: 1 },
    }).fetch()[0];

  const showExists = !loading && !!showName;

  return {
    loading,
    showName,
    defaultName,
    showExists,
  };
}, ShowName);

export default ShowNameContainer;
