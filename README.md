# TokenChecker

TokenChecker is a React application built with TypeScript and Vite. It provides tools for checking staked and liquidity pool (LP) token balances using Ethereum smart contracts. The application leverages Infura as an RPC provider to interact with the Ethereum blockchain.

## Features

- **React + TypeScript + Vite**: Utilizes modern web development technologies for a fast and efficient development experience.
- **Staked Balance Checker**: A component to fetch and display staked token balances from a specified smart contract.
- **LP Balance Checker**: A component to fetch and display liquidity pool token balances from a specified smart contract.
- **Ethereum Integration**: Uses ethers.js to interact with Ethereum smart contracts and Infura for blockchain data.

## Setup

1. **Install Dependencies**: Ensure you have Node.js installed, then run:

   npm install

2. **Environment Configuration:**: To run the application, execute the following command:
   //GET YOUR INFURA ID FROM https://infura.io/dashboard/

   VITE_INFURA_URL= <your infura id>

3. **Run the Application**: To start the development server, run:

   npm run dev
