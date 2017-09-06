class Game {
  constructor() {
    this.resources = Array.apply(null, Array(19)).map((_, i) => String.fromCharCode(65 + i))  // A-S
      .reduce((acc, cur) => { acc[cur] = new Resource(cur); return acc; }, {});
    this.resources.ids = Object.keys(this.resources);
    this.vertices = Array.apply(null, Array(54)).map((_, i) => (i + 1)) // 1-54
      .reduce((acc, cur) => { acc[cur] = new Vertex(cur); return acc; }, {});
    this.vertices.ids = Object.keys(this.vertices);
  }
}
