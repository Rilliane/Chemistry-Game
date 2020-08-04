// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(
        {
            displayName:"渐显时间",
            type:cc.Float
        }
    )
    disappearTime:number=0.7;

    @property(
        {
            displayName:"开场音乐",
            type:cc.AudioClip,
        }
    ) music:cc.AudioClip=null;
    onLoad () {
        this.node.opacity=0;
        this.node.runAction(cc.fadeIn(this.disappearTime));
    }

    start () {

        if(cc.audioEngine.isMusicPlaying()==false)
        {
              cc.audioEngine.playMusic(this.music,true);
        }
    }

    // update (dt) {}
}
