// Convert data to GRAPHML
const fs = require('fs');
const nodes = require('./data/nodes.json');
const links = require('./data/links.json');

const nodeIdMap = new Map();
const padding = Math.floor(Math.log10(nodes.length))+ 1;

for (let i = 0; i < nodes.length; i++) {
  nodeIdMap.set(nodes[i].id, 'n' + i.toString().padStart(padding, '0'));
}

const header = '<graph id="G" edgedefault="undirected">'
const ending = '</graph>'

const nodeData = nodes.map(_ => {
  return (
    `<node id="${nodeIdMap.get(_.id)}">\n` + 
    `\t<data key="v_name">${_.id}</data>\n` +
    `\t<data key="v_label">${_.name}</data>\n` +
    `</node>`
  );
}).join('\n');

const edgeData = links.map(_ => {
  const isMain = _.source.indexOf('patrik.marin') !== -1 || _.target.indexOf('patrik.marin') !== -1;
  return (
    `<edge source="${nodeIdMap.get(_.source)}" target="${nodeIdMap.get(_.target)}">\n` +
    `\t<data key="e_type">${isMain}</data>\n` +
    `</edge>`
  );
}).join('\n');

const data = header + '\n' + nodeData + '\n' + edgeData + ending;

fs.writeFile('network.graphml', data, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('File written!');
});