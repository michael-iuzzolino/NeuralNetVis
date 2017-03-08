// https://bl.ocks.org/mbostock/6123708
// http://stackoverflow.com/questions/38599930/d3-version-4-workaround-for-drag-origin

var gene_width = 30;
var gene_height = 30;
var geneColor_inactive = "#80ffcc";
var geneColor_active = "#80ff80";
var geneColor_hover = "#cc66ff";
var geneColor_hover_2 = "#b3fff0";
var geneColor_disabled = "#ff9999";

var genome, neurons, linkVisActivity;
var topology, topology_keys;


var show_hidden_links = true;


// ============================================
// ============   REMOVE Text  ================
// ============================================
function removeText(d, i) {
  d3.selectAll(".gene_"+i+"_extra_text").remove();
  d3.select("#innovation_"+d.innovation).remove();
}




// ============================================
// ==============   ADD Text   ================
// ============================================
function addText(self, d, i) {
  
  
  d3.select("#innovation_"+d.innovation).transition().duration(200)
                    .attr("x", i*gene_width+10)
                    .attr("y", 22.5)
                    .text(function () {
                      return "Innovation # " + d.innovation;
                    });
  
  // Input Neuron
  var input_text = self.append("text")
          .attr("class", "gene_"+i+"_extra_text")
          .style("opacity", 0)
          .style("font-size", 16)
          .attr("x", i*gene_width+10)
          .attr("y", 50)
          .text( function() { 
            return "In: " + d.input;
          });
  
  // Output Neuron
  var output_text = self.append("text")
          .attr("class", "gene_"+i+"_extra_text")
          .style("opacity", 0)
          .style("font-size", 16)
          .attr("x", i*gene_width+60)
          .attr("y", 50)
          .text( function() { 
            return "Out: " + d.output;
          });
  
  // Weight
  var weight_text = self.append("text")
          .attr("class", "gene_"+i+"_extra_text")
          .style("opacity", 0)
          .style("font-size", 16)
          .attr("x", i*gene_width+10)
          .attr("y", 80)
          .text( function() { 
            var weight = Math.round(d.weight*100)/100;
            return "Weight: " + weight;
          });
  
  // Enabled
  var enabled_text = self.append("text")
          .attr("class", "gene_"+i+"_extra_text")
          .style("opacity", 0)
          .style("font-size", 16)
          .style("fill", function() {
            var color = (d.disabled) ? "red" : "black";
            return color;
          })
          .attr("x", i*gene_width+10)
          .attr("y", 110)
          .text( function() { 
            return "Disabled: " + d.disabled;
          });
  
  
  input_text.transition().duration(1000).style("opacity", 1);
  output_text.transition().duration(1000).style("opacity", 1);
  weight_text.transition().duration(1000).style("opacity", 1);
  enabled_text.transition().duration(1000).style("opacity", 1);
}



// ============================================
// ==========    Highlight Links ==============
// ============================================
function highlightLinks(link_svg, link_data, highlight, hover=false) {
 
  var stroke_color = link_data.stroke_color;
  if (!stroke_color) {
    stroke_color = "black";
  }
  
  var color = (hover) ? geneColor_hover : ((highlight) ? geneColor_active : stroke_color);
  var size = (hover) ? link_data.stroke_width*1.5 : link_data.stroke_width;
  
  link_svg.style("stroke", color).style("stroke-width", size);  
  
  
}



function checkNeuronActivation(neuron_id) {
  var activated = false;
  for (var i=0; i < neurons.length; i++) {
    var neuron = neurons[i];
    if (neuron.id == neuron_id) {
      activated = (neuron.activated > 0) ? true : false;
    }
  }
  return activated;
}


// ============================================
// ==========    Expand the Gene ==============
// ============================================
function highlightNodes(current_gene, neuron_id, activate, hover=false) {
  var color, size;

  color = (hover) ? geneColor_hover : ((activate) ? geneColor_active : "white");
  size = (hover) ? circle_r*1.25 : circle_r;
  
  // Gene's input neuron
  d3.select("#neuron_"+neuron_id).select("circle")
              .transition()
              .duration(200)
              .style("fill", color)
              .attr("r", size);

    
}




