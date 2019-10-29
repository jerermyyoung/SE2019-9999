let instance

export default class DataBus {
  constructor() {
    if (instance)
      return instance
    instance = this;
    this.page=-1;//无页面
    this.ctx = canvas.getContext('2d');//全局ctx
    this.world = 1;//默认世界
    this.mission = 1;//关卡
  }
}