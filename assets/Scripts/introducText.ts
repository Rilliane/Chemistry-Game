
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  
    @property({
        displayName:"关卡文字内容",
        type:cc.String,
    })
    levelText:string[]=[];

    start () {

    }

    
}
