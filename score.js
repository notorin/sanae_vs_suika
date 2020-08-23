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

  addScore: function(bullet, scoreEffects) {
    this.score += bullet.score;
    this.text = `SCORE:${this.score}`;
    this.tweener.clear().set({y: this.prey - 20})
                        .to( {y: this.prey}, 100).play();
    let effect = Label({
      text: `${bullet.score}`,
      fontSize: 20,
      fill: 'white',
      fontFamily: 'FAMania',
      stroke: 'black',
      strokeWidth: 4,
      x: bullet.x,
      y: bullet.y,
    }).addChildTo(scoreEffects);
    effect.tweener.by({y: -20},100)
                  .by({y: 20},100)
                  .wait(100).call(()=>{effect.remove()}).play();
    
    bullet.score *= 2;
  }
});