import { useState, useEffect } from 'react';
import * as d3 from 'd3';

function LogToNum(input) {
    if (!input) { return 0 };

    return 0;
}

export default function AudioGraph() {
    const [ graphNumber, setGraphNumber ] = useState(0);
    const [ graphArray, setGraphArray] = useState([]);
    const maxItems = 100;
    const maxValue = 16;

    useEffect(() => {
        let tempArray = [...graphArray, graphNumber];
        if (tempArray.length > maxItems) { tempArray.shift() }
        setGraphArray(tempArray);
    }, [graphNumber]);

    useEffect(() => {
        const svg = d3.select('svg');
        svg.selectAll("*").remove();

        let w = svg.node().getBoundingClientRect().width;
        let h = svg.node().getBoundingClientRect().height;

        w = w - 40;
        h = h - 25;
        const barMargin = 10;
        const barWidth = w / graphArray.length;

        let yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([h, 0])

        const chartGroup = svg.append('g')
        .classed('chartGroup', true)
        .attr('transform', 'translate(30,3)');

        let barGroups = chartGroup
        .selectAll('g')
        .data(graphArray);

        let newBarGroups = barGroups.enter()
        .append('g')
        .attr('transform', (d, i) => {
            return 'translate(${i * barWidth}, ${yScale(d)})'
        });

        newBarGroups
        .append('rect')
        .attr('x', 0)
        .attr('height', d => { return h - yScale(d) })
        .attr('width', barWidth - barMargin)
        .attr('fill', 'black')

        let yAxis = d3.axisLeft(yScale);
        chartGroup.append('g')
        .classed('axis y', true)
        .call(yAxis);

    }, [graphArray])


    return (
        <>
            
            <svg
                width="100%"
                height="100%"
                style={{ display: "block" }}
            />
        </>
    );
}