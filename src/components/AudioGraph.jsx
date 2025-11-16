import { useState, useEffect } from 'react';
import * as d3 from 'd3';

function LogToNum(input) {
    if (!input) { return 0 };

    return 0;
}

export default function AudioGraph() {

    const [graphArray, setGraphArray] = useState([]);
    const maxItems = 100;


    return (
        <>
            <h4>graph</h4>
            <svg
                width="100%"
                height="100%"
                style={{ display: "block" }}
            />
        </>
    );
}