import { ReactElement } from 'react';
import React from 'react';
import ConnectToMetaMaskPro from './components/token';
import './App.css';

function App(): ReactElement {
  return (
    <div className="App">
      <header className="App-header">
      <ConnectToMetaMaskPro />
      </header>
    </div>
  );
}

export default App;
