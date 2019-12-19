import Player from './player/index'
import Enemy from './npc/enemy'
import Floatage from './npc/floatage'
import Freighter from './npc/freighter'
import Boss from './npc/boss'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
//import Config from './common/config'
import ControlLayer from './base/controllayer'
import Util from './common/util'
import Constants from './common/constants'
import PageBus from './page/bus'
import Store from './page/store'
import Timer from './component/timer.js'
let pagebus = new PageBus()
let ctx = pagebus.ctx;
let databus = new DataBus()
let mystore
//这是一个关于敌机有没有生成的标志,true=可以生成
let boss_flag=true
//这是一个关于敌机有没有死亡的标志,true=活着
let boss_life = true

const Config = require('./common/config.js').Config
const systemInfo = wx.getSystemInfoSync();

// let button = wx.createUserInfoButton({ //创建用户授权按钮，注意：wx.authorize({scope: "scope.userInfo"})，无法弹出授权窗口
//   type: 'text',
//   text: '获取用户信息',
//   style: {
//     left: 10,
//     top: 76,
//     width: 200,
//     height: 40,
//     lineHeight: 40,
//     backgroundColor: '#ff0000',
//     color: '#ffffff',
//     textAlign: 'center',
//     fontSize: 16,
//     borderRadius: 4
//   }
// })
// button.onTap((res)=>{
//   //获取用户信息
// })


