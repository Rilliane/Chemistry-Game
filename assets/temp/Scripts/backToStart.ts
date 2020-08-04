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
            displayName:"要隐藏的内容",
            type:cc.Node
        }
        
    )disappearItem:cc.Node=null;
    start () {

    }
    backToStart() {
        let temp1=cc.sequence(cc.fadeOut(0.7),cc.callFunc(function(){
            cc.director.loadScene("start");
        }));
       this.disappearItem.runAction(temp1);
    }
    // update (dt) {}
}
