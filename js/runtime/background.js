import Sprite from '../base/sprite'
import Constants from '../common/constants'
import PageBus from '../page/bus'
let pagebus = new PageBus()

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

var BG_IMG_SRC = ['images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg', 'images/bg4.jpg']
const BG_WIDTH     = 512
const BG_HEIGHT    = 512

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC[pagebus.world], BG_WIDTH, BG_HEIGHT)

    this.render(ctx)

    this.top = 0
  }

  onTouchEvent(type, x, y, callback) {
    //nop
  }

  update() {
    this.top += Constants.Background.Speed

    if ( this.top >= screenHeight )
      this.top = 0
  }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      -screenHeight + this.top,
      screenWidth,
      screenHeight
    )

    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      this.top,
      screenWidth,
      screenHeight
    )
  }
}
