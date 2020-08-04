// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property(
        {
            displayName:"开场音乐",
            type:cc.AudioClip,
        }
    )
    music:cc.AudioClip=null;

    @property(
        {
            displayName:"要隐藏的内容",
            type:cc.Node
        }
        
    )disappearItem:cc.Node=null;
    start () {
        if(cc.audioEngine.isMusicPlaying()==false)
         cc.audioEngine.playMusic(this.music,true);
        this.disappearItem.opacity=0;
        this.disappearItem.runAction(cc.fadeIn(0.7));
    }
    toChooseLevels(){
        //let temp:cc.Action=cc.fadeOut(1.0);
        let temp1=cc.sequence(cc.fadeOut(0.7),cc.callFunc(function(){
            cc.director.loadScene("chooseLevel");
        }));
       this.disappearItem.runAction(temp1);
        
    }
    
    // update (dt) {}
}
