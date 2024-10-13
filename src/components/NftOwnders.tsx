import React, { useState } from 'react';
import { ethers } from 'ethers';
import { erc721AbiSamurai } from '../abis/NFTAbi';
import { exportDataToCSV } from '../utils/toCSV';

// ERC721 ABI with the ownerOf function
const erc721Abi = erc721AbiSamurai;

interface NftOwnersProps {
  contractAddress: string;
}

const NftOwnersChecker: React.FC<NftOwnersProps> = ({ contractAddress }) => {
  const [owners, setOwners] = useState<
    Array<{ tokenId: string; owner: string; reason: string }>
  >([]); // Set owner type to string instead of number
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Connect to the Ethereum network using Infura
  const infuraUrl = process.env.infuraId;
  const provider = new ethers.JsonRpcProvider(infuraUrl);

  // Initialize the contract instance
  const contract = new ethers.Contract(contractAddress, erc721Abi, provider);

  // Function to get owners of all tokens from 1 to 2006
  const getAllOwners = async () => {
    console.log('Starting to fetch all NFT owners');
    setLoading(true);
    setProgress(0);
    try {
      const ownerList: Array<{
        tokenId: string;
        owner: string;
        reason: string;
      }> = [];

      // Loop through each tokenId from 1 to 2006
      for (let tokenId = 1; tokenId <= 2006; tokenId++) {
        let retries = 3;
        while (retries > 0) {
          try {
            console.log(`Fetching owner for token ID ${tokenId}`);
            // Get the owner of the current tokenId
            const owner = await contract.ownerOf(tokenId);
            console.log(`Fetched owner for token ID ${tokenId}: ${owner}`);
            ownerList.push({
              tokenId: tokenId.toString(),
              owner,
              reason: 'NFT',
            });
            setProgress((prevProgress) => prevProgress + 1);
            break; // Exit the retry loop on success
          } catch (error) {
            retries -= 1;
            console.error(
              `Error fetching owner for token ID ${tokenId}, retries left: ${retries}`,
              error
            );
            if (retries === 0) {
              console.error(
                `Failed to fetch owner for token ID ${tokenId} after multiple attempts.`
              );
            }
          }
        }
      }

      setOwners(ownerList); // Set ownerList after the loop completes
      console.log('Finished fetching all owners');
    } catch (error) {
      console.error('Error fetching all owners:', error);
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  // Export owners to CSV
  const exportToCSV = () => {
    if (owners.length > 0) {
      exportDataToCSV(owners, 'nft_owners');
    }
  };

  return (
    <div>
      <h2>Owners of the NFT Collection:</h2>
      <button onClick={getAllOwners} disabled={loading}>
        {loading ? `Loading... (${progress}/2006)` : 'Get All NFT Owners'}
      </button>
      <button onClick={exportToCSV} disabled={owners.length === 0}>
        Export to CSV
      </button>
      <ul>
        {owners.map(({ tokenId, owner }, index) => (
          <li key={index}>
            Token ID: {tokenId}, Owner: {owner}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NftOwnersChecker;
