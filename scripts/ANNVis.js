
function ANNFF() {
  d3.selectAll(".text").remove();
  
  
  function verticalScale(max_height, m, d) {
    var scaleHeight = d3.scaleLinear()
                          .domain([0, max_height])
                          .range([m, network_vis_height-m]);
    
    return scaleHeight(d);
  }
  
  
  function feed_forward(W, i, X_data) {
    var Z;
    
    
    if (i == 0 && i == W.length-1) {
      if (W[i][0].length == 1) {
        return activate(dot(X_data, W[i]));
      }
      else {
        return softMax(dot(X_data, W[i]));  
      }
    }
    
    else if (i == 0) {
      return activate(dot(X_data, W[i]));
    }
    
    Z = feed_forward(W, i-1, X_data);
    if (i == W.length-1) {
      if (W[i][0].length == 1) {
        return activate(dot(Z, W[i]));
      }
      else {
        return softMax(dot(Z, W[i]));  
      }
    }
    else {
      return activate(dot(Z, W[i]));
    }
  }
  
  // Obtain information from dataset
  var topology = selected_model_data.topology;
  var topology_keys = selected_model_data.topology_keys;
  var W = selected_model_data.W;
  
  
  // Create random input to test feed forward
  var input_size = topology["input"];
  var X_data = [];
  for (var i=0; i < input_size; i++) {
    X_data.push(Math.random()*2);
  }
  
  // Normalize input
  var X_std = normalizeInput(X_data)
  
  // Network Output!
  var Y = feed_forward(W, W.length-1, X_std);
  
  
  // Print input and output
  var vis_group = d3.select("#view_svg_container");
  
  // Input values
  vis_group.selectAll("text.input_vals").data(X_data).enter().append("text").attr("class", "input_vals").attr("class", "text")
    .attr("x", function(d, i) { 
      return 20;
    })
    .attr("y", function(d, i) { 
      return 200 + i*100;
    })
    .text(function(d, i) {
      return "Input_" + (i+1) + ": " + Math.round(d*100)/1000;;
    })
    .style("word-spacing", 6);
  
  // Output values
  vis_group.selectAll("text.output_vals").data(Y).enter().append("text").attr("class", "output_vals").attr("class", "text")
    .attr("x", function(d, i) { 
      return 600;
    })
    .attr("y", function(d, i) { 
      return 200 + i*100;
    })
    .text(function(d, i) {
      return "Output " + (i+1) + ": " + Math.round(d*100)/1000;;
    })
    .style("word-spacing", 6);
  
}



function findMaxWeight(m) {
  var current_weight, max_weight;
  max_weight = m[0][0];
  for (var i=0; i < m.length; i++) {
    for (var j=0; j < m[i].length; j++) {
      current_weight = m[i][j];
      if (current_weight > max_weight) {
        max_weight = current_weight;
      }
    }
  }
  return max_weight;
}






function visANN() {
  var vis_group = d3.select("#visualization_group");  
  
  function verticalScale(max_height, m, d) {
    var scaleHeight = d3.scaleLinear()
                          .domain([0, max_height])
                          .range([m, network_vis_height-m]);
    
    return scaleHeight(d);
  }
  
  
  function horizontalScale(max_width, m, d) {
    var scaleWidth = d3.scaleLinear()
                          .domain([0, max_width])
                          .range([m, network_vis_width-m]);
    
    return scaleWidth(d);
  }
  
 
  function linkScale(max_w, w) {
    
    var linkWeightScale = d3.scaleLinear()
                            .domain([0, max_w])
                            .range([1, 5]);
    
    return linkWeightScale(w);
  }
  
  
  // Obtain information from dataset
  var topology = selected_model_data.topology;
  var topology_keys = selected_model_data.topology_keys;
  var W = selected_model_data.W;
  
  
  
  // Find max neurons in lay and max layer size to setup margins
  var max_length = topology_keys.length;
  var max_height = 0;
  for (var i=0; i < max_length; i++) {
    var key = topology_keys[i];
    var layer_height = topology[key];
    if (layer_height > max_height) {
      max_height = layer_height; 
    }
  }

  
  
  
  
  // Setup NN locations
  NN_locs = {};
  for (var i=0; i < topology_keys.length; i++) {
    var key = topology_keys[i];
    NN_locs[key] = [];
    
    var current_layer_size = topology[key];
    var h_m = (network_vis_width - 2*circle_r*topology_keys.length)/(topology_keys.length+1);
    var x = horizontalScale(topology_keys.length, h_m, i);
    
    for (var j=0; j < current_layer_size; j++) {
      var v_m = (network_vis_height - 2*circle_r*current_layer_size)/(current_layer_size+1);
      var y = verticalScale(current_layer_size, v_m, j);
      
      NN_locs[key].push([x, y]);
    }
  }
  
  

  
  // Create Links
  for (var wi=0; wi < W.length; wi++) {
    var w_i = W[wi];
    
    var max_w = findMaxWeight(w_i);

    for (var i=0; i < w_i.length; i++) {
      for (var j=0; j < w_i[i].length; j++) {
        var this_key = topology_keys[wi];
        var next_key = topology_keys[wi+1];
       
        var next_x = NN_locs[next_key][j][0];
        var next_y = NN_locs[next_key][j][1];
        
        var this_x = NN_locs[this_key][i][0];
        var this_y = NN_locs[this_key][i][1];
        
        vis_group.append("line").data([w_i[i][j]])
                  .attr("x1", this_x)
                  .attr("x2", next_x)
                  .attr("y1", this_y)
                  .attr("y2", next_y)
                  .style("stroke", "black")
                  .style("stroke-width", function(d, i) {
                      
                    return linkScale(max_w, d);
                  })
                  .on("mouseover", function(d, i)
                  {
                    console.log("Weight: " + d);
                    d3.select(this).style("stroke", "blue");
                  })
                  .on("mouseout", function(d, i)
                  {
                    d3.select(this).style("stroke", "black");
                  });
      }
    }
  }
  
  
  // Add nodes
  for (var i=0; i < topology_keys.length; i++) {
    var key = topology_keys[i];
    
    var current_layer_size = topology[key];
    
    for (var j=0; j < current_layer_size; j++) {
      var newGroup = vis_group.append("g").data([j]).attr("id", key+"_neuron_group_"+j)
                                .on("mouseover", function(d) {})
                                .on("mouseout", function(d) {});
      
      
      newGroup.append("circle")
                .attr("id", key+"_neuron_"+i)
                .attr("cx", function() {
                  var h_m = (network_vis_width - 2*circle_r*topology_keys.length)/(topology_keys.length+1);
                  var in_x = horizontalScale(topology_keys.length, h_m, i);
                  return in_x;
                })
                .attr("cy", function() {
                  var v_m = (network_vis_height - 2*circle_r*current_layer_size)/(current_layer_size+1);
                  var in_y = verticalScale(current_layer_size, v_m, j);
                  return in_y;
                })
                .attr("r", circle_r)
                .attr("fill", "white")
                .attr("stroke", "black")
                .on("mouseover", function(d){})
                .on("mouseout", function(d) {});
    }
  }
}