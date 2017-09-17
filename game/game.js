
const _ = require('underscore');
const helpers = require('./helpers');
// const Player = require('./player.js');
const Vertex = require('./vertex.js');
const Resource = require('./resource.js');

class Game {
  constructor() {
    this.MAX_PLAYERS = 4;
    this.state = 'setup';

    // Create resources
    this.resources = Array.apply(null, Array(19)).map((_, i) => String.fromCharCode(65 + i))  // A-S
      .reduce((acc, cur) => { acc[cur] = new Resource(cur); return acc; }, {});
    this.resources.ids = Object.keys(this.resources);

    // Create vertices
    this.vertices = Array.apply(null, Array(54)).map((_, i) => (i + 1)) // 1-54
      .reduce((acc, cur) => { acc[cur] = new Vertex(cur); return acc; }, {});
    this.vertices.ids = Object.keys(this.vertices);

    // Map Vertices/Resources
    helpers.idMap.forEach((mapping) => {
      for (let i = 0; i < mapping.vertices.length; i += 1) {
        // Mapping IDs only
        const r = mapping.resource;
        const v1 = mapping.vertices[i];
        const buddy = (i + 1 === mapping.vertices.length) ? 0 : i + 1;
        const v2 = mapping.vertices[buddy];
        this.resources[r].addVertex(v1);
        this.vertices[v1].addResource(r);
        this.vertices[v1].addEdge(v2);
        this.vertices[v2].addEdge(v1);
      }
    });

    this.players = {};
  }

  viewOf() {
    const view = _.pick(this, ['resources', 'state', 'vertices']);
    return JSON.stringify(view);
  }
}

module.exports = Game;
