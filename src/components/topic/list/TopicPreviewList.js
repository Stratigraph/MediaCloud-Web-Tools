import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { GridList, GridTile } from 'material-ui/GridList';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';
import FavoriteToggler from '../../common/FavoriteToggler';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import messages from '../../../resources/messages';
import { TOPIC_SNAPSHOT_STATE_COMPLETED } from '../../../reducers/topics/selected/snapshots';
import { ErrorNotice } from '../../common/Notice';

const localMessages = {
  total: { id: 'topitopic.list.totalStories', defaultMessage: 'Total Stories' },
  media: { id: 'topitopic.list.mediaCount', defaultMessage: 'Media Sources' },
  links: { id: 'topitopic.list.links', defaultMessage: 'Story Links' },
  range: { id: 'topitopic.list.range', defaultMessage: '{start} - {end}' },
  createdBy: { id: 'topitopic.list.createdBy', defaultMessage: 'Created by: ' },
  errorInTopic: { id: 'topitopic.list.error', defaultMessage: 'Error In Topic...' },
};

const TopicPreviewList = (props) => {
  const { topics, linkGenerator, onSetFavorited, emptyMsg } = props;
  let content = null;
  let subContent = null;
  if (topics && topics.length > 0) {
    content = (
      topics.map((topic) => {
        if (topic.detailInfo !== undefined && topic.detailInfo.timespan !== undefined) {
          subContent = (
            <GridList
              cols={3}
              margin={0}
              padding={0}
              cellHeight={100}
              className="topic-mini-cards"
            >
              <GridTile margin={0}>
                <h3><FormattedMessage {...localMessages.total} /></h3>
                {topic.detailInfo.timespan.story_count}
              </GridTile>
              <GridTile margin={0}>
                <h3><FormattedMessage {...localMessages.media} /></h3>
                {topic.detailInfo.timespan.medium_count}
              </GridTile>
              <GridTile>
                <h3><FormattedMessage {...localMessages.links} /></h3>
                {topic.detailInfo.timespan.story_link_count}
              </GridTile>
            </GridList>
          );
        }
        let ownerListContent;
        if (topic.owners.length > 0) {
          ownerListContent = topic.owners.map(u => u.full_name).join(', ');
        } else {
          ownerListContent = <FormattedMessage {...messages.unknown} />;
        }

        let errorNotice = null;
        if (topic.state !== TOPIC_SNAPSHOT_STATE_COMPLETED) {
          errorNotice = <ErrorNotice><Link to={linkGenerator(topic)}><FormattedMessage {...localMessages.errorInTopic} /></Link></ErrorNotice>;
        }
        return (
          <Col key={topic.topics_id} lg={4} xs={12}>
            <DataCard className="topic-preview-list-item">
              <div className="content" id={`topic-preview-${topic.topics_id}`}>
                <div>
                  <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
                    <FavoriteToggler
                      isFavorited={topic.isFavorite}
                      onSetFavorited={isFav => onSetFavorited(topic.topics_id, isFav)}
                    />
                  </Permissioned>
                  <h2><Link to={linkGenerator(topic)}>{topic.name}</Link></h2>
                  {errorNotice}
                  <FormattedMessage
                    {...localMessages.range}
                    values={{
                      start: <FormattedDate value={topic.start_date} month="short" year="numeric" day="numeric" />,
                      end: <FormattedDate value={topic.end_date} month="short" year="numeric" day="numeric" />,
                    }}
                  />
                  <p>{topic.description}</p>
                  <p><FormattedMessage {...localMessages.createdBy} /><i>{ownerListContent}</i></p>
                </div>
              </div>
              {subContent}
            </DataCard>
          </Col>
        );
      })
    );
  } else if (emptyMsg) {
    content = (
      <p><FormattedMessage {...emptyMsg} /></p>
    );
  }
  return (
    <div className="topic-preview-list">
      <Row>
        {content}
      </Row>
    </div>
  );
};

TopicPreviewList.propTypes = {
  // from parent
  linkGenerator: PropTypes.func,
  topics: PropTypes.array.isRequired,
  onSetFavorited: PropTypes.func,
  emptyMsg: PropTypes.object,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    connect(null)(
      TopicPreviewList
    )
  );
