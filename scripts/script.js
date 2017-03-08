

// DATA
// ========================================================================
var models = ["NEAT", "ANN"];
var selected_model = "NEAT";
var model_data = {"NEAT" : ["NEAT 1", "NEAT 2", "NEAT 3"],
                  "ANN" : ["ANN 1", "ANN 2", "ANN 3", "ANN 4"]};

var selected_data_set_name; 

var data = {  "NEAT 1" :  generateNEATData(),
              "NEAT 2" :  generateNEATData(),
              "NEAT 3" :  generateNEATData(),
              "ANN 1"  :  generateANNData() ,
              "ANN 2"  :  generateANNData() ,
              "ANN 3"  :  generateANNData() ,
              "ANN 4"  :  generateANNData() ,   };

var selected_model_data;
// ========================================================================




function loadData() {
  selected_data_set_name = d3.select("#model_data_select_menu").property("value");
  selected_model_data = data[selected_data_set_name];
}







function setupVisContainer() {
  
  
  var left_margin = (SVG_CONTAINER_WIDTH - network_vis_width) / 2.0;
  var top_margin = (SVG_CONTAINER_HEIGHT - network_vis_height) / 2.0;
  
  var margin = {"left" : left_margin, "top" : top_margin}
  // Create group  SVG
  var vis_group = d3.select("#view_svg_container")
                      .append("g")
                        .attr("id", "visualization_group")
                        .attr("transform", "translate("+margin.left+","+margin.top+")");
  
  vis_group.append("rect")
              .attr("height", network_vis_height)
              .attr("width", network_vis_width)
              .style("fill", SVG_background_color);
  
  // Print Dataset Name
  d3.select("#view_svg_container").append("text").attr("class", "header_text")
                                  .attr("x", 300)
                                  .attr("y", 60)
                                  .text(function() { return "Dataset: " + selected_data_set_name;});
}



function resetButtons() {
  d3.select("#hide_disabled_links_button").remove();
  d3.select("#test_data_button").remove();
  
  if (selected_model == "NEAT") {
    createHideDisabledLinksButton();
  }
  else if (selected_model == "ANN") {
    createTestButton();
  }
  
}

function resetVisualization() {
  d3.select("#visualization_group").remove();
  d3.selectAll(".text").remove();
  d3.selectAll(".header_text").remove();
  resetButtons();
  NEATVisInitializeVariables();
  
}



function visualizeData() {
  
  resetVisualization();
  setupVisContainer();
  
  if (selected_model == "NEAT") {
    visNEAT();
  }
  else if (selected_model == "ANN") {
    visANN();
  }
  
}







function updateModelDataChoices() {
  
  d3.select("#test_data_button").remove();
  d3.select("#hide_disabled_links_button").remove();
  
  // Remove data from previously selected model
  d3.select("#model_data_select_menu")
      .selectAll("option").remove();
  
  // Add new model's data
  d3.select("#model_data_select_menu")
      .selectAll("option")
      .data(model_data[selected_model]).enter()
      .append("option")
        .text(function (d, i) { return d; });
  
  resetButtons();
}



