class Resource {
  constructor(id) {
    this.id = id;
  }
  highlight(toggle) {
    if (toggle) { this.sprite.tint = 0Xffc6c6; }
    else { this.sprite.tint = 0X00FFFFFF; }
  }
  place(x, y) {
    this.sprite.position.set(x, y);
  }
  setEdgeLength(edgeLength) {
    this.sprite.width = 2 * edgeLength;
    this.sprite.height = Math.sqrt(3) * edgeLength;
    this.sprite.anchor.set(0.5);
  }
}
