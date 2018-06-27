import React from 'react';

const PlayButton = ({
  isInPlayMode,

  play,
  stop,
}) => (
  <button
    className="Zap-CommandButton"
    onClick={() => {
      if (isInPlayMode) {
        stop();
      } else {
        play();
      }
    }}
  >
    {isInPlayMode
      ? <div className="Zap-IconStop" />
      : <div className="Zap-IconPlay" />
    }
  </button>
);

export default PlayButton;
