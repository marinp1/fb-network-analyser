const d3 = require("d3");

const nodes = require('./data/nodes.json');
const links = require('./data/links.json');

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

function getNodeColor(node) {
  return '#000'
}

function getNodeSize(node) {
  return Math.min(5, Math.max(1, node.degree / 50));
}

function getEdgeColor(edge) {
  if (edge.source === '/patrik.marin' || edge.target === '/patrik.marin') {
    return "#FF0000";
  } else {
    return "#333";
  }
}

function countCommonFriends(id) {
  let count = 0;
  for(let i = 0; i < links.length; i++){
      if(links[i].target.id === id || links[i].source.id === id) {
        count++;
      }
  }
  return count;
}

export function createNetwork() {
  
  const textBox = svg.append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("fontSize", "20px")
    .attr("fill", "black")
    .text("");

  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-30)) 
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(6))
    .force('x', d3.forceX(0.00000001))
    .force('y', d3.forceY(0.00002));

  simulation.force('link', d3.forceLink()
    .id(link => link.id));

  const linkElements = svg.append('g')
  .selectAll('line')
  .data(links)
  .enter().append('line')
    .attr('stroke-width', 0.05)
    .attr('stroke', getEdgeColor)

  const nodeElements = svg.append('g')
  .selectAll('circle')
  .data(nodes)
  .enter().append('circle')
    .attr('r', getNodeSize)
    .attr('fill', getNodeColor)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))
  .on('mouseover', (d, i) => {
    textBox.text(d.name + " " + d.degree);
    d3.event.stopPropagation();
  });

  simulation.nodes(nodes).on('tick', () => {
    linkElements
      .attr('x1', link => Math.max(20,link.source.x))
      .attr('y1', link => Math.max(20,link.source.y))
      .attr('x2', link => Math.max(20,link.target.x))
      .attr('y2', link => Math.max(20,link.target.y))
    nodeElements
      .attr("cx", node => Math.max(20,node.x))
      .attr("cy", node => Math.max(20, node.y))
  }) 

  simulation.force('link').links(links);

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
}