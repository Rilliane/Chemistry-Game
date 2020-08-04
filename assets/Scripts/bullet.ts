

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        displayName:"爆炸特效",
        type:cc.Prefab,
    })boom:cc.Prefab=null;
    
    power:number=0;

    life:number=0.6;

    kind:string[]=[];
    setPower(temp:number)
    {
        this.power=temp;
    }
    setKind(temp:string[])
    {
        this.kind=temp;
    }
    start () {

    }
    killSelf()
    {
        this.node.destroy();
    }
     update (dt) {
        this.schedule(this.killSelf,2,1,this.life);
     }
}