// ============================================
// ==========  Collapse the Gene ==============
// ============================================
function collapseGene(self, d) {
  
  var current_gene = d.gene;
  var i = d.j;
  
  self.transition().duration(200).attr("transform", "translate(0, 0)");
  self.select("rect").transition().duration(200)
    .attr("height", gene_height)
    .attr("width", gene_width)
    .style("fill", function() {
      var gene_color = (d.gene.disabled) ? geneColor_disabled : geneColor_inactive;
      return gene_color;
    });

  
  removeText(current_gene, i);
  
  var input_neuron = current_gene.input;
  var output_neuron = current_gene.output;

  // Determine if neurons are activated or not
  input_neuron_activated = checkNeuronActivation(input_neuron);
  output_neuron_activated = checkNeuronActivation(output_neuron);

  highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=false);
  highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=false);
  
  // Add innovation number
  self.append("text")
      .attr("class", "genome_innovation_num_text")
      .attr("id", function() { return "innovation_"+current_gene.innovation; })
      .attr("x", function() {
        return gene_width*current_gene.innovation+5;
      })
      .attr("y", 15)
      .text(function(d) {
        return current_gene.innovation;
      }); 

  // Unhighlight link
  var original_color = (d.gene.disabled) ? "red" : "black";
  d3.select("#link_"+d.gene.innovation).transition().duration(200).style("stroke", original_color);
}


// ============================================
// ==========    Expand the Gene ==============
// ============================================
function expandGene(self, d) {
  
  var current_gene = d.gene;
  var i = d.j;
  
  self.transition().duration(200).attr("transform", "translate(0, -150)");
  self.select("rect").transition()
                      .duration(200)
                      .attr("height", gene_height*4)
                      .attr("width", gene_width*4)
                      .style("fill", geneColor_active);

  addText(self, current_gene, i);
  
  var input_neuron = current_gene.input;
  var output_neuron = current_gene.output;

  // Determine if neurons are activated or not
  input_neuron_activated = checkNeuronActivation(input_neuron);
  output_neuron_activated = checkNeuronActivation(output_neuron);
  console.log("INPUT " + input_neuron + " ACTIVATION: " + input_neuron_activated);
  console.log("OUTPUT " + output_neuron + " ACTIVATION: " + output_neuron_activated);
  highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=false);
  highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=false);

  
  
  
  // Highlight link
  d3.select("#link_"+d.gene.innovation).transition().duration(200).style("stroke", "blue");
  
}



// ============================================
// ==========    Popout the Gene ==============
// ============================================
function popoutGene(gene, expand, d) {
  var height, width, color;
  if (expand) {
    height = gene_height*1.5;
    width = gene_width*1.5;
    color = geneColor_hover;
  }
  else {
    height = gene_height;
    width = gene_width;
    console.log(d);
    color = (d.gene.disabled) ? geneColor_disabled : (d.selected) ? geneColor_active : geneColor_inactive;
  }
  
  gene.transition().duration(200)
                    .attr("height", height)
                    .attr("width", width)
                    .style("fill", color);
}






