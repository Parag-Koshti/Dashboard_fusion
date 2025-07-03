import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SummaryCard = ({ title, endpoint, field }) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000${endpoint}`)
      .then(res => {
        if (res.data && res.data[field] !== undefined) {
          setCount(res.data[field]);
        } else {
          setCount('N/A');
        }
      })
      .catch(err => {
        console.error(`❌ Error fetching ${title} data:`, err);
        setCount('Error');
      });
  }, [endpoint, field, title]);

  return (
    <div style={{
      padding: '1rem 2rem',
      borderRadius: '8px',
      background: '#f0f0f0',
      textAlign: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      minWidth: '200px'
    }}>
      <h3>{title}</h3>
      <h2>{count !== null ? count : 'Loading...'}</h2>
    </div>
  );
};

export default SummaryCard;
