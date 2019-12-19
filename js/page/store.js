//暂时是用来模拟创建和存储的

const MAPTOT = 3
const LEVELTOT = 12

export default class Store {
  
  constructor(b) {
    if (!b){
      this.money = 80000
      this.myplanes = new Array(false, false, false)
      this.plane = -1 //默认小飞机
      this.mycards = new Array(0, 0, 0, 0, 0, 0)
      this.mylevel = new Array()
      for (var i = 0; i < MAPTOT; i++) {
        this.mylevel[i] = new Array()
        for (var j = 0; j < LEVELTOT; j++) {
          this.mylevel[i][j] = false
        }
      }
      this.mylevel[0][0] = true
      this.mylevel[0][1] = true
      this.mylevel[1][0] = true
      this.mylevel[2][0] = true
      
      //下面是成就界面的一些数据
      this.summoney = 0        //这里的money是不会减少的，表示的累积的钱            
      this.num = 0            //游戏次数
      this.output = 0          //击落敌机数量
      this.level = 0          //通关关数
      this.shoot = 0           //击落敌机数同时未掉血
      this.lastshoot = 0        //残血情况下击落的敌机数
    }
    else{
      this.plane= b.plane
      if(this.plane==null)this.plane=0
      this.money = b.money
      this.myplanes = b.myplanes
      this.mycards = b.mycards
      this.mylevel = b.mylevel
      for (var i = 0; i < MAPTOT; i++) {
        this.mylevel[i] = b.mylevel[i]
        for (var j = 0; j < LEVELTOT; j++) {
          this.mylevel[i][j] = b.mylevel[i][j]
        }
      }

      //下面是成就界面的一些数据
      this.summoney = b.summoney       //这里的money是不会减少的，表示的累积的钱            
      this.num = b.num            //游戏次数
      this.output = b.output          //击落敌机数量
      this.level = b.level          //通关关数
      this.shoot = b.shoot           //击落敌机数同时未掉血
      this.lastshoot = b.lastshoot        //残血情况下击落的敌机数
    }
  }

  changeMoney(x) { //修改金钱接口
    this.money = x
  }

  increaseMoney(x){
    this.money += x
  }

  howMuchMoney() { //查询金钱接口
    return this.money
  }

  increaseGoods(x) { //修改道具和飞机接口，0 复活卡，1无敌卡，2轰炸卡，3加速卡，4补充卡，5无限卡，6红色，7黄色，8绿色
    if (x < 6) this.mycards[x] ++
    else this.myplanes[x - 6] = true
  }

  decreaseGoods(x){ //同上1-5
    this.mycards[x] --
  }

  howManyCards(x){ //查询道具数量接口，0 复活卡，1无敌卡，2轰炸卡，3加速卡，4补充卡，5无限卡
    return this.mycards[x]
  }

  haveThePlane(x){ //查询飞机接口，0红色，1黄色，2绿色
    return this.myplanes[x]
  }

  unlockedLevel(m, n){ //解锁m世界n关卡
    this.mylevel[m][n] = true
  }

  haveLevel(m, n){ //查询m世界n关卡有没有解锁
    return this.mylevel[m][n]
  }



  //下面是成就界面一些数据的接口

  increaseSummoney(x) { //修改金钱接口
    this.summoney += x
  }

  howMuchSummoney() { //查询金钱接口
    return this.summoney
  }

  increaseNum(x) { //修改游戏次数接口
    this.num += x
  }

  howMuchNum() { //查询游戏次数接口
    return this.num
  }

  increaseOutput(x) { //修改击落敌机数量接口
    this.output += x
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

  changeLastshoot(x) { //修改一滴血情况下击落敌机数接口
    this.lastshoot = x
  }

  howMuchLastshoot() { //查询一滴血情况下击落敌机数接口
    return this.lastshoot
  }
}