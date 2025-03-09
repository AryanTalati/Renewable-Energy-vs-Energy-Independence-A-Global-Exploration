import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { fetchRadarDataBasedOnCountryAndYear } from "../utils/fetchData";

function RadarChart({ selectedCountry, countryList, onCountryChange }) {
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2000);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const features = [
    "renewableElectricityPerCapita",
    "renewEnergyShare",
    "fossilElectricity",
    "renewableElectricity",
  ];

  const featureNames = {
    renewableElectricityPerCapita: "Renewable Electricity Per Capita (Watt/capita)",
    renewEnergyShare: "Renew Energy Share (%)",
    fossilElectricity: "Fossil Electricity (TWh)",
    renewableElectricity: "Renewable Electricity (TWh)"
  };

  const colorScale = d3.scaleOrdinal()
    .domain(features)
    .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"]);

  useEffect(() => {
    if (!selectedCountry || !selectedCountry.name) {
      setData(null);
      return;
    }

    fetchRadarDataBasedOnCountryAndYear(selectedCountry.name, selectedYear)
      .then((d) => {
        setData(d[0]);
      })
      .catch((error) => {
        console.error("Error fetching radar data:", error);
      });
  }, [selectedYear, selectedCountry]);

  useEffect(() => {
    const outerSize = 600;
    const margin = { top: 80, right: 100, bottom: 80, left: 100 };
    const width = outerSize - margin.left - margin.right;
    const height = outerSize - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    if (!tooltipRef.current) {
      tooltipRef.current = d3.select("body")
        .append("div")
        .attr("class", "radar-tooltip")
        .style("position", "absolute")
        .style("z-index", 9999)
        .style("background-color", "rgba(0,0,0,0.8)")
        .style("border", "1px solid #444")
        .style("padding", "8px")
        .style("border-radius", "8px")
        .style("color", "#fff")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("box-shadow", "0 0 5px rgba(0,0,0,0.3)")
        .style("opacity", 0);
    }

    const tooltip = tooltipRef.current;

    const svg = svgEl
      .attr("width", outerSize)
      .attr("height", outerSize);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left + width/2},${margin.top + height/2})`);

    const angleSlice = (Math.PI * 2) / features.length;

    const dataPoints = data
      ? features.map((feature) => ({ feature, value: data[feature] || 0 }))
      : features.map((feature) => ({ feature, value: 0 }));

    const maxValue = d3.max(dataPoints, d => d.value) || 0;

    const rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    const levels = 5;

    const gridGroup = g.append("g").attr("class", "grid-group");
    gridGroup.selectAll(".gridCircle")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d) => (radius / levels) * d)
      .style("fill", "none")
      .style("stroke", "#CDCDCD")
      .style("stroke-dasharray", "4 4");

    gridGroup.selectAll(".axisLabel")
      .data(d3.range(1, levels + 1))
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 0)
      .attr("y", (d) => - (radius / levels) * d)
      .attr("dy", "-0.2em")
      .style("font-size", "10px")
      .style("fill", "#ccc")
      .attr("text-anchor", "middle")
      .text((d) => {
        const val = (maxValue * d / levels);
        return val.toFixed(2);
      });

    const axes = g.selectAll(".axis")
      .data(features)
      .enter()
      .append("g")
      .attr("class", "axis");

    axes.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "#999")
      .style("stroke-width", "1px");

    axes.append("text")
      .attr("class", "feature-label")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => {
        const labelOffset = radius + 40;
        if (i === 0) return 0;
        if (i === 1) return labelOffset;
        if (i === 2) return 0;
        if (i === 3) return -labelOffset;
      })
      .attr("y", (d, i) => {
        const labelOffset = radius + 40;
        if (i === 0) return -labelOffset;
        if (i === 1) return 0;
        if (i === 2) return labelOffset;
        if (i === 3) return 0;
      })
      .attr("transform", (d, i) => {
        if (i === 0 || i === 2) return null;
        if (i === 1) return `rotate(0)`;
        if (i === 3) return `rotate(0)`;
      })
      .style("font-size", "8px")
      .style("font-weight", "bold")
      .style("fill", (d) => colorScale(d))
      .text((d) => featureNames[d]);

    const lineGenerator = d3.lineRadial()
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    if (data) {
      const radarGroup = g.append("g").attr("class", "radar-wrapper");

      radarGroup.selectAll(".radar-path")
        .data([dataPoints])
        .join("path")
        .attr("class", "radar-path")
        .transition().duration(500)
        .attr("d", lineGenerator)
        .style("fill", "white")
        .style("fill-opacity", 0.4)
        .style("stroke", "white")
        .style("stroke-width", "1px");

      const dots = radarGroup.selectAll(".dot")
        .data(dataPoints, d => d.feature);

      dots.join(
        enter => enter.append("circle")
          .attr("class", "dot")
          .attr("r", 4)
          .style("fill", d => colorScale(d.feature))
          .attr("transform", (d, i) => {
            const x = rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
            const y = rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
            return `translate(${x},${y})`;
          })
      )
      .transition().duration(500)
      .attr("transform", (d, i) => {
        const x = rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        const y = rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        return `translate(${x},${y})`;
      });

      radarGroup.selectAll(".dot")
        .on("mouseover", (event, d) => {
          tooltip.style("opacity", 1);
          tooltip.html(`${featureNames[d.feature]}: ${d.value.toFixed(2)}`);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });
    }

  }, [data, selectedCountry, selectedYear]);

  return (
    <div
      style={{
        position: 'relative',
        width: '600px',
        margin: '0 auto',
        backgroundColor: 'transparent',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '20px',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <select
            value={selectedCountry ? selectedCountry.name : ''}
            onChange={(e) => {
              const countryName = e.target.value;
              if (onCountryChange) {
                onCountryChange(countryName);
              }
            }}
            style={{
              width: '100%',
              padding: '5px',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select a country</option>
            {(countryList || []).map((cName) => (
              <option key={cName} value={cName}>
                {cName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <input
            type="range"
            min={2000}
            max={2014}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              width: '200px',
            }}
          />
          <span>Year: {selectedYear}</span>
        </div>

        {!selectedCountry && (
          <p style={{ marginTop: '10px', fontSize: '14px', backgroundColor: '#333', color: '#ccc' }}>
            Please select a country to see the radar chart.
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: '100px',
          width: '600px',
          height: '600px',
          position: 'relative'
        }}
      >
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default RadarChart;
