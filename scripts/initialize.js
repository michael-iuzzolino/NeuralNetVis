var main_container, controller_container, view_container;
var SVG_CONTAINER_HEIGHT = 800;
var SVG_CONTAINER_WIDTH = 800;

var SVG_BACKGROUND_HEIGHT = 800;
var SVG_BACKGROUND_WIDTH = 800;

var SVG_background_color = "#f2f2f2"

var network_vis_height = 600;
var network_vis_width = 600;

var circle_r = 20;


function initializeController() {
  
  // Create controller div container in main_container
  var main_controller_container = main_container.append("div").attr("id", "main_controller_container");
  
  // Create div container for controller header / description
  var controller_info_container = main_controller_container.append("div").attr("id", "controller_info_container");
  
  // Create header
  controller_info_container.append("h1").html("Neural Network Visualizer");
  
  // Create paragraph
  controller_info_container.append("p").html("Description Here");
  
  
  
  // Create controllers
  controller_container = main_controller_container.append("div").attr("id", "controller_container");
  
  // Create Pulldown menu to select MODEL type: NEAT or ANN for now
  controller_container.append("select").attr("id", "model_select_menu")
                        .selectAll("option")
                        .data(models).enter()
                      .append("option")
                        .text(function (d, i) { return d; })
  
  // Add on change functionality to menu - set selected model upon change
  d3.select("#model_select_menu")
      .on("change", function(d, i) {
        selected_model = d3.select(this).property("value");
        updateModelDataChoices();
      });

                        
  
  // Create data selector pending model selection
  controller_container.append("select").attr("id", "model_data_select_menu");
  
  
  // Populate the inital data list with the default-selected model
  updateModelDataChoices();
  
  
  
  // Create button to load model data
  controller_container.append("input")
                        .attr("type", "button")
                        .attr("value", "Load Data")
                        .on("click", loadData);
  
  
  // Create button to visualize model data
  controller_container.append("input")
                        .attr("type", "button")
                        .attr("value", "Visualize!")
                        .on("click", visualizeData);
  

  if (selected_model == "ANN") {
    createTestButton();
  }
  
  // Create button to turn on/off bias 
  
  
  
  // Create button to reset
  controller_container.append("input").style("margin-left", function() { return SVG_BACKGROUND_WIDTH*0.4+"px";})
                        .attr("type", "button")
                        .attr("value", "Reset")
                        .on("click", resetVisualization);
  
}


function createTestButton() {
  // Create button to test network
  controller_container.append("input")
                        .attr("id", "test_data_button")
                        .attr("type", "button")
                        .attr("value", "Test")
                        .on("click", ANNFF);
}



function createHideDisabledLinksButton() {
  // Create button to test network
  controller_container.append("input")
                        .attr("id", "hide_disabled_links_button")
                        .attr("type", "button")
                        .attr("value", "Hide Disabled Links")
                        .on("click", function() {
                          linkVis(show_hidden_links);
                          nodeVis();
                          var word = (show_hidden_links) ? "Hide" : "Show";
                          d3.select(this).property('value', word+" Disabled Links");
                          show_hidden_links = !show_hidden_links;
                        });
}




function initializeView() {
  
  // Create view div container in main_container
  view_container = main_container.append("div").attr("id", "view_container");
  
  // Create view SVG container
  view_svg_container = view_container.append("svg")
                                      .attr("id", "view_svg_container")
                                      .attr("height", SVG_CONTAINER_HEIGHT)
                                      .attr("width", SVG_CONTAINER_WIDTH);
  
  // Create background SVG
  var background = view_svg_container.append("rect")
                                      .attr("height", SVG_BACKGROUND_HEIGHT)
                                      .attr("width", SVG_BACKGROUND_WIDTH)
                                      .style("fill", SVG_background_color)
                                      .style("stroke", "black");
  
  
  
                                    
}

function initializeContainers() {
  
  main_container = d3.select("body").append("div").attr("id", 'main_container');
  
  initializeController();
  initializeView();
}




function initialize() {
  
  initializeContainers();
}