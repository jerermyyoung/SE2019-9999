import './js/libs/weapp-adapter'
import './js/libs/symbol'
import PageBus from './js/page/bus'
import Main from './js/main'//引用页面
import Index from './js/page/index'//引用页面
import Setting from './js/page/setting'
import World from './js/page/world'
import Mission from './js/page/mission'
import Achievement from './js/page/achievement'
import Store from './js/page/store'

/*
  新增界面: import XXX from './js/page/xxx'
*/

let pagebus = new PageBus();
Object.defineProperty(pagebus, "page", {
  get: function () {
    return page
  },
  set: function (value) {
    console.log(value); //value是 data改变后的值
    switch (value)
    {
      case 0: //主界面
      {
        pagebus.ctx.textAlign = "center";//文字居中
        new Index();
        break;
      }
      case 1: //游戏界面
      {
        pagebus.ctx.textAlign = "left";//文字左对齐
        new Main();
        break;
      }
      case 2: //设置界面
      {
        pagebus.ctx.textAlign = "left";
        new Setting();
        break;
      }
      case 3: //选择世界
      {
        pagebus.ctx.textAlign = "center";
        new World();
        break;
      }
      case 4: //选择关卡
      {
        pagebus.ctx.textAlign = "center";
        new Mission();
        break;
      }
      case 5: //成就界面
        {
          pagebus.ctx.textAlign = "center";
          new Achievement();
          break;
        }
      case 6: //商店界面
        {
          var A = new Store();
          A.createShop();
          break;
        }
      /**
       * 新增界面，例如:
       * case 2:
       * {
       *  pagebus.ctx.textAlign = "center";//文字居中
          new XXX();
          break;
       * }
       */
    }
  }
})
pagebus.page=0;//首页
