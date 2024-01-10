// Load the CSV data
d3.csv("us_state_2digitnaics_2021.csv").then(function(data) {
    // Group data by NAICS code and calculate total firms
       const naicsData = d3.rollup(data, v => d3.sum(v, d => +d.Firms.replace(/,/g, '')), d => d["NAICS_Description"]);
    // Convert the grouped data to an array of objects
    const naicsArray = Array.from(naicsData, ([key, value]) => ({ NAICS_Description: key, TotalFirms: value }));

    // Sort the data by NAICS Description
    naicsArray.sort((a, b) => a.NAICS_Description.localeCompare(b.NAICS_Description));

    // Select the table body
    const tableBody = d3.select("tbody");

    // Bind the data to table rows and cells
    const rows = tableBody.selectAll("tr")
        .data(naicsArray)
        .enter()
        .append("tr");

    // Append cells for NAICS code and Total Firms
    rows.append("td").text(d => d.NAICS_Description);
    rows.append("td").text(d => d.TotalFirms.toLocaleString());

    
    const margin = { top: 60, right: 60, bottom: 80, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#table-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .domain(naicsArray.map(d => d.NAICS_Description))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(naicsArray, d => d.TotalFirms)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll("rect")
        .data(naicsArray)
        .enter()
        .append("rect")
        .attr("x", d => x(d.NAICS_Description) + 5) // Add space between bars
        .attr("y", d => y(d.TotalFirms))
        .attr("width", x.bandwidth() - 5) // Reduce bar thickness
        .attr("height", d => height - y(d.TotalFirms))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(y));

}).catch(function(error) {
    console.log("Error loading the CSV file:", error);

});
