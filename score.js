phina.define('Score', {
  superClass: 'Label',
  init: function() {
    this.superInit({
      text: `SCORE:0`,
      fontSize: 40,
      fill: 'white',
      fontFamily: 'FAMania',
      stroke: 'black',
      strokeWidth: 5,
    });
    this.score = 0;
  },

  setPosition: function(x, y) {
    this.superMethod('setPosition', x, y);
    this.prey = y;
  },

  addScore: function(bullet) {
    this.score += bullet.score;
    bullet.score *= 2;
    this.text = `SCORE:${this.score}`;
    this.tweener.clear().set({y: this.prey - 20})
                        .to( {y: this.prey}, 100).play();
  }
});