phina.define('GameManager', {
  superClass:'DisplayElement',
  init: function(player) {
    this.superInit();
    this.respawnTimer = 30;
    this.spawnNum = 2;
    this.player = player;
    this.isGameover = false;
  },

  update: function() {
    //敵の前後関係を正しく描画するためソート
    this.children.sort((a, b) => a.y - b.y);
    //ゲームオーバー時
    if (this.isGameover) return;
    //毎フレームタイマーを減少させる
    this.respawnTimer = Math.max(this.respawnTimer-1, 0);
    //一定フレームごとに敵を生成
    if (this.respawnTimer === 0) {
      (this.spawnNum).times(() => {
        let rad = Math.degToRad(Random.randint(-50, 50));
        let x = SCREEN_X*Math.cos(rad)+this.player.x;
        let y = SCREEN_X*Math.sin(rad)+this.player.y;
        let v = 3;
        let destx = this.player.x+Random.randint(-20, 20);
        let desty = this.player.y+Random.randint(-20, 20);
        rad = Math.atan2(desty - y, destx - x);
        Enemy(x, y, v, destx, rad).addChildTo(this);
      });
      this.respawnTimer = 30;
    }
    //敵とプレイヤーの当たり判定
    this.children.each((e) => {
      this.isGameover = this.isGameover || this.player.isHit(e)
    });
    //ゲームオーバーが決まった
    if (this.isGameover){
      //全ての弾を消去
      this.player.children.clear();
      this.player.isGameover = true;
      this.children.each((e) => {
        e.isGameover = true;
        //高速で接近
        e.v = 30;
        e.anim.ss.getAnimation('walk').frequency = 2;;
      })
    }
  }
});