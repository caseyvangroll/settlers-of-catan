
// Vertex
//   id: String {1-54}
//   sprite: PIXI.Sprite

const extendVertices = () => {
  vertices.ids.forEach((id) => {

    vertices[id].highlight = function(toggle) {
      if (toggle) { this.sprite.tint = 0X81abef; }
      else { this.sprite.tint = 0X00FFFFFF; }
    };
    vertices[id].place = function(x, y) {
      this.sprite.position.set(x, y);
    };

    vertices[id].select = function(toggle) {
      if (toggle) { this.sprite.tint = 0X3123ed; }
      else { this.sprite.tint = 0X00FFFFFF; }
    };

    vertices[id].setEdgeLength = function(edgeLength) {
      this.sprite.width = edgeLength / 3;
      this.sprite.height = edgeLength / 3;
      this.sprite.anchor.set(0.5);
      // Redefine hit area - i don't understand why all of this needs to be double what i calculated
      this.sprite.hitArea = new PIXI.Circle(0, 0, edgeLength / 3);
    };

    vertices[id].setInteractive = function(toggle) {
      this.sprite.interactive = toggle;
      if (toggle) {
        this.sprite.on('pointerdown', () => { clickVertex(this.id); });
      }
    };

  });
};
