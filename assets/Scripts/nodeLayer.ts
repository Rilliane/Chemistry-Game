 
 cc.Class({
    extends: cc.Component,    
    //编辑器属性定义
    properties: {
        zIndex: {
            type: cc.Integer, //使用整型定义
            default: 0,            
            //notify用来监听属性值是否变化
            notify(oldValue) {                
                //判断与原来值是否一样
                if (oldValue === this.zIndex) {               
                    return;
                }
                this.node.zIndex = this.zIndex;
            }
        }
    },
    onLoad () {        
        this.node.zIndex = this.zIndex;
    }
});

