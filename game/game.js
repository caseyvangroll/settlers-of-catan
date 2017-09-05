
const helpers = require('./helpers');

const Vertex = require('./vertex.js');
const Resource = require('./resource.js');

const vertices = Array.apply(null, Array(54)).map((_, i) => new Vertex(i + 1)); // 1-54
const resources = Array.apply(null, Array(19)).map((_, i) => new Resource(String.fromCharCode(65 + i))); // A-S

// Map Vertices/Resources
helpers.idMap.forEach((mapping) => {
  for (let i = 0; i < mapping.vertices.length; i += 1) {
    const r = resources[mapping.resource];
    const v1 = vertices[mapping.vertices[i] - 1];
    const buddy = (i + 1 === mapping.vertices.length) ? 0 : i + 1;
    const v2 = vertices[mapping.vertices[buddy] - 1];

    r.addVertex(v1);
    v1.addResource(r);

    v1.addEdge(v2);
    v2.addEdge(v1);
  }
});

module.exports = {
  resources,
  vertices,
};
