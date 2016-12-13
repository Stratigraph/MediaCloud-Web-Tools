import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { createCollection, fetchSourcesByIds, fetchCollectionSourcesByIds,
  resetAdvancedSearchSource, resetAdvancedSearchCollection, resetSourcesByIds, resetCollectionsByIds } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import CollectionForm from './form/CollectionForm';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Create New Collection' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Save New Collection' },
  feedback: { id: 'source.add.feedback', defaultMessage: 'We saved your new Collection' },
};

class CreateCollectionContainer extends React.Component {

  componentWillMount() {
    const { saveParamsToStore } = this.props;
    saveParamsToStore(this.props, this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.src !== this.props.params.src ||
      nextProps.params.coll !== this.props.params.coll ||
      nextProps.params.search !== this.props.params.search) {
      const { saveParamsToStore } = nextProps;
      saveParamsToStore(nextProps, this);
    }
  }
  render() {
    const { handleSave, goToAdvancedSearch, initialValues } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;

    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <CollectionForm
            initialValues={initialValues}
            buttonLabel={formatMessage(localMessages.addButton)}
            onSave={handleSave}
            goToAdvancedSearch={goToAdvancedSearch}
          />
        </Grid>
      </div>
    );
  }
}

CreateCollectionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  location: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  goToAdvancedSearch: React.PropTypes.func.isRequired,
  dispatchMetadataSelections: React.PropTypes.func.isRequired,
  dispatchAddAllSourcesByString: React.PropTypes.func.isRequired,
  dispatchReset: React.PropTypes.func,
  saveParamsToStore: React.PropTypes.func.isRequired,
  sourceAdvancedResults: React.PropTypes.array,
  collectionAdvancedResults: React.PropTypes.array,
  initialValues: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  sourceAdvancedResults: state.sources.sourceSearchByIds.list,
  collectionAdvancedResults: state.sources.collectionSearchByIds.list,
  initialValues: {
    sourceAdvancedResults: state.sources.sourceSearchByIds.list,
    collectionAdvancedResults: state.sources.collectionSearchByIds.list,
  },
  srcIdsToAddArray: ownProps.location.query.src,
  collIdsToAddArray: ownProps.location.query.coll,
  searchStrToAddArray: ownProps.location.query.search,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
      name: values.name,
      description: values.description,
      sources: values.sources.map(s => s.id),
      static: values.static,
    };
    dispatch(createCollection(infoToSave))
      .then((results) => {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        // TODO: redirect to new source detail page
        dispatch(push(`/collections/${results.tags_id}`));
      });
  },
  goToAdvancedSearch: (values) => {
    dispatch(push(`/collections/create/advancedSearch?${values}`));
  },
  dispatchMetadataSelections: (sourceIdArray, collectionIdArray) => {
    dispatch(resetSourcesByIds());
    dispatch(resetCollectionsByIds());
    // fields of sources will come back and will be integrated into the media form fields
    if (collectionIdArray && collectionIdArray.length > 0) {
      dispatch(fetchCollectionSourcesByIds(collectionIdArray.length > 1 ? collectionIdArray.split(',') : collectionIdArray));
    }
    if (sourceIdArray && sourceIdArray.length > 0) {
      dispatch(fetchSourcesByIds(sourceIdArray.length > 1 ? sourceIdArray.split(',') : sourceIdArray));
    }
  },
  dispatchAddAllSourcesByString() {
    // not currently implemented, but creation of collection should add all media sources by searchStr and metadata...
  },
  dispatchReset() {
    dispatch(resetAdvancedSearchSource());
    dispatch(resetAdvancedSearchCollection());
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    saveParamsToStore: () => {
      if (stateProps.srcIdsToAddArray || stateProps.collIdsToAddArray) {
        dispatchProps.dispatchMetadataSelections(stateProps.srcIdsToAddArray, stateProps.collIdsToAddArray);
      } else {
        dispatchProps.dispatchAddAllSourcesByString(stateProps.searchStr);
      }
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      CreateCollectionContainer
    ),
  );