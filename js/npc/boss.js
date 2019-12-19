import Sprite from '../base/sprite'
import Animation from '../base/animation'
import AnimationBuilder from '../base/animbuilder'
import DataBus from '../databus'
import PageBus from '../page/bus'
let pagebus = new PageBus()
const Config = require('../common/config.js').Config

const BOSS_IMG_SRC = ['images/boss1.png', 'images/boss2.png', 'images/boss3.png', 'images/boss4.png']
const BOSS_WIDTH = 150
const BOSS_HEIGHT = 100
const BOSS_HP = 10 


const __ = {
  speed: Symbol('speed'),
  explosionAnim: Symbol('explosionAnim')
}

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Boss extends Sprite {

  constructor(img_src, width, height) {
    if (img_src === undefined || width === undefined || height === undefined)
      super(BOSS_IMG_SRC[pagebus.world], BOSS_WIDTH, BOSS_HEIGHT)
    else
      super(img_src, width, height)
    this.hp = BOSS_HP
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - this.width)
    this.y = -this.height
    //this.birth = new Date().getTime()

    this[__.speed] = speed

    this.visible = true
  }

  hpReduce(variation) {
    if (this.hp - variation < 0) {
      this.hp = 0
      this.visible = false
    }
    else this.hp = this.hp - variation
  }

  destroy() {
    this.visible = false
    let explosionAnim = databus.pool.getItemByClass('animation', Animation, Boss.frames)
    //NOTE: 回调函数必须被重新设置，否则会有玄妙的后果..(回调到其他敌机实例去)
    explosionAnim.onFinished = () => {  //对象回收
      databus.removeAnimation(explosionAnim)
      databus.removeBoss(this)
    }
    explosionAnim.start()
    this[__.explosionAnim] = explosionAnim
  }

  isAlive() {
    return this.visible
  }

  update(timeElapsed) {
    if (this.isAlive()) {
      if(!databus.frozen)this.y += this[__.speed]
      if (this.y > window.innerHeight + this.height) {
        databus.removeBoss(this)  //对象回收
        //console.log('Enemy life: ' + (new Date().getTime() - this.birth))
      }
    }
    else {  //destroyed
      if(!databus.frozen)this.y += this[__.speed]  //即便炸毁了还有惯性
      this[__.explosionAnim].update(timeElapsed)
    }
  }

  render(ctx) {
    if (this.isAlive())
      super.render(ctx)
    else
      this[__.explosionAnim].render(ctx, this.x, this.y)
  }

  /*
    shoot() {
      let bombs = []
      let bombNum = Constants.Bomb.Types.indexOf(Config.Bomb.Type) + 1
      for (let i = 0; i < bombNum; i++)
        bombs.push(databus.pool.getItemByClass('bomb', bomb))
  
      bombs.forEach((bomb, index) => {
        bomb.init(
          this.x + this.width * (index + 1) / (bombNum + 1) - bomb.width / 2,
          this.y - 10,
          Config.Bomb.Speed
        )
        databus.bombs.push(bomb)
      })
    }
    */

}

// 预定义爆炸的帧动画
Boss.explosionImageList = function () {
  let imageList = []
  const EXPLO_IMG_PREFIX = 'images/explosion'
  const EXPLO_FRAME_COUNT = 19
  for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
    imageList.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
  }
  return imageList
}
Boss.frames = AnimationBuilder.initFramesFromPaths(Boss.explosionImageList())