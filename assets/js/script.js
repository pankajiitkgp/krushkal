// ---------------------GLOBAL-----------------------

let alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
var rows;


// ----------------------TABLE-----------------------

function matrix_dimension() {
  rows = $('#rows option:selected').text();
  $("#tbl tr").remove();
  var stri = "";
  let k = 0;
  for (let i = 0; i <= rows; i++) {
    stri = stri + "<tr>";
    if (i == 0) {
      stri = stri + "<th scope='col' style='width:60px'>" + "#" + "</th>";
      for (let j = 0; j < rows; j++) {
        stri = stri + "<th scope='col' style='width:60px'>" + alpha[j] + "</th>";
      }
      stri = stri + "</tr>";
    } else {
      for (let j = 0; j <= rows; j++) {
        if (j == 0) {
          stri = stri + "<th scope='row' style='width:60px'>" + alpha[k++] + "</th>";
        } else {
          if (i <= j) {
            stri = stri + "<td style='width:60px'><input type='number' name='data[" + i + " " + j + "]' class='val_input' autocomplete='off' disabled/></td>";
          } else {
            stri = stri + "<td style='width:60px'><input type='number' name='data[" + i + " " + j + "]' class='val_input' autocomplete='off'/></td>";
          }
        }
      }
      stri = stri + "</tr>";
    }
  }

  $("#tbl").append(stri);



};

function addvalue(input_data) {
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= rows; j++) {
      if (i <= j) {} else {
        document.getElementsByName("data[" + i + " " + j + "]")[0].value = input_data[i - 1][j - 1];
      }
    }
  }
};

// ----------------------KRUSHKAL-----------------------

var parent = [];
var arrayfrom = [],
  arrayto = [],
  arraycost = [];
var min_cost;

function find(i) {
  while (parent[i] != i) {
    i = parent[i];
  }
  return i;
}

function union(node1, node2) {
  let a = find(node1);
  let b = find(node2);
  parent[a] = b;
}

function krushkal(edges, no_node) {

  min_cost = 0;
  for (let i = 0; i < no_node; i++) {
    parent[i] = i;
  }

  let edge_count = 0;
  let l = 0;
  while (edge_count < no_node - 1) {
    let min = Infinity;
    let a = -1;
    let b = -1;
    for (let i = 0; i < no_node; i++) {
      for (let j = 0; j < no_node; j++) {
        if (find(i) != find(j) && edges[i][j] < min) {
          min = edges[i][j];
          a = i;
          b = j;
        }
      }
    }
    union(a, b);
    edge_count++;
    //console.log("V " + edge_count + ": (" + a + ", " + b + ") Cost: " + min);
    arrayfrom[l] = a + 1;
    arrayto[l] = b + 1;
    arraycost[l] = min;
    l++;
    min_cost = min_cost + min;
  }
  //console.log("Minimum cost: " + min_cost)
}

// ----------------------NETWROK-----------------------

function networkdraw(input_data) {
  var nodes = [];
  for (let i = 0; i < rows; i++) {
    var nodesId = i + 1;
    var nodeslabel = alpha[i];
    nodes.push({
      id: nodesId,
      label: nodeslabel,
      fixed: true
    });
    //console.log(nodesId + " " + nodeslabel)
  }
  var nodeSet = new vis.DataSet(nodes);

  // create an array with edges

  var edge_label = [];
  let edgeval;
  let eid = 1;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      if (i <= j) {} else {
        let val = input_data[i][j];
        if (val == Infinity) {} else {
          let edgefrom = i + 1;
          let edgeto = j + 1;
          edgeval = val.toString();
          edge_label.push({
            id: eid,
            from: edgefrom,
            to: edgeto,
            label: edgeval,
            font: {
              size: 16,
              background: '#ffffff',
            }
          });
          eid++;
        }
      }
    }
  }

  var edgeSet = new vis.DataSet(edge_label);
  //console.log(edge_label);

  // create a network
  var container = document.getElementById('network');
  var data = {
    nodes: nodeSet,
    edges: edgeSet
  };
  var options = {
    layout: {
      randomSeed: 3.8
    },
    physics: false
  };
  var network = new vis.Network(container, data, options);

  let m = 0;
  let highlt = [];
  for (let i = 0; i < edgeSet.length; i++) {
    for (let j = 0; j < edgeSet.length; j++) {
      if ((arrayfrom[i] == edgeSet.get(j + 1).from.toString() && arrayto[i] == edgeSet.get(j + 1).to.toString()) || (arrayto[i] == edgeSet.get(j + 1).from.toString() && arrayfrom[i] == edgeSet.get(j + 1).to.toString())) {
        highlt[m++] = j + 1;
      }
    }
  }


  for (let x in highlt) {
    edgeSet.update({
      id: highlt[x],
      color: {
        color: '#ff383f',
        highlight: '#ff383f',
        opacity: 1.0
      },
      background: {
        enabled: true,
        color: '#ff383f',
        size: 5
      }
    });
  }
}

function printMST() {
  $("#output span").remove();
  $("#output br").remove();
  var output = "Minimum spanning tree (MST) of the input network is given below:<br>";
  for (let i = 0; i < arrayfrom.length; i++) {
    let j = arrayfrom[i];
    let k = arrayto[i];
    output = output + "<span>Node " + alpha[j - 1] + " <i class='glyphicon glyphicon-resize-horizontal' aria-hidden='true'></i> Node " + alpha[k - 1] + " | Cost: " + arraycost[i] + "</span><br>";
  }
  output = output + "<span><b>Minimum cost for MST: " + min_cost + "</b></span>";
  $("#output").append(output);
}

function findMSTbtn() {

  let error = document.getElementById('error');
  let selectindex = document.getElementById("rows").selectedIndex;
  if (selectindex == 0) {
    error.innerHTML = "Looks like you have not selected. Please select number nodes from dropdown first!";
    $('#errormodal').modal('show');
    return;
  }

  var matrix = new Array(rows);
  for (let i = 0; i < rows; i++) {
    matrix[i] = new Array(rows);
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      let p = document.getElementsByName("data[" + (i + 1) + " " + (j + 1) + "]")[0].value;
      if (p == "") {
        p = Infinity;
      }
      matrix[i][j] = Number(p);
      matrix[j][i] = Number(p);
    }
  }

  for (let i = 0; i < rows; i++) {
    const allEqual = matrix => matrix.every(v => v === matrix[0]);
    if (allEqual(matrix[i]) == true) {
      error.innerHTML = "Looks like you have not entered correct connection between each nodes. Please enter edge weights first!<br/>";
      $('#errormodal').modal('show');
      return;
    }
  }




  //console.log(matrix);
  krushkal(matrix, rows);
  networkdraw(matrix);
  printMST();

}