// ============================================
// ========== GENOME VISUALIZATION ============
// ============================================
function genomeVis() {
  d3.select("#genome_group").remove();
  
  var vis_group = d3.select("#visualization_group")
  
  var genome_group = vis_group.append("g")
                        .attr("id", "genome_group");
  
  // Setup drag behavior
  var dragBehavior = d3.drag()
    .on("drag", function(d) {
      var new_x = d3.event.sourceEvent.clientX-120;
      var new_y = d3.event.sourceEvent.clientY-30;
      genome_group.attr('transform', "translate("+new_x+", "+new_y+")");
    })
  
  
  // Add button to genome group for clicking and dragging
  genome_group.append("rect")
                .attr("x", 0)
                .attr("y", 30)
                .attr("height", 20)
                .attr("width", 20)
                .style("fill", "grey")
                .style("stroke", "black")
                .call(dragBehavior);

  
  // Add header to genome
  genome_group.append("text").attr("x", -70).attr("y", 20).text("Genome");
  
  // Transform group
  genome_group.attr("transform", "translate(0, 600)");
  
  // Add genes to genome
  for (var j=0; j < genome.length; j++) {
    var gene = genome[j];
    gene["expanded"] = false;
    var data = {"gene" : gene, "j" : j};
    
    var gene_group = genome_group.append("g")
                            .data([data])
                            .attr("id", "gene_"+j);
    
    gene_group.on("mouseover", function(d) {
                var self = d3.select(this);
                var current_gene = d.gene;
                var link = d3.select("#link_"+current_gene.innovation);
                var link_data = link.datum();
      
                var input_neuron = current_gene.input;
                var output_neuron = current_gene.output;
      
                if (!current_gene.expanded) {

                  // Determine if neurons are activated or not
                  input_neuron_activated = checkNeuronActivation(input_neuron);
                  output_neuron_activated = checkNeuronActivation(output_neuron);
                  
                  highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=true);
                  highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=true);

                  highlightLinks(link, link_data, highlight=false, hover=true);
                  popoutGene(self.select("rect"), true, d);
                }
                else {
                  highlightNodes(d.gene, input_neuron, activate=true, hover=true);
                  highlightNodes(d.gene, output_neuron, activate=true, hover=true);
                  highlightLinks(link, link_data, highlight=false, hover=true);
                  self.select("rect").transition()
                                      .style("fill", geneColor_hover_2);
                }
              })
              .on("mouseout", function(d) {
                var self = d3.select(this);
                var current_gene = d.gene;
                var link = d3.select("#link_"+current_gene.innovation);
                var link_data = link.datum();
                var input_neuron = current_gene.input;
                var output_neuron = current_gene.output;
      
                if (!current_gene.expanded) {
                  
                  // Determine if neurons are activated or not
                  input_neuron_activated = checkNeuronActivation(input_neuron);
                  output_neuron_activated = checkNeuronActivation(output_neuron);
                  
                  highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=false);
                  highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=false);
                  
                  highlightLinks(link, link_data, false, false);
                  popoutGene(self.select("rect"), false, d);
                }
                else {
                  highlightNodes(d.gene, input_neuron, activate=true, hover=false);
                  highlightNodes(d.gene, output_neuron, activate=true, hover=false);
                  highlightLinks(link, link_data, highlight=false, hover=false);
                  self.select("rect").transition().duration(200)
                                      .style("fill", geneColor_active);
                  console.log(d);
                }
                
              })
              .on("click", function(d) {
                var self = d3.select(this);
                var current_gene = d.gene;
                
                var link_key = "#link_" + current_gene.innovation;
                var link_data = d3.select(link_key).datum();
            
                if (current_gene.expanded) {
                  updateNodeHighlightCount(link_data, -1);
                  
                  collapseGene(self, d);
                }
                else {
                  updateNodeHighlightCount(link_data, 1);
                  expandGene(self, d);
                }
                
                linkVisActivity[link_key].selected = !linkVisActivity[link_key].selected;
                current_gene.expanded = !current_gene.expanded;
              });
    
    // Append boxes
    gene_group.append("rect")
      .attr("height", gene_height)
      .attr("width", gene_width)
      .attr("x", function(d) {
        return gene_width*j;
      })
      .style("fill", function(d) {
        var gene_color = (d.gene.disabled) ? geneColor_disabled : geneColor_inactive;
        return gene_color;
      })
      .style("stroke", "black");
    
    
    // Add innovation number
    gene_group.append("text")
        .attr("class", "genome_innovation_num_text")
        .attr("id", function(d) { return "innovation_"+d.gene.innovation; })
        .attr("x", function(d) {
          return gene_width*j+5;
        })
        .attr("y", 15)
        .text(function(d) {
          var current_gene = d.gene;
          return current_gene.innovation;
        }); 
  }
}



// ============================================
// ==========    Find Connections =============
// ============================================
function findConnections(d, innovation_nums) {
  var this_id = d.id;
  for (var k=0; k < genome.length; k++) {
    var gene = genome[k];
    var gene_innovation = gene.innovation;
    var gene_in = gene.input;
    var gene_out = gene.output;
    if (this_id == gene_in) {
      innovation_nums.push(gene_innovation);
    }
    if (this_id == gene_out) {
      innovation_nums.push(gene_innovation);
    }
  }
}


