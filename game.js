import './js/libs/weapp-adapter'
import './js/libs/symbol'
import PageBus from './js/page/bus'
import Main from './js/main'//引用页面
import Index from './js/page/index'//引用页面
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
      case 0:{
        pagebus.ctx.textAlign = "center";//文字居中
        new Index();
        break;
      }
      case 1:
      {
        pagebus.ctx.textAlign = "left";//文字左对齐
        new Main();
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
