import Util from '../common/util'
import Constants from '../common/constants'
import PageBus from '../page/bus' //引用page选择组件
let pagebus = new PageBus();//选择页面的通信
const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/boxbg.png'
let btn = new Image()
btn.src = 'images/btn.png'
//'images/Common.png'
let img1 = new Image();
img1.src = "images/pause1.png"
let img2 = new Image();
img2.src = "images/pause2.png"

const SettingCommands = {
  textList: ['每秒数据更新频率切换', '子弹速度切换', '子弹类型切换', '无敌模式切换', '背景层事件响应切换'],
  commandList: ['switchUpdateRate', 'switchBulletSpeed', 'switchBulletType', 'youAreGod', 'backgroundActive'],
  optionListList: [[60, 6], [10, 60], Constants.Bullet.Types.slice(0, 1), [false, true], [false, true]]
}

export default class GameInfo {
  constructor() {
    this.showGameOver = false
    this.ispaused = false
  }

  onTouchEvent(type, x, y, callback) {
    switch (type) {
      case 'touchstart':
        if (Util.inArea({ x, y }, this.areaSetting)){
          callback({ message: 'pause' })
          let commandIndex
          wx.showActionSheet({
            itemList: SettingCommands.textList,
            success: function (res) {
              commandIndex = res.tapIndex
            },
            complete: function () {
              if (commandIndex !== undefined){
                callback({
                  message: SettingCommands.commandList[commandIndex],
                  optionList: SettingCommands.optionListList[commandIndex]
                })
              }
              callback({ message: 'resume' })
            }
          })
        }
        else if (!this.showGameOver && Util.inArea({ x, y }, this.areaPause)) {
          this.ispaused = !this.ispaused;
          if (this.ispaused) callback({ message: 'pause' })
          else callback({ message: 'resume' })
        }
        else if (this.showGameOver && Util.inArea({ x, y }, this.btnRestart)) {
          callback({ message: 'restart' })
          this.showGameOver = false
          // console.log('restart')
        }
        else if (this.showGameOver && Util.inArea({ x, y }, this.btnReturn)) {
          callback({ message: 'return' })
          this.showGameOver = false
        }
        else if (this.showGameOver && Util.inArea({ x, y }, this.btnmission)) {
          callback({ message: 'returnmission' })
          this.showGameOver = false
        }
        else if (this.ispaused && Util.inArea({ x, y }, this.btnRestart)) {
          callback({ message: 'restart' })
          this.showGameOver = false
          // console.log('restart')
        }
        else if (this.ispaused && Util.inArea({ x, y }, this.btnReturn)) {
          callback({ message: 'return' })
          this.showGameOver = false
        }
        else if (this.ispaused && Util.inArea({ x, y }, this.btnmission)) {
          callback({ message: 'returnmission' })
          this.showGameOver = false
        }
        else if (this.ispaused && Util.inArea({ x, y }, this.btnContinue)) {
          this.ispaused = !this.ispaused;
          callback({ message: 'resume' })
        }
        

        
        break
    }
  }
  renderPause(ctx)
  {
    
    // ctx.drawImage(img,screenWidth/2-20,5,40,40);

    // this.areaPause = {
    //   startX: screenWidth / 2 - 20,
    //   startY: 5,
    //   endX: screenWidth / 2 + 20,
    //   endY: 45
    // }
    if(this.ispaused==true)ctx.drawImage(img1, 10, screenHeight-50, 40, 40);
    else ctx.drawImage(img2, 10, screenHeight - 50, 40, 40);

    this.areaPause = {
      startX: 10,
      startY: screenHeight - 50,
      endX: 50,
      endY: screenHeight - 10
    }

    if(this.ispaused==true)//已暂停
    {
      pagebus.ctx.textAlign = "center";//文字居中
      ctx.fillStyle = "rgb(0,0,0,0.5)";
      ctx.fillRect(0, 0, screenWidth, screenHeight)
      ctx.fillStyle = "#ffffff";

      //绘制
      ctx.drawImage(atlas, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)
      //ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)

      ctx.fillStyle = "#000000"
      ctx.font = "16px Arial"

      // const grd = ctx.createLinearGradient(0, screenHeight / 2 - 90, 0, screenHeight / 2 - 100)
      // grd.addColorStop(0, '#f64f59')
      // grd.addColorStop(0.5, '#c471ed')
      // grd.addColorStop(1, '#12c2e9')
      // ctx.fillStyle=grd;
      ctx.fillText(
        '游戏暂停',
        screenWidth / 2 ,
        screenHeight / 2 -100
      )
      ctx.fillStyle = "#000000"

      // ctx.fillText(
      //   '得分: ' + score,
      //   screenWidth / 2 - 40,
      //   screenHeight / 2 - 100 + 0
      // )
      ctx.drawImage(
        btn,
        screenWidth / 2 - 60,
        screenHeight / 2 -50,
        120, 40
      )

      ctx.fillText(
        '继续游戏',
        screenWidth / 2,
        screenHeight / 2 - 25
      )

      ctx.drawImage(
        btn,
        screenWidth / 2 - 60,
        screenHeight / 2 ,
        120, 40
      )

      ctx.fillText(
        '重新开始',
        screenWidth / 2,
        screenHeight / 2 + 25
      )

      ctx.drawImage(
        btn,
        screenWidth / 2 - 60,
        screenHeight / 2 + 50,
        120, 40
      )

      ctx.fillText(
        '返回主页',
        screenWidth / 2,
        screenHeight / 2 + 75
      )

      ctx.drawImage(
        btn,
        screenWidth / 2 - 60,
        screenHeight / 2 + 100,
        120, 40
      )

      ctx.fillText(
        '选择关卡',
        screenWidth / 2,
        screenHeight / 2 + 125
      )

      /**
       * 重新开始按钮区域
       * 方便简易判断按钮点击
       */
      this.btnContinue = {
        startX: screenWidth / 2 - 40,
        startY: screenHeight / 2 -50,
        endX: screenWidth / 2 + 50,
        endY: screenHeight / 2 - 10
      }

      this.btnRestart = {
        startX: screenWidth / 2 - 40,
        startY: screenHeight / 2 ,
        endX: screenWidth / 2 + 50,
        endY: screenHeight / 2 + 40
      }

      this.btnReturn = {
        startX: screenWidth / 2 - 40,
        startY: screenHeight / 2 + 50,
        endX: screenWidth / 2 + 50,
        endY: screenHeight / 2 + 90
      }

      this.btnmission = {
        startX: screenWidth / 2 - 40,
        startY: screenHeight / 2 + 100,
        endX: screenWidth / 2 + 50,
        endY: screenHeight / 2 + 140
      }
      pagebus.ctx.textAlign = "left";//
    }
  }
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    //visualize area boundary
    // ctx.drawImage(
    //   atlas,
    //   202, 6, 39, 24,
    //   10, 10,
    //   28, 25
    // )

