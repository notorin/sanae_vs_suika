// タイトル
phina.define('TitleScene', {
  superClass: 'MyDisplayScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = 'rgb(204, 195, 161)';

    this.label1 = Label({
      text: '東風谷早苗と\nスイカが割れる日',
      fontSize: 60,
      fill: 'rgb(150, 255, 50)',
      stroke: 'black',
      strokeWidth: 5,
    }).addChildTo(this);
    this.label1.setPosition(SCREEN_X / 2, SCREEN_Y / 4);
    this.label2 = Label({
      text: 'TOUHOU GAME JAM 2020\nPROGRAM : NOTORIN\nGRAPHIC : syak',
      fontSize: 25,
      fill: 'white',
      fontFamily: 'FAMania',
      stroke: 'black',
      strokeWidth: 5,
    }).addChildTo(this);
    this.label2.setPosition(SCREEN_X / 2, SCREEN_Y * 8 / 9);

    this.start = Label({
      text: '>Click here to PLAY<',
      fontSize: 30,
      fill: 'yellow',
      fontFamily: 'FAMania',
      stroke: 'black',
      strokeWidth: 5,
    }).addChildTo(this);
    this.start.setInteractive(true);
    this.start.setPosition(SCREEN_X / 2, SCREEN_Y * 3 / 5);
    // onclickじゃないとあかんのか？
    this.start.onclick = () => {
      //モバイル端末での音声再生のためにcontextを出し入れする必要があるらしい
      let context = phina.asset.Sound.getAudioContext();
      context.resume();

      this.start.setInteractive(false);
      this.start.text = 'READY TO FIGHT!!';
      this.start.fill = 'red';
      this.start.stroke = 'white';
      this.start.tweener.set({alpha: 1}).wait(100)
                        .set({alpha: 0}).wait(100)
                        .set({alpha: 1}).wait(100)
                        .set({alpha: 0}).wait(100)
                        .set({alpha: 1}).wait(100)
                        .set({alpha: 0}).wait(100)
                        .set({alpha: 1}).wait(100)
                        .set({alpha: 0}).wait(100)
                        .call(() => {this.exit()}).play();
    }

    /*this.howto = Button({
      text: 'How To Play',
      fontSize: 30,
      fontColor: 'White',
      fill: 'blue',
      stroke: 'black',
    }).addChildTo(this);
    this.howto.setPosition(SCREEN_X * 2 / 3, SCREEN_Y * 3 / 5);   
    this.howto.onpointstart = function() {
      self.app.pushScene(HowToPlayScene())
    }; */
  },

  update: function() {
  }
});