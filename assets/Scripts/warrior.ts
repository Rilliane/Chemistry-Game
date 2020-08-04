 import bullet from "./bullet"
import enemy from "./enemy"
import level from "./level"

const {ccclass, property} = cc._decorator;

@ccclass
export default class warrior extends cc.Component {


    @property({
        displayName:"攻击速度",
    })speed:number=1;

    @property({
        displayName:"子弹生命长度",
        tooltip:"子弹可以持续多久消失"
    })
    bulletLife:number=0.7;

    @property({
        displayName:"小怪种类",
        visible:true,
        type:cc.String,
    })
    kind:string[]=["酸","碱"];

    @property({
        tooltip:"对应不同小怪的攻击力",
        displayName:"攻击力",
        visible:true,
        type:cc.Integer,
    })
    power:number[]=[1,2];

    @property({
        displayName:"子弹",
        type:cc.Prefab,
    })
    bullet:cc.Prefab=null;

    @property({
        displayName:"攻击频率",
        tooltip:"一秒钟攻击几次",
        type:cc.Integer,
    })
    attackRate=0;

    @property({
        displayName:"攻击范围",
        type:cc.Integer,
    })attackRange=500;

    @property({
        displayName:"攻击次数",
        type:cc.Integer,
    })life=5;

    curLevel:level=null;

    curTarget:cc.Node=null;

    bulletSpeedRate:number=4;

    isLose=false;

    warriorNumber:number=0;

    wholeLife:number=0;

    attack(enemyNode:cc.Node)
    {
        if(enemyNode==null)return;
        let realBullet=cc.instantiate(this.bullet);
       
        realBullet.parent=cc.director.getScene();
        realBullet.setSiblingIndex(2);
        realBullet.position=this.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        let tempPower:string=enemyNode.getComponent(enemy).attribute;
        let ii=0;
        for(let i=0;i<this.kind.length;i++)
        if(this.kind[i]==tempPower)
        {
            ii=i;break;
        }
        realBullet.getComponent(bullet).setPower(this.power[ii]);
        realBullet.getComponent(bullet).setKind(this.kind);
        realBullet.getComponent(bullet).life=this.bulletLife;
        let bulletMoveTime=cc.v2(enemyNode.position.x,enemyNode.position.y).sub(cc.v2(realBullet.position.x,realBullet.position.y)).mag();
        bulletMoveTime=bulletMoveTime/(this.speed*this.bulletSpeedRate);
        realBullet.runAction(cc.moveTo(bulletMoveTime,enemyNode.position.x,enemyNode.position.y));

    }

    start()
    {
        this.wholeLife=this.life;
        cc.director.once("游戏失败",this.onGameLose,this);
        this.schedule(function(){
            if(this.curLevel!=null&&this.isLose==false&&this.life>0)
            {
                let attackTarget;
                attackTarget=this.curLevel.searchForEnemy(this.node,this.curTarget);
                if(attackTarget!=null)
                {
                    let flag:number=0;
                    let attribute=attackTarget.getComponent(enemy).attribute;
                    for(let i=0;i<this.kind.length;i++)
                    {
                        if(this.kind[i]==attribute)
                        {
                            flag=1;
                            break;
                        }
                    }
                    if(flag==1)
                    {
                        let startPos=cc.v2(this.node.x,this.node.y);
                    let endPos=cc.v2(attackTarget.x,attackTarget.y);
                    let dis=startPos.sub(endPos).mag();
                    if(attackTarget.active==true&&dis<=this.attackRange)
                    {
                        this.attack(attackTarget);
                        this.life--;
                        this.curLevel.slider[this.warriorNumber].getComponent(cc.ProgressBar).progress-=1.0/this.wholeLife;
                    }

                    }
                    
                   
                }
            }
            
           
        },1/this.attackRate);
        
    }  
    onGameLose()
    {
        this.isLose=true;
    }

    update(dt)
    {
        if(this.life<=0)
        {
            this.curLevel.isCreateWarrior[this.warriorNumber]=false;
             this.curLevel.slider[this.warriorNumber].active=false;     
            this.node.destroy();
        }
         
    }

}
