class Vertex {
  constructor(id) {
    this.id = id;
  }
  highlight(toggle) {
    if (toggle) { this.sprite.tint = 0X81abef; }
    else { this.sprite.tint = 0X00FFFFFF; }
  }
  place(x, y) {
    this.sprite.position.set(x, y);
  }
  select(toggle) {
    if (toggle) { this.sprite.tint = 0X3123ed; }
    else { this.sprite.tint = 0X00FFFFFF; }
  }
  setEdgeLength(edgeLength) {
    this.sprite.width = edgeLength / 3;
    this.sprite.height = edgeLength / 3;
    this.sprite.anchor.set(0.5);
    // Redefine hit area - i don't understand why all of this needs to be double what i calculated
    this.sprite.hitArea = new PIXI.Circle(0, 0, edgeLength / 3);
  }
  setSprite(sprite) {
    this.sprite = sprite;
    this.sprite.interactive = true;
    this.sprite.on('pointerdown', () => { clickVertex(this.id); });
  }
}
