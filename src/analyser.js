const _ = require('underscore');

const nodes = require('./data/nodes.json');
const links = require('./data/links.json');

class Node {
  constructor(id) {
    this.id = id;
    this.neighbours = [];
  }
  
  addNeighbour(id) {
    this.neighbours.push(id);
  }
}

function getNodeList(nodes, links) {
  const nodeList = [];
  const nodeMap = new Map();
  for (node of nodes) {
    const newNode = new Node(node.id);
    nodeList.push(newNode);
    nodeMap.set(node.id, newNode);
  }

  for (link of links) {
    nodeMap.get(link.source).addNeighbour(nodeMap.get(link.target));
    nodeMap.get(link.target).addNeighbour(nodeMap.get(link.source));
  }

  return nodeList;
}

function getBetweennessCentralities(nodes, links) {
  // Transform node and link data to OO-style
  const nodeList = getNodeList(nodes, links);

  // Constructs path from BFS result
  function construct_path(targetId, startId, path) {

    // All possible shortest paths between start and target
    const paths = [];

    function next_step(currentPath, id) {
      if (id === startId) {
        // Add generated path
        paths.push(currentPath);
      } else {

        // Get the nodes which point to this node
        const parents = path.get(id);

        if (parents.length === 1) {
          currentPath.push(parents[0]);
          next_step(currentPath, parents[0]);
        } else {

          // If the path branches, create new paths
          // And copy the current path to it
          for (let i = 1; i < parents.length; i++) {
            const branch = currentPath.concat(parents[i]);
            next_step(branch, parents[i]);
          }

          // Continue with the original path as well
          currentPath.push(parents[0]);
          next_step(currentPath, parents[0]);

        }
      }
    }

    // Initiate loop
    next_step([targetId], targetId);

    // Get length of shortest path
    let minLength = paths[0].length;

    // Reverse paths
    for (const arr of paths) {
      if (arr.length < minLength) minLength = arr.length;
      arr.reverse();
    }

    // Remove only shortest paths
    const minLengthPaths = paths.filter(_ => _.length === minLength);
    return minLengthPaths;
  }

  function BFS(start, target) {
    const open_set = [];
    const visited = new Set();

    const path = new Map();

    let found = false;

    open_set.push(start);

    while (open_set.length > 0) {
      const currentNode = open_set.shift();

      // If target has been found, finish current loop
      // In order to get all shortest paths
      if (target.id === currentNode.id) {
        found = true;
      };

      if (!found) {
        for (const neighbour of currentNode.neighbours) {
          if (!visited.has(neighbour.id)) {

            // Handle possible branching, node may have to incoming links
            if (path.has(neighbour.id) && path.get(neighbour.id).length > 0) {
              if (path.get(neighbour.id).indexOf(currentNode.id) === -1) {
                path.get(neighbour.id).push(currentNode.id);
              }
            } else {
              path.set(neighbour.id, [ currentNode.id ]);
            }
            // Add child node to next iteration
            open_set.push(neighbour);
          }
        }
      }

      visited.add(currentNode.id);

    }

    return construct_path(target.id, start.id, path);
  }

  // Constructs all shortest paths between nodes
  function construct_paths() {
    const paths = new Map();
    const visited = new Set();

    for (const v1 of nodeList) {
      for (const v2 of nodeList) {
        // Undirected network
        const identifier = [v1.id, v2.id].sort().join();
        if (!visited.has(identifier)) {
          paths.set(identifier, BFS(v1, v2));
        }
        visited.add(identifier);
      }
    }

    return paths;
  }

  function getBetweenness(allPaths, node) {
    let betweenness = 0;
    const visited = new Set();

    for (const v1 of nodeList) {
      for (const v2 of nodeList) {
        // Undirected network
        const identifier = [v1.id, v2.id].sort().join();
        if (v1.id !== v2.id && v1.id !== node.id && v2.id !== node.id && !visited.has(identifier)) {
          const paths = allPaths.get(identifier);
          // Get number of paths that go through given node
          const sum = paths.map(_ => _.indexOf(node.id) === -1 ? 0 : 1).reduce((a, b) => a + b);
          // Increment betweenness by the ratio
          betweenness += sum / paths.length;
        }
        visited.add(identifier);
      }
    }
    return betweenness;
  }

  const paths = construct_paths();
  const result = new Map();

  for (const v of nodeList) {
    result.set(v.id, getBetweenness(paths, v));
  }

  return result;

}

getBetweennessCentralities(nodes, links);