import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';

const API_REQUESTS_UNLIMITED = 0;

const localMessages = {
  admin: { id: 'user.profile.admin', defaultMessage: '<p><b>You are an admin-level user. Don\'t break anything!</b></p>' },
  email: { id: 'user.profile.email', defaultMessage: '<b>Email:</b> {email}' },
  name: { id: 'user.profile.name', defaultMessage: '<b>Name:</b> {name}' },
  apiKey: { id: 'user.profile.apiKey', defaultMessage: '<b>API Key:</b> {apiKey} (<i>dont\'t give this out to anyone else</i>)' },
  apiRequests: { id: 'user.profile.apiRequests', defaultMessage: '<b>API Weekly Requests:</b> {requested} / {allowed}' },
  apiRequestedItems: { id: 'user.profile.apiRequestedItems', defaultMessage: '<b>API Weekly Requested Items:</b> {requested} / {allowed}' },
};

const UserProfileContainer = (props) => {
  const { profile, apiKey } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.userProfile)} | ${parentTitle}`;
  const adminContent = (profile.auth_roles.includes('admin')) ? <FormattedHTMLMessage {...localMessages.admin} /> : null;
  return (
    <Grid>
      <Title render={titleHandler} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...messages.userProfile} /></h1>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          {adminContent}
          <ul>
            <li><FormattedHTMLMessage {...localMessages.email} values={{ email: profile.email }} /></li>
            <li><FormattedHTMLMessage {...localMessages.name} values={{ name: profile.full_name }} /></li>
            <li><FormattedHTMLMessage {...localMessages.apiKey} values={{ apiKey }} /></li>
            <li><FormattedHTMLMessage
              {...localMessages.apiRequests}
              values={{
                requested: profile.weekly_requests_sum,
                allowed: (profile.weekly_requests_limit === API_REQUESTS_UNLIMITED) ? formatMessage(messages.unlimited) : profile.weekly_requests_limit,
              }}
            /></li>
            <li><FormattedHTMLMessage
              {...localMessages.apiRequestedItems}
              values={{
                requested: profile.weekly_requested_items_sum,
                allowed: (profile.weekly_requested_items_limit === API_REQUESTS_UNLIMITED) ? formatMessage(messages.unlimited) : profile.weekly_requests_limit,
              }}
            /></li>
          </ul>
        </Col>
      </Row>
    </Grid>
  );
};

UserProfileContainer.propTypes = {
  // from state
  profile: React.PropTypes.object,
  apiKey: React.PropTypes.string,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.user.profile,
  apiKey: state.user.key,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      UserProfileContainer
    )
  );