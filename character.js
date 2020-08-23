
phina.define('Player', {
  superClass:'Sprite',
  init: function() {
    this.superInit('sanae', 64, 96);
    this.frameIndex = 0;
    this.holdTimer = 0;
    this.radius = 32;
    this.isGameover = false;
  },

  setPosition: function(x, y) {
    this.superMethod('setPosition', x, y);
    this.prex = x;
  },

  setBulletsGroup: function(group) {
    this.bullets = group;
  },

  update: function(app) {
    let p = app.pointer;
    //ゲームオーバー時
    if (this.isGameover) return;
    //毎フレームタイマーを減少させる
    this.holdTimer = Math.max(this.holdTimer-1, 0);
    //各ショットが画面外に出たら消去する
    this.children.eraseIfAll((e) =>
      e.x + this.x > SCREEN_X || e.y + this.y > SCREEN_Y || e.y + this.y < 0
    );

    //マウスを押した瞬間
    if (p.getPointingStart()) {
      //溜めてるアニメーション
      this.frameIndex = 1;
      this.tweener.clear().by( {x:  5}, 100)
                          .by( {x: -5}, 100).setLoop(true).play();
      //押した時間で弾の種類を決めるためholdTimerを起動
      this.holdTimer = 15;
    }
    //マウスを放した瞬間、ショットの生成
    if (p.getPointingEnd()) {
      //撃ってるアニメーション
      this.frameIndex = 2;
      this.tweener.clear().set({x: this.prex})
                          .wait(200)
                          .set({frameIndex: 0}).play();
      //発射角度は-90度～90度まで
      let rad = Math.max(-Math.PI/2, Math.min(Math.PI/2, Math.atan2(p.y - this.y, p.x - this.x)));
      //指定フレーム以上押しっぱなしにしていれば貫通弾を撃つ
      let type = (this.holdTimer === 0) ? 1 : 0;
      Bullet(this.x, this.y, Math.radToDeg(rad), type).addChildTo(this.bullets);
    }
  },
  isHit: function(enemy) {
    let isHit = (enemy.life > 0) && (enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2 < (enemy.radius + this.radius) ** 2;
    //ゲームオーバー時アニメ
    if (isHit) this.tweener.clear().set({x: this.prex, frameIndex: 3})
                                   .by( {x:  5}, 100)
                                   .by( {x: -5}, 100).setLoop(true).play();
    return isHit;
  }
});

phina.define('Bullet', {
  superClass:'Shape',
  init: function(x, y, deg, type) {
    this.superInit();
    this.setPosition(x, y);
    this.setSize(32, 8);
    this.radius = 4;
    this.setRotation(deg);
    //type => 0:normal bullet 1:Pierce bullet
    this.type = type
    this.v =  type ? 25 : 20;
    this.score = type ? 100 : 20;
    this.backgroundColor = type ? 'red': 'yellow';
  },
  update: function() {
    //角度方向に直進
    let rad = Math.degToRad(this.rotation);
    this.setPosition(this.x + Math.cos(rad) * this.v, this.y + Math.sin(rad) * this.v);
    //ショットが画面外に出たら消去する
    if (this.x > SCREEN_X || this.y > SCREEN_Y || this.y < 0) this.remove();
  },
  isHit: function(enemy) {
    return (enemy.life > 0) && (enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2 < (enemy.radius + this.radius) ** 2
  },
});

phina.define('Enemy', {
  superClass:'Sprite',
  init: function(x, y, v, destx, rad) {
    this.superInit('suika', 64, 64);
    this.setPosition(x, y);
    this.anim = FrameAnimation('suika_ss').attachTo(this).gotoAndPlay('walk');
    this.anim.ss.getAnimation('walk').frequency = 4;
    this.destx = destx;
    this.rad = rad
    this.v = v;
    this.life = 5;
    this.isGameover = false;
  },
  update: function() {
    //体力が尽きたとき、なにもしない
    if (this.life <= 0) return;
    //毎フレームプレイヤーに近づく
    this.setPosition(this.x + Math.cos(this.rad) * this.v, this.y + Math.sin(this.rad) * this.v)
    //目的地まで到達したら速度を0にして停止する
    if (this.x < this.destx) this.v = 0;
  },
  damage: function(type) {
    this.life -= type ? 5 : 1;
    //破壊時
    if (this.life <= 0) {
      this.anim.gotoAndStop();
      this.setImage('suika', 32, 64);
      this.frameIndex = 0;
      this.x -= 16;
      this.tweener.clear().by({x: -16},200)
                          .set({alpha: 0}).wait(50)
                          .set({alpha: 1}).wait(50)
                          .set({alpha: 0}).wait(50)
                          .set({alpha: 1}).wait(50)
                          .call(()=>{this.remove();}).play();
      let rightSuika = Sprite('suika', 32, 64).addChildTo(this);
      rightSuika.frameIndex = 0;
      rightSuika.scaleX *= -1;
      rightSuika.setPosition(32, 0);
      rightSuika.tweener.by({x: 32},200)
                        .set({alpha: 0}).wait(50)
                        .set({alpha: 1}).wait(50)
                        .set({alpha: 0}).wait(50)
                        .set({alpha: 1}).wait(50)
                        .call(()=>{rightSuika.remove();}).play();
      return;
    }
    this.tweener.clear().set({alpha: 0}).wait(50)
                        .set({alpha: 1}).wait(50)
                        .set({alpha: 0}).wait(50)
                        .set({alpha: 1}).wait(50).play();
  }
});