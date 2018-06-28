import React from 'react';
import './CommandBar.css';

import PlayButton from './PlayButton';
import PauseButton from './PauseButton';

const CommandBar = ({
  width,
  runStatus,

  play,
  stop,
  pause,
  resume
}) => (
  <div
    className="Zap-CommandBar"
    style={{
      width,
    }}
  >
    <PlayButton
      isInPlayMode={runStatus !== 'STOPPED'}

      play={play}
      stop={stop}
    />
    <PauseButton
      isInPlayMode={runStatus !== 'STOPPED'}
      isPaused={runStatus === 'PAUSED'}

      pause={pause}
      resume={resume}
    />
  </div>
);

export default CommandBar;
