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
    // Filter data based on the selected state
    const stateData = data.filter(d => d.State_Name === selectedState);

    // Group data by NAICS code and calculate total firms
    const naicsData = d3.rollup(stateData, v => d3.sum(v, d => +d.Firms.replace(/,/g, '')), d => d["NAICS_Description"]);

    // Convert the grouped data to an array of objects
    const naicsArray = Array.from(naicsData, ([key, value]) => ({ NAICS_Description: key, TotalFirms: value }));

    // Sort the data by NAICS Description
    naicsArray.sort((a, b) => a.NAICS_Description.localeCompare(b.NAICS_Description));

    // Update the table
    const tableBody = d3.select("tbody");
    const rows = tableBody.selectAll("tr").data(naicsArray);

    // Update existing rows
    rows.select("td:nth-child(2)").text(d => d.TotalFirms.toLocaleString());

    // Append new rows
    const newRows = rows.enter().append("tr");
    newRows.append("td").text(d => d.NAICS_Description);
    newRows.append("td").text(d => d.TotalFirms.toLocaleString());

    // Remove old rows
    rows.exit().remove();

    // Update the bar chart
    updateBarChart(naicsArray);
}

function updateBarChart(data) {
    // Rest of the bar chart code remains the same
    // ...
}
