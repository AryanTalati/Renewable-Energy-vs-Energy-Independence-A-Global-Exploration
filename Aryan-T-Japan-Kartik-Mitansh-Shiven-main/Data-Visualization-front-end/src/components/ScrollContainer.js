import React, { useEffect, useState, useRef } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import Globe from './Globe';
import LineChart from './LineChart';
import StreamGraph from './StreamGraph';
import RadarChart from './RadarChart';
import NetworkGraph from './NetworkGraph';

function ScrollContainer({ allData }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const streamGraphRef = useRef(null);
  const [showAdditionalVis, setShowAdditionalVis] = useState(false);

  const allAttr1Values = allData.flatMap((yearData) =>
    yearData.countries.map((country) => country.attr1)
  );

  const globalMinValue = Math.min(...allAttr1Values);
  const globalMaxValue = Math.max(...allAttr1Values);

  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
    const currentYear = 2000 + data;
    if (currentYear === 2014 && !selectedCountry) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showAdditionalVis ? 'hidden' : 'auto';
  }, [showAdditionalVis]);

  useEffect(() => {
    if (allData) {
      const countriesSet = new Set();
      allData.forEach((yearData) => {
        yearData.countries.forEach((country) => {
          countriesSet.add(country.name);
        });
      });
      setCountryList(Array.from(countriesSet).sort());
    }
  }, [allData]);

  useEffect(() => {
    const globeContainer = document.querySelector('.GlobeContainer');
    if (globeContainer) {
      const handleWheel = (e) => {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
      };

      globeContainer.addEventListener('wheel', handleWheel);
      return () => globeContainer.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const onStepProgress = ({ data, progress }) => {
  };

  const handleCountrySelect = (countryData) => {
    if (typeof countryData === 'string') {
      if (countryData === '') {
        setSelectedCountry(null);
      } else {
        const found = allData[0].countries.find((c) => c.name === countryData);
        setSelectedCountry(found || null);
      }
    } else {
      setSelectedCountry(countryData);
    }
    setShowPrompt(false);
  };

  const handleStreamGraphCountryChange = (countryName) => {
    handleCountrySelect(countryName);
  };

  const currentYear = 2000 + currentStepIndex;
  const yearData = allData.find((d) => d.year === currentYear);

  const showSeeMoreButton = currentYear === 2014 && selectedCountry;

  return (
    <div style={{ height: '375vh', overflow: showAdditionalVis ? 'hidden' : 'auto' }}>
      <Scrollama onStepEnter={onStepEnter} onStepProgress={onStepProgress} offset={0.5}>
        {[...Array(15)].map((_, stepIndex) => (
          <Step data={stepIndex} key={stepIndex}>
            <div
              style={{
                margin: '10vh 0',
                opacity: currentStepIndex === stepIndex ? 1 : 0.5,
                minHeight: '10vh',
              }}
            >
              <h2>Year: {2000 + stepIndex}</h2>
            </div>
          </Step>
        ))}
      </Scrollama>

      {showPrompt && (
        <div
          style={{
            position: 'fixed',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'transparent',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            zIndex: 1000,
            color: '#fff'
          }}
        >
          <p>Please select a country to see more details.</p>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          top: '5%',
          left: '5%',
          zIndex: 1000,
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff'
        }}
      >
        Year: {currentYear}
      </div>

      <Globe
        className="GlobeContainer"
        yearData={yearData}
        onCountrySelect={handleCountrySelect}
        selectedCountry={selectedCountry}
        globalMinValue={globalMinValue}
        globalMaxValue={globalMaxValue}
      />

      <div
        style={{
          position: 'fixed',
          top: '10%',
          right: '5%',
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #444',
          width: '400px',
        }}
      >
        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
          {selectedCountry ? (
            <h3 style={{ margin: '0 0 10px' }}>Trends for {selectedCountry.name}</h3>
          ) : (
            <h3 style={{ margin: '0 0 10px' }}>Global Trends</h3>
          )}
          <select
            value={selectedCountry ? selectedCountry.name : ''}
            onChange={(e) => handleCountrySelect(e.target.value)}
            style={{
              width: '100%',
              padding: '5px',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
            }}
          >
            <option value="">Select a country</option>
            {countryList.map((countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            ))}
          </select>
          {!selectedCountry && (
            <p style={{ marginTop: '10px', fontSize: '14px', backgroundColor: '#333', color: '#ccc' }}>
              Please select a country to see detailed trends.
            </p>
          )}
        </div>
        <LineChart
          allData={allData}
          selectedCountry={selectedCountry}
          currentYear={currentYear}
        />
      </div>

      {showAdditionalVis && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: '#000000',
            color: '#ffffff',
            zIndex: 2000,
            overflowY: 'auto',
            scrollSnapType: 'y mandatory',
            overscrollBehavior: 'contain'
          }}
        >
          {/* Stream Graph Section */}
          <div
            ref={streamGraphRef}
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '30px' }}>StreamGraph</h2>
            <StreamGraph
              selectedCountry={selectedCountry}
              countryList={countryList}
              onCountryChange={handleStreamGraphCountryChange}
            />
            <button
              style={{
                position: 'fixed',
                top: '10%',
                left: '5%',
                zIndex: 3000,
                padding: '10px 20px'
              }}
              onClick={() => {
                setShowAdditionalVis(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Back to Globe
            </button>
          </div>

          {/* Radar Chart Section */}
          <div
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Radar Chart</h2>
            <RadarChart
              selectedCountry={selectedCountry}
              countryList={countryList}
              onCountryChange={handleCountrySelect}
            />
          </div>

          {/* Network Graph Section */}
          <div
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <NetworkGraph
              selectedCountry={selectedCountry}
              countryList={countryList}
              onCountryChange={handleCountrySelect}
            />
          </div>
        </div>
      )}

      {showSeeMoreButton && (
        <button
          style={{
            position: 'fixed',
            bottom: '5%',
            right: '5%',
            padding: '10px 20px',
            fontSize: '16px',
          }}
          onClick={() => {
            setShowAdditionalVis(true);
            requestAnimationFrame(() => {
              if (streamGraphRef.current) {
                streamGraphRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            });
          }}
        >
          See More for {selectedCountry.name} →
        </button>
      )}
    </div>
  );
}

export default ScrollContainer;