// ============================================
// ==========    Update Node Highlights ==============
// ============================================
function updateNodeHighlightCount(d, update_val) {
  
  for (var i=0; i < neurons.length; i++) {
    var current_neuron = neurons[i];
    if (current_neuron.id == d.input) {
      if (!neurons[i]["activated"]) {
        neurons[i]["activated"] = (update_val == 1) ? 1 : 0;  
      }
      else {
        neurons[i]["activated"] += update_val;
      }
    }
    
    if (current_neuron.id == d.output) {
      if (!neurons[i]["activated"]) {
        neurons[i]["activated"] = (update_val == 1) ? 1 : 0;  
      }
      else {
        neurons[i]["activated"] += update_val;
      }
    }
  }
}











// ======================================================================
// Setup SCALES
// ======================================================================
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
// ======================================================================
// ======================================================================
// ======================================================================







// =================================================================================
// ======================          NODES         ===================================
// =================================================================================
function nodeVis() {
  
  d3.select("#neuron_group").remove();
  
  // Declare VIS Group
  // ==========================================
  var vis_group = d3.select("#visualization_group"); 
  // ==========================================
  
  
  var neuron_group = vis_group.append("g").attr("id", "neuron_group");
  for (var i=0; i < topology_keys.length; i++) {
    var key = topology_keys[i];
    
    var current_layer_size = topology[key].length;
    
    // Setup layers
    var layer_group = neuron_group.append("g").attr("id", "layer_group_"+i);
    
    // Setup Group
    for (var j=0; j < current_layer_size; j++) {
    var new_neuron_group = layer_group.append("g")
                              .data([topology[key][j]])
                              .attr("id", function(d, i) {
                                return "neuron_"+d.id;
                              })
                              .on("mouseover", function(d) {
                                var self = d3.select(this).select("circle");

                                if (!d.activated) {
                                  var innovation_nums = [];
                                  findConnections(d, innovation_nums);

                                  // Highlight genes and neurons
                                  for (var k=0; k < innovation_nums.length; k++) {
                                    var inno_num = innovation_nums[k];
                                    var gene = d3.select("#gene_"+inno_num).select("rect");
                                    gene.transition().duration(200)
                                      .attr("height", gene_height*1.5)
                                      .attr("width", gene_width*1.5)
                                      .style("fill", geneColor_hover);

                                    // Highlight nodes
                                    var current_gene_object = genome[inno_num];
                                    
                                    var input_neuron = current_gene_object.input;
                                    var output_neuron = current_gene_object.output;

                                    // Determine if neurons are activated or not
                                    input_neuron_activated = checkNeuronActivation(input_neuron);
                                    output_neuron_activated = checkNeuronActivation(output_neuron);
                                    highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=true);
                                    highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=true);

                                  }
                                }
                              })
                              .on("mouseout", function(d) {

                                var self = d3.select(this).select("circle");

                                if (!d.activated) {
                                  var innovation_nums = [];
                                  findConnections(d, innovation_nums);

                                  // De-highlight genes and neurons
                                  for (var k=0; k < innovation_nums.length; k++) {
                                    var inno_num = innovation_nums[k];
                                    var gene = d3.select("#gene_"+inno_num).select("rect");
                                    
                                    gene.transition().duration(200)
                                      .attr("height", gene_height)
                                      .attr("width", gene_width)
                                      .style("fill", function() {
                                        var gene_color = genome[inno_num].disabled ? geneColor_disabled : geneColor_inactive;
                                        return gene_color;
                                      });

                                    // De-highlight neurons
                                    var current_gene_object = genome[inno_num];
                                    
                                    var input_neuron = current_gene_object.input;
                                    var output_neuron = current_gene_object.output;

                                    // Determine if neurons are activated or not
                                    input_neuron_activated = checkNeuronActivation(input_neuron);
                                    output_neuron_activated = checkNeuronActivation(output_neuron);
                                    highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=false);
                                    highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=false);
                                  }
                                }
                              });
    
      
    // Add nodes
    new_neuron_group.append("circle")
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
              .attr("stroke", "black");

      
      
      
    // ==========================================================================================
    //                          TEXT ON NODES
    // ==========================================================================================
    new_neuron_group.append("text")
              .attr("id", key+"_neuron_text__"+i)
              .attr("x", function() {
                var h_m = (network_vis_width - 2*circle_r*topology_keys.length)/(topology_keys.length+1);
                var in_x = horizontalScale(topology_keys.length, h_m, i);
                return in_x;
              })
              .attr("y", function() {
                var v_m = (network_vis_height - 2*circle_r*current_layer_size)/(current_layer_size+1);
                var in_y = verticalScale(current_layer_size, v_m, j);
                return in_y;
              })
              .text(function(d){ return d.id; })
    // ==========================================================================================
    // ==========================================================================================
    // ==========================================================================================
    }
  }
}
// ==========================================================================================
// ==========================================================================================
// ===============================        END NODES       ===================================
// ==========================================================================================
// ==========================================================================================




