import PageBus from './bus' //引用page选择组件
import Button from '../component/button'
let pagebus = new PageBus();//选择页面的通信
let ctx = pagebus.ctx;

const systemInfo = wx.getSystemInfoSync()
const Width = systemInfo.windowWidth;
const Height = systemInfo.windowHeight;

export default class Template {
  constructor() {
    this.restart();//初始重置
    /******************
     * 初始化UI控件。
    *******************/
    this.bg = new Image();
    this.bg.src = 'images/bg.jpg';
    this.boxbg = new Image();
    this.boxbg.src = "images/boxbg.png";
    this.mission = new Array();
    for(var i=0;i<4;i++)
    {
      for (var j=0;j<3;j++)
      {
        console.log(i*3+j)
        var newmission;
        if(i*3+j==0)newmission = new Button(i*3+j+1, 'images/btn.png',Width/2+j*70-100,200+70*i,60,60);
        else newmission = new Button(i * 3 + j + 1, 'images/btn3.png', Width / 2 + j * 70 - 100, 200 + 70 * i, 60, 60);
        this.mission.push(newmission);
      }   
    }
    this.returnbtn = new Button('选择世界', 'images/btn.png', (Width - 100) / 2, 470, 100, 50);
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
    ctx.fillText('选择关卡', Width / 2, 120)
    ctx.font = '16px Arial';
    for(var i=0;i<4;i++)
    {
      for(var j=0;j<3;j++)
      {
        this.mission[i*3+j].render(ctx);
      }
    }
    this.returnbtn.render(ctx);
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
     if(this.mission[0].isTapped(x,y)==true)
     {
       this.remove();
       pagebus.mission=1;
       pagebus.page=1;
     }
     else if(this.returnbtn.isTapped(x,y)==true)
     {
       this.remove();
       pagebus.page=3;
     }
  }
}



