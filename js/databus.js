import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frozen = false;
    this.frame      = 0
    this.score      = 0
    this.bullets    = []
    this.enemys     = []
    this.floatages  = []
    this.bosses     = []
    //this.animations = []  //不再需要
    this.gameStatus = DataBus.GameRunning
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    //let temp = this.bullets.shift()  //原版的简化处理
    let temp = (bullet === undefined) ? 
      this.bullets.shift() : this.bullets.splice(this.bullets.indexOf(bullet), 1)

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = (enemy === undefined) ?
      this.enemys.shift() : this.enemys.splice(this.enemys.indexOf(enemy), 1)

    temp.visible = false

    this.pool.recover(enemy.constructor.name, enemy) //freighters has its own queue
  }

  /**
   * 回收boss，进入对象池
   * 此后不进入帧循环
   */
  removeBoss(boss) {
    let temp = (boss === undefined) ?
      this.bosses.shift() : this.bosses.splice(this.bosses.indexOf(boss), 1)

    temp.visible = false

    this.pool.recover(boss.constructor.name, boss)
  }
  
  /**
   * 回收漂浮物，进入对象池
   * 此后不进入帧循环
   */
  removeFloatage(floatage) {
    let temp = (floatage === undefined) ?
      this.floatages.shift() : this.floatages.splice(this.floatages.indexOf(floatage), 1)

    temp.visible = false

    this.pool.recover('floatage', floatage)
  }

  /**
   * 回收动画，进入对象池
   * 此后不进入帧循环
   */
  removeAnimation(anim) {
    this.pool.recover('animation', anim)
  }
}

DataBus.GameRunning = 0
DataBus.GameOver = 1
DataBus.GamePaused = 2
DataBus.GameWin = 3
DataBus.BeforeGameOver=4//hp降为0，选择使用复活卡
