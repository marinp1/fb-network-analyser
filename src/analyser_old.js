const _ = require('underscore');

const nodes = require('./data/nodes.json');
const links = require('./data/links.json');

function getTenClosestFriends(nodes) {
  const sortedNodes = _.sortBy(nodes, node => -node.degree);
  console.log('Ten closest friends:')
  // i = 0 is the egocenter
  for (let i = 1; i <= 10; i++) {
    console.log(`${i}: ${sortedNodes[i].name} with ${sortedNodes[i].degree - 1} common friends`)
  }
}

function getTenLeastCloseFriends(nodes) {
  const sortedNodes = _.sortBy(nodes, node => node.degree);
  console.log('Ten least close friends:')
  for (let i = 0; i < 9; i++) {
    console.log(`${i + 1}: ${sortedNodes[i].name} with ${sortedNodes[i].degree - 1} common friends`)
  }
}

function getAverageDegree(nodes, links) {
  const averageDegree = (2 * links.length) / nodes.length;
  console.log(averageDegree);
}

class Node {
  constructor(id) {
    this.id = id;
    this.neighbours = [];
  }
  
  addNeighbour(id) {
    this.neighbours.push(id);
  }
}

const nodeList = [];
const nodeMap = new Map();
for (node of nodes) {
  const newNode = new Node(node.id);
  nodeList.push(newNode);
  nodeMap.set(node.id, newNode);
}

for (link of links) {
  nodeMap.get(link.source).addNeighbour(link.target);
  nodeMap.get(link.target).addNeighbour(link.source);
}

function getLocalClusteringCoefficient(id) {
  
  const neighbours = nodeMap.get(id).neighbours;
  if (neighbours.length === 1) return 0;

  let links = 0;

  for (w of neighbours) {
    for (u of neighbours) {
      if (_.contains(nodeMap.get(w).neighbours, u)) {
        links += 0.5;
      }
    }
  }

  return (2 * links) / (neighbours.length * (neighbours.length - 1));

}

function getGlobalClusteringCoefficient(nodes) {
  const clusteringCoefficients = nodes.map(node => getLocalClusteringCoefficient(node.id));
  const globalClusteringCoefficient = _.reduce(clusteringCoefficients, (a, b) => a + b, 0) / nodes.length;
  console.log(globalClusteringCoefficient);
}

// Implementation of Floyd-Marshall -algorithm
// TODO: Move nodemap somewhere else
function getDistances(nodes, links) {
  const nodeMap = new Map();

  const distances = new Array(nodes.length);
  for (let i = 0; i < nodes.length; i++) {
    nodeMap.set(nodes[i].id, i);
    distances[i] = new Array(nodes.length).fill(Number.POSITIVE_INFINITY);
  }

  for (let i = 0; i < nodes.length; i++) {
    distances[i][i] = 0;
  }

  for (let i = 0; i < links.length; i++) {
    distances[nodeMap.get(links[i].source)][nodeMap.get(links[i].target)] = 1;
    distances[nodeMap.get(links[i].target)][nodeMap.get(links[i].source)] = 1;
  }

  for (let k = 0; k < nodes.length; k++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (distances[i][j] > distances[i][k] + distances[k][j]) {
          distances[i][j] = distances[i][k] + distances[k][j]
        }
      }
    }
  }

  return {distances, nodeMap};
}

// TODO: Move distance calculation somewhere else
function getClosenessCentralityIndex(id, nodes, links) {
  const distanceResult = getDistances(nodes, links);

  const distances = distanceResult.distances;
  const nodeMap = distanceResult.nodeMap;

  const closenessCentralityIndex = _.reduce(distances[nodeMap.get(id)], (a, b) => {
    if (a === Number.POSITIVE_INFINITY) return b;
    if (b === Number.POSITIVE_INFINITY) return a;
    return a + b;
  }) / (nodes.length - 1);

  return closenessCentralityIndex;
}

function getNodeRankingByClosenessCentrality(nodes, links) {

  const closenessCentralities = new Map();
  let progress = 0;
  const progressMark = Math.floor(nodes.length * 0.1);
  let n = 0;
  nodes.forEach(node => {
    closenessCentralities.set(node.id, getClosenessCentralityIndex(node.id, nodes, links))
    if (n % progressMark === 0) {
      console.log(`${Math.floor(n * 100 / nodes.length)} % done...`)
    }
    n++;
  });

  const sortedNodes = _.sortBy(nodes, node => closenessCentralities.get(node.id));
  console.log('Ten nodes with smallest closeness centrality index:')
  for (let i = 1; i <= 10; i++) {
    console.log(`${i}: ${sortedNodes[i].name} with value of ${closenessCentralities.get(sortedNodes[i].id)}`)
  }

}