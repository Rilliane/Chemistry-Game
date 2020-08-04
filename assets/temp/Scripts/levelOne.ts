// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// @ts-ignore

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        displayName:"当前关卡数目",
        type:cc.Integer,
    })
    levelNum=1;
    global: any;
    node: any;

    @property(
        {
            displayName:"要隐藏的内容",
            type:cc.Node
        }
        
    )disappearItem:cc.Node=null;

   
  
    // LIFE-CYCLE CALLBACKS:

     onLoad () {

        
     }
    isAvailable : boolean;//是否可进入；
    
   
    start () {
      
    }
    changeToLevel()
    {
       // cc.audioEngine.stopMusic();
        let levelName:string="level";
       //console.log("level name1:"+levelName);
        levelName=levelName+(this.levelNum-1).toString();
       // console.log("level name2:"+levelName);
       
        let temp1=cc.sequence(cc.fadeOut(0.7),cc.callFunc(function(){
            cc.director.loadScene(levelName);
            cc.audioEngine.stopMusic();
        }));
       this.disappearItem.runAction(temp1);
       this.schedule(this.musicDisappear,0.2,5,0);
        
    }
    musicDisappear() {
        let volume=cc.audioEngine.getMusicVolume()-0.2;
        cc.audioEngine.setMusicVolume(volume);
    }
    update(dt)
    {
    
    }


}
