const _ = require('underscore');

const nodes = require('./data/nodes.json');
const links = require('./data/links.json');

function getTenClosestFriends(nodes) {
  const sortedNodes = _.sortBy(nodes, node => -node.degree);
  console.log('Ten closest friends:')
  // i = 0 is the egocenter
  for (let i = 1; i < 10; i++) {
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