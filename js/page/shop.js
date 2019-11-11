import PageBus from './bus' //引用page选择组件
import Button from '../component/button'
let pagebus = new PageBus();//选择页面的通信
let ctx = pagebus.ctx;

//shop界面，状态存储在Store内

const SHOP_IMG_START_X = canvas.width * 0.1
const SHOP_IMG_START_Y = canvas.width * 0.3
const GOODS_HEIGHT = canvas.width * 0.2
const GOODS_WIDTH = canvas.width * 0.2
const BUTTUON_HEIGHT = canvas.width * 0.1
const BUTTUON_WIDTH = canvas.width * 0.43
const SHOP_IMG_HEAD = 'images/shop_img_'
const SHOPNAME_IMG_HEAD = 'images/shopname_img_'
const SHOPMONEY_IMG_HEAD = 'images/shopmoney_img_'
const SHOP_BUTTON_HEAD = 'images/shop_button_'
const SHOPLEVEL_IMG_HEAD = 'images/shoplevel_img_'
const SHOPLEVEL_MONEY_IMG_HEAD = 'images/shoplevel_money_img_'
const SHOPLEVEL_MAPBUTTON_IMG_HEAD = 'images/shoplevel_mapbutton_img_'

var shopcontext = canvas.getContext('2d')
var introcontext = canvas.getContext('2d')
var moneycontext = canvas.getContext('2d')

export default class Shop {
  constructor(b) {
    this.storepoint = b //记录存储状态
    this.money = b.howMuchMoney()
    this.resetForSaleGoods()
    this.mappoint = 0
    //this.resetForSaleLevels()
  }

  showImage(a = '', x = 0, y = 0, w = 0, h = 0) {
    var _this = this
    var img = new Image()
    img.onload = function () {
      shopcontext.drawImage(img, x, y, w, h)
    }
    img.src = a
  }

  resetForSaleGoods(){
    introcontext.clearRect(0, 0, canvas.width, canvas.height)
    shopcontext.clearRect(0, 0, canvas.width, canvas.height)
    //this.showImage('images/shop_bg.png', 0, 0, canvas.width, canvas.height)
    this.showImage('images/shop_img_back.png', canvas.width * 0.05, canvas.width * 0.08, canvas.width * 0.12, canvas.width * 0.08)
    this.showImage('images/shop_title.png', canvas.width * 0.29, canvas.height * 0.008, canvas.width* 0.42, canvas.height * 0.14)
    this.storepoint.changePoint(1)
    this.resetGoods()
    this.resetButtons()
    this.resetMoney()
    this.touchGoods()
    this.touchBuy()
    this.touchBack()
    this.touchButton()
  }

