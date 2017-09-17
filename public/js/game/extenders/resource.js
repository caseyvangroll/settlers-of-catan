
// Resource
//   id: String {A-S}
//   sprite: PIXI.Sprite

const extendResources = () => {
  resources.ids.forEach((id) => {

    resources[id].highlight = function(toggle) {
      if (toggle) { this.sprite.tint = 0Xf47777; }
      else { this.sprite.tint = 0X00FFFFFF; }
    };
    resources[id].place = function(x, y) {
      this.sprite.position.set(x, y);
    };

    resources[id].select = function(toggle) {
      if (toggle) { this.sprite.tint = 0Xff0000; }
      else { this.sprite.tint = 0X00FFFFFF; }
    };

    resources[id].setEdgeLength = function(edgeLength) {
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
    };

    resources[id].setInteractive = function(toggle) {
      this.sprite.interactive = toggle;
      if (toggle) {
        this.sprite.on('pointerdown', () => { clickResource(this.id); });
      }
    };

  });
};
