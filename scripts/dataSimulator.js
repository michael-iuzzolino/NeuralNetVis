var Neuron = function (id, type, layer) {
  this.id = id;
  this.layer = type;
  this.layer_num = layer;
}

var Gene = function (innovation_number, input, output) {
  this.innovation = innovation_number;
  this.input = input;
  this.output = output;
  this.weight = Math.random();
  this.disabled = false;
}









function findOutput(new_input, genome) {
  var current_gene, new_output;
  var output_neurons = [];
  for (var i=0; i < genome.length; i++) {
    current_gene = genome[i];
    if (current_gene.input == new_input) {
      output_neurons.push(current_gene.output);
    }
  }
  
  var random_index = Math.floor(Math.random()*output_neurons.length);
  new_output = output_neurons[random_index];
  
  
  for (var i=0; i < genome.length; i++) {
    current_gene = genome[i];
    if (current_gene.input == new_input && current_gene.output == new_output) {
      if (!current_gene.disabled) {
        current_gene.disabled = true;
      }
      else {
        return "disabled";
      }
    }
  }
      
  return new_output;
}


function adjustLayerNumbers(input_neuron_id, neurons, genome) {
  var current_neuron, current_gene;
  var in_neuron, out_neuron;
  var output_neuron_id;
  
  
  // Find output neuron id
  for (var i=0; i < genome.length; i++) {
    current_gene = genome[i];
    if (current_gene.input == input_neuron_id && !current_gene.disabled) {
      output_neuron_id = current_gene.output;
      break;
    }
  }
  
  // We now have the output_neuron_id
  if (!output_neuron_id) {
    return;
  }
  
  // Find input and output neuron
  for (var i=0; i < neurons.length; i++) {
    current_neuron = neurons[i];
    if (current_neuron == input_neuron_id) {
      in_neuron = current_neuron;
    }
    else if (current_neuron == output_neuron_id) {
      out_neuron = current_neuron;
    }
  }
  out_neuron.layer_num = in_neuron.layer_num + 1;
  
  adjustLayerNumbers(output_neuron_id, neurons, genome);
  
}

function getLayerNum(input_neuron, output_neuron, neurons) {
  var current_neuron;
  var layer;
  var in_neuron, out_neuron;
  
  for (var i=0; i < neurons.length; i++) {
    current_neuron = neurons[i];
    if (current_neuron.id == input_neuron) {
     
      layer = current_neuron.layer_num;
      in_neuron = current_neuron;
      
    }
    
    if (current_neuron.id == output_neuron) {
      out_neuron = current_neuron;
    }
  }
  out_neuron.layer_num = in_neuron.layer_num + 2;
    
  return layer+1;
}









