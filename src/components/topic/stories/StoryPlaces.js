import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'story.places.title', defaultMessage: 'Geographic Focus' },
  intro: { id: 'story.places.intro', defaultMessage: 'We think this story is about the following places:' },
  helpTitle: { id: 'story.places.help.title', defaultMessage: 'About Geographic Focus' },
  helpText: { id: 'story.places.help.text', defaultMessage: 'This story has been processed with the CLIFF-CLAVIN geocoder.  This finds any geographic places mentioned in the text of the story and tries to determine where they are.  This is based on a set of heuristics we have tested and validated to work at industry-standard levels.  We have listed the most frequently mentioned places in the story here, as the places the story is "about".' },
};

const StoryPlaces = (props) => {
  const { tags, helpButton } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} />{helpButton}</h2>
      <p><FormattedMessage {...localMessages.intro} /></p>
      <ul>
        {tags.map(t => (
          <li key={t.geoname.id}>{t.geoname.name}{t.geoname.parent ? `, ${t.geoname.parent.name}` : ''}</li>
        ))}
      </ul>
    </DataCard>
  );
};

StoryPlaces.propTypes = {
  // from parent
  tags: React.PropTypes.array.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

export default
  injectIntl(
    composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
      StoryPlaces
    )
  );