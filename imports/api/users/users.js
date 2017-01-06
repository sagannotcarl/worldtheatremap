// Utilities
import { _ } from 'meteor/underscore';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

// Forms
import React from 'react';
import t from 'tcomb-form';
import ReactSelect from 'react-select';

// API
import { AllCountriesFactory } from '../../api/countries/countries.js';

// Components
import Checkboxes from '../../ui/components/Checkboxes.jsx';

const profile = t.struct({
  first: t.String, // Required
  last: t.String, // Required
  country: t.maybe(t.list(t.String)),
  referrer: t.maybe(t.list(t.String)),
  referrerOther: t.maybe(t.String),
});

export const userSchema = t.struct({
  email: t.String, // Required
  password: t.String, // Required
  confirm: t.String, // Required
  profile,
});

// referrer options
const Referrer = [
  {
    value: 'From the HowlRound.com website',
    label: <FormattedMessage
      id="referrer.From the HowlRound.com website"
      description="Referrer: From the HowlRound.com website"
      defaultMessage="From the HowlRound.com website"
    />,
  },
  {
    value: 'Word of mouth',
    label: <FormattedMessage
      id="referrer.Word of mouth"
      description="Referrer: Word of mouth"
      defaultMessage="Word of mouth"
    />,
  },
  {
    value: 'Social media',
    label: <FormattedMessage
      id="referrer.Social media"
      description="Referrer: Social media"
      defaultMessage="Social media"
    />,
  },
  {
    value: 'Google or other web search ',
    label: <FormattedMessage
      id="referrer.Google or other web search "
      description="Referrer: Google or other web search "
      defaultMessage="Google or other web search "
    />,
  },
  {
    value: 'Other',
    label: <FormattedMessage
      id="referrer.Other"
      description="Referrer: Other"
      defaultMessage="Other"
    />,
  },
];

// referrer template
const referrerCheckboxes = t.form.Form.templates.select.clone({
  renderLabel: (locals) => {
    const className = {
      'control-label': true,
      'disabled': locals.disabled,
    }
    return (
      <label
        htmlFor={locals.attrs.id}
        className={classnames(className)}
      >
        {locals.label}
      </label>
    );
  },

  renderSelect: (locals) => {
    return (
      <Checkboxes
        options={Referrer}
        values={locals.value}
        name="referrer-options"
        onChange={locals.onChange}
        disabled={locals.disabled}
      />
    );
  },

  renderHelp: (locals) => {
    const className = {
      'help-block': true,
      'disabled': locals.disabled,
    }

    return (
      <span
        id={`${locals.attrs.id}-tip`}
        className={classnames(className)}
      >
        {locals.help}
      </span>
    );
  },
});

// referrer factory function
class ReferrerCheckboxesFactory extends t.form.Component {
  getTemplate() {
    return referrerCheckboxes;
  }
}

// referrer transformer
ReferrerCheckboxesFactory.transformer = t.form.List.transformer;

export const defaultFormOptions = () => ({
  fields: {
    email: {
      type: 'email',
      label: <FormattedMessage
        id="auth.emailLabel"
        description="Label for email field"
        defaultMessage="Your Email"
      />,
      attrs: {},
      error: <FormattedMessage
        id='auth.errorsEmail'
        description='Field validation error when user does not enter an email on an auth form'
        defaultMessage='Email required'
      />,
    },
    password: {
      type: 'password',
      label: <FormattedMessage
        id="auth.passwordLabel"
        description="Label for password field"
        defaultMessage="Password"
      />,
      attrs: {},
      error: <FormattedMessage
        id='auth.errorsPassword'
        description='Field validation error when user does not enter a password on an auth form'
        defaultMessage='Password required'
      />,
    },
    confirm: {
      type: 'password',
      label: <FormattedMessage
        id="auth.passwordConfirmLabel"
        description="Label confirm password field"
        defaultMessage="Confirm Password"
      />,
      attrs: {},
      error: <FormattedMessage
        id='auth.errorsConfirm'
        description='Field validation error when user does not enter a confirmation password on the join form'
        defaultMessage='Please confirm your password'
      />
    },
    profile: {
      fields: {
        country: {
          factory: AllCountriesFactory(true),
        },
        referrer: {
          factory: ReferrerCheckboxesFactory,
        }
      }
    }
  }
});