function generateNEATData() {
  var print = false;
  var epochs = 30;
  var max_input = 4;
  var max_output = 4;
  
  
  var neuron_ids = [];
  for (var i=0; i < 26; i++) {
    neuron_ids.push(String.fromCharCode(97+i));
  }
  
  var genome = [];
  var input_neurons = [];
  var output_neurons = [];
  var neurons = [];
  
  // Setup initial connections with just input / output layer
  var input_num = Math.floor(Math.random()*max_input + 2);
  var output_num = Math.floor(Math.random()*max_output + 1);
  
  
  // Setup initial neurons
  for (var i=0; i < input_num; i++) {
    var new_id = neuron_ids[i];
    var new_neuron = new Neuron(new_id, "input", 0);
    neurons.push(new_neuron);
    input_neurons.push(new_id);
  }
  neuron_ids.splice(0, input_num);
  
  for (var i=0; i < output_num; i++) {
    var new_id = neuron_ids[i];
    var new_neuron = new Neuron(new_id, "output", 1);
    neurons.push(new_neuron);
    output_neurons.push(new_id);
  }
  neuron_ids.splice(0, output_num);
  
  
  
  // Setup initial genome
  var innovation = 0;
  for (var j=0; j < input_num; j++) {
    var input_id = input_neurons[j];
    for (var k=0; k < output_num; k++) {
      var output_id = output_neurons[k];

      var new_gene = new Gene(innovation, input_id, output_id)
      genome.push(new_gene);
      innovation++;
    }
  }
    
  
  
  // Simulate evolution
  var add_node_rate = 0.1;
  var add_link_rate = 0.5;
  
  var new_neuron_list = [];
  
  for (var i=0; i < epochs; i++) {
    
    // Randomly add neurons
    if (Math.random() < add_node_rate) {
      // Make new neuron
      var new_id = neuron_ids[0];
      neuron_ids.splice(0, 1);
      
      
      
      // Select randomly from existing neurons which to connect
      if (new_neuron_list.length == 0) {
        var counter = 0;
        var disabled = true;
        while (!disabled || counter < 4) {
          var random_input_neuron_id = Math.floor(Math.random()*input_neurons.length);
          var random_input_neuron = input_neurons[random_input_neuron_id];
          var random_output_neuron = findOutput(random_input_neuron, genome);
          if (random_output_neuron != "disabled") {
            disabled = false;
            break;
          }
          counter++;
        }
        if (counter == 4) {
          continue;
        }
      }
      else {
       
        var counter = 0;
        var disabled = true;
        while (!disabled || counter < 4) {
          var random_num = Math.random();
          if (random_num < 0.5) {
            var random_input_neuron_id = Math.floor(Math.random()*input_neurons.length);
            var random_input_neuron = input_neurons[random_input_neuron_id];
            var random_output_neuron = findOutput(random_input_neuron, genome);
            
            
          }
          else {
            var random_input_neuron_id = Math.floor(Math.random()*new_neuron_list.length);
            var random_input_neuron = new_neuron_list[random_input_neuron_id];
            var random_output_neuron = findOutput(random_input_neuron, genome);
          }
          
          if (random_output_neuron != "disabled") {
            disabled = false;
            break;
          }
          
          counter++;
        }
        if (counter == 4) {
          continue;
        }
      }
      
      
      var new_gene_1 = new Gene(innovation, random_input_neuron, new_id);
      innovation++;
      var new_gene_2 = new Gene(innovation, new_id, random_output_neuron);
      innovation++;
      
      new_neuron_list.push(new_id);
      genome.push(new_gene_1);
      genome.push(new_gene_2);
      
      
      var layer_num = getLayerNum(random_input_neuron, random_output_neuron, neurons);
      var new_neuron = new Neuron(new_id, "hidden", layer_num);
      neurons.push(new_neuron);
      
      adjustLayerNumbers(random_input_neuron, random_output_neuron, neurons, genome);
    }
    
    // Randomly add links
    if (Math.random() < add_link_rate) {
      
    }
  }
  
  
  if (print) {
    console.log("input_num: " + input_num);
    console.log("output_num: " + output_num);
    console.log(input_neurons);
    console.log(output_neurons);
    console.log(genome);
    console.log(neurons);
    console.log("\n");
  }
  
  return {"genome" : genome, "neurons" : neurons};
}








function generateANNData() {
  var print = false;
  var max_input = 2;
  var max_output = 4;
  var max_hidden_layers = 5;
  var max_hidden_num = 10;
       
  // Generate number of input and output neurons
  var input_num = Math.floor(Math.random()*max_input + 2);
  var output_num = Math.floor(Math.random()*max_output + 1);
  
  
  
       
       
  // Generate number of hidden layers
  var hidden_layer_num = Math.floor(Math.random()*max_hidden_layers);
  
  
  // Generate topology
  var topology = {"input" : input_num };
  var topology_keys = ["input"];
  // Create hidden layers
  for (var i=0; i < hidden_layer_num; i++) {
    var hidden_num = Math.floor(Math.random()*max_hidden_num)+2;
    var key = "H" + (i+1);
    topology[key] = hidden_num;
    topology_keys.push(key);
  }
  topology["output"] = output_num;
  topology_keys.push("output");
  
  
  
  
  // Generate Weight matrices
  var num_weight_matrices = Object.keys(topology).length - 1;
  var W = [];
  
  for (var i=0; i < num_weight_matrices; i++) {
    var W_i = [];
    var key, key2, random_weight;
    
    // Case 1: i == 0
    // --------------
    // W_0 \in R^ |input| x |H1|
    if (i == 0) {
      for (var j=0; j < topology["input"]; j++) {
        var new_row = [];
        key = topology_keys[1];
        for (var k=0; k < topology[key]; k++) {
          random_weight = Math.random();
          new_row.push(random_weight);
        }
        W_i.push(new_row);
      }
      W.push(W_i);
    }
    
    
    // Case 2: i == num_weight_matricies - 1
    // --------------------------------------
    // W_n \in R^ |H_{n-1}| x |output|
    else {
      key = topology_keys[i];
      for (var j=0; j < topology[key]; j++) {
        var new_row = [];
        key2 = topology_keys[i+1];
        for (var k=0; k < topology[key2]; k++) {
          random_weight = Math.random();
          new_row.push(random_weight)
        }
        W_i.push(new_row);
      }
      W.push(W_i);
    }
  }
  
  if (print) {
    console.log("Generating ANN Data");
  
    // Print Topology
    console.log("Topology");
    console.log(topology);
    
    // Print matrices
    console.log("Weight Matrices")
    console.log(W)
    console.log("\n");
  }
  
  return {"topology" : topology, "topology_keys" : topology_keys, "W" : W};
}