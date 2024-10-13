import { useState } from 'react';
import { ethers } from 'ethers';
import { getAddress, formatUnits } from 'ethers'; // Import specific utilities
import { LPAbi } from '../abis/LPAbi';
import { exportDataToCSV } from '../utils/toCSV';

const contractAbi = LPAbi;

interface StakedBalanceCheckerProps {
  contractAddress: string;
}

const LPBalanceChecker: React.FC<StakedBalanceCheckerProps> = ({
  contractAddress,
}) => {
  const [walletBalances, setWalletBalances] = useState<
    Array<{ wallet: string; balance: number; reason: string }>
  >([]);

  // Use Infura or other RPC provider
  const infuraUrl = process.env.INFURA_URL;
  const provider = new ethers.JsonRpcProvider(infuraUrl);

  // Initialize contract instance
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);

  // Function to fetch transactions and wallets involved
  const getWalletsAndBalances = async () => {
    try {
      // Filter to get logs/events related to the contract (adjust the filter if needed for specific events)
      const filter = {
        address: contractAddress,
        fromBlock: 'earliest', // or set to a specific block number if needed
        toBlock: 'latest',
      };

      // Fetch the logs from the contract
      const logs = await provider.getLogs(filter);

      // Extract unique wallet addresses from logs (assuming the address is in log.topics[1])
      const walletAddresses = [
        ...new Set(
          logs
            .map((log) => log.topics[1])
            .filter(
              (address) =>
                address &&
                address !==
                  '0x0000000000000000000000000000000000000000000000000000000000000000'
            )
            .map((address) => {
              try {
                return getAddress('0x' + address.slice(26));
              } catch (error) {
                console.warn('Invalid address:', address, error);
                return null;
              }
            })
            .filter((address): address is string => address !== null)
        ),
      ];

      if (walletAddresses.length === 0) {
        console.log('No valid wallet addresses found');
        return;
      }

      // Fetch staked balances for each wallet
      const walletBalances = await Promise.all(
        walletAddresses.map(async (wallet) => {
          console.log(wallet);

          // Fetch the balance for the wallet
          const balance = await contract.balanceOf(wallet);

          // Convert the balance to a human-readable format with a maximum of 4 decimals
          const totalStaked = parseFloat(formatUnits(balance, 18)).toFixed(4);

          // Exclude zero balances
          if (parseFloat(totalStaked) > 0) {
            return { wallet, balance: parseFloat(totalStaked), reason: 'LP' };
          }
          return null;
        })
      );

      // Filter out null values (wallets with zero balance)
      const filteredBalances = walletBalances.filter(
        (
          balance
        ): balance is { wallet: string; balance: number; reason: string } =>
          balance !== null
      );
      setWalletBalances(filteredBalances);
    } catch (error) {
      console.error('Error fetching wallets and staked balances:', error);
    }
  };

  // Export wallet balances to CSV
  const exportToCSV = () => {
    if (walletBalances.length > 0) {
      exportDataToCSV(walletBalances, 'wallet_balances');
    }
  };

  return (
    <div>
      <h2>Provided LP</h2>
      <button onClick={getWalletsAndBalances}>
        Get Wallets and LP Balances
      </button>
      <button onClick={exportToCSV} disabled={walletBalances.length === 0}>
        Export to CSV
      </button>
      <ul>
        {walletBalances.map(({ wallet, balance }, index) => (
          <li key={index}>
            {wallet} : {balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LPBalanceChecker;
