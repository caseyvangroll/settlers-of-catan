class Resource {
  constructor(id) {
    this.id = id;
    this.vertices = [];
  }

  addVertex(vertex) {
    if (!this.vertices.find(v => v.id === vertex.id)) {
      this.vertices.push(vertex);
    }
  }

  toString() {
    let vertices = '< ';
    for (let i = 0; i < this.vertices.length; i += 1) {
      vertices += `${this.vertices[i].id} `;
    }
    vertices += '>';

    return `${this.id} ${vertices}`;
  }
}

module.exports = Resource;
