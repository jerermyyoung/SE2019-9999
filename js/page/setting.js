import PageBus from './bus' //引用page选择组件
import Button from '../component/button' //引用button组件
import StateBtn from '../component/statebtn'//引用StateBtn组件
import Music from '../runtime/music'
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
    this.music = new Music()
    this.bg = new Image();
    this.bg.src = 'images/bg.jpg';
    this.boxbg=new Image();
    this.boxbg.src="images/boxbg.png";
    try {
      this.bgmbtn = new StateBtn('', ['images/chose.png', 'images/chosen.png'], (Width + 300) / 2 - 80, 182, 20, 20, 'white', wx.getStorageSync('bgm'));
      this.soundbtn = new StateBtn('', ['images/chose.png', 'images/chosen.png'], (Width + 300) / 2 - 80, 242, 20, 20, 'white', wx.getStorageSync('sound'));
      this.nightbtn = new StateBtn('', ['images/chose.png', 'images/chosen.png'], (Width + 300) / 2 - 80, 302, 20, 20, 'white', wx.getStorageSync('night'));
      this.savebtn = new Button('保存设置', 'images/btn.png', (Width - 200) / 2, 370, 200, 50);
    } catch (e) {
      console.log(e);
      // Do something when catch error
    }
    
    
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
    // console.log('ok')
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
    ctx.drawImage(this.bg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight)
    ctx.drawImage(this.boxbg,(Width-300)/2,50,300,400);
    let tmpsta = ctx.textAlign;
    ctx.textAlign = "center" //文字居中
    ctx.fillText('游戏设置', (Width - 300) / 2+150, 100);
    ctx.textAlign = tmpsta;
    ctx.fillText('背景音乐', (Width - 300) / 2+40, 200);
    this.bgmbtn.render(ctx);
    ctx.fillText('音效', (Width - 300) / 2 + 40, 260);
    this.soundbtn.render(ctx);
    ctx.fillText('夜间模式', (Width - 300) / 2 + 40, 320);
    this.nightbtn.render(ctx);
    this.savebtn.render(ctx);
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
    if(this.bgmbtn.isTapped(x,y)==true)
    {
      this.bgmbtn.changeState();
    }
    else if(this.soundbtn.isTapped(x,y)==true)
    {
      this.soundbtn.changeState();
    }
    else if(this.nightbtn.isTapped(x,y)==true)
    {
      this.nightbtn.changeState();
    }
    else if(this.savebtn.isTapped(x,y)==true)
    {
      //保存设置
      //回到首页
      this.music.setBgmState(this.bgmbtn.state);
      this.music.setSoundState(this.soundbtn.state);
      try {
        wx.setStorageSync('bgm', this.bgmbtn.state);
        wx.setStorageSync('sound', this.soundbtn.state);
        wx.setStorageSync('night', this.nightbtn.state);
      } catch (e) { 
        console.log(e);
      }
      this.remove();
      pagebus.page=0;
    }
  }
}



