
const helpers = require('./helpers');

const Vertex = require('./vertex.js');
const Resource = require('./resource.js');

const resources = Array.apply(null, Array(19)).map((_, i) => String.fromCharCode(65 + i))  // A-S
  .reduce((acc, cur) => { acc[cur] = new Resource(cur); return acc; }, {});
resources.ids = Object.keys(resources);

const vertices = Array.apply(null, Array(54)).map((_, i) => (i + 1)) // 1-54
.reduce((acc, cur) => { acc[cur] = new Vertex(cur); return acc; }, {});
vertices.ids = Object.keys(vertices);

// Map Vertices/Resources
helpers.idMap.forEach((mapping) => {
  for (let i = 0; i < mapping.vertices.length; i += 1) {
    // Mapping IDs only
    const r = mapping.resource;
    const v1 = mapping.vertices[i];
    const buddy = (i + 1 === mapping.vertices.length) ? 0 : i + 1;
    const v2 = mapping.vertices[buddy];

    resources[r].addVertex(v1);
    vertices[v1].addResource(r);

    vertices[v1].addEdge(v2);
    vertices[v2].addEdge(v1);
  }
});

module.exports = {
  resources,
  vertices,
};