// ==========================================================================================
//                          LINKS
// ==========================================================================================
function linkVis(show_hidden=true) {
  
  // Declare VIS Group
  // ==========================================
  var vis_group = d3.select("#visualization_group"); 
  // ==========================================
  
  d3.select("#link_group").remove();
  
  // Setup NN locations
  for (var i=0; i < topology_keys.length; i++) {
      var key = topology_keys[i];

      var current_layer_size = topology[key].length;
      var h_m = (network_vis_width - 2*circle_r*topology_keys.length)/(topology_keys.length+1);
      var x = horizontalScale(topology_keys.length, h_m, i);

      for (var j=0; j < current_layer_size; j++) {
        var current_id = topology[key][j].id;
        var v_m = (network_vis_height - 2*circle_r*current_layer_size)/(current_layer_size+1);
        var y = verticalScale(current_layer_size, v_m, j);
        topology[key][j]["x"] = x;
        topology[key][j]["y"] = y;
      }
  }
  
  
  // Find MAX weight for links to scale
  var current_weight, max_weight;
  for (var i=0; i < genome.length; i++) {
      var current_gene = genome[i];
      current_weight = current_gene.weight;
      if (current_weight > max_weight || !max_weight) {
        max_weight = current_weight;
      }
  }
  
  linkVisActivity = {};
  
  // PUT LINKS ON CANVAS
  var link_group = vis_group.append("g").attr("id", "link_group");
  for (var i=0; i < genome.length; i++) {
    var current_gene = genome[i];
    var innovation = current_gene.innovation;
    var input_neuron_id = current_gene.input;
    var output_neuron_id = current_gene.output;
    var weight = current_gene.weight;
    var disabled = current_gene.disabled;
    
    if (!show_hidden && disabled) {
      continue;
    }
    
    var x1, x2, y1, y2;

    for (var key in topology) {
      var layer = topology[key];
      for (var j=0; j < layer.length; j++) {
        var test_neuron = layer[j];
        if (test_neuron.id == input_neuron_id) {
          x1 = test_neuron.x;
          y1 = test_neuron.y;
        }
        else if (test_neuron.id == output_neuron_id) {
          x2 = test_neuron.x;
          y2 = test_neuron.y;
        }
      }
    }

    var stroke_color = (disabled) ? "red" : "black";
    var scaled_weight = linkScale(max_weight, weight);

    var link_data = {"innovation" : innovation,
                     "input" : input_neuron_id,
                     "output" : output_neuron_id,
                     "weight" : weight,
                     "disabled" : disabled,
                     "stroke_color" : stroke_color,
                     "stroke_width" : scaled_weight,
                     "selected" : false,
                     "gene" : current_gene};

    // Add to link vis activity dict
    var link_key = "#link_" + innovation;
    linkVisActivity[link_key] = link_data;

    link_group.append("line").data([link_data]).attr("id", function(d) { return "link_" + d.innovation; })
              .attr("x1", x1)
              .attr("x2", x2)
              .attr("y1", y1)
              .attr("y2", y2)
              .style("stroke", stroke_color)
              .style("stroke-width", function(d, i) {
                return d.stroke_width;
              })
              .on("mouseover", function(d)
              {
                var self = d3.select(this);
                var gene = d3.select("#gene_"+d.innovation).select("rect");

                if (!d.selected) {
                  self.style("stroke", geneColor_active).style("stroke-width", d.stroke_width*1.5);  
                  popoutGene(gene, true, d);

                  var input_neuron = d.input;
                  var output_neuron = d.output;

                  // Determine if neurons are activated or not
                  input_neuron_activated = checkNeuronActivation(input_neuron);
                  output_neuron_activated = checkNeuronActivation(output_neuron);

                  highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=true);
                  highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=true);



                  highlightLinks(self, d, false, true);
                }
                else {
                  self.style("stroke-width", d.stroke_width*2.5);
                }
              })
              .on("mouseout", function(d)
              {
                var self = d3.select(this);
                var gene = d3.select("#gene_"+d.innovation).select("rect");

                if (!d.selected) {
                  self.style("stroke", d.stroke_color).style("stroke-width", d.stroke_width);
                  popoutGene(gene, false, d);


                  var input_neuron = d.input;
                  var output_neuron = d.output;

                  // Determine if neurons are activated or not
                  input_neuron_activated = checkNeuronActivation(input_neuron);
                  output_neuron_activated = checkNeuronActivation(output_neuron);

                  highlightNodes(d.gene, input_neuron, activate=input_neuron_activated, hover=false);
                  highlightNodes(d.gene, output_neuron, activate=output_neuron_activated, hover=false);

                  highlightLinks(self, d, false, false);
                }
                else {
                  self.style("stroke-width", d.stroke_width*1.5);
                }
              })
              .on("click", function(d)
              {
                var self = d3.select("this");
                var gene = d3.select("#gene_"+d.innovation);
                var d_2 = {"gene" : d.gene, "j" : d.innovation};

                if (!d.selected) {
                  console.log("!d.selected");
                  self.transition().duration(200).style("stroke", geneColor_active);

                  genome[d.innovation].expanded = true;

                  updateNodeHighlightCount(d, 1);
                  expandGene(gene, d_2);

                }
                else {
                  console.log("d.selected");
                  self.transition().duration(200).style("stroke", geneColor_inactive);

                  genome[d.innovation].expanded = false;

                  updateNodeHighlightCount(d, -1);
                  collapseGene(gene, d_2);

                }
                d.selected = !d.selected;
              });
    
  }
}
// ==========================================================================================
// ==========================================================================================
// ===============================        END LINKS       ===================================
// ==========================================================================================
// ==========================================================================================


