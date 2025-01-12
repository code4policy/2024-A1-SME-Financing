// Load data and create charts
Promise.all([
    d3.csv("datasets/1_Statewise_7a_ApprovalPercentage_Value.csv"),
    d3.csv("datasets/2_Sectorwise_7a_ApprovalPercentage_Value.csv")
]).then(function(data) {

    // Graph 1: Loan Approval by State
    createBarChartState1(data[0], "#chart1", "Yearly Loan Approval by State", "Loan Approval Rate");

    // Graph 2: Loan Approval by Industry
    createBarChartIndustry1(data[1], "#chart2", "Yearly Loan Approval by Industry", "Loan Approval Rate");
});

// Define the yAxisUpperLimit
const yAxisUpperLimit1 = 100;

// Function to create a bar chart for states
function createBarChartState1(data, container, title, yAxisLabel) {
    const states1 = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];

    // Setting the size and margins of the SVG area
    const margin = { top: 30, right: 30, bottom: 40, left: 90 },
        width = 900 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Adding options for the dropdown menu
    d3.select(container)
        .select("label")
        .text("Select State:");

    d3.select(container)
        .select("select")
        .selectAll("option")
        .data(states1)
        .enter()
        .append("option")
        .text(d => d);

    // Setting the initial state
    const initialState1 = states1[0];

    // Creating the SVG element
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Displaying initial data
    updateBarChartState1(data, svg, initialState1, yAxisLabel, title, width, height, margin);

    // Handling changes in the dropdown
    d3.select(container)
        .select("select")
        .on("change", function() {
            const selectedState1 = d3.select(this).property("value");
            updateBarChartState1(data, svg, selectedState, yAxisLabel, title, width, height, margin);
        });
}

// Function to update the bar chart for states
function updateBarChartState1(data, svg, selectedState1, yAxisLabel, title, width, height, margin) {
    // Extracting data for the selected state
    const selectedData1 = data.map(d => ({ year: d.year, value: +d[selectedState1] }));

    // Setting scales for x and y axes
    const x = d3.scaleBand().domain(selectedData1.map(d => d.year)).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, yAxisUpperLimit1]).range([height, 0]);

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
        .data(selectedData1)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .on("mouseover", function(d) {
            // Display the actual value as a tooltip on hover
            const tooltip = d3.select(this)
                .append("text")
                .attr("class", "tooltip")
                .attr("x", x(d.year) + x.bandwidth() / 2)
                .attr("y", y(d.value) - 5)
                .attr("text-anchor", "middle")
                .text(d.value);

            // Store the tooltip reference on the bar element
            d3.select(this).node().__tooltip = tooltip;
        })
        .on("mouseout", function() {
            // Remove the stored tooltip on mouseout
            const storedTooltip = d3.select(this).node().__tooltip;
            if (storedTooltip) {
                storedTooltip.remove();
            }
        });

    // Adding text labels on top of the bars
    svg.selectAll(".bar-label")
        .data(selectedData1)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.year) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.value + "%");

    // Adding the 100% gray bar
    svg.selectAll(".gray-bar")
        .data(selectedData1)
        .enter().append("rect")
        .attr("class", "gray-bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", y(yAxisUpperLimit1))
        .attr("height", height - y(yAxisUpperLimit1))
        .attr("fill", "gray")
        .attr("opacity", 0.3);

    // Adding a solid black line for the y-axis upper limit (showing the 100% line)
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", y(yAxisUpperLimit1))
        .attr("x2", width)
        .attr("y2", y(yAxisUpperLimit1))
        .attr("stroke", "rgb(0, 0, 0)");

    // Adding the graph title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
}

// Function to create a bar chart for industries
function createBarChartIndustry1(data, container, title, yAxisLabel) {
    const naicsCodes1 = ["Accommodation and Food Services", "Administrative and Support and Waste Management and Remediation Services", "Agriculture, Forestry, Fishing and Hunting", "Arts, Entertainment, and Recreation", "Construction", "Educational Services", "Finance and Insurance", "Health Care and Social Assistance", "Information", "Management of Companies and Enterprises", "Manufacturing", "Mining, Quarrying, and Oil and Gas Extraction", "Other Services (except Public Administration)", "Professional, Scientific, and Technical Services", "Public Administration", "Real Estate and Rental and Leasing", "Retail Trade", "Transportation and Warehousing", "Utilities", "Wholesale Trade"];

    // Setting the size and margins of the SVG area
    const margin = { top: 30, right: 30, bottom: 40, left: 90 },
        width = 900 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Adding options for the dropdown menu
    d3.select(container)
        .select("label")
        .text("Select Industry:");

    d3.select(container)
        .select("select")
        .selectAll("option")
        .data(naicsCodes1)
        .enter()
        .append("option")
        .text(d => d);

    // Setting the initial NAICS code
    const initialNAICSCode1 = naicsCodes1[0];

    // Creating the SVG element
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Displaying initial data
    updateBarChartIndustry1(data, svg, initialNAICSCode1, yAxisLabel, title, width, height, margin);

    // Handling changes in the dropdown
    d3.select(container)
        .select("select")
        .on("change", function() {
            const selectedNAICSCode1 = d3.select(this).property("value");
            updateBarChartIndustry1(data, svg, selectedNAICSCode1, yAxisLabel, title, width, height, margin);
        });
}

// Function to update the bar chart for industries
function updateBarChartIndustry1(data, svg, selectedNAICSCode1, yAxisLabel, title, width, height, margin) {
    // Extracting data for the selected NAICS code
    const selectedData1 = data.map(d => ({ year: d.year, value: +d[selectedNAICSCode1] }));

    // Setting scales for x and y axes
    const x = d3.scaleBand().domain(selectedData1.map(d => d.year)).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, yAxisUpperLimit1]).range([height, 0]);

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
        .data(selectedData1)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .on("mouseover", function(d) {
            // Display the actual value as a tooltip on hover
            const tooltip = d3.select(this)
                .append("text")
                .attr("class", "tooltip")
                .attr("x", x(d.year) + x.bandwidth() / 2)
                .attr("y", y(d.value) - 5)
                .attr("text-anchor", "middle")
                .text(d.value);

            // Store the tooltip reference on the bar element
            d3.select(this).node().__tooltip = tooltip;
        })
        .on("mouseout", function() {
            // Remove the stored tooltip on mouseout
            const storedTooltip = d3.select(this).node().__tooltip;
            if (storedTooltip) {
                storedTooltip.remove();
            }
        });

    // Adding text labels on top of the bars
    svg.selectAll(".bar-label")
        .data(selectedData1)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.year) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.value + "%");
    
    // Adding the 100% gray bar
    svg.selectAll(".gray-bar")
        .data(selectedData1)
        .enter().append("rect")
        .attr("class", "gray-bar")
        .attr("x", d => x(d.year))
        .attr("width", x.bandwidth())
        .attr("y", y(yAxisUpperLimit1))
        .attr("height", height - y(yAxisUpperLimit1))
        .attr("fill", "gray")
        .attr("opacity", 0.3);

    // Adding a solid black line for the y-axis upper limit (showing the 100% line)
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", y(yAxisUpperLimit1))
        .attr("x2", width)
        .attr("y2", y(yAxisUpperLimit1))
        .attr("stroke", "rgb(0, 0, 0)");

    // Adding the graph title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
}