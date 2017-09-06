class Vertex {
  constructor(id) {
    this.id = id;
    this.resources = [];
    this.vertices = [];
  }
  addEdge(vertexID) {
    if (!this.vertices.includes(vertexID)) {
      this.vertices.push(vertexID);
    }
  }

  addResource(resourceID) {
    if (!this.resources.includes(resourceID)) {
      this.resources.push(resourceID);
    }
  }

  toString() {
    return `Vertex ${this.id}: Connected to [${this.vertices}], Borders [${this.resources}]`;
  }
}

module.exports = Vertex;
