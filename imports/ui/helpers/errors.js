export const displayError = (error) => {
  if (error) {
    console.log(error);
    // It would be better to not alert the error here but inform the user in some
    // more subtle way
    alert(error);
    // alert(TAPi18n.__(error.error)); // eslint-disable-line no-alert
  }
};
