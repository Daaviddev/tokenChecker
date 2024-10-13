import { useState } from 'react';
import { exportDataToCSV } from '../utils/toCSV';

const MORALIS_API_KEY = '';
const FETCH_API = ``;

export interface Holder {
  owner_address: string;
  balance: string;
  balance_formatted: string;
  isContract: boolean;
}

const TokenOwners = () => {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTokenHolders = async () => {
    setLoading(true);
    try {
      const response = await fetch(FETCH_API, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': MORALIS_API_KEY,
        },
      });

      const data = await response.json();
      const filteredHolders = data.result;

      setHolders(filteredHolders);
      setTotalCount(filteredHolders.length);
    } catch (error) {
      console.error('Error fetching token holders:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    exportDataToCSV(holders, 'token_holders');
  };

  return (
    <div>
      <h2>Current Token Holders</h2>
      <button onClick={fetchTokenHolders} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Token Holders'}
      </button>
      <button onClick={exportToCSV} disabled={holders.length === 0}>
        Export to CSV
      </button>

      {totalCount > 0 && <p>Total Holders: {totalCount}</p>}
      {loading && <p>Loading...</p>}

      <ul>
        {holders.map((holder, index) => (
          <li key={index}>
            Address: {holder.owner_address}, Balance: {holder.balance_formatted}{' '}
            tokens
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenOwners;
