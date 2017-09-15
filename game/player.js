class Player {
  constructor(nickname) {
    this.nickname = nickname;
  }
  toString() {
    return `Player ${this.nickname}`;
  }
}

module.exports = Player;