  resetGoods(){
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        this.showImage(SHOP_IMG_HEAD + (i * 3 + j) + '.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + GOODS_WIDTH * 0.1, i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y, GOODS_WIDTH * 0.8, GOODS_HEIGHT * 0.8)
        this.showImage(SHOPNAME_IMG_HEAD + (i * 3 + j) + '.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.95, GOODS_WIDTH, GOODS_HEIGHT * 0.4)
        this.showImage(SHOPMONEY_IMG_HEAD + (i * 3 + j) + '.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.36, GOODS_WIDTH, GOODS_HEIGHT * 0.4)
      }
    }
  }

  resetButtons() {
    this.button_goods = this.storepoint.whichPoint() - 1
    this.button_level = 2 - this.storepoint.whichPoint()
    this.showImage(SHOP_BUTTON_HEAD + 0 + '_' + this.button_goods + '.png', canvas.width * 0.05, canvas.height * 0.92, BUTTUON_WIDTH, BUTTUON_HEIGHT)
    this.showImage(SHOP_BUTTON_HEAD + 1 + '_' + this.button_level + '.png', canvas.width * 0.52, canvas.height * 0.92, BUTTUON_WIDTH, BUTTUON_HEIGHT)
    this.showImage('images/shop_money.png', canvas.width * 0.65, canvas.width * 0.195, canvas.width * 0.08, canvas.width * 0.08)
  }

  resetMoney() {
    this.storepoint.changeMoney(this.money)
    moneycontext.clearRect(canvas.width * 0.74, canvas.width * 0.2, canvas.width * 0.25, canvas.height * 0.05)
    moneycontext.font = "18px Arial"
    moneycontext.fillStyle = "grey"
    moneycontext.fillText(this.money, canvas.width * 0.83, canvas.width * 0.26)
  }

  touchGoods() { //点击商品图标时，会出现商品介绍
    var _this = this;
    wx.onTouchStart(function (e) {
      var touch = e.changedTouches[0]
    if (_this.storepoint.whichPoint() == 1) { //判断场景是商店才会监听，不知道应该怎么解决所以暂时这么写，下同
      var clientX = touch.clientX
      var clienty = touch.clientY
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if ((j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + GOODS_WIDTH * 0.1 < clientX && clientX < j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + 0.9 * GOODS_WIDTH)
            && (i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y < clienty && clienty < i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.9)) {
            _this.showIntroduction(3 * i + j)
          }
        }
      }}
    })
  }

  showIntroduction(x) {
    introcontext.clearRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.fillStyle = 'white'
    introcontext.fillRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.font = "16px Arial"
    introcontext.fillStyle = "black"
    switch (x) {
      case 0: {
        introcontext.fillText("满血复活，复活前5秒无敌", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 1: {
        introcontext.fillText("获得10秒无敌状态", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 2: {
        introcontext.fillText("消灭界面上所有普通敌机", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 3: {
        introcontext.fillText("加快击发速度", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 4: {
        introcontext.fillText("魔力值 + 40", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 5: {
        introcontext.fillText("20秒内魔力无限", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 6: {
        introcontext.fillText("酷酷的红色小飞机", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 7: {
        introcontext.fillText("像一道闪电划过天空", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
      case 8: {
        introcontext.fillText("环保型战机", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
        break
      }
    }
  }

  touchBuy() { //点击金色按钮时，会购买此道具
    var _this = this;
    wx.onTouchStart(function (e) {
      var touch = e.changedTouches[0]
    if (_this.storepoint.whichPoint() == 1) { 
      var clientX = touch.clientX
      var clienty = touch.clientY
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if ((j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X < clientX && clientX < j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + GOODS_WIDTH)
            && (i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.36 < clienty && clienty < i * (GOODS_HEIGHT * 1.9) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.36 + GOODS_HEIGHT * 0.4)) {
            _this.buy(3 * i + j)
          }
        }
      }}
    })
  }

  buy(x) {
    var goodsmoney = Array(1000, 800, 1000, 600, 600, 1000, 8000, 8000, 8000)
    introcontext.clearRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.fillStyle = 'white'
    introcontext.fillRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.font = "16px Arial"
    introcontext.fillStyle = "black"
    if(this.money < goodsmoney[x]){
      introcontext.fillText("您的金币不足", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
    }
    else if (x > 5 && this.storepoint.haveThePlane(x - 6)){
      introcontext.fillText("您已拥有此飞机", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
    }
    else{
      this.money -= goodsmoney[x]
      introcontext.fillText("您已成功购买此商品", canvas.width * 0.13, canvas.height * 0.86, canvas.width * 0.8)
      this.resetMoney()
      this.storepoint.increaseGoods(x)
    }
  }

  touchBack() { //点击返回按钮后，应返回主菜单，现在暂时是会创造一个test窗口
    var _this = this;
    wx.onTouchStart(function (e) {
      var touch = e.changedTouches[0]
    if (_this.storepoint.whichPoint()) { 
      var clientX = touch.clientX
      var clienty = touch.clientY
      if ((canvas.width * 0.05 < clientX && clientX < canvas.width * 0.17)
        && (canvas.width * 0.08 < clienty && clienty < canvas.width * 0.16)) {
        _this.shopTurnBack()
      }}
    })
  }

  shopTurnBack(){ //返回主界面
    introcontext.clearRect(0, 0, canvas.width, canvas.height)
    shopcontext.clearRect(0, 0, canvas.width, canvas.height)
    this.storepoint.changePoint(0)
    //this.remove();
    pagebus.page = 0;
  }

  touchButton() {
    var _this = this;
    wx.onTouchStart(function (e) {
      var touch = e.changedTouches[0]
      if (_this.storepoint.whichPoint() == 1) {
        var clientX = touch.clientX
        var clienty = touch.clientY
        if ((canvas.width * 0.52 < clientX && clientX < canvas.width * 0.52 + BUTTUON_WIDTH)
          && (canvas.height * 0.92 < clienty && clienty < canvas.height * 0.92 + BUTTUON_HEIGHT)) {
          _this.resetForSaleLevels()
        }
      }
      if (_this.storepoint.whichPoint() == 2) {
        var clientX = touch.clientX
        var clienty = touch.clientY
        if ((canvas.width * 0.05 < clientX && clientX < canvas.width * 0.05 + BUTTUON_WIDTH)
          && (canvas.height * 0.92 < clienty && clienty < canvas.height * 0.92 + BUTTUON_HEIGHT)) {
          _this.resetForSaleGoods()
        }
      }
    })
  }

  resetForSaleLevels(){
    introcontext.clearRect(0, 0, canvas.width, canvas.height)
    shopcontext.clearRect(0, 0, canvas.width, canvas.height)
    //this.showImage('images/shop_bg.png', 0, 0, canvas.width, canvas.height)
    this.showImage('images/shop_img_back.png', canvas.width * 0.05, canvas.width * 0.08, canvas.width * 0.12, canvas.width * 0.08)
    this.showImage('images/shop_title.png', canvas.width * 0.29, canvas.height * 0.008, canvas.width * 0.42, canvas.height * 0.14)
    this.storepoint.changePoint(2)
    this.resetLevels()
    this.resetButtons()
    this.resetMoney()
    this.resetMapButtons()
    this.touchLevels()
    this.touchBack()
    this.touchMapButton()
  }

  resetLevels(){
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        this.showImage(SHOPLEVEL_IMG_HEAD + (i * 3 + j) + '.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.05, GOODS_WIDTH, GOODS_HEIGHT)
        /*
        introcontext.font = "40px Arial"
        introcontext.fillStyle = "#ed7d2e"
        introcontext.fillText((i * 3 + j), j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + GOODS_WIDTH *0.4, i * (GOODS_HEIGHT * 1.6) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.65)
        */
        if (!this.storepoint.haveLevel(this.mappoint, i * 3 + j)){
          this.showImage(SHOPLEVEL_MONEY_IMG_HEAD + Math.floor((i * 3 + j) / 3) + '.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.06, GOODS_WIDTH, GOODS_HEIGHT * 0.4)
          this.showImage('images/shoplevel_locked_1.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.05, GOODS_WIDTH, GOODS_HEIGHT)
          this.showImage('images/shoplevel_locked_2.png', j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + GOODS_WIDTH * 0.25, i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.3, GOODS_WIDTH * 0.5, GOODS_HEIGHT * 0.5)
        }
      }
    }
  }

  resetMapButtons(){
    for (var i = 0; i < 3; i++) {
      this.showImage(SHOPLEVEL_MAPBUTTON_IMG_HEAD + i + '.png', canvas.width * 0.12 + canvas.width * 0.1 * i, canvas.width * 0.2, canvas.width * 0.08, canvas.width * 0.08)
      if (i == this.mappoint){
        this.showImage('images/shoplevel_mapbutton_img.png', canvas.width * 0.12 + canvas.width * 0.1 * i, canvas.width * 0.2, canvas.width * 0.08, canvas.width * 0.08)
        }
      }
  }

  touchMapButton() { 
    var _this = this;
    wx.onTouchStart(function (e) {
      var touch = e.changedTouches[0]
      if (_this.storepoint.whichPoint() == 2) {
        var clientX = touch.clientX
        var clienty = touch.clientY
        for (var i = 0; i < 3; i++) {
          if ((canvas.width * 0.12 + canvas.width * 0.1 * i < clientX && clientX < canvas.width * 0.12 + canvas.width * 0.1 * i + canvas.width * 0.08)
          && (canvas.width * 0.2 < clienty && clienty < canvas.width * 0.2 + canvas.width * 0.08)) {
              _this.mappoint = i
            shopcontext.clearRect(SHOP_IMG_START_X, SHOP_IMG_START_Y + GOODS_HEIGHT * 0.24, GOODS_WIDTH * 4, GOODS_HEIGHT * 6.4)
            _this.resetLevels()
            shopcontext.clearRect(canvas.width * 0.12, canvas.width * 0.2, canvas.width * 0.28, canvas.width * 0.08)
            _this.resetMapButtons()
            }
          }
        }
      })
  }

  touchLevels() { //点击金色按钮时，会购买此道具
    var _this = this;
    wx.onTouchStart(function (e) {
      var touch = e.changedTouches[0]
      if (_this.storepoint.whichPoint() == 2) {
        var clientX = touch.clientX
        var clienty = touch.clientY
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 3; j++){
            if (!_this.storepoint.haveLevel(_this.mappoint, i * 3 + j)) {
              if ((j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X < clientX && clientX < j * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X + GOODS_WIDTH)
                && (i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.06 < clienty && clienty < i * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 1.46)) {
                _this.buyLevel(_this.mappoint, 3 * i + j)
              }
            }
          }
        }
      }
    })
  }

  buyLevel(m, n){
    var levelmoney = Array(1000, 1000, 2000, 4000)
    introcontext.clearRect(canvas.width * 0.1, canvas.height * 0.85, canvas.width * 0.8, canvas.height * 0.05)
    introcontext.fillStyle = 'white'
    introcontext.fillRect(canvas.width * 0.1, canvas.height * 0.85, canvas.width * 0.8, canvas.height * 0.05)
    introcontext.font = "16px Arial"
    introcontext.fillStyle = "black"
    if (this.money < levelmoney[Math.floor(n / 3)]) {
      introcontext.fillText("您的金币不足", canvas.width * 0.13, canvas.height * 0.88, canvas.width * 0.8)
    }
    else {
      this.money -= levelmoney[Math.floor(n / 3)]
      introcontext.fillText("您已成功购买此商品", canvas.width * 0.13, canvas.height * 0.88, canvas.width * 0.8)
      this.resetMoney()
      this.storepoint.unlockedLevel(m, n)
      shopcontext.clearRect((n % 3) * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, Math.floor(n / 3) * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.05, GOODS_WIDTH, GOODS_HEIGHT * 1.45)
      this.showImage(SHOPLEVEL_IMG_HEAD + n + '.png', (n % 3) * (GOODS_WIDTH * 1.5) + SHOP_IMG_START_X, Math.floor(n / 3) * (GOODS_HEIGHT * 1.5) + SHOP_IMG_START_Y + GOODS_HEIGHT * 0.05, GOODS_WIDTH, GOODS_HEIGHT)
    }
  }
}

