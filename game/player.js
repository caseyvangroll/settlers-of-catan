const _ = require('underscore');

class Player {
  constructor(nickname) {
    this.nickname = nickname;
    this.secret = 'shhhhh';
  }
  publicView() {
    const view = _.pick(this, ['nickname']);
    return view;
  }
  privateView() {
    const view = _.clone(this);
    view.self = true;
    return view;
  }
  toString() {
    return `Player ${this.nickname}`;
  }
}

module.exports = Player;
