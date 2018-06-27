import React from 'react';

const PauseButton = ({
  isInPlayMode,
  isPaused,

  pause,
  resume,
}) => (
  <button
    className={'Zap-CommandButton' + (isInPlayMode ? '' : ' Zap-DisabledButton')}
    onClick={() => {
      if (!isInPlayMode) {
        return;
      }
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    }}
  >
    {isPaused
      ? <div className="Zap-IconPlay" />
      : <div className="Zap-IconPause" />
    }
  </button>
);

export default PauseButton;
