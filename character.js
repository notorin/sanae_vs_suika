
phina.define('Player', {
  superClass:'Sprite',
  init: function(score) {
    this.superInit('sanae', 64, 96);
    this.frameIndex = 0;
    this.holdTimer = 0;
    this.radius = 32;
    this.isGameover = false;
    this.score = score;
  },
  update: function(app) {
    let p = app.pointer;
    //ゲームオーバー時
    if (this.isGameover){
      //やられてるアニメーション
      this.frameIndex = 3;
      return;
    }
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
      this.prex = this.x;
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
      Bullet(Math.radToDeg(rad), type).addChildTo(this);
    }
  },
  isHit: function(enemy) {
    //弾との衝突
    this.children.each((e) => {
      if (e.isHit(enemy, this)) {
        //敵へのダメージ
        enemy.damage(e.type);
        this.score.addScore(e);
        //弾へのダメージ
        if (e.type === 0) e.remove();
      }
    })
    //プレイヤーとの衝突
    let isHit = enemy.life && (enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2 < (enemy.radius + this.radius) ** 2;
    //ゲームオーバー時アニメ
    if (isHit) this.tweener.clear().set({x: this.prex})
                                   .by( {x:  5}, 100)
                                   .by( {x: -5}, 100).setLoop(true).play();
    return isHit;
  }
});

phina.define('Bullet', {
  superClass:'Shape',
  init: function(deg, type) {
    this.superInit();
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
    let rad = Math.degToRad(this.rotation);
    this.setPosition(this.x + Math.cos(rad) * this.v, this.y + Math.sin(rad) * this.v)
  },
  isHit: function(enemy, player) {
    return (enemy.x - this.x - player.x) ** 2 + (enemy.y - this.y - player.y) ** 2 < (enemy.radius + this.radius) ** 2
  },
});

phina.define('Enemy', {
  superClass:'Sprite',
  init: function(x, y, v, destx, rad) {
    this.superInit('suika', 64, 64);
    this.setPosition(x, y);
    this.anim = FrameAnimation('suika_ss').attachTo(this).gotoAndPlay('walk');
    this.destx = destx;
    this.rad = rad
    this.v = v;
    this.life = 5;
    this.isGameover = false;
  },
  update: function() {
    //体力が尽きたとき、なにもしない
    // if (this.life <= 0) return;
    if (this.life <= 0) this.remove();
    //毎フレームプレイヤーに近づく
    this.setPosition(this.x + Math.cos(this.rad) * this.v, this.y + Math.sin(this.rad) * this.v)
    //目的地まで到達したら速度を0にして停止する
    if (this.x < this.destx) this.v = 0;
  },
  damage: function(type) {
    this.life -= type ? 5 : 1;
    //if (this.life <= 0) this.remove();
    this.tweener.clear().set({alpha: 0}).wait(50)
                        .set({alpha: 1}).wait(50)
                        .set({alpha: 0}).wait(50)
                        .set({alpha: 1}).wait(50).play();
  }
});