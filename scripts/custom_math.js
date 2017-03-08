


function dot(m1, m2)
{
  var new_rows = m1.length;
  var new_cols = m2[0].length;
  var new_matrix = new Array(new_rows);
  for (var i=0; i < new_rows; i++) {
    new_matrix[i] = new Array(new_cols);
  }
 
  var m1_value, m2_value;
  var new_value;
  
  for (var i=0; i < m2[0].length; i++)
  {
    for (var j=0; j < m1.length; j++)
    {
      new_value = 0;
      for (var k=0; k < m2.length; k++)
      {
        m1_value = m1[j][k];
        m2_value = m2[k][i];
        new_value += m1_value * m2_value;
      }
      new_matrix[j][i] = new_value;
    }
  }

  return new_matrix;
}


function RELU(value)
{
  var relu_value = (value <= 0) ? 0 : value;
  return relu_value;
}




function sigm(value)
{
  var sigm_value = 1.0 / (1.0 + Math.exp(-value));
  return sigm_value;
}



function softMax(m)
{
  
  var exp_sum = 0.0;
  for (var i=0; i < m.length; i++)
  {
    for (var j=0; j < m[i].length; j++)
    {
      exp_sum += Math.exp(m[i][j]);
    }
  }
  
  var output_softMax = [];
  var max = [0, 0];
  var max_value = m[0][0] / exp_sum;
  
  for (var i=0; i < m.length; i++)
  {
    for (var j=0; j < m[i].length; j++)
    {
      var new_value = Math.exp(m[i][j]) / exp_sum;
      output_softMax.push(new_value);
    }
  }

  return output_softMax;
}

var RELU_on = false;

function activate(m)
{
  var activated_matrix = [];
  
  for (var i=0; i < m.length; i++)
  {
    var new_row = []
    for (var j=0; j < m[i].length; j++)
    {
      var new_value = (RELU_on) ? RELU(m[i][j]) : sigm(m[i][j]);
      var RELU_value = (m[i][j] <= 0) ? 0 : m[i][j];
      
      new_row.push(new_value)
    }
    activated_matrix.push(new_row);
  }
  
  return activated_matrix;
  
}



function normalizeInput(X)
{
  var normalized_input = [];
  
  
  // valculate mean
  var mean = 0;
  for (var i=0; i < X.length; i++)
  {
    mean += X[i] / (X.length*1.0);
  }
  
  
  // calculate variance;
  var variance = 0.0;
  for (var i=0; i < X.length; i++)
  {
    variance += (X[i] - mean)**2 / (X.length*1.0);
  }
  
  // Normalize
  for (var i=0; i < X.length; i++)
  {
    var std_value = (X[i] - mean) / variance;
    normalized_input.push(std_value);
  }
  return [normalized_input];
}
