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
  select(toggle) {
    if (toggle) { this.sprite.tint = 0Xff0000; }
    else { this.sprite.tint = 0X00FFFFFF; }
  }
  setEdgeLength(edgeLength) {
    this.sprite.width = 2 * edgeLength;
    this.sprite.height = Math.sqrt(3) * edgeLength;
    this.sprite.anchor.set(0.5);
    // Redefine hit area - i don't understand why all of this needs to be double what i calculated
    this.sprite.hitArea = new PIXI.Polygon([
      -edgeLength * 2, 0,
      -edgeLength, -edgeLength * (Math.sqrt(3)),
      edgeLength, -edgeLength * (Math.sqrt(3)),
      edgeLength * 2, 0,
      edgeLength, edgeLength * (Math.sqrt(3)),
      -edgeLength, edgeLength * (Math.sqrt(3)),
    ]);
  }
  setSprite(sprite) {
    this.sprite = sprite;
    this.sprite.interactive = true;
    this.sprite.on('pointerdown', () => { clickResource(this.id); });
  }
}
