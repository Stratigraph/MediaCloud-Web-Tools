import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import composeIntlForm from '../../common/IntlForm';
import TopicForm, { TOPIC_FORM_MODE_CREATE } from './TopicForm';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { getCurrentDate, getMomentDateSubtraction } from '../../../lib/dateUtil';

const localMessages = {
  title: { id: 'topic.create.setup.title', defaultMessage: 'Step 1: Create A Topic' },
  updateTitle: { id: 'topic.update.setup.title', defaultMessage: 'Step 1: Update Topic' },
  about: { id: 'topic.create.setup.about',
    defaultMessage: 'Create A Topic then click Preview' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'You can create a new Topic to add to the MediaCloud system. Copy and paste the keyword query from an Explorer search into here, and then select dates and media sources and/or collections.  The stories in our database that match will be "seed stories".  Our system will follow links from those stories to find others that match your keyword query, even if they are in sources we don\'t otherwise cover. The combination of stories in our system, and stories that we find via this "spidering" process, will create your Topic.' },
  updateTopicText: { id: 'topic.update.text', defaultMessage: 'Update your edited Topic. Click Preview to review your updated stories. ' },
  addCollectionsTitle: { id: 'topic.create.addCollectionsTitle', defaultMessage: 'Select Sources And Collections' },
  addCollectionsIntro: { id: 'topic.create.addCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic:' },
  sourceCollectionsError: { id: 'topic.create.form.detail.sourcesCollections.error', defaultMessage: 'You must select at least one Source or one Collection to seed this topic.' },
};

const formSelector = formValueSelector('topicForm');

const TopicCreate1ConfigureContainer = (props) => {
  const { finishStep, formData, initialValues, handleMediaChange, handleMediaDelete } = props;
  const { formatMessage } = props.intl;
  const endDate = getCurrentDate();
  const startDate = getMomentDateSubtraction(endDate, 3, 'months');
  const allInitialValues = {
    start_date: startDate,
    end_date: endDate,
    max_iterations: 15,
    buttonLabel: formatMessage(messages.preview),
    ...initialValues,
  };
  let titleInfo = null;
  if (formData.isUpdating) {
    titleInfo = (
      <div>
        <Title render={formatMessage(localMessages.updateTitle)} />
        <Row>
          <Col lg={10}>
            <h1><FormattedMessage {...localMessages.updateTitle} /></h1>
            <p><FormattedMessage {...localMessages.updateTopicText} /></p>
          </Col>
        </Row>
      </div>
    );
  } else {
    titleInfo = (
      <div>
        <Title render={formatMessage(localMessages.title)} />
        <Row>
          <Col lg={10}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.createTopicText} /></p>
          </Col>
        </Row>
      </div>
    );
  }
  return (
    <Grid>
      {titleInfo}
      <TopicForm
        initialValues={allInitialValues}
        onSubmit={() => finishStep(1)}
        title={formatMessage(localMessages.addCollectionsTitle)}
        intro={formatMessage(localMessages.addCollectionsIntro)}
        mode={TOPIC_FORM_MODE_CREATE}
        enabledReinitialize
        onMediaChange={handleMediaChange}
        onMediaDelete={handleMediaDelete}
      />
    </Grid>
  );
};

TopicCreate1ConfigureContainer.propTypes = {
  // from parent
  location: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  // form composition
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  // from state
  currentStep: PropTypes.number,
  formData: PropTypes.object,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  handleMediaChange: PropTypes.func.isRequired,
  handleMediaDelete: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: formSelector(state, 'solr_seed_query', 'start_date', 'end_date', 'sourcesAndCollections', 'isUpdating'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  finishStep: (step) => {
    dispatch(goToCreateTopicStep(step));
  },
  handleMediaChange: (sourceAndCollections) => {
    // take selections from mediaPicker and push them back into topicForm
    const updatedSources = sourceAndCollections.filter(m => m.type === 'source' || m.media_id);
    const updatedCollections = sourceAndCollections.filter(m => m.type === 'collection' || m.tags_id);
    const selectedMedia = updatedCollections.concat(updatedSources);

    ownProps.change('sourcesAndCollections', selectedMedia); // redux-form change action
  },
  handleMediaDelete: () => null,   // in create mode we don't need to update the values
});

const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          TopicCreate1ConfigureContainer
        )
      )
    )
  );
