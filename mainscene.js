// MainScene クラスを定義
phina.define('MainScene', {
    superClass: 'MyDisplayScene',
    init: function() {
      this.superInit();
      // 背景色を指定
      this.backgroundColor = 'rgb(204, 195, 161)';
      this.score = Score();
      this.player = Player(this.score).addChildTo(this);
      this.player.setPosition(SCREEN_X / 4, SCREEN_Y / 2);
      this.gameManager = GameManager(this.player, this.score).addChildTo(this);
      this.score.addChildTo(this);
      this.score.setPosition(SCREEN_X / 2, SCREEN_Y / 8);
      this.gameoverTimer = 0;
    },

    update: function() {
      if (! this.gameManager.isGameover) return;
      this.gameoverTimer += 1;

      if (this.gameoverTimer < 30) return;
      this.exit({
        player: this.player,
        manager: this.gameManager,
        score: this.score
      });
    },
  });
