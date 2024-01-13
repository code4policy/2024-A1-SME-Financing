// Load data and create charts
Promise.all([
    d3.csv("datasets/2_by_state.csv"),
    d3.csv("datasets/3_by_industry.csv")
]).then(function(data) {
    // Deleted Graph 1
    // Graph 2: Business Applications by State
    createGroupBarChart(data[0], "#chart2", "Yearly Business Applications by State", "State", "Number of Business Applications");

    // Graph 3: Business Applications by Industry
    createGroupBarChartForNAICS(data[1], "#chart3", "Yearly Business Applications by Industry", "Industry", "Number of Business Applications");
});

// Deleted Graph 1: Function to create a line chart
// Function to create a temporal bar chart
function createGroupBarChart(data, container, title, yAxisLabel) {
    const states = ["United States", "North East", "Mid West", "South", "West", "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

    // Setting the size and margins of the SVG area
    const margin = { top: 30, right: 30, bottom: 80, left: 90 },
        width = 800 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Adding options for the dropdown menu
    d3.select(container)
        .select("label")
        .text("Select State:");
    
    d3.select(container)
        .select("select")
        .selectAll("option")
        .data(states)
        .enter()
        .append("option")
        .text(d => d);

    // Setting the initial state
    const initialState = states[0];

    // Creating the SVG element
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Displaying initial data
    updateBarChart(data, svg, initialState, yAxisLabel, title, width, height, margin);

    // Handling changes in the dropdown
    d3.select(container)
        .select("select")
        .on("change", function() {
            const selectedState = d3.select(this).property("value");
            updateBarChart(data, svg, selectedState, yAxisLabel, title, width, height, margin);
        });
}

// Function to update the temporal bar chart
function updateBarChart(data, svg, selectedState, yAxisLabel, title, width, height, margin) {
    // Extracting data for the selected state
    const selectedData = data.map(d => ({ year: d.year, value: +d[selectedState] }));

    // Setting scales for x and y axes
    const x = d3.scaleBand().domain(selectedData.map(d => d.year)).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(selectedData, d => d.value)]).range([height, 0]);

    // Creating x and y axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Adding x and y axes to SVG
    svg.selectAll("*").remove(); // Clear previous content
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .style("text-anchor", "end");
    svg.append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle");

    svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisLabel);

    // Drawing the bars
    svg.selectAll(".bar")
        .data(selectedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .classed("covid", d => d.year >= 2020); // Add "covid" class for bars from 2020 onwards

    // Adding the graph title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
}

// Function to create a temporal bar chart for NAICS codes
function createGroupBarChartForNAICS(data, container, title, yAxisLabel) {
    const naicsCodes = ["All Industries", "Agriculture, Forestry, Fishing and Hunting", "Mining, Quarrying, and Oil and Gas Extraction", "Utilities", "Construction", "Manufacturing", "Wholesale Trade", "Retail Trade", "Transportation and Warehousing", "Information", "Finance and Insurance", "Real Estate and Rental and Leasing", "Professional, Scientific, and Technical Services", "Management of Companies and Enterprises", "Administrative and Support and Waste Management and Remediation Services", "Educational Services", "Health Care and Social Assistance", "Arts, Entertainment, and Recreation", "Accommodation and Food Services", "Other Services (except Public Administration)"];

    // Setting the size and margins of the SVG area
    const margin = { top: 30, right: 30, bottom: 80, left: 90 },
        width = 800 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Adding options for the dropdown menu
    d3.select(container)
        .select("label")
        .text("Select Industry:");
    
    d3.select(container)
        .select("select")
        .selectAll("option")
        .data(naicsCodes)
        .enter()
        .append("option")
        .text(d => d);

    // Setting the initial NAICS code
    const initialNAICSCode = naicsCodes[0];

    // Creating the SVG element
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Displaying initial data
    updateBarChartForNAICS(data, svg, initialNAICSCode, yAxisLabel, title, width, height, margin);

    // Handling changes in the dropdown
    d3.select(container)
        .select("select")
        .on("change", function() {
            const selectedNAICSCode = d3.select(this).property("value");
            updateBarChartForNAICS(data, svg, selectedNAICSCode, yAxisLabel, title, width, height, margin);
        });
}

// Function to update the temporal bar chart for NAICS codes
function updateBarChartForNAICS(data, svg, selectedNAICSCode, yAxisLabel, title, width, height, margin) {
    // Extracting data for the selected NAICS code
    const selectedData = data.map(d => ({ year: d.year, value: +d[selectedNAICSCode] }));

    // Setting scales for x and y axes
    const x = d3.scaleBand().domain(selectedData.map(d => d.year)).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(selectedData, d => d.value)]).range([height, 0]);

    // Creating x and y axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Adding x and y axes to SVG
    svg.selectAll("*").remove(); // Clear previous content
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .style("text-anchor", "end");
    svg.append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle");

    svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisLabel);

    // Drawing the bars
    svg.selectAll(".bar")
        .data(selectedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .classed("covid", d => d.year >= 2020); // Add "covid" class for bars from 2020 onwards

    // Adding the graph title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
}