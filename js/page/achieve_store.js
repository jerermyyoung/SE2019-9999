//暂时是用来模拟创建和存储的

const MAPTOT = 3
const LEVELTOT = 12

export default class achieve_Store {
  constructor() { //初始化的内容应该从存储文件中读取
    this.money = 20000        //这里的money是不会减少的，表示的累积的钱             
    
    this.num = 0            //游戏次数
    this.output = 0          //击落敌机数量
    this.level = 0          //通关关数
    this.shoot = 0           //击落敌机数同时未掉血
    this.lastshoot = 0        //残血情况下击落的敌机数
  }

  changeMoney(x) { //修改金钱接口
    this.money = x
  }

  howMuchMoney() { //查询金钱接口
    return this.money
  }

  changeNum(x) { //修改游戏次数接口
    this.num = x
  }

  howMuchNum() { //查询游戏次数接口
    return this.num
  }

  changeOutput(x) { //修改击落敌机数量接口
    this.output = x
  }

  howMuchOutput() { //查询击落敌机数量接口
    return this.output
  }

  changeLevel(x) { //修改通关关数接口
    this.level = x
  }

  howMuchLevel() { //查询通关关数接口
    return this.level
  }

  changeShoot(x) { //修改未掉血情况下击落敌机数接口
    this.shoot = x
  }

  howMuchShoot() { //查询未掉血情况下击落敌机数接口
    return this.shoot
  }

  changeLastshoot(x) { //修改未掉血情况下击落敌机数接口
    this.lastshoot = x
  }

  howMuchLastshoot() { //查询未掉血情况下击落敌机数接口
    return this.lastshoot
  }
}