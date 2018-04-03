import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import TopicCreatePreview from './preview/TopicCreatePreview';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'topic.create.preview.title', defaultMessage: 'Step 2: Preview Your Topic' },
  about: { id: 'topic.create.preview.about',
    defaultMessage: '<b>Make sure your topic looks right before you create it</b>.  We start your topic by finding all the stories in our database that match your query. From there we follow all the links and download them. We check if they match your keywords, and if they do then we add them to your topic (this is called "spidering"). Check the result below and make sure your topic is finding you the stories you want before creating it.' },
  aboutUpdate: { id: 'topic.update.preview.about',
    defaultMessage: '<b>Make sure your topic looks right before you update it</b>. Pay special attention to the amount of seed stories - a large number can easily spider out of scope.' },

};

const TopicCreate2PreviewContainer = (props) => {
  const { handleNextStep, handlePreviousStep, formData } = props;
  const { formatMessage } = props.intl;

  const content = <TopicCreatePreview formData={formData} />;
  let titleInfo = (
    <p>
      <FormattedHTMLMessage {...localMessages.about} />
    </p>
  );
  if (formData.isUpdating) {
    titleInfo = (
      <p>
        <FormattedHTMLMessage {...localMessages.aboutUpdate} />
      </p>
    );
  }
  return (
    <Grid>
      <h1>
        <FormattedHTMLMessage {...localMessages.title} />
      </h1>
      {titleInfo}
      { content }
      <br />
      <Row>
        <Col lg={12} md={12} sm={12} >
          <AppButton flat label={formatMessage(messages.previous)} onClick={() => handlePreviousStep()} />
          &nbsp; &nbsp;
          <AppButton type="submit" label={formatMessage(messages.confirm)} primary onClick={() => handleNextStep()} />
        </Col>
      </Row>
    </Grid>
  );
};

TopicCreate2PreviewContainer.propTypes = {
  // from parent
  location: PropTypes.object.isRequired,
  // form composition
  intl: PropTypes.object.isRequired,
  // from state
  currentStep: PropTypes.number,
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  // from form
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  currentStep: state.topics.create.preview.workflow.currentStep,
  formData: state.form.topicForm.values,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(0));
  },
  handleNextStep: () => {
    dispatch(goToCreateTopicStep(2));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleNextStep();
    },
  });
}

export default
  injectIntl(
    composeIntlForm(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        TopicCreate2PreviewContainer
      )
    )
  );
