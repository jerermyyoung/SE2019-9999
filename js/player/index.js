import Sprite   from '../base/sprite'
import Bullet   from './bullet'
import DataBus  from '../databus'
import Constants from '../common/constants'
import Pagebus from '../page/bus.js'
let pagebus=new Pagebus();
const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 玩家相关常量设置

const PLAYER_WIDTH   = 80
const PLAYER_HEIGHT  = 80

const PLAYER_MAXHP = 100
const PLAYER_MAXMP = 100

let databus = new DataBus()


const Config = require('../common/config.js').Config

export default class Player extends Sprite {
  constructor() {
    var PLAYER_IMG_SRC = (pagebus.plane == -1 ? 'images/hero.png' : (pagebus.plane == 0 ? 'images/shop_img_6.png' : (pagebus.plane == 1 ? 'images/shop_img_7.png' : pagebus.plane == 2 ? 'images/shop_img_8.png' : 'images/hero.png')))
    console.log(pagebus.plane)
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    //记录当前的生命值与魔法值
    this.hp=PLAYER_MAXHP
    this.mp=PLAYER_MAXMP

    //记录是否是无敌或者无限魔力
    this.hpinf=false;
    this.mpinf=false;

    //记录是否轰炸
    this.bomb=false;
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(   x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation  )
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if ( disX < 0 )
      disX = 0

    else if ( disX > screenWidth - this.width )
      disX = screenWidth - this.width

    if ( disY <= 0 )
      disY = 0

    else if ( disY > screenHeight - this.height )
      disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  onTouchEvent(type, x, y, callback) {
    switch (type){
      case 'touchstart':
        if (this.checkIsFingerOnAir(x, y)) {
          this.touched = true
          this.setAirPosAcrossFingerPosZ(x, y)
        }
        break;
      case 'touchmove':
        if (this.touched)
          this.setAirPosAcrossFingerPosZ(x, y)
        break;
      case 'touchend':
        this.touched = false
        break;
    }
  }

  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    let bullets = []
    let bulletNum = Constants.Bullet.Types.indexOf(Config.Bullet.Type) + 1
    for (let i = 0; i < bulletNum; i++)
      bullets.push(databus.pool.getItemByClass('bullet', Bullet))

    bullets.forEach( (bullet, index) => {
      bullet.init(
        this.x + this.width * (index+1) / (bulletNum+1) - bullet.width / 2,
        this.y - 10,
        Config.Bullet.Speed
      )
      databus.bullets.push(bullet)
    })
  }

  /**
   * 提供修改[当前]血量、魔法量的方法，【只返回在0~HP/MP_MAX之间的非负值】
   * 修改操作信息由外部给出
   * 还可以添加除了hp值改变以外的、其他的变化到方法中
   */
  hpAdd(variation){
    if(variation+this.hp > PLAYER_MAXHP) this.hp=PLAYER_MAXHP
    else this.hp=variation+this.hp
  }

  hpReduce(variation){
    if(this.hpinf==true)return;
    if(this.hp-variation<0) this.hp=0
    else this.hp=this.hp-variation
  }

  mpAdd(variation){
    if(variation+this.mp > PLAYER_MAXMP) this.mp=PLAYER_MAXMP
    else this.mp=variation+this.mp
  }

  mpReduce(variation){
    if(this.mpinf==true)return;
    if(this.mp-variation<0) this.mp=0
    else this.mp=this.mp-variation
  }
}
