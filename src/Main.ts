//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////








class Main extends egret.DisplayObjectContainer {


    player: Player;

    private pointx: number;
    private pointy: number;
    /**
     * 加载进度界面
     * Process interface loading
     */




    private loadingView: LoadingUI;

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */

    /*
        private Judge(MyPlayer: Player) {
            egret.Ticker.getInstance().register(() => {
                if (MyPlayer.appearance.x == this.pointx && MyPlayer.appearance.y == this.pointy) {
                    MyPlayer.idel();
    
                }
            }, this)
        }
    */


    /*
    
        private Animate(MyPlayer: Player, bit: egret.Bitmap, playMod: number, playerAnimation: egret.Texture[], playerAnimation2: egret.Texture[]) {
            var frame = 0;
            var animateFrame = 0;
            egret.Ticker.getInstance().register(() => {
                
                if (MyPlayer.idState.GetIdleState()) {
    
                    if (frame % 8 == 0) {
                        bit.texture = playerAnimation[animateFrame];
                        animateFrame++;
                        if (animateFrame >= playMod) {
    
                            animateFrame = 0;
    
                        }
                    }
                    frame++;
                    if (frame >= playMod * 10) {
    
                        frame = 0;
                    }
    
    
                }
    
                if (MyPlayer.moState.GetMoveState()) {
                    if (frame % 8 == 0) {
                        bit.texture = playerAnimation2[animateFrame];
                        animateFrame++;
                        if (animateFrame >= playMod) {
    
                            animateFrame = 0;
    
                        }
                    }
                    frame++;
                    if (frame >= playMod * 10) {
    
                        frame = 0;
                    }
    
                }
    this.Judge(MyPlayer);
            }, this);
    
        }
    
    
    */




    private createGameScene(): void {
        var myGrid = new Grid(10, 10);


        var myMap = new TileMap(myGrid);
        this.addChild(myMap);

        this.player = new Player();
        this.addChild(this.player);
        this.player.x = 32;
        this.player.y = 32;

        this.touchEnabled = true;
        var index = 0;


        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {

            console.log("tap" + e.stageX + "  " + e.stageY);

            myMap.grid.setEndPoint(Math.floor(e.stageX / 64), Math.floor(e.stageY / 64));
            myMap.grid.setStartPoint(Math.floor(this.player.x / 64), Math.floor(this.player.y / 64));
            var myRoad = myMap.findPath();

            var targetX = myRoad[index].x * 64 + 64 / 2;
            var targetY = myRoad[index].y * 64 + 64 / 2;

            var dx = targetX - this.player.x;
            var dy = targetY - this.player.y;

            var dist = Math.sqrt(dx * dx + dy * dy);
            /*
            while (index < myRoad.length) {
                this.player.move(new Vector2(myRoad[index].x * 64, myRoad[index].y * 64));
                if (Math.floor(this.player.x / 64) == myRoad[index].x && Math.floor(this.player.y / 64) == )
                    index++;
            }

            if (dist < 1) {
                index++;
                if (index = myRoad.length) {
                    this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => { }, this);
                }
*/

            this.moveJudge(targetX, targetY);
            if (this.moveJudge(targetX, targetY) == 0)
                index++;
            console.log("current index" + index);
        }, this);



    }

    private moveJudge(x: number, y: number): number {
        this.player.move(new Vector2(x, y));
        while (true) {

            if (this.player.x == x && this.player.y == y) {
                return 0
            } else {
                return -1;
            }
        }


    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */

    private createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }



    /**
     * 切换描述内容
     * Switch to described content
     
    private changeDescription(textfield: egret.TextField, textFlow: Array<egret.ITextElement>): void {
        textfield.textFlow = textFlow;
    }
     */
}


