import React from 'react';
import { injectIntl } from 'react-intl';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const SourcesApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <AppContainer
        name="topics"
        title={formatMessage(messages.sourcesToolName)}
        description={formatMessage(messages.sourcesToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

SourcesApp.propTypes = {
  children: React.PropTypes.node,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    SourcesApp
  );