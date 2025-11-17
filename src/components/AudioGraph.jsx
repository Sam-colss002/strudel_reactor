import { useState, useEffect, useRef, useContext } from 'react';
import * as d3 from 'd3';
import { StrudelContext } from "../App";

function LogToNum(input) {
    if (!input) { return 0 };

    return 0;
}

let testArray = [ 0 ];

export default function AudioGraph() {
    const hasRun = useRef(false);
    /* allows us to read strudelData from context
     * - this is *not* d3data, this is the cleaned up strudelData specifically for graphing
     */
    let { strudelData, setStrudelData } = useContext(StrudelContext);
    
    const [ graphNumber, setGraphNumber ] = useState(0);
    // the graph array contains every currently displayed point on the graph
    const [ graphArray, setGraphArray] = useState([]);
    const maxItems = 100;
    const timeOut = 25;
    const maxValue = 20;

    function handleD3Data(e) {
        console.log("handleD3Data in AudioGraph");
        /* With the data, we want to split it, and call LogToNum for each line to get each point.
         * Then, add each point to graphArray. Each "e" has the entire d3 data list.
         * Maybe do something about speed? multiply interval by it to match?
         */
        

        let temp = e.detail;

        testArray.push( Math.floor( Math.random() * 4 ) );
        if (testArray.length > maxItems) { testArray.shift() }
        //console.log("testArray : " + testArray);

        setGraphArray(testArray);
        //setGraphArray( testArray );
    }

    useEffect(() => {
        if (!hasRun.current) {
            console.log("first load");
            document.addEventListener("d3Data", handleD3Data);
            hasRun.current = true;
        }
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setGraphNumber(testArray[0]); // sets next value
        }, timeOut);
        return () => clearInterval(interval);
    }, []);

    // adds graphNumber to graphArray, which results in graphNumber being added to displayed points
    useEffect(() => {
        let tempArray = [...graphArray, graphNumber];
        //if (tempArray.length > maxItems) { tempArray.shift() }
        setGraphArray(tempArray);
        console.log("graphArray : " + tempArray);
    }, [graphNumber]);


    useEffect(() => {
        const svg = d3.select('svg');
        svg.selectAll("*").remove();

        const w = svg.node().getBoundingClientRect().width - 40;
        const h = svg.node().getBoundingClientRect().height - 25;
        const barWidth = w / (graphArray.length || 1);

        const yScale = d3.scaleLinear()
            .domain([0, maxValue+2])
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