import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostChart from './PostChart';
import GenderChart from './GenderChart';
import StreamChart from './StreamChart';
import SummaryCard from './SummaryCard';
import DrillDownChart from './DrillDownChart'; // Post → Stream
import DrillDownStreamGender from './DrillDownStreamGender';
import DrillDownPostCity from './DrillDownPostCity'; // Post → City
import DrillDownFeePostChart from './DrillDownFeePostChart'; // adjust path as needed




const Dashboard = () => {
  const [showMoreCards, setShowMoreCards] = useState(false);
  const [pendingBreakup, setPendingBreakup] = useState(null);

  const handleToggle = () => {
    setShowMoreCards(prev => !prev);
  };

  useEffect(() => {
    if (showMoreCards) {
      axios.get('/api/summary/pending-page-breakup')
        .then(res => setPendingBreakup(res.data))
        .catch(err => console.error('❌ Error fetching pending page breakup:', err));
    }
  }, [showMoreCards]);

  const cardStyle = {
    flex: '1 1 20%',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f8f9fa',
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Candidate Dashboard</h1>

      {/* ✅ Summary Cards Row 1 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1rem', gap: '1rem' }}>
      <div style={cardStyle}>
        <SummaryCard
          title="Total Registered Candidate"
          endpoint="/api/summary/total-candidates"
          field="total"
        /></div>
        <div style={cardStyle}>
          <SummaryCard title="Total Applications" endpoint="/api/summary/total" field="totalApplications" />
        </div>
        <div style={cardStyle}>
          <SummaryCard title="Completed Payment" endpoint="/api/summary/isfeepaid" field="isFeePaid" />
        </div>
        <div style={cardStyle}>
          <SummaryCard title="PWD Applications" endpoint="/api/summary/disability" field="disabilityYesCount" />
        </div>
        
        <div onClick={handleToggle} style={{ ...cardStyle, cursor: 'pointer' }}>
          <SummaryCard title="Pending Payment" endpoint="/api/summary/isfeepending" field="isFeePending" />
        </div>
      </div>

      {/* ✅ Summary Cards Row 2 (toggle) */}
      {showMoreCards && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1rem', gap: '1rem' }}>
            <div style={cardStyle}>
              <SummaryCard title="Candidate on Page-1" endpoint="/api/summary/completed-page-1" field="completedPage1Count" />
            </div>
            <div style={cardStyle}>
              <SummaryCard title="Candidate on Page-2" endpoint="/api/summary/completed-page-2" field="completedPage2Count" />
            </div>
            <div style={cardStyle}>
              <SummaryCard title="Candidate on Page-3" endpoint="/api/summary/completed-page-3" field="completedPage3Count" />
            </div>
          </div>

          {/* ✅ Pending Page-wise Breakdown */}
          {pendingBreakup && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
              background: '#eef',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <div style={{ ...cardStyle, flex: '1 1 30%' }}>
                <h4>Only Page 1 Completed</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingBreakup.page1Only}</p>
              </div>
              <div style={{ ...cardStyle, flex: '1 1 30%' }}>
                <h4>Page 2 Completed</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingBreakup.page2Included}</p>
              </div>
              <div style={{ ...cardStyle, flex: '1 1 30%' }}>
                <h4>Page 3 Completed</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingBreakup.page3Included}</p>
              </div>
              <div style={{
                ...cardStyle,
                flex: '1 1 100%',
                textAlign: 'center',
                backgroundColor: '#fff3cd'
              }}>
                <strong>
                  ✅ Total (Calculated): {pendingBreakup.calculatedTotal} / Pending: {pendingBreakup.pendingPaymentTotal}
                </strong>
              </div>
            </div>
          )}
        </>
      )}
      <div style={{ marginTop: '2rem' }}>
        <DrillDownPostCity />
      </div>
      {/* ✅ Drill-down charts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ flex: '1 1 48%' }}>
          <DrillDownChart />
        </div>
        <div style={{ flex: '1 1 48%' }}>
          <DrillDownFeePostChart />
        </div>
      </div>

      {/* ✅ Post & Gender charts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ flex: '1 1 48%' }}>
          <PostChart />
        </div>
        <div style={{ flex: '1 1 48%' }}>
          <GenderChart />
        </div>
      </div>

      {/* ✅ Full-width Stream chart */}
      <div style={{ marginTop: '2rem' }}>
        <StreamChart />
      </div>

      {/* ✅ Stream → Gender Drill-down */}
      <div style={{ marginTop: '2rem' }}>
        <DrillDownStreamGender />
      </div>
    </div>
  );
};

export default Dashboard;
