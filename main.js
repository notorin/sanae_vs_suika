// phina.js をグローバル領域に展開
phina.globalize();

// 画面サイズ
const SCREEN_X = 800;
const SCREEN_Y = 600;

//ドット絵の倍率
const DOT_SCALE = 4.0;

// MyDisplayScene クラスを定義 毎回やる処理とかはここに記述
phina.define('MyDisplayScene', {
  superClass: 'DisplayScene',
  init: function() {
    // 親クラスの初期化
    this.superInit({
      width: SCREEN_X,
      height: SCREEN_Y,
    });
    // ぼやけ防止
    this.canvas.imageSmoothingEnabled = false;
  },
});

// ドットキャラクラスを定義 元画像の4倍サイズで表示しアニメーションの設定もする
phina.define('DotCharacter', {
  superClass: 'Sprite',
  init: function(image, ss, width, height) {
    this.superInit(image, width, height);
    this.setScale(DOT_SCALE, DOT_SCALE);
    this.ss = FrameAnimation(ss).attachTo(this);
  },

  gotoAndPlay: function(anime) {
    this.ss.gotoAndPlay(anime);
  },

  gotoAndStop: function(anime) {
    this.ss.gotoAndStop(anime);
  },
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'title', // メインシーンから開始する
    width: SCREEN_X,
    height: SCREEN_Y,
    assets: ASSETS,
  });
  // アプリケーション実行
  app.run();
});
