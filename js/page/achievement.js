import PageBus from './bus' //引用page选择组件
import Button from '../component/button'
import Store from './store'
let pagebus = new PageBus();//选择页面的通信
let ctx = pagebus.ctx;

const systemInfo = wx.getSystemInfoSync()
const Width = systemInfo.windowWidth;
const Height = systemInfo.windowHeight;

let mystore
try {
  mystore = new Store(wx.getStorageSync('userstore'))
}
catch (e) {
  console.log(e)
}

var introcontext = canvas.getContext('2d')

export default class Template {
  constructor(b) {
    this.restart();//初始重置
    /******************
     * 初始化UI控件。
    *******************/
    
    this.storepoint = b //记录存储状态
    this.moneydata = this.storepoint.howMuchSummoney()
    this.numdata = this.storepoint.howMuchNum()
    this.outputdata = this.storepoint.howMuchOutput()
    this.leveldata = this.storepoint.howMuchLevel()
    this.shootdata = this.storepoint.howMuchShoot()
    this.lastshootdata = this.storepoint.howMuchLastshoot()

    this.bg = new Image();
    this.bg.src = 'images/achbg.jpg';
    this.boxbg = new Image();
    //this.boxbg.src = "images/boxbg.png";
    this.word1 = new Button('孜孜不倦', 'images/bg.jpg', Width / 2 - 80, 100, 60, 60);
    //玩游戏次数达到n次    //四个数字分别表示左边开始的位置，上面开始的位置，左右大小，上下大小
    this.word2 = new Button('', 'images/ach3.jpg', Width / 2 - 150, 100, 60, 60);
    //玩游戏次数达到n次 
    this.word3 = new Button('孜孜不倦', 'images/bg.jpg', Width / 2 - 10, 100, 60, 60);
    //玩游戏次数达到n次 
    this.word10 = new Button('孜孜不倦', 'images/bg.jpg', Width / 2 + 60, 100, 60, 60);
    //玩游戏次数达到n次 
    this.word4 = new Button('输出机器', 'images/bg.jpg', Width / 2 - 80, 180, 60, 60);
    //击落很多飞机
    this.word5 = new Button('输出机器', 'images/bg.jpg', Width / 2 -10, 180, 60, 60);
    //击落很多飞机
    this.word6 = new Button('', 'images/ach2.jpg', Width / 2 - 150, 180, 60, 60);
    //击落很多飞机
    this.word11 = new Button('输出机器', 'images/bg.jpg', Width / 2 + 60, 180, 60, 60);
    //击落很多飞机
    this.word7 = new Button('富可敌国', 'images/bg.jpg', Width / 2 - 80, 250, 60, 60);
    //拥有很多很多金钱
    this.word8 = new Button('富可敌国', 'images/bg.jpg', Width / 2 -10, 250, 60, 60);
    //拥有很多很多金钱
    this.word9 = new Button('', 'images/ach1.jpg', Width / 2 - 150, 250, 60, 60);
    //拥有很多很多金钱
    this.word12 = new Button('富可敌国', 'images/bg.jpg', Width / 2 + 60, 250, 60, 60);
    //拥有很多很多金钱
    this.returnbtn = new Button('返回主页', 'images/btn.png', (Width - 100) / 2, 480, 100, 50);
    this.text1 = new Button('点击上面的成就名字，', '', Width / 2 - 110, 340, 200, 50);
    this.text2 = new Button('会显示成就的具体内容', '', Width / 2 - 110, 390, 200, 50);
    this.text3 = new Button('', '', Width / 2 - 110, 430, 200, 50);
    this.text4 = new Button('', '', Width / 2 - 110, 430, 200, 50);
    this.text5 = new Button('', '', Width / 2 - 110, 430, 200, 50);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height) //清除矩形
    /*********************
     * 在canvas上画图
     *******************/
    ctx.drawImage(this.bg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    ctx.drawImage(this.boxbg, (Width - 400) / 2, 50, 400, 500);
    ctx.font = '30px Arial';
    ctx.fillText('成就', Width / 2, 70)
    ctx.font = '16px Arial';
    this.word1.render(ctx);
    this.word2.render(ctx);
    this.word3.render(ctx);
    this.word4.render(ctx);
    this.word5.render(ctx);
    this.word6.render(ctx);
    this.word7.render(ctx);
    this.word8.render(ctx);
    this.word9.render(ctx);
    this.word10.render(ctx);
    this.word11.render(ctx);
    this.word12.render(ctx);
    this.returnbtn.render(ctx);
    this.text1.render(ctx);
    this.text2.render(ctx);
    this.text3.render(ctx);
    this.text4.render(ctx);
    this.text5.render(ctx);
  }
  touchEventHandler(e)//触屏检测，触发相应事件
  {
    e.preventDefault()
    let [x, y] = (e.type == 'touchstart' || e.type == 'touchmove') ?
      [e.touches[0].clientX, e.touches[0].clientY] : [null, null]

    /******************
     * 拿到了触屏点击的坐标(x,y)和类型{touchstart或者touchmove或者touchend}
     * 检测每个控件是否被点击，并触发相应的事件。
     *******************/
    if (this.returnbtn.isTapped(x, y) == true) {
      this.remove();
      pagebus.page = 0;
    }

    else if (this.word1.isTapped(x, y) == true) {
      //pagebus.world = 1;
      //this.remove();
      //pagebus.page = 1;
      this.showIntroduction(1);
    }
    else if (this.word2.isTapped(x, y) == true) {
      this.showIntroduction(2);
    }
    else if (this.word3.isTapped(x, y) == true) {
      this.showIntroduction(3);
    }
    else if (this.word4.isTapped(x, y) == true) {
      this.showIntroduction(4);
    }
    else if (this.word5.isTapped(x, y) == true) {
      this.showIntroduction(5);
    }
    else if (this.word6.isTapped(x, y) == true) {
      this.showIntroduction(6);
    }
    else if (this.word7.isTapped(x, y) == true) {
      this.showIntroduction(7);
    }
    else if (this.word8.isTapped(x, y) == true) {
      this.showIntroduction(8);
    }
    else if (this.word9.isTapped(x, y) == true) {
      this.showIntroduction(9);
    }
    else if (this.word10.isTapped(x, y) == true) {
      this.showIntroduction(10);
    }
    else if (this.word11.isTapped(x, y) == true) {
      this.showIntroduction(11);
    }
    else if (this.word12.isTapped(x, y) == true) {
      this.showIntroduction(12);
    }
  }


