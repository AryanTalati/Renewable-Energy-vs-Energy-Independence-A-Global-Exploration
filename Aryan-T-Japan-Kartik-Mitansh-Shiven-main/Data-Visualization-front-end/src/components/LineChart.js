import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function LineChart({ allData, selectedCountry, currentYear }) {
  const ref = useRef();
  
  const width = 375;
  const height = 300;
  const margin = { top: 50, right: 30, bottom: 40, left: 50 };
  const tooltipRef = useRef(null);

  useEffect(() => {
    d3.select(ref.current).select('svg').remove();
    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3
      .scaleLinear()
      .domain([2000, 2020])
      .range([margin.left, width - margin.right]);

    const y1 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const y2 = d3.scaleLinear().range([height - margin.bottom, margin.top]);


    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`);
      

    svg
      .append('g')
      .attr('class', 'y-axis-attr1')
      .attr('transform', `translate(${margin.left},0)`);
    
    svg
      .append('g')
      .attr('class', 'y-axis-attr2')
      .attr('transform', `translate(${width - margin.right -5},0)`);

    svg.append('path').attr('class', 'line1');
    svg.append('path').attr('class', 'line2');


    svg
    .append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', (width - margin.left) / 2 + margin.left/2)
    .attr('y', height - margin.bottom / 2 + 20)
    .style('font-size', '16px')
    .style('fill', 'white')
    .text('Year');


    

    svg
      .append('text')
      .attr('class', 'legend-attr1')
      .attr('x', width - margin.right - width/2.4)
      .attr('y', margin.top - 28)
      .attr('fill', 'steelblue')
      .style('font-weight', 'bold')
      .text('Renewable Energy Produced (%)')
      .style('font-size', '12px');

    svg
      .append('text')
      .attr('class', 'legend-attr2')
      .attr('x', width - margin.right - width/2.4)
      .attr('y', margin.top-10)
      .attr('fill', 'orange')
      .style('font-weight', 'bold')
      .text('Energy Imported (%)')
      .style('font-size', '12px');
      return () => {
        d3.select(ref.current).select('svg').remove();
        tooltipRef.current.remove();
      };
  }, []);

  

  useEffect(() => {
    tooltipRef.current = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(0,0,0,0.8)')
      .style('border', '1px solid #444')
      .style('padding', '8px')
      .style('border-radius', '8px')
      .style('pointer-events', 'none')
      .style('color', '#ffffff')
      .style('font-size', '12px')
      .style('box-shadow', '0 0 5px rgba(0,0,0,0.3)')
      .style('opacity', 0);
  
    return () => {
      tooltipRef.current.style('opacity', 0);
    };
  }, []);
  const x = d3
      .scaleLinear()
      .domain([2000, 2014])
      .range([margin.left, width - margin.right]);

    const y1 = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const y2 = d3.scaleLinear().range([height - margin.bottom, margin.top]);

  useEffect(() => {
    if (allData) {
      const svg = d3.select(ref.current).select('svg');
      

      let data;

      if (selectedCountry) {
        console.log(
          `Rendering line chart for ${selectedCountry.name} up to year ${currentYear}`
        );

        data = allData
          .filter((yearData) => yearData.year <= currentYear)
          .map((yearData) => {
            const country = yearData.countries.find(
              (c) => c.name === selectedCountry.name
            );
            return {
              year: yearData.year,
              attr1: country ? country.attr1 : null,
              attr2: country ? country.attr2 : null,
            };
          });
      } else {
        console.log('Rendering global line chart up to year', currentYear);

        data = allData
          .filter((yearData) => yearData.year <= currentYear)
          .map((yearData) => {
            const avgAttr1 =
              yearData.countries.reduce((sum, c) => sum + c.attr1, 0) /
              yearData.countries.length;
            const avgAttr2 =
              yearData.countries.reduce((sum, c) => sum + c.attr2, 0) /
              yearData.countries.length;
            return {
              year: yearData.year,
              attr1: avgAttr1,
              attr2: avgAttr2,
            };
          });
      }

      console.log('Data for line chart:', data);

      console.log('Updating y-scales for attr1 and attr2');

      const attr1Extent = d3.extent(data, d => d.attr1).map(v => v == null ? 0 : v);
      const attr2Extent = d3.extent(data, d => d.attr2).map(v => v == null ? 0 : v);

      if (attr1Extent[0] === attr1Extent[1]) {
        attr1Extent[0] = attr1Extent[0] * 0.9;
        attr1Extent[1] = attr1Extent[1] * 1.1;
      }
      if (attr2Extent[0] === attr2Extent[1]) {
        attr2Extent[0] = attr2Extent[0] * 0.9;
        attr2Extent[1] = attr2Extent[1] * 1.1;
      }

      attr1Extent[0] = attr1Extent[0] == null ? 0 : attr1Extent[0];
      attr1Extent[1] = attr1Extent[1] == null ? 1 : attr1Extent[1];
      attr2Extent[0] = attr2Extent[0] == null ? 0 : attr2Extent[0];
      attr2Extent[1] = attr2Extent[1] == null ? 1 : attr2Extent[1];

      console.log('attr1Extent:', attr1Extent, 'attr2Extent:', attr2Extent);

      y1.domain(attr1Extent);
      y2.domain(attr2Extent);

      svg
        .select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(x).ticks(21).tickFormat(d3.format('d')));

      svg
        .select('.y-axis-attr1')
        .transition()
        .duration(500)
        .call(d3.axisLeft(y1));

      svg
        .select('.y-axis-attr2')
        .transition()
        .duration(500)
        .call(d3.axisRight(y2));

      const line1 = d3
        .line()
        .x(d => x(d.year))
        .y(d => y1(d.attr1))
        .curve(d3.curveMonotoneX);

      const line2 = d3
        .line()
        .x(d => x(d.year))
        .y(d => y2(d.attr2))
        .curve(d3.curveMonotoneX);
      
      svg
        .select('.line1')
        .datum(data)
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .attr('d', line1)
        .attr('stroke', 'steelblue')
        .attr('fill', 'none');
      
      svg
        .select('.line2')
        .datum(data)
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .attr('d', line2)
        .attr('stroke', 'orange')
        .attr('fill', 'none');
      
      svg
        .select('.x-axis')
        .transition()
        .duration(500)
        .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format('d')));
    
      svg
        .select('.chart-title')
        .text(
          selectedCountry
            ? `Trends for ${selectedCountry.name}`
            : 'Global Trends'
        );
      
            const circles1 = svg.selectAll('.dot1').data(data);

      circles1
        .enter()
        .append('circle')
        .attr('class', 'dot1')
        .merge(circles1)
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => y1(d.attr1))
        .attr('r', 3)
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d) => {
          console.log('Tooltip data:', d);
          if (d.attr1 !== null && d.attr1 !== undefined) {
            tooltipRef.current
              .style('opacity', 1)
              .html(
                `<span style="color: steelblue;">Renewable Energy Produced:</span> ${
                  d.attr1.toFixed(2)
                }<br/>Year: ${d.year}`
              )
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY - 28}px`);
          }
        })
        .on('mouseout', () => {
          tooltipRef.current.style('opacity', 0);
        });
        

      circles1
        .transition()
        .duration(1000)
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => y1(d.attr1));

      circles1.exit().remove();

      const circles2 = svg.selectAll('.dot2').data(data);

      circles2
        .enter()
        .append('circle')
        .attr('class', 'dot2')
        .merge(circles2)
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => y2(d.attr2))
        .attr('r', 3)
        .attr('fill', 'orange')
        .on('mouseover', (event, d) => {
          console.log('Tooltip data:', d);
          if (d.attr2 !== null && d.attr2 !== undefined) {
            tooltipRef.current
              .style('opacity', 1)
              .html(
                `<span style="color: orange;">Energy Imported:</span> ${
                  d.attr2.toFixed(2)
                }<br/>Year: ${d.year}`
              )
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY - 28}px`);
          }
        })
        .on('mouseout', () => {
          tooltipRef.current.style('opacity', 0);
        });
        

      circles2
        .transition()
        .duration(1000)
        .attr('cx', (d) => x(d.year))
        .attr('cy', (d) => y2(d.attr2));

      circles2.exit().remove();
    }
    
  }, [allData, selectedCountry, currentYear]);

  return (
    <div
      ref={ref}
      style={{
        width: '95%',
        height: '300px',
        backgroundColor: 'transparent',
        padding: '10px 0',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
    ></div>
  );
}

export default LineChart;
