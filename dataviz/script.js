// Load the CSV data
d3.csv("Data_Sheet.csv").then(function(data) {
    // Group data by NAICS code and calculate total firms
    const naicsData = d3.rollup(data, v => d3.sum(v, d => +d.Firms.replace(/,/g, '')), d => d.NAICS);

    // Convert the grouped data to an array of objects
    const naicsArray = Array.from(naicsData, ([key, value]) => ({ NAICS: key, TotalFirms: value }));

    // Sort the data by NAICS code
    naicsArray.sort((a, b) => a.NAICS.localeCompare(b.NAICS));

    // Select the table body
    const tableBody = d3.select("tbody");

    // Bind the data to table rows and cells
    const rows = tableBody.selectAll("tr")
        .data(naicsArray)
        .enter()
        .append("tr");

    // Append cells for NAICS code and Total Firms
    rows.append("td").text(d => d.NAICS);
    rows.append("td").text(d => d.TotalFirms.toLocaleString());

}).catch(function(error) {
    console.log("Error loading the CSV file:", error);
});
