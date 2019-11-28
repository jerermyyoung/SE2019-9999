//暂时是用来模拟创建和存储的

const MAPTOT = 3
const LEVELTOT = 12

export default class Store {
  
  constructor(b) {
    if (!b){
      this.money = 0
      this.myplanes = new Array(false, false, false)
      this.mycards = new Array(0, 0, 0, 0, 0, 0)
      this.mylevel = new Array()
      for (var i = 0; i < MAPTOT; i++) {
        this.mylevel[i] = new Array()
        for (var j = 0; j < LEVELTOT; j++) {
          this.mylevel[i][j] = false
        }
      }
      this.mylevel[0][0] = true
    }
    else{
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
}