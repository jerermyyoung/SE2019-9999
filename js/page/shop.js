import PageBus from './bus' //引用page选择组件
import Button from '../component/button'
import Store from './store'
let pagebus = new PageBus();//选择页面的通信
let ctx = pagebus.ctx;

//shop界面，状态存储在Store内

const SHOP_IMG_START_X = canvas.width * 0.1
const SHOP_IMG_START_Y = canvas.width * 0.3
const GOODS_HEIGHT = canvas.width * 0.2
const GOODS_WIDTH = canvas.width * 0.2
const BUTTUON_HEIGHT = canvas.width * 0.1
const BUTTUON_WIDTH = canvas.width * 0.43
const SHOP_GOODSBUTTON_HEAD = 'images/shop_img_goodsbutton_'
const SHOP_LEVELBUTTON_HEAD = 'images/shop_img_levelbutton_'
const SHOP_IMG_HEAD = 'images/shop_img_'

export default class Template {
  constructor(b) { 
    this.restart()//初始重置
    /******************
     * 初始化UI控件。
    *******************/
    this.storepoint = b //记录存储状态
    this.moneydata = this.storepoint.howMuchMoney()
    this.bg = new Image()
    this.bg.src = 'images/bg4.jpg'
    this.button_goods_state = 1
    this.button_level_state = 0
    this.resetForSaleGoods()
    this.intro = new Button('', '', 0, 0, 0, 0)
  }
  restart()//重置
  {
    this.bindLoop = this.loop.bind(this) //绑定渲染事件
    this.aniId = window.requestAnimationFrame(//界面重绘时执行 loop方法
      this.bindLoop,
      canvas
    );
    this.touchHandler = this.touchEventHandler.bind(this);
    ['touchstart', 'touchmove', 'touchend'].forEach((type) => {
      canvas.addEventListener(type, this.touchHandler)
    })
  }
  remove()//清除
  {
    ['touchstart', 'touchmove', 'touchend'].forEach((type) => {
      canvas.removeEventListener(type, this.touchHandler)
    });
    window.cancelAnimationFrame(this.aniId);
    console.log('ok')
  }
  loop()//循环刷帧
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    window.cancelAnimationFrame(this.aniId);
    this.render();
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  render()//渲染函数
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    /*********************
     * 在canvas上画图
     *******************/
    ctx.drawImage(this.bg, 0, 0, canvas.width, canvas.height)
    this.back.render(ctx)
    this.title.render(ctx)
    this.button_goods.render(ctx)
    this.button_level.render(ctx)
    this.moneyshow.render(ctx)
    this.money.render(ctx)
    this.intro.render(ctx)
    if (this.button_level_state == 1) {
      for (var i = 0; i < 9; i++) {
        this.goodsimg[i].render(ctx)
        this.goodsname[i].render(ctx)
        this.goodsval[i].render(ctx)
      }  
    }
    if (this.button_goods_state == 1){
      for(var i = 0; i < 12; i++){
        this.levelimg[i].render(ctx)
        this.levelval[i].render(ctx)
      }
      for(var i = 0; i < 3; i++){
        this.button_map[i].render(ctx)
      }
    }
  }
  touchEventHandler(e)
  {
    e.preventDefault()
    let [x, y] = (e.type == 'touchstart' || e.type == 'touchmove') ?
      [e.touches[0].clientX, e.touches[0].clientY] : [null, null]

    if (this.back.isTapped(x, y) == true) {
      this.remove();
      try {
        wx.setStorageSync("userstore", this.storepoint)
      } catch (e) {
        console.log(e);
      }
      pagebus.page = 0;
    }

    if (this.button_level_state == 1){
      for (var i = 0; i < 9; i++) {
        if (this.goodsimg[i].isTapped(x, y) == true || this.goodsname[i].isTapped(x, y) == true) {
          this.showIntroduction(i)
        }
      }
      for (var i = 0; i < 9; i++) {
        if (this.goodsval[i].isTapped(x, y) == true) {
          this.buyGoods(i)
        }
      }
      if (this.button_level.isTapped(x, y) == true) {
        this.resetForSaleLevels()
      }
    }

     if (this.button_goods_state == 1){
       for (var i = 0; i < 3; i++) {
         if (this.mappoint != i && this.button_map[i].isTapped(x, y) == true) {
           this.mappoint = i
           this.resetMapButtons()
           this.resetLevels()
         }
       }
       for(var i = 0; i < 12; i++){
         if (this.levelval[i].isTapped(x, y) == true) {
           this.buyLevel(i)
         }
       }
       if (this.button_goods.isTapped(x, y) == true) {
         this.resetForSaleGoods()
       }
    }
  }

  resetForSaleGoods() {
    this.intro = new Button('','', 0, 0, 0, 0)
    this.back = new Button('', 'images/shop_img_back.png', canvas.width * 0.05, canvas.width * 0.08, canvas.width * 0.12, canvas.width * 0.08)
    this.title = new Button('', 'images/shop_img_title.png', canvas.width * 0.29, canvas.height * 0.008, canvas.width * 0.42, canvas.height * 0.14)
    this.resetGoods()
    this.resetButtons()
    this.resetMoney()
  }

  resetForSaleLevels() {
    this.intro = new Button('', '', 0, 0, 0, 0)
    this.mappoint = 0
    this.resetLevels()
    this.resetButtons()
    this.resetMoney()
    this.resetMapButtons()
  }

  resetGoods() {
    this.goodsimg = Array(9)
    this.goodsname = Array(9)
    this.goodsval = Array(9)
    this.goodsnamedata = Array("复活卡", "无敌卡", "轰炸卡", "加速卡", "补充卡", "无限卡", "红色小飞机", "黄色小飞机", "绿色小飞机")
    this.goodsvaldata = Array(1000, 800, 1000, 600, 600, 1000, 8000, 8000, 8000)
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        this.goodsimg[i * 3 + j] = new Button('', SHOP_IMG_HEAD + (i * 3 + j) + '.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + GOODS_WIDTH * 0.1, i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y, GOODS_WIDTH * 0.8, GOODS_HEIGHT * 0.8)
        this.goodsname[i * 3 + j] = new Button(this.goodsnamedata[i * 3 + j], 'images/shop_img_goodsname.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.95, GOODS_WIDTH, GOODS_HEIGHT * 0.4)
        this.goodsval[i * 3 + j] = new Button(this.goodsvaldata[i * 3 + j], 'images/shop_img_val.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.36, GOODS_WIDTH, GOODS_HEIGHT * 0.4)
      }
    }
  }

  resetButtons() {
    this.button_goods_state = 1 - this.button_goods_state
    this.button_level_state = 1 - this.button_level_state
    this.button_goods = new Button('', SHOP_GOODSBUTTON_HEAD + this.button_goods_state + '.png', canvas.width * 0.05, canvas.height * 0.92, BUTTUON_WIDTH, BUTTUON_HEIGHT)
    this.button_level = new Button('', SHOP_LEVELBUTTON_HEAD + this.button_level_state + '.png', canvas.width * 0.52, canvas.height * 0.92, BUTTUON_WIDTH, BUTTUON_HEIGHT)
    this.money = new Button('', 'images/shop_img_money.png', canvas.width * 0.65, canvas.width * 0.195, canvas.width * 0.08, canvas.width * 0.08)
  }

  resetMoney() {
    this.storepoint.changeMoney(this.moneydata)
    this.moneyshow = new Button(this.moneydata, '', canvas.width * 0.7, canvas.width * 0.2, canvas.width * 0.25, canvas.height * 0.05)
  }

  resetLevels() {
    this.levelimg = Array(12)
    this.levelval = Array(12)
    this.levelvaldata = Array(1000, 1000, 2000, 4000)
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) { 
        if (!this.storepoint.haveLevel(this.mappoint, i * 3 + j)){
          this.levelimg[i * 3 + j] = new Button(i * 3 + j + 1, 'images/shop_img_level_0.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.05, GOODS_WIDTH, GOODS_HEIGHT)
          this.levelval[i * 3 + j] = new Button(this.levelvaldata[Math.floor((i * 3 + j) / 3)], 'images/shop_img_val.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.06, GOODS_WIDTH, GOODS_HEIGHT * 0.4)
        }
        else {
          this.levelimg[i * 3 + j] = new Button(i * 3 + j + 1, 'images/shop_img_level_1.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.05, GOODS_WIDTH, GOODS_HEIGHT)
          this.levelval[i * 3 + j] = new Button('', '', 0, 0, 0, 0)
        }
      }
    }
  }

  resetMapButtons() {
    this.button_map = Array(3)
    for (var i = 0; i < 3; i++) {
      if (i == this.mappoint) {
        this.button_map[i] = new Button(i + 1, 'images/shop_img_mapbutton_1.png', canvas.width * 0.12 + canvas.width * 0.1 * i, canvas.width * 0.2, canvas.width * 0.08, canvas.width * 0.08) 
      }
      else {
        this.button_map[i] = new Button(i + 1, 'images/shop_img_mapbutton_0.png', canvas.width * 0.12 + canvas.width * 0.1 * i, canvas.width * 0.2, canvas.width * 0.08, canvas.width * 0.08)
      }
    }
  }

  showIntroduction(x) {
    this.introdata = Array("满血复活，复活前5秒无敌", "获得10秒无敌状态", "消灭界面上所有普通敌机", "加快击发速度", "魔力值 + 40", "20秒内魔力无限", "酷酷的红色小飞机", "像一道闪电划过天空", "环保型战机")
    this.intro = new Button(this.introdata[x], 'images/white.png', canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
  }

  buyGoods(x){
    if (this.moneydata < this.goodsvaldata[x]) {
      this.intro = new Button("您的金币不足", 'images/white.png', canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    }
    else if (x > 5 && this.storepoint.haveThePlane(x - 6)) {
      this.intro = new Button("您已拥有此飞机", 'images/white.png', canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    }
    else {
      this.moneydata -= this.goodsvaldata[x]
      this.intro = new Button("您已成功购买此商品", 'images/white.png', canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
      this.resetMoney()
      this.storepoint.increaseGoods(x)
    }
  }

  buyLevel(n) {
    if (this.moneydata < this.levelvaldata[Math.floor(n / 3)]) {
      this.intro = new Button("您的金币不足", 'images/white.png', canvas.width * 0.1, canvas.height * 0.85, canvas.width * 0.8, canvas.height * 0.05)
    }
    else if (!this.storepoint.haveLevel(this.mappoint, n - 1)){
      this.intro = new Button("您未解锁前一关卡", 'images/white.png', canvas.width * 0.1, canvas.height * 0.85, canvas.width * 0.8, canvas.height * 0.05)
    }
    else {
      this.moneydata -= this.levelvaldata[Math.floor(n / 3)]
      this.intro = new Button("您已成功购买此关卡", 'images/white.png', canvas.width * 0.1, canvas.height * 0.85, canvas.width * 0.8, canvas.height * 0.05)
      this.resetMoney()
      this.storepoint.unlockedLevel(this.mappoint, n)
      this.levelimg[n] = new Button(n + 1, 'images/shop_img_level_1.png', (n - Math.floor(n / 3) * 3) * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, Math.floor(n / 3) * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.05, GOODS_WIDTH, GOODS_HEIGHT)
      this.levelval[n] = new Button('', '', 0, 0, 0, 0)
    }
  }

}
