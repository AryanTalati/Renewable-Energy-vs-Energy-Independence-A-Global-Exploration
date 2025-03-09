import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import * as chromatic from 'd3-scale-chromatic';

function GlobeComponent({ yearData, onCountrySelect, selectedCountry, globalMinValue,
  globalMaxValue, }) {
  const globeRef = useRef();
  const [countriesGeoJson, setCountriesGeoJson] = useState(null);
  const featuresWithValuesRef = useRef([]);

  useEffect(() => {
    if (!countriesGeoJson) {
      console.log('Fetching country geometries');
      fetch('././GlobeCountries.geojson')
        .then((res) => res.json())
        .then((countries) => {
          console.log('Loaded country geometries:', countries);
          setCountriesGeoJson(countries);
          featuresWithValuesRef.current = countries.features;
        })
        .catch((error) => {
          console.error('error loading country geometries:', error);
        });
    }
  }, [countriesGeoJson]);

  useEffect(() => {
    if (countriesGeoJson && yearData) {
      console.log('Updating features with values');
      featuresWithValuesRef.current.forEach((feature) => {
        const countryName =
          feature.properties.NAME || feature.properties.ADMIN;
        const countryData = yearData.countries.find(
          (c) => c.name === countryName
        );

        feature.properties.value = countryData ? countryData.attr1 : 0;
        feature.properties.lat = countryData ? countryData.lat : 0;
        feature.properties.lng = countryData ? countryData.lng : 0;
      });
    }
  }, [yearData, countriesGeoJson]);

  const colorScale = useMemo(() => {
    if (yearData) {
      console.log('Constructing color scale with globalMinValue:', globalMinValue, 'globalMaxValue:', globalMaxValue);
      const scale = d3
        .scaleSequentialPow(chromatic.interpolateYlGn)
        .exponent(0.5)
        .domain([globalMinValue, globalMaxValue]);
  
      return scale;
    } else {
      console.log('No yearData, returning null color scale');
      return null;
    }
  }, [globalMinValue, globalMaxValue, yearData]);
  

  const handleCountryClick = (countryFeature) => {
    if (!countryFeature) return;

    const countryName =
      countryFeature.properties.NAME || countryFeature.properties.ADMIN;
    console.log('Clicked on country:', countryName);

    // Find the country data
    const countryData = yearData.countries.find(
      (c) => c.name === countryName
    );

    if (onCountrySelect) {
      if (selectedCountry && selectedCountry.name === countryName) {
        console.log(`Deselecting country: ${countryName}`);
        onCountrySelect(null);

        // Reset globe's point of view
        if (globeRef.current) {
          console.log('Resetting globe view to default');
          globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);
        }
      } else if (countryData) {
        console.log(`Selecting country: ${countryName}`);
        onCountrySelect(countryData);

        // Rotate the globe to the selected country
        if (globeRef.current) {
          const { lat, lng } = countryData;
          console.log(`Rotating globe to lat: ${lat}, lng: ${lng}`);
          globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
        }
      }
    }
  };

   useEffect(() => {
    if (selectedCountry) {
      console.log(`selectedCountry changed: ${selectedCountry.name}`);
      if (globeRef.current) {
        const { lat, lng } = selectedCountry;
        console.log(
          `Rotating globe to selected country via dropdown: ${selectedCountry.name} at lat: ${lat}, lng: ${lng}`
        );
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
      }
    } else {
      console.log('selectedCountry is null, resetting globe view to default');
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);
      }
    }
  }, [selectedCountry]);

  const handleCountryHover = (countryFeature) => {
    const countryName = countryFeature
      ? countryFeature.properties.NAME || countryFeature.properties.ADMIN
      : null;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '60%',
        height: '100vh',
      }}
    >
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="#000000"
        polygonsData={featuresWithValuesRef.current}
        polygonAltitude={(feat) =>
          feat.properties.ADMIN === selectedCountry?.name ? 0.06 : 0.01
        }
        polygonCapColor={(feat) => {
          const value = feat.properties.value;
          const baseColor = colorScale ? colorScale(value) : '#cccccc';
          return baseColor;
        }}
        polygonsTransitionDuration={3000}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonStrokeColor={() => '#111'}
        polygonLabel={({ properties }) => {
          const countryName = properties.NAME || properties.ADMIN;
          const value = properties.value;
          const attr2Value = properties.attr2Value;
        
          return `
            <div style="
              text-align: center;
              font-size: 14px;
              background: rgba(0, 0, 0, 0.7);
              color: #fff;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            ">
              <strong style="font-size: 16px; text-decoration: underline;">${countryName}</strong><br/>
              <span style="color: steelblue;">Renewable Energy Produced:</span> ${value.toFixed(2)}<br/>
            </div>
          `;
        }}
        
        onPolygonClick={handleCountryClick}
        onPolygonHover={handleCountryHover}
        enableZoom={false}
      />
    </div>
  );
}

export default GlobeComponent;