  showIntroduction(x) {
    introcontext.clearRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.fillStyle = 'white'
    introcontext.fillRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.font = "16px Arial"
    introcontext.fillStyle = "black"
    
    this.numdata = this.storepoint.howMuchNum()
    this.outputdata = this.storepoint.howMuchOutput()
    this.leveldata = this.storepoint.howMuchLevel()
    this.moneydata = this.storepoint.howMuchSummoney()
    this.shootdata = this.storepoint.howMuchShoot()
    this.lastshootdata = this.storepoint.howMuchLastshoot()

    switch (x) {
      case 1: {
        this.text1 = new Button('孜孜不倦：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积玩游戏5次', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：',  '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.numdata, '', Width / 2-20, 400, 100, 30);
        if(this.numdata >= 5){
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else{
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }
      case 2: {
        this.text1 = new Button('孜孜不倦：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积玩一定次数的游戏', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.numdata, '', Width / 2 - 20, 400, 100, 30);
        this.text5 = new Button('', '', Width / 2 - 110, 430, 200, 30);
        break;
      }
      case 3: {
        this.text1 = new Button('孜孜不倦：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积玩游戏20次', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.numdata, '', Width / 2 - 20, 400, 100, 30);
        if (this.numdata >= 20) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }
      case 10: {
        this.text1 = new Button('孜孜不倦：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积玩游戏100次', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.numdata, '', Width / 2 - 20, 400, 100, 30);
        if (this.numdata >= 100) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }
      case 4: {
        this.text1 = new Button('输出机器：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积击落20架敌机', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.outputdata, '', Width / 2 - 20, 400, 100, 30);
        if (this.outputdata >= 20) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }
     
      case 5: {
        this.text1 = new Button('输出机器：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积击落100架敌机', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.outputdata, '', Width / 2 - 20, 400, 100, 30);
        if (this.outputdata >= 100) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }

      case 6: {
        this.text1 = new Button('输出机器：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积击落一定数量的敌机', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.outputdata, '', Width / 2 - 20, 400, 100, 30);
        this.text5 = new Button('', '', Width / 2 - 110, 430, 200, 30);
        break;
      }
      
      case 11: {
        this.text1 = new Button('输出机器：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积击落500架敌机', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.outputdata, '', Width / 2 - 20, 400, 100, 30);
        if (this.outputdata >= 500) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }

      case 7: {
        this.text1 = new Button('富可敌国：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积获得2000金币', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.moneydata, '', Width / 2 - 20, 400, 100, 30);
        if (this.moneydata >= 2000) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }

      case 8: {
        this.text1 = new Button('富可敌国：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积获得10000金币', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.moneydata, '', Width / 2 - 20, 400, 100, 30);
        if (this.moneydata >= 10000) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }

      case 9: {
        this.text1 = new Button('富可敌国：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积获得一定数量的金币', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.moneydata, '', Width / 2 - 20, 400, 100, 30);
        this.text5 = new Button('', '', Width / 2 - 110, 430, 200, 30);
        break;
      }

      case 12: {
        this.text1 = new Button('富可敌国：', '', Width / 2 - 110, 340, 200, 30);
        this.text2 = new Button('累积获得20000金币', '', Width / 2 - 110, 370, 220, 30);
        this.text3 = new Button('实际完成：', '', Width / 2 - 70, 400, 100, 30);
        this.text4 = new Button(this.moneydata, '', Width / 2 - 20, 400, 100, 30);
        if (this.moneydata >= 20000) {
          this.text5 = new Button('已完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        else {
          this.text5 = new Button('未完成该成就', '', Width / 2 - 110, 430, 200, 30);
        }
        break;
      }
    }
  }

}

/*
//存入缓存
if (this.back.isTapped(x, y) == true) {
      this.remove();
      try {
        wx.setStorageSync("userstore", this.storepoint)
      } catch (e) {
        console.log(e);
      }
      pagebus.page = 0;
    }
*/

