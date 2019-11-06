import DataBus from '../databus'
import Button from '../component/button' //引用button组件
import PageBus from './bus' //引用page选择组件
let databus = new DataBus()//运行游戏的数据交互，暂时用不到
let pagebus = new PageBus();//选择页面的通信
let ctx = pagebus.ctx;

const systemInfo = wx.getSystemInfoSync()
const Width=systemInfo.windowWidth;
const Height=systemInfo.windowHeight;


export default class Index {
  constructor() {
    this.restart();
    this.title=new Image();
    this.title.src='images/title.png';
    this.bg=new Image();
    this.bg.src='images/bg.jpg';
    this.startbtn=new Button('开始游戏','images/btn.png',(Width-200)/2,250,200,50);
    this.settingbtn = new Button('游戏设置', 'images/btn.png', (Width - 200) / 2, 310, 200, 50);
    this.helpbtn = new Button('帮助', 'images/btn.png', (Width - 200) / 2, 370, 200, 50);
    this.shopbtn = new Button('商店', 'images/btn2.png', (Width - 200) / 2 +15, 450, 60, 60 , 'white')
    this.achievebtn = new Button('成就', 'images/btn2.png', (Width + 200) / 2 - 75 , 450, 60, 60)
  }
  restart()
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
    // console.log('ok')
  }
  loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    window.cancelAnimationFrame(this.aniId);
    this.render();
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  render()
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height) //清除矩形
    // ctx.drawImage(img, 0, 0, systemInfo.windowWidth,systemInfo.windowHeight)
    // console.log(systemInfo.windowWidth)
    // ctx.fillStyle = '#ffffff' // 矩形颜色
    // ctx.fillRect(0, 0, Width, Height) // 矩形左上角顶点为(0, 0)
    ctx.drawImage(this.bg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight)
    ctx.drawImage(this.title, 0, 80, systemInfo.windowWidth, systemInfo.windowHeight/3)
    this.startbtn.render(ctx);
    this.settingbtn.render(ctx);
    this.helpbtn.render(ctx);
    this.shopbtn.render(ctx);
    this.achievebtn.render(ctx);
  }
  touchEventHandler(e) {
    e.preventDefault()
    let [x, y] = (e.type == 'touchstart' || e.type == 'touchmove') ?
      [e.touches[0].clientX, e.touches[0].clientY] : [null, null]
    if(this.startbtn.isTapped(x,y)==true)//开始游戏
    {
      // console.log(true);
      this.remove();
      // pagebus.showpage(1);
      pagebus.page=3;//选择世界
    }
    else if(this.settingbtn.isTapped(x,y)==true)//游戏设置
    {
      // console.log(true);
      this.remove();
      pagebus.page=2;
    }
    else if (this.achievebtn.isTapped(x, y) == true)//成就
    {
      // console.log(true);
      this.remove();
      pagebus.page = 5;
    }
    else if (this.shopbtn.isTapped(x, y) == true)//商店
    {
      // console.log(true);
      this.remove();
      pagebus.page = 6;
    }
  }
}



