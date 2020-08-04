import enemy from "./enemy"
import warrior from "./warrior"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

//#region 属性面板里赋值的参数
    @property({
        displayName:"放置战士音效",
        type:cc.AudioClip,
    })
    placeMusic:cc.AudioClip=null;
    @property({
        displayName:"战士出生点",
        type:[cc.Node],
        tooltip:"放置战士的位置"
    })
    warriorPoses:cc.Node[]=[];

    @property({
        displayName:"选择战士按钮",
        type:[cc.Node],
        tooltip:"选择战士的按钮位置"
    })
    warriorChoosePoses:cc.Node[]=[];

    
    @property({
        displayName:"战士",
        type:[cc.Prefab],
        tooltip:"战士"
    })
    warriors:cc.Prefab[]=[];

    @property({
        displayName:"取消选中按钮",
        type:cc.Node,
        tooltip:"取消选中战士的按钮",
    })
    notChooseBtn:cc.Node=null;

    @property({
        displayName:"小怪出生点",
        type:cc.Vec2,
        tooltip:"小怪出生点",
    })
    enemyBirthPlace:cc.Vec2=null;

    @property({
        displayName:"小怪",
        type:[cc.Prefab],
        tooltip:"小怪",
    })
    enemies:cc.Prefab[]=[];

    @property({
        displayName:"路线节点",
        type:[cc.Vec2],
        tooltip:"小怪移动路线",
    })
    enemyRoad:cc.Vec2[]=[];

    @property({
        displayName:"UI管理",
        type:cc.Node,
    })
    UIManager:cc.Node=null;

    @property({
        displayName:"部署点数",
        type:cc.Node,
    })moneyNode:cc.Node=null;

    @property({
        displayName:"战士点数列表",
        tooltip:"在本场战斗中出现的战士部署点数，需要按照顺序填写",
        type:cc.Integer,
    })moneyList:number[]=[];

    @property({
        displayName:"小怪顺序",
        tooltip:"小怪出现顺序",
        type:cc.Integer,
    })enemySequence:number[]=[];

    @property({
        displayName:"战士顺序",
        tooltip:"每一个战士选择框对应prefab中的哪个战士",
        type:cc.Integer,
    })warriorMap:number[]=[];

    @property({
        displayName:"滑动条",
        type:cc.Node,
    })
    slider:cc.Node[]=[];

//#endregion

//#region 脚本内赋值的参数

    //当前鼠标选中的战士
    curWarrior:cc.Prefab=null;
   

    //小怪对象池
    enemyPools:Array<cc.NodePool>=[];
    
    //在场上的小怪数组
    enemyQueue:Array<cc.Node>=[];

    //剩余活着的小怪数目
    leftEnemyNum:number=0;

    //战士出生点是否有放置战士
    isCreateWarrior:boolean[]=[];

    //没有被打死的小怪数目
    unKilledEnemyNum:number=0;

    //剩余没生成的小怪个数
    createEnemyNum:number=0;

    //部署点数
    money:number=5;
    

//#endregion

//#region 关卡逻辑部分
     onLoad () {
         //0.开启物理引擎
         cc.director.getPhysicsManager().enabled=true;
         cc.director.getCollisionManager().enabled=true;
         //cc.director.getCollisionManager().enabledDebugDraw=true;
         //cc.director.getCollisionManager().enabledDrawBoundingBox=true;
          //1.生成小怪对象池
          for(let i=0;i<this.enemies.length;i++)
          {
              this.enemyPools[i]=new cc.NodePool();
          }
          this.unKilledEnemyNum=0;
          //console.log(this.unKilledEnemyNum);
          console.log("场景加载到了onLoad");
         
     }
     start () {
         //0.按照顺序生成小怪
         let enemyNum=0;
         this.createEnemyNum=0;
         this.leftEnemyNum=0;
         
         this.schedule(function(){
             let temp;
                temp=this.createEnemy(this.enemySequence[enemyNum]);
                console.log("create完了一个小怪");
              temp.getComponent(enemy).move(this.enemyRoad);
              console.log("取到了这个小怪的脚本");
              enemyNum++;
              this.enemyQueue.push(temp);
              //console.log("1");
              this.enemyQueue[enemyNum]=temp;
              //console.log("2");
              this.createEnemyNum++;
              //console.log("3");
              this.leftEnemyNum++;
              //console.log("4");
              
         },2,this.enemySequence.length-1,0);
         //1.注册小怪函数
         cc.director.on("小怪死亡",this.onEnemyKilled,this);
         cc.director.on("小怪逃跑",this.onEnemyLeft,this);
         //2.战士出生点是否放置战士初始化
         for(let i=0;i<this.warriorPoses.length;i++)
            this.isCreateWarrior[i]=false;
        //3.定时改变部署点数
        this.schedule(function(){ 
            this.money++;

        },1);

        for(let i=0;i<this.slider.length;i++)
        {
            this.slider[i].active=false;
        }
        console.log("场景加载到了start");
    }
    
    update(dt)
    {
        if(this.unKilledEnemyNum>=3)
        {
            console.log("游戏失败");
            /*
            for(let i=0;i<this.enemyQueue.length;i++)
            if(this.enemyQueue[i]!=null)
            this.enemyQueue[i].active=false;
            */
            cc.director.emit("游戏失败");
            
        }
       
        if(this.createEnemyNum==this.enemySequence.length&&this.leftEnemyNum==0&&this.unKilledEnemyNum<3)
        {
            console.log("游戏成功");
            cc.director.emit("游戏成功");

        }
        this.moneyNode.getComponent(cc.Label).string=this.money.toString();
        
    }
    //#endregion

