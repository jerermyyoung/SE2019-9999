import Util from '../common/util'
import Constants from '../common/constants'
import PageBus from '../page/bus' //引用page选择组件
import DataBus from '../databus'
import Store from '../page/store'
let databus = new DataBus();
let pagebus = new PageBus();//选择页面的通信
const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight
let mystore
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
    try {
      mystore = new Store(wx.getStorageSync('userstore'))
    }
    catch (e) {
      console.log(e)
    }
    this.showGameOver = false
    this.showGameWin = false
    this.showGameRelive=false
    this.ispaused = false
    this.iswin=false
    this.tools = new Array();
    for (var i = 0; i < 6; i++)//0 复活卡，1无敌卡，2轰炸卡，3加速卡，4补充卡，5无限卡
    {
      var x=new Image();
      x.src ='images/shop_img_'+i+'.png';
      this.tools.push(x);
    }
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
        else if (!this.showGameRelive&&!this.showGameOver &&!this.showGameWin && Util.inArea({ x, y }, this.areaPause)) {
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
        else if (this.showGameOver && Util.inArea({ x, y }, this.btnShare)) {
          callback({ message: 'share' })
          this.showGameWin = false
        }
        else if (this.showGameWin && Util.inArea({ x, y }, this.btnmission)) {
          callback({ message: 'returnmission' })
          this.showGameWin = false
        }
        else if (this.showGameWin && Util.inArea({ x, y }, this.btnReturn)) {
          callback({ message: 'return' })
          this.showGameWin = false
        }
        else if (this.showGameWin && Util.inArea({ x, y }, this.btnnext)) {
          if(pagebus.mission!=11)callback({message:'nextmission'})
          this.showGameWin = false
        }
        else if (this.showGameWin && Util.inArea({ x, y }, this.btnShare)){
          callback({ message: 'share' })
          this.showGameWin = false
        }
        else if (this.showGameRelive && Util.inArea({ x, y }, this.btnYes))
        {
          callback({message: 'relive'});//复活
          this.showGameRelive=false;
        }
        else if (this.showGameRelive && Util.inArea({ x, y }, this.btnNo)) {
          callback({ message: 'giveup' });//不复活
          this.showGameRelive = false;
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
        else {
          for(var i=1;i<6;i++){
            if (Util.inArea({ x, y }, {
            startX: 5,
            startY: screenHeight / 2 - 140 + i * 45,
            endX: 45, 
            endY: screenHeight / 2 - 140 + i * 45+40
            }))
            {
            //使用第i号道具
            callback({ message: 'tool'+i })
            
            break;
            }
          }
          if(Util.inArea({x,y},{
            startX: screenWidth - 60,
            startY: screenHeight - 250,
            endX: screenWidth,
            endY: screenHeight - 190
          }))
          {
            //使用大招
            callback({ message: 'ultraSkill' })
          }
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
    if (this.ispaused == true) ctx.drawImage(img1, 10, screenHeight - 50, 40, 40);
    else ctx.drawImage(img2, 10, screenHeight - 50, 40, 40);

    this.areaPause = {
      startX: 10,
      startY: screenHeight - 50,
      endX: 50,
      endY: screenHeight - 10
    }

    if (this.ispaused == true)//已暂停
    {
      pagebus.ctx.textAlign = "center";//文字居中
      ctx.fillStyle = "rgb(0,0,0,0.5)";
      ctx.fillRect(0, 0, screenWidth, screenHeight)
      ctx.fillStyle = "#ffffff";

      //绘制
      ctx.drawImage(atlas, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)
      //ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)

      ctx.fillStyle = "#000000"
      
      ctx.font = '20px Arial';
      // const grd = ctx.createLinearGradient(0, screenHeight / 2 - 90, 0, screenHeight / 2 - 100)
      // grd.addColorStop(0, '#f64f59')
      // grd.addColorStop(0.5, '#c471ed')
      // grd.addColorStop(1, '#12c2e9')
      // ctx.fillStyle=grd;
      ctx.fillText(
        '游戏暂停',
        screenWidth / 2,
        screenHeight / 2 - 80
      )
      ctx.font = "16px Arial"
      ctx.fillStyle = "#000000"

      // ctx.fillText(
      //   '得分: ' + score,
      //   screenWidth / 2 - 40,
      //   screenHeight / 2 - 100 + 0
      // )
      ctx.drawImage(
        btn,
        screenWidth / 2 - 60,
        screenHeight / 2 - 50,
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
        screenHeight / 2,
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
        startY: screenHeight / 2 - 50,
        endX: screenWidth / 2 + 50,
        endY: screenHeight / 2 - 10
      }

      this.btnRestart = {
        startX: screenWidth / 2 - 40,
        startY: screenHeight / 2,
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
  renderTools(ctx)
  {
    try {
      mystore = new Store(wx.getStorageSync('userstore'))
    }
    catch (e) {
      console.log(e)
    }
    ctx.fillStyle="white";
    ctx.fillRect(0,screenHeight/2-150,60,290)
    ctx.fillStyle="black";
    for(var i=0;i<6;i++)
    {
      ctx.drawImage(this.tools[i],5,screenHeight/2-140+i*45,40,40);
      ctx.font = "14px Arial"
      ctx.fillText('' + mystore.mycards[i], 50, screenHeight / 2 - 100 + i * 45);
      ctx.font = "16px Arial"
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

  renderUltraSkillIcon(ctx,currentMP,mpinf){
    var x1=new Image();
    x1.src='images/btnUltra.png';
    var x2=new Image();
    x2.src='images/btnUltraNot.png';

    if(currentMP==100 || mpinf==true){
      ctx.drawImage(x1,screenWidth-60,screenHeight-250,60,60);
    }
    else{
      ctx.drawImage(x2,screenWidth-60,screenHeight-250,60,60);
    }
  }

  renderPlayerStatus(ctx, currentHP,currentMP,hpinf,mpinf) {
    ctx.fillStyle = "#ff0000"
    ctx.font      = "20px Arial"

    if(hpinf==false)ctx.fillText(
      '❤ ' + currentHP, //设定图标
      10, 
      10 + 20 + 10 + 20
    )
    else ctx.fillText(
      '❤ ' + '无敌', //设定图标
      10,
      10 + 20 + 10 + 20
    )
    /*血条的简单实现
    ctx.fillRect(80, 45, 80*(currentHP/100), 15)//尚未import玩家类，此时默认最大血量为100
    ctx.strokeRect(80,45,80,15)
    */

    ctx.fillStyle = "#0000ff"
    ctx.font      = "20px Arial"
    if(mpinf==false)ctx.fillText(
      '💠 ' + currentMP, //设定图标
      10, 
      10 + 20 + 10 + 20 + 10 + 20
    )
    else ctx.fillText(
      '💠 无限' , //设定图标
      10,
      10 + 20 + 10 + 20 + 10 + 20
    )

    /*蓝条的简单实现
    ctx.fillRect(80, 75, 80*(currentMP/100), 15)//尚未import玩家类，此时默认最大蓝量为100
    ctx.strokeRect(80,75,80,15)
    */
   
    this.areaSetting = {
      startX: 10,
      startY: 10,
      endX: 10 + 28, //ctx.font = '20px Arial'
      endY: 10 + 25
    }
  }
  renderRelive(ctx,cards)//是否复活
  {
    if(cards<=0)return ;
    this.showGameRelive = true;
    pagebus.ctx.textAlign = "center";//文字居中
    ctx.fillStyle = "rgb(0,0,0,0.5)";
    ctx.fillRect(0, 0, screenWidth, screenHeight)
    ctx.fillStyle = "#ffffff";
    ctx.drawImage(atlas, screenWidth / 2 - 200, screenHeight / 2 - 200, 400, 200)
    ctx.fillStyle = "#000000"
    ctx.font = "20px Arial"
    ctx.fillText(
      '提示',
      screenWidth / 2,
      screenHeight / 2 - 120
    )
    ctx.font = "16px Arial"
    ctx.fillText('您有'+cards+'张复活卡，是否要使用?',screenWidth/2,screenHeight/2-90)
    ctx.drawImage(
      btn,
      screenWidth / 2 - 30-50,//-30
      screenHeight / 2 - 75,
      60, 40
    )
    ctx.fillText(
      '是',
      screenWidth / 2-50,
      screenHeight / 2-50
    )
    ctx.drawImage(
      btn,
      screenWidth / 2 - 30 + 50,//-30
      screenHeight / 2 - 75,
      60, 40
    )
    ctx.fillText(
      '否',
      screenWidth / 2 + 50,
      screenHeight / 2 - 50
    )
    this.btnYes = {
      startX: screenWidth / 2 - 80,
      startY: screenHeight / 2 - 75,
      endX: screenWidth / 2 -20,
      endY: screenHeight / 2 - 35
    }

    this.btnNo = {
      startX: screenWidth / 2 +20,
      startY: screenHeight / 2 - 75,
      endX: screenWidth / 2 + 80,
      endY: screenHeight / 2 - 35
    }
    pagebus.ctx.textAlign = "left";//文字
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

    ctx.font = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2,
      screenHeight / 2 - 90
    )
    ctx.font = "16px Arial"

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2,
      screenHeight / 2 - 60
    )

    ctx.fillText(
      '获得金钱: ' + score * 10,
      screenWidth / 2,
      screenHeight / 2 - 30
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 - 25,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2,
      screenHeight / 2
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 + 25,
      120, 40
    )

    ctx.fillText(
      '选择关卡',
      screenWidth / 2,
      screenHeight / 2 + 50
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 + 75,
      120, 40
    )

    ctx.fillText(
      '返回主页',
      screenWidth / 2,
      screenHeight / 2 + 100
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 + 125,
      120, 40
    )

    ctx.fillText(
      '分享群聊',
      screenWidth / 2,
      screenHeight / 2 + 150
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnRestart = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 30,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 15
    }

    this.btnReturn = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 20,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 65
    }

    this.btnmission = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 70,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 115
    }

    this.btnShare = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 120,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 165
    }

    pagebus.ctx.textAlign = "left";//文字
  }
  renderGameWin(ctx, score) {
    pagebus.ctx.textAlign = "center";//文字居中
    ctx.fillStyle = "rgb(0,0,0,0.5)";
    ctx.fillRect(0, 0, screenWidth, screenHeight)
    ctx.fillStyle = "#ffffff";
    this.showGameWin= true
    //ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)
    ctx.drawImage(atlas, screenWidth / 2 - 150, screenHeight / 2 - 200, 300, 400)
    ctx.fillStyle = "#000000"
    ctx.font = "20px Arial"

    ctx.fillText(
      '游戏胜利',
      screenWidth / 2,
      screenHeight / 2 - 90
    )
    ctx.font = "16px Arial"
    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2,
      screenHeight / 2 - 60
    )

    ctx.fillText(
      '获得金钱: ' + score * 10,
      screenWidth / 2,
      screenHeight / 2 - 30
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 - 25,
      120, 40
    )
    if(pagebus.mission==11)
    {
      ctx.fillText(
        '已通关',
        screenWidth / 2,
        screenHeight / 2
      )
    }
    else ctx.fillText(
      '下一关',
      screenWidth / 2,
      screenHeight / 2 
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 + 25,
      120, 40
    )

    ctx.fillText(
      '选择关卡',
      screenWidth / 2,
      screenHeight / 2 + 50
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 + 75,
      120, 40
    )

    ctx.fillText(
      '返回主页',
      screenWidth / 2,
      screenHeight / 2 + 100
    )

    ctx.drawImage(
      btn,
      screenWidth / 2 - 60,
      screenHeight / 2 + 125,
      120, 40
    )

    ctx.fillText(
      '分享群聊',
      screenWidth / 2,
      screenHeight / 2 + 150
    )


    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnnext = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 30,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 15
    }

    this.btnmission = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 20,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 65
    }

    this.btnReturn = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 70,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 115
    }

    this.btnShare = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 + 120,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 + 165
    }

    pagebus.ctx.textAlign = "left";//文字
  }
}

