/* eslint-disable @typescript-eslint/no-unused-vars */

import reactLogo from './assets/react.svg';

import './App.css';
import StakedBalanceChecker from './components/StakedCheck';
import LPBalanceChecker from './components/LpCheck';
import NftOwnersChecker from './components/NftOwnders';

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Token Balance Checker</h1>
      <div className="card">
        <StakedBalanceChecker contractAddress="0xfb691697bdaf1857c748c004cc7dab3d234e062e" />
      </div>
      <div className="card">
        <LPBalanceChecker contractAddress="0xf96Bc096dd1E52dcE4d595B6C4B8c5d2200db1E5" />
      </div>
      <div className="card">
        <NftOwnersChecker contractAddress="0x519eD34150300dC0D04d50a5Ff401177A92b4406" />
      </div>
    </>
  );
}
export default App;
