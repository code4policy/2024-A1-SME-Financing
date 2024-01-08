// Define the dimensions of the SVG canvas and the radius of the pie chart
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;

// Create an SVG element and append it to the chart-container div
const svg = d3.select("#pie-chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Load your CSV data
d3.csv("Data_Sheet.csv", function(data) {
    // Group the data by "NAICS Description" and calculate the sum of "Firms" for each group
   // console.log(data);
    const dataGrouped = d3.group(data, d => d.NAICS_Description);
    //dataGrouped.forEach((value, key, map) => {
    //    value.forEach(d => {
    //        d.Firms = parseInt(d.Firms); // Convert "Firms" to a number
    //    });
    });

    // Create a color scale for the pie chart
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a pie generator
    const pie = d3.pie()
        .value(d => d3.sum(d.value, e => e.Firms)); // Use d.value to access the values within each group

    // Generate the pie chart data
    const pieData = pie(Array.from(dataGrouped)); // Convert the grouped data to an array

    // Create arcs for the pie chart segments
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Create a path for each pie chart segment
    const paths = svg.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colorScale(i))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    // Add tooltips
    paths.append("title")
        .text(d => `${d.data.key}: ${d.value} firms`);
//});
