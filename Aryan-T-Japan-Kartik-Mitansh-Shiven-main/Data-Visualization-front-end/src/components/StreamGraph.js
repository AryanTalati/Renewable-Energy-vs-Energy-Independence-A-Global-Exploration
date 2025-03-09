import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchDataForSteamGraphBasedOnCountry } from '../utils/fetchData'; // Adjust the path as needed

function StreamGraph({ selectedCountry, onCountryChange, countryList }) {
  const ref = useRef();
  const [streamData, setStreamData] = useState(null);

  const margin = { top: 10, right: 150, bottom: 100, left: 60 };
  const width = 800;
  const height = 400;

  const xScaleRef = useRef();
  const yScaleRef = useRef();
  const colorRef = useRef();
  const tooltipRef = useRef();
  const keysRef = useRef([]);
  const bandDomainRef = useRef([]);

  useEffect(() => {
    console.log("StreamGraph mounted");
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      console.log("No selectedCountry, not fetching streamgraph data.");
      setStreamData(null);
      return;
    }

    console.log(`Fetching streamgraph data for country: ${selectedCountry.name}`);
    fetchDataForSteamGraphBasedOnCountry(selectedCountry.name)
      .then(data => {
        console.log("Fetched streamgraph data:", data);
        const transformed = transformStreamData(data);
        setStreamData(transformed);
      })
      .catch(error => console.error("Error fetching streamgraph data:", error));
  }, [selectedCountry]);

  function transformStreamData(rawData) {
    function simplifyKey(str) {
      console.log("Simplifying type string:", str);
      const parts = str.split(" ");
      const lastWord = parts[parts.length - 1];
      return lastWord === "other" ? "Renewables" : lastWord;
    }

    const uniqueTypesSet = new Set(rawData.map(d => d.type));
    let sources = Array.from(uniqueTypesSet);
    console.log("Extracted source types:", sources);
    sources = sources.map(s => simplifyKey(s));
    console.log("Simplified source types:", sources);

    const typeToKeyMap = {};
    Array.from(uniqueTypesSet).forEach((originalType, i) => {
      typeToKeyMap[originalType] = sources[i];
    });
    console.log("typeToKeyMap:", typeToKeyMap);

    rawData.forEach(d => { d.value = +d.value; });

    const groupedByYear = d3.rollups(
      rawData,
      arr => {
        const obj = { year: arr[0].year };
        sources.forEach(s => obj[s] = 0);
        for (const d of arr) {
          const newKey = typeToKeyMap[d.type];
          obj[newKey] = d.value;
        }
        return obj;
      },
      d => d.year
    );

    const result = groupedByYear.map(([year, obj]) => obj).sort((a,b) => a.year - b.year);
    console.log("Transformed streamData:", result);
    return result;
  }

  useEffect(() => {
    d3.select(ref.current).select('svg').remove();
    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', 'transparent');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const chartArea = g.append('g')
      .attr('class', 'chart-area')
      .attr('transform', `translate(0,50)`);

    chartArea.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
    chartArea.append('g').attr('class', 'y-axis');

    chartArea.append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Energy Supply (Quadrillion BTU)");

    chartArea.append("text")
      .attr("class", "x-label")
      .attr("x", width / 2)
      .attr("y", height +50)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Year");

    chartArea.append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -(margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "white");

    tooltipRef.current = d3.select("body")
      .append("div")
      .attr("class", "stream-tooltip")
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

    g.append("g").attr("class", "legend");

  }, [height, margin.bottom, margin.left, margin.right, margin.top, width, selectedCountry]);

  useEffect(() => {
    if (!streamData) return;

    console.log("Updating streamgraph with new data:", streamData);
    const svg = d3.select(ref.current).select('svg');
    const g = svg.select('g');
    const chartArea = g.select('.chart-area');

    const keys = Object.keys(streamData[0]).filter(k => k !== 'year');
    keysRef.current = keys;

    const stack = d3.stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(streamData);

    const x = d3.scaleBand()
      .domain(streamData.map(d => d.year))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([
        d3.min(stackedData, layer => d3.min(layer, d => d[0])),
        d3.max(stackedData, layer => d3.max(layer, d => d[1]))
      ])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeSet2);

    xScaleRef.current = x;
    yScaleRef.current = y;
    colorRef.current = color;
    bandDomainRef.current = x.domain();

    const area = d3.area()
      .x(d => x(d.data.year))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveBasis);

    chartArea.select('.chart-title')
      .text(`Energy Sources Streamgraph for ${selectedCountry ? selectedCountry.name : "Selected Countries"}`);

    const layers = chartArea.selectAll(".layer")
      .data(stackedData, d => d.key);

    layers.enter()
      .append("path")
      .attr("class", "layer")
      .attr("fill", d => color(d.key))
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.7)
      .merge(layers)
      .transition().duration(1000)
      .attr("d", area);

    layers.exit().remove();

    const tooltip = tooltipRef.current;

    chartArea.selectAll(".layer")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1);
      })
      .on("mousemove", (event, d) => {
        const [mx] = d3.pointer(event, chartArea.node());
        const years = bandDomainRef.current;
        let closestYear = null;
        let minDist = Infinity;
        for (const yr of years) {
          const center = x(yr) + x.bandwidth() / 2;
          const dist = Math.abs(mx - center);
          if (dist < minDist) {
            minDist = dist;
            closestYear = yr;
          }
        }

        const datum = streamData.find(r => r.year === closestYear);
        const val = datum[d.key];
        const capKey = d.key === "other" ? "Renewables" : d.key.charAt(0).toUpperCase() + d.key.slice(1);

        tooltip
          .html(`Source: ${capKey}<br>Year: ${closestYear}<br>Value: ${val.toFixed(3)}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    chartArea.select(".x-axis")
      .transition().duration(1000)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "12px");

    chartArea.select(".y-axis")
      .transition().duration(1000)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "12px");

    const legendG = g.select(".legend")
      .attr("transform", `translate(${width - margin.right}, 0)`);

    const legendItems = legendG.selectAll(".legend-item")
      .data(keys, d => d);

    const legendEnter = legendItems.enter().append("g")
      .attr("class", "legend-item");

    legendEnter.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("stroke", "black");

    legendEnter.append("text")
      .attr("fill", "white")
      .style("font-size", "12px");

    legendEnter.merge(legendItems)
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legendEnter.merge(legendItems)
      .select("rect")
      .attr("fill", d => color(d));

    legendEnter.merge(legendItems)
      .select("text")
      .attr("x", 15 + 5)
      .attr("y", 15 - 5)
      .text(d => (d === "other" ? "Renewables" : d.charAt(0).toUpperCase() + d.slice(1)));

    legendItems.exit().remove();

    const legendBBox = legendG.node().getBBox();
    const legendBg = legendG.selectAll(".legend-bg").data([null]);
    legendBg.enter().insert("rect", ":first-child")
      .attr("class", "legend-bg")
      .merge(legendBg)
      .attr("x", legendBBox.x - 10)
      .attr("y", legendBBox.y - 10)
      .attr("width", legendBBox.width + 50)
      .attr("height", legendBBox.height + 20)
      .attr("fill", "rgba(0,0,0,0.5)")
      .attr("rx", 5)
      .attr("ry", 5);

  }, [streamData, selectedCountry]);

  return (
    <div
      style={{
        position: 'relative',
        width: '860px', 
        margin: '0 auto',
        backgroundColor: 'transparent',
        overflow: 'visible'
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
          boxSizing: 'border-box'
        }}
      >
        <select
          value={selectedCountry ? selectedCountry.name : ''}
          onChange={(e) => {
            const countryName = e.target.value;
            console.log("Country dropdown changed:", countryName);
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

      <div
        ref={ref}
        style={{
          marginTop: '100px',
          width: '860px',
          height: '600px',
          position: 'relative'
        }}
      ></div>
    </div>
  );
}

export default StreamGraph;
