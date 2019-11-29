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
    this.returnbtn = new Button('返回', 'images/btn.png', (Width - 100) / 2, 480, 100, 50);
    this.showpage=0;
    this.nextbtn = new Button('下一页', 'images/btn.png', (Width - 100) / 2, 480, 100, 50);
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
  drawtextx(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      if(str[i]=='\n')
      {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 22; //22为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
        continue;
      }
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 22; //22为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  }
  render()//渲染函数
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height) //清除矩形
    /*********************
     * 在canvas上画图
     *******************/
    ctx.drawImage(this.bg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight)
    ctx.drawImage(this.boxbg, (Width - 400) / 2, 50, 400, 500);
    let tmpsta = ctx.textAlign;
    ctx.textAlign = "center" //文字居中
    ctx.font = '20px Arial';
    ctx.fillText('游戏帮助', (Width) / 2 , 180);
    ctx.font = '16px Arial';
    ctx.textAlign = "left";//文字靠左
    if(this.showpage==0)this.drawtextx(ctx,'    本游戏是由“总是被精锐打”小组完成的飞机大战，操作简便，具有不同的世界、关卡和模式。\n    点击开始游戏后，选择世界，选择关卡，便可进入游戏。按住飞机进行移动，躲避敌机。击落运输机，获得子弹威力提升。触碰敌机或被敌机子弹攻击到会扣除生命值，生命值耗尽则游戏结束。',Width/2-100,220,220,200);
    else if (this.showpage == 1) this.drawtextx(ctx, '    除了有HP机制外，还有MP机制。当能量达到一定值时，可以释放必杀技。更有紧张刺激的boss战，和休闲娱乐的割草模式。\n    通过当前关卡，可以解锁下一关；也可以通过在商城购买关卡，直接解锁后续关卡。\n    商城系统中，可以解锁后续关卡，后者购买各种道具，应有尽有。', Width / 2 - 100, 220, 220, 200);
    else if (this.showpage == 2) this.drawtextx(ctx, '    游戏中还可以解锁各种成就，获得的成就可以在成就系统中查阅。\n    设置选项，可以关闭或开启游戏中的背景音乐和音效。也有夜间模式，为您夜间的战斗保驾护航。\n    勇士，还等什么？快来加入战斗吧！', Width / 2 - 100, 220, 220, 200);
    ctx.textAlign = tmpsta;
    if(this.showpage<2)this.nextbtn.render(ctx);
    if(this.showpage==2)this.returnbtn.render(ctx);
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
     if(this.showpage<2&&this.nextbtn.isTapped(x,y)==true)
     {
       this.showpage++;
     }
     else if (this.showpage==2&&this.returnbtn.isTapped(x, y) == true) {
      this.remove();
      pagebus.page = 0;
     }
  }
}