/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    
    try {
      var mydata = wx.getStorageSync('userstore')
      mystore = new Store(mydata)
      console.log(mydata);
      pagebus.plane=mystore.plane;
    }
    catch (e) {
      console.log(e)
    }
    console.log(`window.innerHeight = ${window.innerHeight}`)

    //1.两个主循环
    this.bindloopUpdate = this.loopUpdate.bind(this)
    this.bindloopRender = this.loopRender.bind(this)
    this.touchHandler = this.touchEventHandler.bind(this);
    //2.不需重置的游戏数据、玩家操控处理机制
    ;//<--编译器BUG，不加";"会和下一语句拼成一句而出错
    ['touchstart', 'touchmove', 'touchend'].forEach((type) => {
      canvas.addEventListener(type, this.touchHandler)
    })
    ;['UpdateRate', 'CtrlLayers.Background.DefaultActive', 'GodMode']
    .forEach(propName => {
      Config.subscribe(propName, this.onConfigChanged.bind(this))
    })

    //3.初次/重新启动
    this.restart()

    //4.其他：转发、广告...
    {
      wx.showShareMenu()
      wx.updateShareMenu({
        withShareTicket: true
      })
      wx.onShareAppMessage(function () {
        return {
          title: '增强版飞机大战',
          imageUrl: canvas.toTempFilePathSync({
            destWidth: 500,
            destHeight: 900
          })
        }
      })
      this.bannerAd = wx.createBannerAd({
        adUnitId: 'xxxx', //迷の广告商人...
        style: {
          left: 10,
          top: 76,
          width: 320
        }
      })
      this.bannerAd.show()
    }
  }
  restart() {
    databus.reset()
    boss_flag = true
    boss_life = true

    Config.Bullet.Type = 'single';

    //0.与通用类的关联
    console.log(`Restart: Config.UpdateRate=${Config.UpdateRate}`)

    //1.需重置的游戏数据、玩家操控处理机制
    this.updateInterval = 1000 / Config.UpdateRate
    this.updateTimes = 0
    this.lastRenderTime = new Date().getTime()
    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()
    this.music.playBgm();
    this.ctrlLayerUI = new ControlLayer('UI', [this.gameinfo])
    this.ctrlLayerSprites = new ControlLayer('Sprites', [this.player])
    this.ctrlLayerBackground = new ControlLayer('Background', [this.bg], 
        Config.CtrlLayers.Background.DefaultActive)  //this.CtrlLayers.Background.DefaultActive)
    
    //2.两个主循环重启
    if (this.updateTimer)
      clearInterval(this.updateTimer)
    this.updateTimer = setInterval(
      this.bindloopUpdate,
      this.updateInterval
    )
    if (this.renderLoopId)
      window.cancelAnimationFrame(this.renderLoopId);
    this.renderLoopId = window.requestAnimationFrame(
      this.bindloopRender,
      canvas
    )
  }

  remove()
  {
    ['touchstart', 'touchmove', 'touchend'].forEach((type) => {
      canvas.removeEventListener(type, this.touchHandler)
    });
    boss_flag = true
    boss_life = true
    window.cancelAnimationFrame(this.renderLoopId);
    clearInterval(this.updateTimer);
    this.bannerAd.destroy();
    //console.log('ok')
  }

  pause() {
    if (databus.gameStatus == DataBus.GameOver || databus.gameStatus == DataBus.GameWin ||databus.gameStatus==DataBus.BeforeGameOver)
      return
    databus.gameStatus = DataBus.GamePaused
    this.ctrlLayerSprites.active = false//玩家飞机不再可移动
    this.ctrlLayerBackground.active = false//背景不再滚动
  }
  resume() {
    if (databus.gameStatus == DataBus.GameOver || databus.gameStatus == DataBus.GameWin || databus.gameStatus==DataBus.BeforeGameOver)//确认游戏已经结束
      return
    databus.gameStatus = DataBus.GameRunning
    this.ctrlLayerSprites.active = true
    this.ctrlLayerBackground.active = Config.CtrlLayers.Background.DefaultActive
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if ((this.updateTimes * Constants.Enemy.SpawnRate) % Config.UpdateRate
      < Constants.Enemy.SpawnRate & databus.score <= Constants.Boss.score[pagebus.mission]) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(Constants.Enemy.Speed)
      databus.enemys.push(enemy)
    }
  }

  //漂浮物生成逻辑
  floatageGenerate() {
    if ((this.updateTimes * Constants.Floatage.SpawnRate) % Config.UpdateRate
      < Constants.Floatage.SpawnRate
      && databus.floatages.length < Constants.Floatage.SpawnMax) {
      let floatage = databus.pool.getItemByClass('floatage', Floatage)
      floatage.init(Constants.Floatage.Speed)
      databus.floatages.push(floatage)
    }
  }

  //运输机生成逻辑
  freighterGenerate() {
    if ((this.updateTimes * Constants.Freighter.SpawnRate) % Config.UpdateRate
      < Constants.Freighter.SpawnRate & databus.score <= Constants.Boss.score[pagebus.mission]) {
      
      let freighter = databus.pool.getItemByClass('freighter', Freighter)
      freighter.init(Constants.Freighter.Speed)
      databus.enemys.push(freighter)  //freighter is an enemy
    }
  }

  //boss生成逻辑
  bossGenerate() {
    
    //if (((this.updateTimes * Constants.Boss.SpawnRate) % Config.UpdateRate
    //  < Constants.Boss.SpawnRate) /*& databus.score >= Constants.Boss.score[pagebus.mission]*/) {
    //  let boss = databus.pool.getItemByClass('boss', Boss)
    //  boss.init(Constants.Boss.Speed)
    //  databus.bosses.push(boss)
    //}
    let boss = databus.pool.getItemByClass('boss', Boss)
    boss.init(Constants.Boss.Speed)
    databus.bosses.push(boss)
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this
    if (this.player.bomb == true)//轰炸
    {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]
        if (enemy.isAlive()) {
          if (enemy.freighter) {
            enemy.hpReduce(Constants.Enemy.CollisionDamage)
            if (enemy.hp == 0) enemy.destroy()
          }
          else {
            enemy.destroy()
          }
          that.music.playExplosion()
          databus.score += 1
        }
      }

      for (let i = 0, il = databus.bosses.length; i < il; i++) {
        let boss = databus.bosses[i]
        if (boss.isAlive()) {
          boss.hpReduce(1)
          if (!boss.isAlive()) {
            boss.destroy()
            boss_life = false
            that.music.playExplosion()
            databus.score += 10
          }
        }
      }
    }
    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (enemy.isAlive() && enemy.isCollideWith(bullet)) {//循环检测碰撞
          if(enemy.freighter) {
            enemy.hpReduce(Constants.Enemy.CollisionDamage)
            if(enemy.hp == 0) enemy.destroy()
          }
          else {
            enemy.destroy()
          }
          bullet.destroy()
          that.music.playExplosion()

          databus.score += 1

          break
        }
      }
    })

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.bosses.length; i < il; i++) {
        let boss = databus.bosses[i]
        if (boss.isAlive() && boss.isCollideWith(bullet)) {//循环检测碰撞
          boss.hpReduce(1)
          bullet.destroy()
          if (!boss.isAlive()) {
            boss.destroy()
            boss_life=false
            that.music.playExplosion()
            databus.score += 10
            break
          }
        }
      }
    })

    databus.floatages.forEach( floatage => {
      if (floatage.lifetime()>6000) {
        floatage.dispose()
      }
      if (this.player.isCollideWith(floatage)) {
        let effect = floatage.dispose()
        if (effect==0) {
          if (Constants.Bullet.Types.indexOf(Config.Bullet.Type) < 4) {
            Config.Bullet.Type = Util.findNext(Constants.Bullet.Types, Config.Bullet.Type)
            Config.Bullet.Speed = Constants.Bullet.SpeedBase * (Constants.Bullet.Types.indexOf(Config.Bullet.Type) + 1)
            wx.showToast({
              title: '子弹增加'
            })
          }
          else {
            databus.score = databus.score + 10
            wx.showToast({
              title: '子弹已满，积分增加'
            })
          }
        }
        else if (effect==1) {
          if(this.player.hp==100) {
            databus.score=databus.score+10
            wx.showToast({
              title: 'HP已满，积分增加'
            })
          }
          else {
            this.player.hpAdd(Constants.Enemy.CollisionDamage) //magic number
            wx.showToast({
              title: 'HP增加'
            })
          }
        }
        else {
          if (this.player.mp == 100) {
            databus.score = databus.score + 10
            wx.showToast({
              title: 'MP已满，积分增加'
            })
          }
          else {
            this.player.mpAdd(Constants.Enemy.CollisionDamage) //magic number
            wx.showToast({
              title: 'MP增加'
            })
          }
        }
      }
    })

    if (!Config.GodMode){
      for (let i = 0, il = databus.enemys.length; i < il; i++) {//游戏结束控制->待修改：敌机可以发射子弹
        let enemy = databus.enemys[i]

        if (this.player.isCollideWith(enemy)) {
          enemy.destroy();

          //与敌机碰撞时，由直接死亡变为生命值减少，同时暂时约定【子弹排数也减少1排】，后续可修改
          this.player.hpReduce(Constants.Enemy.CollisionDamage)          
          if(Constants.Bullet.Types.indexOf(Config.Bullet.Type)>0)Config.Bullet.Type = Util.findLast(Constants.Bullet.Types,Config.Bullet.Type)

          //Game Over逻辑由死亡变更为生命值==0
          //【注：此处的死亡判定暂时限定在碰撞敌机时，如果后面玩法扩充，需要再次补充死亡判定】
          if(this.player.hp == 0){
            databus.gameStatus=DataBus.BeforeGameOver;
            if (mystore.mycards[0] <= 0) databus.gameStatus = DataBus.GameOver;//没有复活卡
            // mystore.increaseMoney(databus.score * 10)
            // mystore.increaseSummoney(databus.score * 10)
            // mystore.increaseNum(1)
            // mystore.increaseOutput(databus.score)    //score就是击落敌机的数量
            // wx.setStorageSync("userstore", mystore)
            // databus.gameStatus = DataBus.GameOver
            break
          }
        }
      }

      for (let i = 0, il = databus.bosses.length; i < il; i++) {//游戏结束控制->待修改：敌机可以发射子弹
        let boss = databus.bosses[i]

        if (this.player.isCollideWith(boss)) {
          boss.destroy();
          boss_life = false

          //与敌机碰撞时，由直接死亡变为生命值减少，同时暂时约定【子弹排数也减少1排】，后续可修改
          this.player.hp=0;

          //Game Over逻辑由死亡变更为生命值==0
          //【注：此处的死亡判定暂时限定在碰撞敌机时，如果后面玩法扩充，需要再次补充死亡判定】
          if (this.player.hp == 0) {
            databus.gameStatus = DataBus.BeforeGameOver;
            if (mystore.mycards[0] <= 0) databus.gameStatus = DataBus.GameOver;//没有复活卡
            // mystore.increaseMoney(databus.score * 10)
            // mystore.increaseSummoney(databus.score * 10)
            // mystore.increaseNum(1)
            // mystore.increaseOutput(databus.score)    //score就是击落敌机的数量
            // wx.setStorageSync("userstore", mystore)
            // databus.gameStatus = DataBus.GameOver
            break
          }
        }
      }

    }
  }

  //-- 游戏【操控】事件处理 ----
  touchEventHandler(e){
    e.preventDefault()
    let [x, y] = (e.type == 'touchstart' || e.type == 'touchmove') ?
      [e.touches[0].clientX, e.touches[0].clientY] : [null, null]

    //规则：1.只会从上层往下层传(只有捕获capture，没有冒泡bubble) 
    //     2.当上层发生过处理时下层不再处理(parent-catch)
    //     3.同一层中，有一个元素处理过（队头优先）其他元素即不再处理(sibling-catch)
    let upperLayerHandled = false
    for (let ctrlLayer of [this.ctrlLayerUI, this.ctrlLayerSprites, this.ctrlLayerBackground]) {
      if (upperLayerHandled)
        break //stop handling
      if (!ctrlLayer.active)
        continue //next layer
      //console.log(`${e.type}: ${ctrlLayer.name}`)
      ctrlLayer.elements.some((element) => {
        //console.log(`${e.type}: ${element.__proto__.constructor.name}`)
        element.onTouchEvent(e.type, x, y, ((res) => {
          switch (res.message) {
            //--- Game Status Switch ---
            case 'restart':
              this.restart()
              this.music.playBgm();
              this.music.updateBgm();
              // console.log('re start!')
              break
            case 'return':
              this.remove();
              this.music.stopBgm();
              this.music.updateBgm();
              pagebus.page=0;
              break
            case 'returnmission':
              this.music.stopBgm();
              this.music.updateBgm();
              this.remove();
              pagebus.page = 4;
              break
            case 'relive': //复活
              console.log('!!!!!')
              this.usetool(0);
              console.log('复活吧')
              break;
            case 'giveup': //不复活
              mystore.increaseMoney(databus.score * 10)
              mystore.increaseSummoney(databus.score * 10)
              mystore.increaseNum(1)
              mystore.increaseOutput(databus.score)    //score就是击落敌机的数量
              wx.setStorageSync("userstore", mystore)
              databus.gameStatus = DataBus.GameOver
              break;
            // case 'tool0':
            //   this.usetool(0);
            //   break;
            case 'tool1':
              this.usetool(1);
              break;
            case 'tool2':
              this.usetool(2);
              break;
            case 'tool3':
              this.usetool(3);
              break;
            case 'tool4':
              this.usetool(4);
              break;
            case 'tool5':
              this.usetool(5);
              break;
            case 'ultraSkill':
              this.useUltraSkill();
              break;
            case 'nextmission':
            //下一关
              if (pagebus.mission<11){
                this.remove();
                pagebus.mission = pagebus.mission + 1;
                pagebus.page = 1;
                this.music.playBgm();
                this.music.updateBgm();
              }
              break
            case 'share':
              wx.shareAppMessage({
                title: '快来和我玩飞机吧',
              });
              break
            case 'pause':
              this.music.stopBgm();
              this.music.updateBgm();
              this.pause()
              break
            case 'resume':
              this.music.playBgm();
              this.music.updateBgm();
              this.resume()
              break
            //--- Setting Commands ---
            case 'switchUpdateRate':
              Config.UpdateRate = Util.findNext(res.optionList, Config.UpdateRate)
              break
            case 'switchBulletSpeed':
              Config.Bullet.Speed = Util.findNext(res.optionList, Config.Bullet.Speed)
              break
            case 'switchBulletType':
              Config.Bullet.Type = Util.findNext(res.optionList, Config.Bullet.Type)
              break
            case 'youAreGod':
              Config.GodMode = Util.findNext(res.optionList, Config.GodMode)
              break
            case 'backgroundActive':
              Config.CtrlLayers.Background.DefaultActive = Util.findNext(res.optionList, Config.CtrlLayers.Background.DefaultActive)
              break
          }
          if (res.message.length > 0){
            upperLayerHandled = true
            return true //if any element handled the event, stop iteration
          }
        }).bind(this))
      })
    }

  }
  usetool(idx)//使用几号道具 0 复活卡，1无敌卡，2轰炸卡，3加速卡，4补充卡，5无限卡
  {
    console.log(databus.gameStatus)
    if (databus.gameStatus!=DataBus.GameRunning&&!(idx==0&&databus.gameStatus==DataBus.BeforeGameOver))return ;
    if (mystore.mycards[idx] > 0) mystore.mycards[idx]--;
    else return;
    switch (idx) {
      case 0: {//复活
        databus.gameStatus=DataBus.GameRunning;//重新运作
        this.resume()
        this.player.hp=100;//满血
        this.player.setAirPosAcrossFingerPosZ(systemInfo.windowWidth/2, systemInfo.windowHeight-20)
        console.log('复活')
        //mystore.mycards[idx]++;
        break;
      }
      case 1: {
        if(this.player.hpinf==true)
        {
          mystore.mycards[idx]++;
          return ;
        }
        this.player.hpinf = true;
        this.tool1=null;//清空
        this.tool1 = new Timer(5, "无敌时间", true, systemInfo.windowWidth / 2 - 100, systemInfo.windowHeight - 50, 200, 10,'#E6A23C');
        break;
      }
      case 2: { //轰炸
        if (this.player.bomb == true) {
          mystore.mycards[idx]++;
          return;
        }
        this.player.bomb = true;
        this.tool2=null;//轰炸计时器清空
        this.tool2 = new Timer(3, "轰炸时间", true, systemInfo.windowWidth / 2 - 100, systemInfo.windowHeight - 100, 200, 10, '#F56C6C');
        this.music.playhongzha();
        break;
      }
      case 3: { //冻结卡
        databus.frozen=true;
        this.tool3 = null;//冻结计时器清空
        this.tool3 = new Timer(3, "冻结时间", true, systemInfo.windowWidth / 2 - 100, systemInfo.windowHeight - 150, 200, 10, '#409EFF');
        break;
      }
      case 4: {
        this.player.mpAdd(40);//增加40
        break;
      }
      case 5: {
        if (this.player.mpinf == true) {
          mystore.mycards[idx]++;
          return;
        }
        this.player.mpinf=true;
        break;
      }
    }
    wx.setStorageSync("userstore", mystore)
  }

  useUltraSkill(){
    if(this.player.mpinf==false) this.player.mp-=100; 
    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]
      if (enemy.isAlive()) {      
        enemy.destroy()       
        this.music.playExplosion()
        databus.score += 1
      }
    }

    for (let i = 0, il = databus.bosses.length; i < il; i++) {
      let boss = databus.bosses[i]
      if (boss.isAlive()) {
        boss.hpReduce(3)
        if (!boss.isAlive()) {
          boss.destroy()
          boss_life = false
          this.music.playExplosion()
          databus.score += 10
        }
      }
    }
  }

  //-- 游戏数据【更新】主函数 ----
  update(timeElapsed) {
    if ([DataBus.GameOver, DataBus.GamePaused, DataBus.GameWin, DataBus.BeforeGameOver].indexOf(databus.gameStatus) > -1)
      return

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.floatages)
      .concat(databus.bosses)
      .forEach((item) => {
        item.update(timeElapsed)
      })

    this.enemyGenerate()

    //this.floatageGenerate()  //Freighters spawn floatages in turn
    this.freighterGenerate()

    this.collisionDetection()

    //即使GameOver仍可能发最后一颗子弹..仇恨的子弹..
    if ((this.updateTimes * Constants.Bullet.SpawnRate) % Config.UpdateRate
       < Constants.Bullet.SpawnRate) {
      this.player.shoot()
      this.music.playShoot()
    }
    
    // if (databus.score == 5) {//测试程序*************************************************************
    //   databus.gameStatus = DataBus.GameWin;
    //   //游戏获胜，解锁下一关卡。
    //   // console.log(pagebus.mission);
    //   // console.log(pagebus.world);
    //   // if(pagebus.mission+1<12)mystore.mylevel[pagebus.world][pagebus.mission+1]=true;
    //   // wx.setStorageSync("userstore", mystore)
    // }//**************************************************************************************** */
    if (databus.score >= Constants.Boss.score[pagebus.mission]) {
      if (boss_flag){
        this.bossGenerate()
        boss_flag=false
      }
    }
    if(!boss_life){
      mystore.unlockedLevel(pagebus.world, pagebus.mission)
      mystore.increaseMoney(databus.score * 10)
      mystore.increaseSummoney(databus.score * 10)
      mystore.increaseNum(1)
      mystore.increaseOutput(databus.score)    //score就是击落敌机的数量
      wx.setStorageSync("userstore", mystore)
      databus.gameStatus = DataBus.GameWin
    }
    //游戏胜利不生成任何新敌机
    if (databus.gameStatus == DataBus.GameWin) {
      if (pagebus.mission + 1 < 12) mystore.mylevel[pagebus.world][pagebus.mission + 1] = true;
      wx.setStorageSync("userstore", mystore)
      this.ctrlLayerSprites.active = false
      this.ctrlLayerBackground.active = false
    }
    //GameOver can only be caused by collisionDetection
    if (databus.gameStatus == DataBus.GameOver || databus.gameStatus == DataBus.GameWin) {
      this.ctrlLayerSprites.active = false
      this.ctrlLayerBackground.active = false
    }
    //待选择时不再生成敌机
    if(databus.gameStatus==DataBus.BeforeGameOver){
      this.ctrlLayerSprites.active = false
      this.ctrlLayerBackground.active = false
    }

  }

  onConfigChanged(key, value, oldValue){
    console.log(`Main::onConfigChanged: ${key}=${value}`)
    switch (key){
      case 'UpdateRate':
        this.updateInterval = 1000 / Config.UpdateRate
        if (this.updateTimer)
          clearInterval(this.updateTimer)
        this.updateTimer = setInterval(
          this.bindloopUpdate,
          this.updateInterval
        )
        break
      case 'CtrlLayers.Background.DefaultActive':
        wx.showToast({
          title: Config.CtrlLayers.Background.DefaultActive ? '有效' : '无效',
        })
        break
      case 'GodMode':
        wx.showToast({
          title: value ? '无敌！' : '小心，无敌取消',
        })
        break
    }
  }

  //-- 游戏数据【渲染】主函数 ----
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    if (this.tool2 && this.tool2.islive == true)
    {
      var tmp = ctx.fillStyle;
      ctx.fillStyle = "rgb(255,0,0,0.3)";
      ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight)
      ctx.fillStyle = tmp;
    }
    

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.floatages)
      .concat(databus.bosses)
      .forEach((item) => {
        item.render(ctx)
      })

    this.player.render(ctx)

    // databus.animations.forEach((anim) => {
    //   anim.render(ctx)
    // })

    this.gameinfo.renderGameScore(ctx, databus.score)
    
    this.gameinfo.renderPlayerStatus(ctx,this.player.hp,this.player.mp,this.player.hpinf,this.player.mpinf)
    this.gameinfo.renderPause(ctx);//暂停游戏
    this.gameinfo.renderTools(ctx);//工具箱
    this.gameinfo.renderUltraSkillIcon(ctx,this.player.mp,this.player.mpinf);//大招图标
    //工具计时器
    if(this.tool1&&this.tool1.islive==true)this.tool1.render(ctx);
    else this.player.hpinf=false;
    if (this.tool2 && this.tool2.islive == true) this.tool2.render(ctx);
    else this.player.bomb = false;
    if (this.tool3 && this.tool3.islive == true) this.tool3.render(ctx);
    else databus.frozen = false;
    //选择使用复活卡
    if(databus.gameStatus == DataBus.BeforeGameOver)
    {
      this.gameinfo.renderRelive(ctx,mystore.mycards[0])
    }
    // 游戏结束停止帧循环
    if (databus.gameStatus == DataBus.GameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)
    }

    //游戏获胜也停止循环
    else if(databus.gameStatus == DataBus.GameWin)
    {
      this.gameinfo.renderGameWin(ctx, databus.score)
    }

  }


  //-- 游戏数据【更新】主循环 ----
  loopUpdate() {//更新时间&次数
    this.updateTimes++
    let timeElapsed = new Date().getTime() - this.lastRenderTime
    this.lastRenderTime = new Date().getTime()
    this.update(timeElapsed)
  }

  //-- 游戏数据【渲染】主循环 ----
  loopRender() {
    
    this.render();
    this.renderLoopId = window.requestAnimationFrame(
      this.bindloopRender,
      canvas
    )
  }

}
