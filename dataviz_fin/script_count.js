(function () {
 
  // Set the dimensions and margins of the chart
const margin = {top: 70, right: 60, bottom: 90, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#count")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(100,20)`);


// Add x-axis label
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10) // Adjust the vertical position
    .style("text-anchor", "middle")
    .text("Year (since 2018)");

// Add y-axis label
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20) // Adjust the vertical position
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("No. of approved loans");


// Read the data from the CSV file
d3.csv("SBA_Count_Approved_Loans.csv").then(function(data) {
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
        .domain([0, d3.max(data, d => +d['Count'])])
        .nice()
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Color palette for each year
    const color = d3.scaleOrdinal()
    .domain(years)
    .range(years.map(year => (year >= 2020) ? "steelblue" : "lightsteelblue"));

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
        return { year: year, value: d.values.find(v => v.year === year)?.['Count'] || 0 };
    }))
    .enter().append("rect")
    .attr("x", d => x1(d.year))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("class", d => (d.year >= 2020) ? "bar covid" : "bar") // Add class for styling
    .on("mouseover", function() {
        d3.select(this).attr("fill", "orange"); // Change color on hover
    })
    .on("mouseout", function(d) {
        const year = d.year >= 2020 ? "covid" : ""; // Determine the class to apply
        d3.select(this).attr("fill", `url(#${year}pattern)`); // Restore the pattern fill
    });

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