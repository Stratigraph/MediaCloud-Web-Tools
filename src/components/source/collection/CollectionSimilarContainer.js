import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchSimilarCollections } from '../../../actions/sourceActions';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import CollectionList from '../../common/CollectionList';

const localMessages = {
  similarCollectionsTitle: { id: 'collections.similar.title', defaultMessage: 'Similar Collections' },
  helpTitle: { id: 'collection.summary.similar.help.text.title',
    defaultMessage: 'Similar Collections',
  },
  helpText: { id: 'collection.summary.similar.help.text',
    defaultMessage: 'Here is a list of similar collections, based on how many sources they have in common. This can be a great way to discover other collecitons you might want to be using. Click one to explore it.',
  },
};

const CollectionSimilarContainer = (props) => {
  const { similarCollections, helpButton } = props;
  const { formatMessage } = props.intl;
  return (
    <CollectionList
      title={formatMessage(localMessages.similarCollectionsTitle)}
      collections={similarCollections}
      helpButton={helpButton}
    />
  );
};

CollectionSimilarContainer.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  similarCollections: React.PropTypes.array,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSimilar.fetchStatus,
  similarCollections: state.sources.collections.selected.collectionSimilar.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSimilarCollections(ownProps.collectionId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText])(
        composeAsyncContainer(
          CollectionSimilarContainer
        )
      )
    )
  );
