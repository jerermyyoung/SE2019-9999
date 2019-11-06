import PageBus from './bus' //引用page选择组件
import Button from '../component/button'
let pagebus = new PageBus();//选择页面的通信
let ctx = pagebus.ctx;

const systemInfo = wx.getSystemInfoSync()
const Width = systemInfo.windowWidth;
const Height = systemInfo.windowHeight;

var introcontext = canvas.getContext('2d')

export default class Template {
  constructor(b) {
    this.restart();//初始重置
    /******************
     * 初始化UI控件。
    *******************/
    this.achievepoint = b //记录存储状态
    this.bg = new Image();
    this.bg.src = 'images/bg.jpg';
    this.boxbg = new Image();
    this.boxbg.src = "images/boxbg.png";
    this.word1 = new Button('孜孜不倦', 'images/bg.jpg', Width / 2 - 90, 160, 80, 80);
    //玩游戏次数达到n次
    this.word2 = new Button('通关达人', 'images/bg.jpg', Width / 2 + 10, 160, 80, 80);
    //通了多少多少关
    this.word3 = new Button('输出机器', 'images/bg.jpg', Width / 2 - 90, 250, 80, 80);
    //击落了n架飞机
    this.word4 = new Button('富可敌国', 'images/bg.jpg', Width / 2 + 10, 250, 80, 80);
    //拥有很多很多金钱
    this.returnbtn = new Button('返回主页', 'images/btn.png', (Width - 100) / 2, 470, 100, 50);
    this.text1 = new Button('点击上面的成就名字，', '', Width / 2 - 110, 340, 200, 50);
    this.text2 = new Button('会显示成就的具体内容', '', Width / 2 - 110, 390, 200, 50);
    this.text3 = new Button('', '', Width / 2 - 110, 430, 200, 50);
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
    ctx.drawImage(this.boxbg, (Width - 300) / 2, 50, 300, 500);
    ctx.font = '30px Arial';
    ctx.fillText('成就', Width / 2, 120)
    ctx.font = '16px Arial';
    this.word1.render(ctx);
    this.word2.render(ctx);
    this.word3.render(ctx);
    this.word4.render(ctx);
    this.returnbtn.render(ctx);
    this.text1.render(ctx);
    this.text2.render(ctx);
    this.text3.render(ctx);
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
  }


  showIntroduction(x) {
    introcontext.clearRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.fillStyle = 'white'
    introcontext.fillRect(canvas.width * 0.1, canvas.height * 0.82, canvas.width * 0.8, canvas.height * 0.08)
    introcontext.font = "16px Arial"
    introcontext.fillStyle = "black"
    switch (x) {
      case 1: {
        this.text1 = new Button('孜孜不倦：', '', Width / 2 - 110, 340, 200, 50);
        this.text2 = new Button('累积玩游戏100次', '', Width / 2 - 110, 390, 200, 50);
        this.text3 = new Button('未获得', '', Width / 2 - 110, 430, 200, 50);
        break;
      }
      case 2: {
        this.text1 = new Button('通关达人：', '', Width / 2 - 110, 340, 200, 50);
        this.text2 = new Button('累积通过50关', '', Width / 2 - 110, 390, 200, 50);
        this.text3 = new Button('未获得', '', Width / 2 - 110, 430, 200, 50);
        break;
      }
      case 3: {
        this.text1 = new Button('输出机器：', '', Width / 2 - 110, 340, 200, 50);
        this.text2 = new Button('累积击落500架敌机', '', Width / 2 - 110, 390, 200, 50);
        this.text3 = new Button('未获得', '', Width / 2 - 110, 430, 200, 50);
        break;
      }
      case 4: {
        this.text1 = new Button('富可敌国：', '', Width / 2 - 110, 340, 200, 50);
        this.text2 = new Button('累积获得20000金币', '', Width / 2 - 110, 390, 200, 50);
        this.text3 = new Button('未获得', '', Width / 2 - 110, 430, 200, 50);
        break;
      }
    
    }
  }

}