    //candidate icons: ⏲⏱⏰⏳🏹🏆🏅🙌👾👁🐲👹😎☏✧☟😘🎈🎊⚙❤🐷💥👁‍🗨💬🔄💠㊙💦🍙🍒💎
    ctx.fillText(
      '🏅 ' + score, //设定图标
      10, 10 + 20
    )

    this.areaSetting = {
      startX: 10,
      startY: 10,
      endX: 10 + 28, //ctx.font = '20px Arial'
      endY: 10 + 25
    }
  }

  renderGameOver(ctx, score) {
    pagebus.ctx.textAlign = "center";//文字居中
    ctx.fillStyle = "rgb(0,0,0,0.5)";
    ctx.fillRect(0, 0, screenWidth, screenHeight)
    ctx.fillStyle = "#ffffff";
    this.showGameOver = true
    //ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)
    ctx.drawImage(atlas, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)
    ctx.fillStyle = "#000000"
    ctx.font    = "16px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 ,
      screenHeight / 2 - 100 
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 ,
      screenHeight / 2 - 60
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 -20,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 ,
      screenHeight / 2 +5
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 +30,
      120, 40
    )

    ctx.fillText(
      '返回主页',
      screenWidth / 2 ,
      screenHeight / 2 +55
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 +80,
      120, 40
    )

    ctx.fillText(
      '选择关卡',
      screenWidth / 2 ,
      screenHeight / 2 +105
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnRestart = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 20,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 +20
    }

    this.btnReturn = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 +30,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2+70
    }

    this.btnmission = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 +80,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 +120
    }
    pagebus.ctx.textAlign = "left";//文字
  }
}

