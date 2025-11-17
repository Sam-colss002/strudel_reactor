import { useState, useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import { StrudelContext } from "../App";

let maxValue = 0.1;

export default function AudioGraph() {
    const hasRun = useRef(false);
    /* allows us to read strudelData from context
     * - this is *not* d3data, this is the cleaned up strudelData specifically for graphing
     */
    let { strudelData, setStrudelData } = useContext(StrudelContext);
    
    //const [ graphNumber, setGraphNumber ] = useState(0);
    // the graph array contains every currently displayed point on the graph
    const [ graphArray, setGraphArray] = useState([]);
    const maxItems = 100;
    //const maxValue = 3; // yAxis limit
    //let maxValueRecorded = 0.1;

    const clearD3Data = () => {
        setGraphArray([]);
        maxValue = 0.1;
    }

    useEffect(() => {
        const handleD3Data = (e) => {
            const value = Number(e.detail.combined);
            setGraphArray(prevArray => {
                const newArray = [...prevArray, value];
                if (newArray.length > maxItems) {
                    newArray.shift();
                }
                return newArray;
            });
            maxValue = ((maxValue < value) ? (value*3) : maxValue);
        };

        // preventing memory leaks by removing after
        document.addEventListener("d3DataHap", handleD3Data);
        document.addEventListener("clearD3Data", clearD3Data)
        return () => {
            document.removeEventListener("d3DataHap", handleD3Data);
            document.removeEventListener("clearD3Data", clearD3Data);
        }
    }, []);

    useEffect(() => {
        const svg = d3.select('svg');
        svg.selectAll("*").remove();

        const w = svg.node().getBoundingClientRect().width;
        const h = svg.node().getBoundingClientRect().height - 15;
        const barWidth = w / (graphArray.length || 1);

        const yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([h, 0]);

        const xScale = d3.scaleLinear()
            .domain([0, 0])
            .range([0, w]);

        const chartGroup = svg.append('g')
            .attr('transform', 'translate(40,10)');
        
        chartGroup.append('path')
        .datum(graphArray)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x((d, i) => i * barWidth)
            .y(d => yScale(d))
        );
    
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale)
        .tickSize(0).tickValues([]) // hide bottom ticks
        chartGroup.append('g')
        .call(yAxis);

        chartGroup.append('g')
        .attr("transform", `translate(0,${h})`)
        .call(xAxis);

    }, [graphArray]);

    // useEffect(() => {
    //     const svg = d3.select('svg');
    //     svg.selectAll("*").remove();

    //     let w = svg.node().getBoundingClientRect().width;
    //     let h = svg.node().getBoundingClientRect().height;

    //     w = w - 40;
    //     h = h - 25;
    //     const barMargin = 10;
    //     const barWidth = w / graphArray.length;

    //     let yScale = d3.scaleLinear()
    //     .domain([0, maxValue])
    //     .range([h, 0])

    //     const chartGroup = svg.append('g')
    //     .classed('chartGroup', true)
    //     .attr('transform', 'translate(30,3)');

    //     let barGroups = chartGroup
    //     .selectAll('g')
    //     .data(graphArray);

    //     let newBarGroups = barGroups.enter()
    //     .append('g')
    //     .attr('transform', (d, i) => {
    //         return 'translate(${i * barWidth}, ${yScale(d)})'
    //     });

    //     newBarGroups
    //     .append('rect')
    //     .attr('x', 0)
    //     .attr('height', d => { return h - yScale(d) })
    //     .attr('width', barWidth - barMargin)
    //     .attr('fill', 'black')

    //     let yAxis = d3.axisLeft(yScale);
    //     chartGroup.append('g')
    //     .classed('axis y', true)
    //     .call(yAxis);

    // }, [graphArray])

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