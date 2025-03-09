import React, { useEffect, useState } from 'react';
import ScrollContainer from './components/ScrollContainer';
import './App.css';
import { fetchCombinedProductionData } from './utils/fetchData';

function App() {
  console.log('App component rendered');

  const [allData, setAllData] = useState(null);

  useEffect(() => {
    console.log('Fetching all data on app load...');
    fetchCombinedProductionData().then((data) => {
      console.log('All data fetched:', data);
      setAllData(data);
    });
  }, []);

  if (!allData) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="App">
      <div
        style={{
          position: 'fixed',
          top: '2%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px 20px',
          borderRadius: '8px',
          
        }}
      >

        <h1 style={{ margin: 0, fontSize: '2.5rem', fontFamily: 'Arial, sans-serif',textShadow: '1px 1px 3px rgba(0,0,0,0.8)',fontWeight: 600,}}>
          <span style={{ color: 'steelblue' }}>Renewable Energy</span>{' '}
          <span style={{ color: 'white' }}>Vs</span>{' '}
          <span style={{ color: 'orange' }}>Energy Independence</span>
        </h1>
        <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'Arial, sans-serif',textShadow: '1px 1px 3px rgba(0,0,0,0.8)',fontWeight: 400, color: '#ffffff', marginTop: '5px'}}>A Global Exploration</h2>
      </div>
      <ScrollContainer allData={allData} />
    </div>
  );
  
}

export default App;
