class Game {
  constructor() {
    this.resources = Array.apply(null, Array(19)).map((_, i) => new Resource(String.fromCharCode(65 + i))); // A-S
    this.vertices = Array.apply(null, Array(54)).map((_, i) => new Vertex(i + 1)); // 1-54
  }
}