//#region 进入战士选中状态函数
     enterWarriorState(e,customData:number)
     {
         let i:number=customData;
      let node1=e.target;
       this.curWarrior=this.warriors[i];

       for(let ii=0;ii<this.warriorChoosePoses.length;ii++)
       {
           
            this.warriorChoosePoses[ii].color=cc.color(255,255,255);  
       }
       node1.color=cc.Color.GRAY;
     }  
     //#endregion

//#region 取消选中战士状态函数
     exitWarriorState(e)
     {
         
        for(let ii=0;ii<this.warriorChoosePoses.length;ii++)
        {
             
             this.warriorChoosePoses[ii].color=cc.color(255,255,255);
        }
        this.curWarrior=null;
     }
     //#endregion

//#region 生成战士函数
     createWarrior(e)
     {
        if(this.curWarrior==null)return;
         let flag:number=0;
        let father=e.target;
        let curCreateWarriorPos=0;
        for(let ii=0;ii<this.warriorPoses.length;ii++)
        {
            
            
             if(this.warriorPoses[ii]==father)
             {
                 if(this.isCreateWarrior[ii]==true)
                 {
                     flag=1;
                 }
                 else curCreateWarriorPos=ii;
             }
        }
        if(flag==1)return;
        let curWarriorNum=0;
        for(let ii=0;ii<this.warriors.length;ii++)
        if(this.curWarrior==this.warriors[ii])
        {
              curWarriorNum=ii;
              break;
        }
        if(this.money<this.moneyList[curWarriorNum])return;
        this.money-=this.moneyList[curWarriorNum];
        this.isCreateWarrior[curCreateWarriorPos]=true;
        
         let warriorNode=cc.instantiate(this.curWarrior);
         
         warriorNode.setParent(cc.director.getScene());
         //warriorNode.scale=warriorNode.scale/father.scale;
         warriorNode.position=father.position;
         warriorNode.setSiblingIndex(2);
         warriorNode.getComponent(warrior).curLevel=this;
         warriorNode.getComponent(warrior).warriorNumber=curCreateWarriorPos;
         this.curWarrior=null;
         for(let ii=0;ii<this.warriorChoosePoses.length;ii++)
       {
           
            this.warriorChoosePoses[ii].color=cc.color(255,255,255);  
       }
       this.node.getComponent(cc.AudioSource).clip=this.placeMusic;
       this.node.getComponent(cc.AudioSource).play();

       this.slider[curCreateWarriorPos].active=true;
       this.slider[curCreateWarriorPos].getComponent(cc.ProgressBar).progress=1;

     }
     //#endregion

//#region 小怪部分
    createEnemy(i:number)
    {
         let enemyNode:cc.Node=null;
         //if(this.enemyPools[i]==null)return;
         let length=this.enemyPools[i].size();
         if(length>0)
         {
             enemyNode=this.enemyPools[i].get();
         }
         else{
             enemyNode=cc.instantiate(this.enemies[i]);
         }
         //console.log("生成了小怪"+i);
         if(enemyNode!=null)
         console.log(enemyNode.name);
         else console.log("null");
         enemyNode.active=true;
         console.log("active");
         let temppp=cc.director.getScene();
         console.log("scene");
         enemyNode.parent=temppp;
         console.log("parent");
         enemyNode.setSiblingIndex(2);
         console.log("sibling");
         enemyNode.position=new cc.Vec3(this.enemyBirthPlace.x,this.enemyBirthPlace.y,0);
        // this.enemyBirthPlace;
         console.log("i:"+i+"position:"+enemyNode.position);
         return enemyNode;
    }
    onEnemyKilled()
    {
        this.leftEnemyNum--;
        
    }

    onEnemyLeft()
    {

        this.unKilledEnemyNum=this.unKilledEnemyNum+1;
    }
//#endregion
   
//#region 战士寻找攻击的小怪AI


    searchForEnemy(warriorPos:cc.Node,curTarget:cc.Node)
    {
        if(curTarget!=null)
        {
            let startPos=cc.v2(curTarget.x,curTarget.y);
            let endPos=cc.v2(warriorPos.x,warriorPos.y);
            let dis=startPos.sub(endPos).mag();
            if(dis<=400)
            return curTarget;
        }
        if(this.leftEnemyNum<=0)return null;
        if(this.enemyQueue.length<=0)return null;
        let minLength:number=100000;
        let ii=0;
        for(let i=0;i<this.enemyQueue.length;i++)
        {
            if(this.enemyQueue[i]==null)continue;
            if(this.enemyQueue[i].active==false)continue;
            let startPos=cc.v2(this.enemyQueue[i].x,this.enemyQueue[i].y);
            let endPos=cc.v2(warriorPos.x,warriorPos.y);
            let dis=startPos.sub(endPos).mag();
            if(dis<minLength)
            {
                minLength=dis;
                ii=i;
            }
        }
        return this.enemyQueue[ii];
    }
//#endregion


}
