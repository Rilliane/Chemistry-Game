import bullet from "./bullet"
const {ccclass, property} = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {

    hurtMusic:cc.AudioClip=null;
   @property({
       tooltip:"小怪属性,分为酸性，碱性，和重金属离子",
       displayName:"属性",
       type:cc.String,
   })
   attribute:string="酸";

   @property(
       {
           displayName:"速度",
           type:cc.Integer,
       }
   )
   speed:number=100;

   @property(
    {
        type:cc.Integer,
        displayName:"生命",
    }
    )
    life:number=10;
   
    audioComponent:cc.AudioSource[]=[];
 
   move(points:cc.Vec2[])
   {
        let length=points.length;
        let moveAction:Array<cc.FiniteTimeAction>=new Array<cc.FiniteTimeAction>();
        for(let i=0;i<length;i++)
        {
            
            let moveTime:number=0;
            if(i==0)
            moveTime=points[0].sub(cc.v2(this.node.position.x,this.node.position.y)).mag();
            else{
                moveTime=points[i].sub(points[i-1]).mag();
            }
            moveTime=moveTime/this.speed;
            moveAction.push(cc.moveTo(moveTime,points[i]));
        }
        this.node.runAction(cc.sequence(moveAction));

   }
   die()
   {
       if(this.life<=0)
       {
            cc.director.emit("小怪死亡");
            this.node.destroy();
       }
       if(this.node.position.y<=-30&&this.life>0)
       {
            cc.director.emit("小怪死亡");
            cc.director.emit("小怪逃跑");
            this.node.destroy();
       }
       

   }

   onCollisionEnter(other, self) 
   {
        if(other.node.active==false)return;
        if(other.getComponent(cc.Collider).tag!=1)return;
        let tempKind:string[]=other.getComponent(bullet).kind;
        let flag:number=0;
        for(let i=0;i<tempKind.length;i++)
        {
             if(tempKind[i]==this.attribute)
             {
                 flag=1;break;
             }
        }
        if(flag==0)return;
        let temp:cc.Node=cc.instantiate(other.getComponent(bullet).boom);
        temp.setParent(cc.director.getScene());
        temp.setSiblingIndex(this.node.getSiblingIndex()+1);
        temp.position=this.node.position;

        let bulletPower=other.node.getComponent(bullet).power;
        other.node.destroy();
        this.life-=bulletPower;

        this.node.color=cc.Color.RED;

        this.schedule(function(){this.node.color=cc.Color.WHITE},1,1,0.2);

        for(let i=0;i<this.audioComponent.length;i++)
        this.audioComponent[i].play();
   }

   onLoad()
   {
   }

    start () {
        this.audioComponent=this.node.getComponents(cc.AudioSource);
    }

     update (dt) {
         this.die();
     }
}
