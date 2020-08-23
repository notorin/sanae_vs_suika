phina.define('ResultScene', {
  superClass: 'MyDisplayScene',
  init: function(param) {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = 'rgb(204, 195, 161)';
    this.player = param.player.addChildTo(this);
    this.gameManager = param.manager.addChildTo(this);
    this.filter = Shape({
      x: SCREEN_X / 2,
      y: SCREEN_Y / 2,
      width: SCREEN_X,
      height: SCREEN_Y,
      backgroundColor: 'black',
    }).addChildTo(this);
    this.filter.alpha = 0,
    this.filter.tweener.fade(0.5, 1000).play();
    this.score = param.score.addChildTo(this);
    this.score.tweener.clear().to({y: SCREEN_Y / 3}, 1000).play();
    this.tweet = Button({
      text: 'Tweet',
      fontSize: 40,
      fontColor: 'White',
      fill: 'skyblue',
      stroke: 'black',
    }).addChildTo(this);
    this.tweet.setPosition(SCREEN_X * 2 / 3, SCREEN_Y * 5 / 4);
    this.tweet.tweener.wait(1000).moveTo(SCREEN_X * 2 / 3, SCREEN_Y * 3 / 4, 400).play();
    this.tweet.onclick = function() {
      let score = 39;
      let txt = `奇跡の力でスイカを粉砕し${param.score.score}点を獲得！`;
      let url = phina.social.Twitter.createURL({
        text: txt + '\n',
        hashtags: '東風谷早苗とスイカが割れる日',
      });
      window.open(url, 'share window', 'width=480, height=320');
    };

    this.back = Button({
      text: 'Title',
      fontSize: 40,
      fontColor: 'White',
      fill: 'blue',
      stroke: 'black',
    }).addChildTo(this);
    this.back.setPosition(SCREEN_X / 3, SCREEN_Y * 5 / 4);
    this.back.tweener.wait(1000).moveTo(SCREEN_X / 3, SCREEN_Y * 3 / 4, 400).play();
    this.back.onpointend = () => {
      this.exit();
    };
  },

});
