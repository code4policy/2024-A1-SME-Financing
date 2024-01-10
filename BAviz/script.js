// Loading data
Promise.all([
    d3.csv("datasets/1_TOTAL_yearly.csv"),
    d3.csv("datasets/2_by_state.csv"),
    d3.csv("datasets/3_by_industry.csv")
]).then(function(data) {
    // Graph 1: Yearly Business Applications
    createLineChart(data[0], "#chart1", "Yearly Business Applications", "Year", "Number of Business Applications");

    // Graph 2: Business Applications by State
    createGroupBarChart(data[1], "#chart2", "Business Applications by State", "State", "Number of Business Applications");

    // Graph 3: Business Applications by Industry
    createGroupBarChart(data[2], "#chart3", "Business Applications by Industry", "Industry", "Number of Business Applications");
});

// Function to create a line chart
function createLineChart(data, container, title, xAxisLabel, yAxisLabel) {
    // Setting the size and margins of the SVG area
    const margin = { top: 30, right: 30, bottom: 30, left: 80 },
        width = 700 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Creating x and y axes
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setting the scales for x and y axes
    const x = d3.scaleLinear().domain([d3.min(data, d => +d.year), d3.max(data, d => +d.year)]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => +d.TOTAL)]).range([height, 0]);

    // Adding x and y axes to the SVG
    const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(y);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(xAxisLabel);

    svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisLabel);

    // Drawing the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(+d.year))
            .y(d => y(+d.TOTAL))
        );

    // Adding the Title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text(title);
}

// Function to create a group bar chart
function createGroupBarChart(data, container, title, xAxisLabel, yAxisLabel) {
    const years = ["2018", "2019", "2020", "2021", "2022"];

    // Setting the size and margins of the SVG area
    const margin = { top: 30, right: 30, bottom: 70, left: 90 },
        width = 800 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Adding options for the dropdown menu
    d3.select(container)
        .select("select")
        .selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .text(d => d);

    // Setting the initial year
    const initialYear = years[0];

    // Creating the SVG element
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Displaying initial data
    updateBarChart(data, svg, initialYear, xAxisLabel, yAxisLabel, title, width, height, margin);

    // Handling changes in the dropdown
    d3.select(container)
        .select("select")
        .on("change", function() {
            const selectedYear = d3.select(this).property("value");
            updateBarChart(data, svg, selectedYear, xAxisLabel, yAxisLabel, title, width, height, margin);
        });
}

// Function to update the group bar chart
function updateBarChart(data, svg, selectedYear, xAxisLabel, yAxisLabel, title, width, height, margin) {
    // Extracting data for the selected year
    const selectedData = data.filter(d => d.year === selectedYear)[0];

    // Setting scales for x and y axes
    const x = d3.scaleBand().domain(Object.keys(selectedData).filter(key => key !== 'year')).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, 600000]).range([height, 0]);

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
        .style("text-anchor", "middle")
        .text(xAxisLabel);

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
        .data(Object.entries(selectedData).filter(([key]) => key !== 'year'))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[1]))
        .attr("height", d => height - y(d[1]));

    // Adding the graph title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
}
