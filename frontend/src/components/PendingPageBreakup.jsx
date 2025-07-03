    // frontend/components/PendingPageBreakup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingPageBreakup = () => {
  const [data, setData] = useState({ page1: 0, page2: 0, page3: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/summary/pending-page-breakup')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading breakdown...</p>;

  return (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Pending Payment Breakdown</h3>
      <ul>
        <li><strong>Completed Page 1:</strong> {data.page1}</li>
        <li><strong>Completed Page 2:</strong> {data.page2}</li>
        <li><strong>Completed Page 3:</strong> {data.page3}</li>
      </ul>
    </div>
  );
};

export default PendingPageBreakup;
