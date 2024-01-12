  // Set the dimensions and margins of the chart
(function () {

const margin = {top: 60, right: 60, bottom: 70, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#values")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

svg.append("text")
    .attr("x", width / 2)             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "20px") 
    .style("text-decoration", "underline")  
    .text("Approved Loan Values");


// Read the data from the CSV file
d3.csv("SBA_Approved_Loan_Values.csv").then(function(data) {
    // Extract unique metrics and years
    const metrics = [...new Set(data.map(d => d.Metric))];

    const years = [...new Set(data.map(d => d.year))];

    // Create a group for each metric
    const x0 = d3.scaleBand()
        .domain(metrics)
        .rangeRound([0, width])
        .paddingInner(0.1);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));


    // Scale for each year within the metric
    const x1 = d3.scaleBand()
        .domain(years)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d['Val'])])
        .nice()
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Color palette for each year
    const color = d3.scaleOrdinal()
        .domain(years)
        .range(d3.schemeSpectral[7])
        .unknown("#ccc");

    // Group the data by metric
    const groupedData = metrics.map(metric => {
        return {
            metric: metric,
            values: data.filter(d => d.Metric === metric)
        };
    });

    // Add groups for each metric and draw bars
    const metricGroups = svg.selectAll(".metric-group")
        .data(groupedData)
        .enter().append("g")
        .attr("class", "metric-group")
        .attr("transform", d => `translate(${x0(d.metric)}, 0)`);

    metricGroups.selectAll("rect")
        .data(d => years.map(year => {
            return { year: year, value: d.values.find(v => v.year === year)?.['Val'] || 0 };
        }))
        .enter().append("rect")
            .attr("x", d => x1(d.year))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.year));


    metricGroups.each(function(metricGroupData) {
    d3.select(this).selectAll(".year-label")
        .data(years)
        .enter().append("text")
            .attr("class", "year-label")
            .attr("x", d => x1(d) + x1.bandwidth() / 2)
            .attr("y", height + 25) // Adjust this value as needed
            .attr("text-anchor", "middle")
            .text(d => d);
});
})
})
();