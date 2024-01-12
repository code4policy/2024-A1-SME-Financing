// Load the CSV data
d3.csv("us_state_2digitnaics_2021.csv").then(function(data) {
    // Extract unique state names
    const stateNames = Array.from(new Set(data.map(d => d.State_Name)));

    // Populate the state selector dropdown
    const stateSelector = d3.select("#stateSelector");
    stateSelector.selectAll("option")
        .data(stateNames)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    // Initial state selection
    const initialState = stateNames[0];
    updateVisualization(data, initialState);

    // Add event listener for state selection change
    stateSelector.on("change", function() {
        const selectedState = this.value;
        updateVisualization(data, selectedState);
    });

}).catch(function(error) {
    console.log("Error loading the CSV file:", error);
});

function updateVisualization(data, selectedState) {
    // Filter data based on the selected state and "Enterprise_Size" value
    const stateData = data.filter(d => d.State_Name === selectedState && d.Enterprise_Size === "01: Total");

    // Handle NAICS code ranges
    stateData.forEach(d => {
        if (d.NAICS.includes('-')) {
            d.NAICS = getMidpointFromRange(d.NAICS);
        }
    });

    // Group data by NAICS code and calculate total firms
    const naicsData = d3.rollup(stateData, v => d3.sum(v, d => +d.Firms.replace(/,/g, '')), d => d["NAICS_Description"]);

    // Convert the grouped data to an array of objects
    let naicsArray = Array.from(naicsData, ([key, value]) => ({ NAICS_Description: key, TotalFirms: value }));

    // Sort the data by NAICS Description (most firms to least)
    naicsArray.sort((a, b) => b.TotalFirms - a.TotalFirms);

    // Update the table
    const tableBody = d3.select("tbody");

    // Select all existing rows
    const rows = tableBody.selectAll("tr").data(naicsArray, d => d.NAICS_Description);

    // Remove old rows
    rows.exit().remove();

    // Update existing rows
    rows.select("td:nth-child(2)").text(d => d.TotalFirms.toLocaleString());

    // Append new rows
    const newRows = rows.enter().append("tr");
    newRows.append("td").text(d => d.NAICS_Description);
    newRows.append("td").text(d => d.TotalFirms.toLocaleString());

    // Sort the table rows based on NAICS Description
    tableBody.selectAll("tr")
        .sort((a, b) => d3.descending(a.TotalFirms, b.TotalFirms));

    // Update the bar chart
    updateBarChart(naicsArray, selectedState);
}

// Declare the svg variable outside the function to keep track of the existing SVG
let svg;

function updateBarChart(data, selectedState) {
    // Remove existing chart if it exists
    if (svg) {
        svg.remove();
    }

    const margin = { top: 80, right: 30, bottom: 300, left: 110 };
    const width = 1200 - margin.left - margin.right; // Increase the width
    const height = 600 - margin.top - margin.bottom;

    // Clear the contents of #chart-container
    d3.select("#chart-container").html("");

    // Create a new SVG
    svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .domain(data.map(d => d.NAICS_Description))
        .range([0, width])
        .padding(0.2) // Adjust the padding for better separation
        .align(0.5); // Align the bars to the center of the band

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.TotalFirms)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.NAICS_Description) + 5)
        .attr("y", d => y(d.TotalFirms))
        .attr("width", x.bandwidth() - 10)
        .attr("height", d => height - y(d.TotalFirms))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px"); // Reduce the font size for x-axis labels

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add title
    svg.append("text")
        .attr("class", "chart-title") // Add class name here
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(`Small Business Distribution in ${selectedState}`);

    // Add y axis label
    svg.append("text")
        .attr("class", "y-axis-label") // Add class name here
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Firms");

    // Add link
    svg.append("text")
        .attr("class", "source-link") // Add class name here
        .attr("x", width)
        .attr("y", height + margin.top + 50) // Adjust the y-coordinate
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .style("fill", "blue")
        .text("Source: U.S. Census Bureau")
        .on("click", function () { window.open("https://www.census.gov/programs-surveys/cbp/data/tables.html", "_blank"); });
}

// Function to get the midpoint from a range (e.g., "31-33")
function getMidpointFromRange(range) {
    const [start, end] = range.split('-').map(Number);
    return Math.floor((start + end) / 2).toString();
}
