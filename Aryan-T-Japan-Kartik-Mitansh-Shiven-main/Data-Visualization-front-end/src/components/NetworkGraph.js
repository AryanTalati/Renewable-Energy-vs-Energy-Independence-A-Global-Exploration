import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  fetchAllCountriesNetworkGraph,
  fetchDataBasedOnCountryAndYear,
} from "../utils/fetchData";

function NetworkGraph({ selectedCountry, countryList, onCountryChange }) {
  const svgRef = useRef(null);
  const [allCountries, setAllCountries] = useState(null);
  const [countryMap, setCountryMap] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2000");
  const [statistics, setStatistics] = useState({
    totalImports: 0,
    totalExports: 0,
    importDetails: [],
    exportDetails: [],
  });

  const calculateTradeStatistics = (data) => {
    const stats = {
      totalImports: 0,
      totalExports: 0,
      importDetails: [],
      exportDetails: [],
    };

    if (data) {
      data.forEach((entry) => {
        if (entry.flow === "Import") {
          stats.totalImports += entry.value;
          stats.importDetails.push({
            country: entry.partnerCountry,
            value: entry.value,
          });
        } else if (entry.flow === "Export") {
          stats.totalExports += entry.value;
          stats.exportDetails.push({
            country: entry.partnerCountry,
            value: entry.value,
          });
        }
      });
    }
    setStatistics(stats);
  };

  useEffect(() => {
    fetchAllCountriesNetworkGraph()
      .then((data) => {
        const uniqueCountries = [...new Set(data)];
        setAllCountries(uniqueCountries);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCountry.name && selectedYear) {
      fetchDataBasedOnCountryAndYear(selectedCountry.name, selectedYear)
        .then((data) => {
          calculateTradeStatistics(data);
          setCountryMap(data);
        })
        .catch((error) => {
          console.error("Error fetching country data:", error);
        });
    } else {
      setCountryMap(null);
      setStatistics({
        totalImports: 0,
        totalExports: 0,
        importDetails: [],
        exportDetails: [],
      });
    }
  }, [selectedCountry, selectedYear]);

  useEffect(() => {
    if (!allCountries || !svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();
    d3.selectAll(".network-tooltip").remove();

    const width = 700;
    const height = 700;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const tooltip = d3.select("body").append("div")
      .attr("class", "network-tooltip")
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

    let nodesData = [];
    let linksData = [];
    let selectedName = null;

    if (selectedCountry && selectedCountry.name && countryMap) {
      const normalizeCountryName = (name) => name.replace(/\s*\(\d+\)\s*/g, "").trim();
      selectedName = normalizeCountryName(selectedCountry.name);

      const allLinks = countryMap.map((entry) => ({
        source: normalizeCountryName(entry.country),
        target: normalizeCountryName(entry.partnerCountry),
        value: entry.value,
        flow: entry.flow,
        type: entry.type,
        renewableValue: entry.renewableValue
      }));

      const connectedLinks = allLinks.filter(
        (l) => l.source === selectedName || l.target === selectedName
      );
      const connectedNodes = new Set(
        connectedLinks.flatMap((l) => [l.source, l.target])
      );

      nodesData = Array.from(connectedNodes).map((id, index) => ({ id, index }));
      linksData = connectedLinks;
    } else {
      nodesData = [];
      linksData = [];
    }

    if (selectedCountry && selectedCountry.name && nodesData.length === 0) {
      tooltip.remove();
      return;
    }

    const nodeTradeData = {};
    let centralRenewable = 0;
    if (countryMap && selectedCountry && selectedCountry.name) {
      const centralEntry = countryMap.find((e) => e.country.trim() === selectedCountry.name.trim());
      if (centralEntry && centralEntry.renewableValue != null) {
        centralRenewable = parseFloat(centralEntry.renewableValue) || 0;
      }

      countryMap.forEach((entry) => {
        const normC = entry.country ? entry.country.trim() : "";
        const normP = entry.partnerCountry ? entry.partnerCountry.trim() : "";
        if (!nodeTradeData[normC]) nodeTradeData[normC] = { imports: 0, exports: 0 };
        if (!nodeTradeData[normP]) nodeTradeData[normP] = { imports: 0, exports: 0 };

        if (entry.flow === "Import") {
          nodeTradeData[normC].imports += entry.value;
          nodeTradeData[normP].exports += entry.value;
        } else if (entry.flow === "Export") {
          nodeTradeData[normC].exports += entry.value;
          nodeTradeData[normP].imports += entry.value;
        }
      });
    }

    const renewableScale = d3.scaleLinear().domain([0, Math.max(centralRenewable, 1)]).range([5,40]);

    const g = svg.append("g");

    const zoom = d3.zoom().scaleExtent([0.1, 10]).on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    svg.call(zoom);

    const valueExtent = d3.extent(linksData, (d) => d.value);
    const sizeScale = d3.scaleLinear().domain(valueExtent || [0,1]).range([5,15]);

    const simulation = d3
      .forceSimulation(nodesData)
      .force(
        "link",
        d3.forceLink(linksData).id((d) => d.id).distance(250)
      )
      .force("charge", d3.forceManyBody().strength(0))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(20));

    g.append("defs")
      .selectAll("marker")
      .data(["import", "export"])
      .enter()
      .append("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 2)
      .attr("markerHeight", 2)
      .attr("orient", (d) => (d === "import" ? "auto-start-reverse" : "auto"))
      .attr("fill", (d) => (d === "import" ? "red" : "green"));

    const linkGroup = g
      .append("g")
      .selectAll("line")
      .data(linksData)
      .enter()
      .append("line")
      .attr("stroke", (d) => (d.flow === "Import" ? "red" : "green"))
      .attr("stroke-width", (d) => Math.max(0.5, (Math.log(d.value)/Math.log(10))*0.5))
      .attr("marker-start", (d) => (d.flow === "Import" ? `url(#arrow-import)` : null))
      .attr("marker-end", (d) => (d.flow === "Export" ? `url(#arrow-export)` : null));

    const nodeGroup = g
      .append("g")
      .selectAll("g")
      .data(nodesData)
      .enter()
      .append("g")
      .call(
        d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
      );

    nodeGroup
      .append("circle")
      .attr("r", (d) => {
        if (selectedName && d.id === selectedName) {
          return renewableScale(centralRenewable);
        }
        if (!nodeTradeData[d.id]) return 2;
        const totalTrade = nodeTradeData[d.id].imports + nodeTradeData[d.id].exports;
        return sizeScale(totalTrade) || 2;
      })
      .attr("fill", (d) => {
        if (selectedName && d.id === selectedName) {
          return centralRenewable > 0 ? "blue" : "gray";
        }

        if (!nodeTradeData[d.id]) return "gray";
        const { imports, exports } = nodeTradeData[d.id];
        const hasImports = imports > 0;
        const hasExports = exports > 0;
        if (hasImports && hasExports) return "purple";
        if (hasImports) return "red";
        if (hasExports) return "green";
        return "gray";
      })
      .attr("class", "node")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1);

        if (selectedName && d.id === selectedName) {
          tooltip.html(
            `<strong>${d.id}</strong><br/>` +
            `Imports ($): ${statistics.totalImports.toLocaleString()}<br/>` +
            `Exports ($): ${statistics.totalExports.toLocaleString()}<br/>` +
            `Renewable Energy ratio: ${centralRenewable.toLocaleString()}`
          );
        } else {
          if (!nodeTradeData[d.id]) {
            tooltip.html(`<strong>${d.id}</strong><br/>No data available`);
          } else {
            const { imports, exports } = nodeTradeData[d.id];
            tooltip.html(
              `<strong>${d.id}</strong><br/>` +
              `Imports: ${imports.toLocaleString()}<br/>` +
              `Exports: ${exports.toLocaleString()}`
            );
          }
        }

        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    simulation.on("tick", () => {
      linkGroup
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const overlay = d3.select(svgRef.current.parentNode)
      .insert("div", ":first-child")
      .style("position", "absolute")
      .style("top", "0px")
      .style("left", "20px")
      .style("z-index", 1000)
      .style("background-color", "rgba(0,0,0,0.7)")
      .style("color", "#fff")
      .style("padding", "20px")
      .style("width", "700px")
      .style("box-sizing", "border-box")
      .style("text-align", "center");

    overlay.html(`
      <h2 style="margin-top:0; margin-bottom:10px;">Trade Network Graph</h2>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex:1; text-align:left;">
          <select id="countrySelect" style="width:100%; padding:5px; background-color:#333; color:#fff; border:1px solid #555; border-radius:4px;">
            <option value="">Select a country</option>
            ${
              (countryList || [])
                .map(cName => `<option value="${cName}" ${(selectedCountry && selectedCountry.name === cName) ? 'selected' : ''}>${cName}</option>`)
                .join('')
            }
          </select>
        </div>
        <div style="flex:1; text-align:center;">
          <input id="yearRange" type="range" min="2000" max="2020" value="${selectedYear}" style="width:200px;" />
          <span style="margin-left:10px;">Year: ${selectedYear}</span>
        </div>
        <div style="flex:1; text-align:right;">
          <span style="font-size:12px;">
            <strong>Legend:</strong><br/>
            <span style="color:green;">Green Arrow:</span> Export<br/>
            <span style="color:red;">Red Arrow:</span> Import<br/>
            <span style="color:purple;">Purple Node:</span> Both Import & Export<br/>
            <span style="color:red;">Red Node:</span> Import Only<br/>
            <span style="color:green;">Green Node:</span> Export Only<br/>
            <span style="color:gray;">Gray Node:</span> No Data<br/>
            <span style="color:blue;">Blue Node:</span> Central Node (Renewable Energy)
          </span>
        </div>
      </div>
    `);

    overlay.select("#countrySelect").on("change", function() {
      const countryName = this.value;
      if (onCountryChange) {
        onCountryChange(countryName);
      }
    });

    overlay.select("#yearRange").on("input", function() {
      setSelectedYear(this.value);
      overlay.select("span")
        .text("Year: " + this.value);
    });

    return () => {
      simulation.stop();
      tooltip.remove();
      overlay.remove();
    };
  }, [allCountries, countryMap, selectedCountry, selectedYear, countryList, onCountryChange]);

  const noData = selectedCountry && selectedCountry.name && (!countryMap || countryMap.length === 0);

  return (
    <div
      style={{
        position: 'relative',
        width: '700px',
        margin: '0 auto',
        backgroundColor: 'transparent',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          marginTop: '20px',
          width: '700px',
          height: '700px',
          position: 'relative',
          marginBottom: '20px'
        }}
      >
        <svg ref={svgRef} width="700" height="700"></svg>
      </div>
      <div style={{ marginBottom: "20px", color: "white" }}>
        {noData ? (
          <h3>Data isn't available for {selectedCountry && selectedCountry.name}</h3>
        ) : (
          <>
            <h3>Trade Statistics for {selectedCountry && selectedCountry.name ? selectedCountry.name : "No Country Selected"}</h3>
            {statistics.totalImports === 0 && statistics.totalExports === 0 && selectedCountry && selectedCountry.name ? (
              <p>Data isn't available for {selectedCountry.name}</p>
            ) : (
              <table style={{ borderCollapse: "collapse", width: "100%", color:"#fff" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #555' }}>Flow Type</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #555' }}>Total Value ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Imports</td>
                    <td>{statistics.totalImports.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Total Exports</td>
                    <td>{statistics.totalExports.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NetworkGraph;
