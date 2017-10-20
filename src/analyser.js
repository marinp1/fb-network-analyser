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