import { useParams } from 'react-router';
import { BackButton } from '../components/BackButton';
import { findStory } from '../data/stories';
import { StoryBook } from './StoryBook';

export function StoryReader() {
  const story = findStory(useParams().id);

  if (!story) {
    return <div className="storybook-missing">
      <h1>No encontramos ese cuento</h1>
      <BackButton to="/">Volver al mapa</BackButton>
    </div>;
  }

  return <StoryBook key={story.id} story={story} />;
}
