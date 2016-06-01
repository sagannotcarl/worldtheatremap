import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/events/events.js';
import { Participants } from '../../api/participants/participants.js';
import { createContainer } from 'meteor/react-meteor-data';
import EventPage from '../pages/EventPage.jsx';

export default createContainer(({ params: { id } }) => {
  const event = Events.findOne(id);
  const participantsByEvent = Meteor.subscribe('participants.byEvent', id);
  const participantsByEventTest = Participants.find({'eventId': id}).fetch();
  return {
    event,
    participantsByEvent: Participants.find({'eventId': id}, {
      fields: Participants.publicFields,
    }).fetch(),
  };
}, EventPage);