function NEATVisInitializeVariables() {
  show_hidden_links = true;
}





function visNEAT() {
  
  
  
  // ==========================================
  //            GET DATA
  // ==========================================
  genome = selected_model_data.genome;
  neurons = selected_model_data.neurons;
  // ==========================================
  // ==========================================
  // ==========================================
  
  
  // ==================================================================
  // Get MAX "depth" - how many input + output + hidden layers?
  // ==================================================================
  var max_depth = 0;
  for (var i=0; i < neurons.length; i++) {
    var layer_num = neurons[i].layer_num;
    if (layer_num > max_depth) {
      max_depth = layer_num;
    }
  }
  
  var total_layers = max_depth + 1;
  // ==================================================================
  // ==================================================================
  // ==================================================================
  
  
  
  
  // ==========================================================================================
  //              Construct TOPOLOGY
  // ==========================================================================================
  
  topology = {};
  topology_keys = [];
  for (var layer_i=0; layer_i < total_layers; layer_i++) {
    var new_layer = [];
    for (var j=0; j < neurons.length; j++) {
      var current_neuron = neurons[j]; 
      
      if (current_neuron.layer_num == layer_i) {
        // FIND KEY to update topology keys
        var key = current_neuron.layer;
        if (current_neuron.layer == "hidden") {
          key += "_" + current_neuron.layer_num;
        }

        var found_key = false;
        for (var k=0; k < topology_keys.length; k++) {
          if (topology_keys[k] == key) {
            found_key = true;
            break;
          }
        }

        if (!found_key) {
          topology_keys.push(key);
          topology[key] = [];
        }
        topology[key].push(current_neuron);
      }
    }
  }
  
  // Reorganize topology keys such that output is the last in the list
  var topo_output = topology_keys.splice(topology_keys.indexOf("output"), 1);
  topology_keys.push("output");
  // ==========================================================================================
  // ========================= End TOPOLOGY Construction            ===========================
  // ==========================================================================================
        
  
  
  
  // ==========================================================================================
  //                          Links
  // ==========================================================================================
  linkVis();
  
 
  // ==========================================================================================
  //                          NODES
  // ==========================================================================================
  nodeVis();

  
  // ==========================================================================================
  //                          Create GENOME Vis
  // ==========================================================================================
  genomeVis();
 
  
  
}
