import React from 'react';

const DEFAULT_WIDTH = 41.928;
const DEFAULT_HEIGHT = 55.401;
const SCALE = DEFAULT_WIDTH / DEFAULT_HEIGHT;

const StoryIcon = (props) => {
  const height = props.height || DEFAULT_HEIGHT;
  const width = height * SCALE;
  return (
    <div className="app-icon app-icon-large app-icon-story">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width={`${width}px`} height={`${height}px`} viewBox="0 0 41.928 55.401" enableBackground="new 0 0 41.928 55.401" xmlSpace="preserve">
        <path d="M37.178,55.401H4.749C2.13,55.401,0,53.351,0,50.833V4.567C0,2.049,2.13,0,4.749,0h32.429c2.619,0,4.75,2.049,4.75,4.567 v46.265C41.928,53.351,39.797,55.401,37.178,55.401z M4.749,3C3.785,3,3,3.703,3,4.567v46.265c0,0.865,0.785,1.568,1.749,1.568 h32.429c0.965,0,1.75-0.703,1.75-1.568V4.567c0-0.864-0.785-1.567-1.75-1.567H4.749z" />
        <path d="M17.529,21.292H8.525c-1.668,0-3.025-1.39-3.025-3.098v-7.987c0-1.708,1.357-3.098,3.025-3.098h9.004 c1.668,0,3.025,1.39,3.025,3.098v7.987C20.555,19.902,19.197,21.292,17.529,21.292z M8.528,10.108 C8.532,10.111,8.5,10.14,8.5,10.207v7.987c0,0.074,0.04,0.101,0.041,0.101l8.978-0.003c0.01-0.009,0.036-0.039,0.036-0.098v-7.987 c0-0.074-0.041-0.102-0.041-0.102L8.528,10.108z" />
        <path d="M34.927,26.692H7c-0.829,0-1.5-0.671-1.5-1.5s0.671-1.5,1.5-1.5h27.927c0.828,0,1.5,0.671,1.5,1.5 S35.755,26.692,34.927,26.692z" />
        <path d="M34.927,32.092H7c-0.829,0-1.5-0.672-1.5-1.5s0.671-1.5,1.5-1.5h27.927c0.828,0,1.5,0.672,1.5,1.5 S35.755,32.092,34.927,32.092z" />
        <path d="M34.927,37.492H7c-0.829,0-1.5-0.672-1.5-1.5s0.671-1.5,1.5-1.5h27.927c0.828,0,1.5,0.672,1.5,1.5 S35.755,37.492,34.927,37.492z" />
        <path d="M34.927,42.891H7c-0.829,0-1.5-0.672-1.5-1.5s0.671-1.5,1.5-1.5h27.927c0.828,0,1.5,0.672,1.5,1.5 S35.755,42.891,34.927,42.891z" />
        <path d="M34.927,48.292H7c-0.829,0-1.5-0.672-1.5-1.5s0.671-1.5,1.5-1.5h27.927c0.828,0,1.5,0.672,1.5,1.5 S35.755,48.292,34.927,48.292z" />
        <path d="M34.927,10.491H24.67c-0.828,0-1.5-0.671-1.5-1.5s0.672-1.5,1.5-1.5h10.257c0.828,0,1.5,0.671,1.5,1.5 S35.755,10.491,34.927,10.491z" />
        <path d="M34.927,15.891H24.67c-0.828,0-1.5-0.671-1.5-1.5s0.672-1.5,1.5-1.5h10.257c0.828,0,1.5,0.671,1.5,1.5 S35.755,15.891,34.927,15.891z" />
        <path d="M34.927,21.292H24.67c-0.828,0-1.5-0.671-1.5-1.5s0.672-1.5,1.5-1.5h10.257c0.828,0,1.5,0.671,1.5,1.5 S35.755,21.292,34.927,21.292z" />
      </svg>
    </div>
  );
};

StoryIcon.propTypes = {
  height: React.PropTypes.number,
};

export default StoryIcon;
