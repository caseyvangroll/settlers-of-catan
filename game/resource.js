class Resource {
  constructor(id) {
    this.id = id;
    this.vertices = [];
  }

  addVertex(vertexID) {
    if (!this.vertices.includes(vertexID)) {
      this.vertices.push(vertexID);
    }
  }

  toString() {
    return `Resource ${this.id}: Surrounded by [${this.vertices}]`;
  }
}

module.exports = Resource;
