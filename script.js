let svg = d3.select("#graph").attr("viewBox", '0 0 1200 800');
let g = svg.append("g").attr("transform", "translate(600,50)");

d3.select("svg").call(
  d3.zoom().on("zoom", function (event) {
    g.attr("transform", event.transform);
  })
);

function clearGraph() {
    g.selectAll("*").remove();
  }

  function logMessage(msg) {
    const log = document.getElementById("log");
    log.innerText += msg + "\n";
    log.scrollTop = log.scrollHeight;
  }
  
function startSimulation() {
  clearGraph();
  document.getElementById("subset-output").innerHTML = "";

  let input = document.getElementById("elements").value;
  let target = parseInt(document.getElementById("target").value);

  if (!input || isNaN(target)) {
    alert("Please enter valid numbers and target.");
    return;
  }

  let elements = input.split(",").map(Number);
  let root = {
    label: "[] = 0",
    x: 0,
    y: 0,
    children: [],
    color: "orange"
  };

  let allNodes = [];
  generateSubsets(root, elements, target, [], 0, 0, 0, allNodes);
  logMessage(" Given a set of numbers and a target sum, we want to find all subsets that add up to the target.");
  logMessage(" Starting with an empty subset. Current sum = 0.");
  
  let i = 0;
  function animate() {
    if (i >= allNodes.length) {
      logMessage("These are all subsets that sum up to the target.");
      logMessage("We applied Backtracking- explore all possibilities and prune paths that exceed the target.");
      return;
    }
  
    let node = allNodes[i];
  
    g.append("circle")
      .attr("cx", node.x)
      .attr("cy", node.y)
      .attr("r", 50)
      .attr("fill", node.color)
      .attr("stroke", "#333")
      .attr("stroke-width", 2)
      .transition()
      .duration(300);
  
    g.append("text")
      .attr("x", node.x)
      .attr("y", node.y + 4)
      .attr("text-anchor", "middle")
      .text(node.label);
  
    if (node.parent) {
      let r = 50;
      let dx = node.parent.x - node.x;
      let dy = node.parent.y - node.y;
      let length = Math.sqrt(dx * dx + dy * dy);
      let offsetX = (dx / length) * r;
      let offsetY = (dy / length) * r;
  
      g.append("line")
        .attr("x1", node.x + offsetX)
        .attr("y1", node.y + offsetY)
        .attr("x2", node.parent.x - offsetX)
        .attr("y2", node.parent.y - offsetY)
        .attr("stroke", "black");
    }
  
    const subset = node.label.split(" = ")[0];
    const sum = parseInt(node.label.split(" = ")[1]);
  
    if (sum === 0 && subset === "[]") {
        logMessage("Starting with an empty set. Total = 0.");
      } else if (sum === parseInt(document.getElementById("target").value)) {
        logMessage(`-> Found a set: ${subset} gives the exact total ${sum}.`);
      } else if (sum > parseInt(document.getElementById("target").value)) {
        logMessage(`Skipping ${subset} since total ${sum} is more than needed.`);
      } else {
        logMessage(`Checking ${subset}. Current total = ${sum}.`);
      }
      
    i++;
    setTimeout(animate, 600);
  }
  

  animate();
}

function generateSubsets(parent, arr, target, subset, sum, depth, offset, allNodes) {
    const horizontalSpacing = 150;
    const verticalSpacing = 120;
  
    let label = `[${subset.join(",")}] = ${sum}`;
    let color = sum === target ? "#07fc03" : sum > target ? "#fc0303" : "#fc03ca";
    let x = offset * horizontalSpacing;
    let y = depth * verticalSpacing;
  
    let node = { label, x, y, color, parent };
    allNodes.push(node);

    for (let i = 0; i < arr.length; i++) {
      let newSubset = subset.concat(arr[i]);
      let newSum = sum + arr[i];
        generateSubsets(
          node,
          arr.slice(i + 1),
          target,
          newSubset,
          newSum,
          depth + 1,
          offset + i - Math.floor(arr.length / 2),
          allNodes
        );
      
    }
  }
  
    


