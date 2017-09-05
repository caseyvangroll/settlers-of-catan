class Vertex {
  constructor(id) {
    this.id = id;
    this.resources = [];
    this.edges = [];
  }
  addEdge(vertex) {
    if (!this.edges.find(v => v.id === vertex.id)) {
      this.edges.push(vertex);
    }
  }

  addResource(resource) {
    if (!this.resources.find(r => r.id === resource.id)) {
      this.resources.push(resource);
    }
  }

  toString() {
    let edges = '< ';
    for (let i = 0; i < this.edges.length; i += 1) {
      edges += `${this.edges[i].id} `;
    }
    edges += '>';

    let resources = '< ';
    for (let i = 0; i < this.resources.length; i += 1) {
      resources += `${this.resources[i].id} `;
    }
    resources += '>';

    return `${this.id} ${edges} ${resources}`;
  }
}

module.exports = Vertex;
