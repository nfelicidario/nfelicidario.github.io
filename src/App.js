import './App.css';
import React from 'react';
import Panel from './Panel';

const App = () => {
  return (
    <div className="container mx-auto py-8">
      <Panel title="Example Panel" children="test">
        <p>This is the content of the panel.</p>
      </Panel>
    </div>
  );
};

export default App;

