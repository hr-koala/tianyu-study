$(function(){

$.getJSON("data/main.json" ,function(data,status){
    vm.$data.site = data
    vm.initData()
}).error(function() {
    vm.initData()
});
var sitime, sitime1;
vm = new Vue({
    el: '#all',
    data: {
        title: '', //标题
        site: {}, //存放的数据
        questionList: [], //所有叶子的数据
        currentObj: {}, //当前叶子的数据
        currentIndex: '', //当前叶子的下标
        playTime: '', //播放时间
        currAnim: {}, //当前动画参数
        navPostType: "", //导航位置
        isAutoFirstFlag: true, //自动播放时，是否是第一次播放
        timelineEl: '', //父元素
        boxWidth: 0,
    },
    computed: {
        /*动画参数*/
        animArr: function(){
            var obj = {
                1: {name: 'drop', option: {direction: 'right'}},
                2: {name: 'scale', option: {}},
                3: {name: 'blind', option: {direction: 'left'}},
                4: {},
            };
            return obj;
        }
    },
    methods: {
        /*初始化页面*/
        initData: function(){
            var str = sessionStorage.getItem('shijianzhou')
            var obj = JSON.parse(str)
            if(obj){
                this.site = obj;
            }
            console.log(this.site);
            this.navPostType = this.site.navPostType;
            this.title = this.site.questionTitle;
            this.questionList = this.site.questionList;
            this.currentIndex = 0;
            this.currentObj = this.site.questionList[0]
            this.currAnim = this.animArr[this.site.animateType]
            if(this.navPostType === 1){
                this.timelineEl = $('.main .timeline')
            }else{
                this.timelineEl = $('.con-main .timeline')
            }
            if(this.site.isAutoPlayFlag){
                this.playTime = this.site.playTime * 1000;
                if(this.site.animateType == 4){
                }
                sitime = setTimeout(this.autoAnimteFun, 100)
            }else{
                this.isAutoFirstFlag = false;
                sitime = setTimeout(this.autoAnimteFun, 100)
            }
            sitime = setTimeout(this.initWidth, 100)
        },
        /*计算方框宽度*/
        initWidth: function(){
            if(this.navPostType === 1){
                var w = $('.timeline .list').width() - 36 * 4;
                var w1 = w / 2;
                this.boxWidth = w1;
                $('.timeline .item').css('width', w1 + 'px')
            }else{
                this.boxWidth = 160;
            }
        },
        /*选择叶子*/
        chooseLeafIndex: function(e){
            var $box = $(e.target).closest('.box');
            var index = $box.data('index');
            this.currentIndex = index;
            this.currentObj = this.questionList[index];
            clearTimeout(sitime)
            this.changeIconClass()
            this.hideAnim()
        },
        /*上一个*/
        addPrevNumFun: function(){
            if(this.currentIndex === 0){
                return;
            }
            clearTimeout(sitime)
            this.hideAnim()
            this.currentIndex -= 1;
            this.changeIconClass()
            this.changeScroll()
            this.currentObj = this.site.questionList[this.currentIndex]
        },
        /*下一个*/
        addNextNumFun: function(){
            if(this.isAutoFirstFlag){
                if(this.currentIndex === this.questionList.length - 1){
                    this.isAutoFirstFlag = false;
                }
            }else{
                if(this.currentIndex === this.questionList.length - 1){
                    return;
                }
            }
            clearTimeout(sitime)
            this.hideAnim()
            this.currentIndex += 1;
            if(this.currentIndex >= this.questionList.length){
                this.currentIndex = 0;
            }
            this.changeIconClass()
            this.changeScroll()
            this.currentObj = this.site.questionList[this.currentIndex]
        },
        /*改变滚动条的样式*/
        changeScroll: function(){
            if(this.navPostType === 1){
                var h = (this.currentIndex - 3) * $('.timeline .post .box:first-child').outerHeight(true)
                $('.timeline .list').scrollTop(h)
            }else{
                var w = (this.currentIndex ) * $('.timeline .post .box:first-child').outerWidth(true)
                $('.timeline .list').scrollLeft(w)
            }
        },
        /*改变图标样式*/
        changeIconClass: function(){
            if(this.currentIndex === 0){
                $('.timeline .icon-prev').addClass('has')
            }else{
                $('.timeline .icon-prev').removeClass('has')
            }
            if(this.currentIndex === this.questionList.length - 1){
                $('.timeline .icon-next').addClass('has')
            }else{
                $('.timeline .icon-next').removeClass('has')
            }
        },
        /*自动播放动画*/
        autoAnimteFun: function(){
            var _this = this;
            if(this.site.animateType === 4){
                $('.animate').show(10, this.dissolveShow)
            }else{
                if(this.site.isAutoPlayFlag){
                    $('.animate').show(this.currAnim.name, this.currAnim.option, this.nextAnimFun)
                }else{
                    $('.animate').show(this.currAnim.name, this.currAnim.option)
                }
            }
        },
        /*下一个动画*/
        nextAnimFun: function(){
            var _this = this;
            sitime = setTimeout(function(){
                _this.addNextNumFun()
            }, _this.playTime)
        },
        /*导航方向为横向时，关闭弹窗*/
        closeMidMainFun: function(){
            $('.animate').hide(this.currAnim.name, this.currAnim.option)
        },
        /*隐藏*/
        hideAnim: function(){
            if(this.site.animateType === 4){
                this.dissolveHide()
            }else{
                $('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
                sitime = setTimeout(this.autoAnimteFun, 400)
            }
        },
        /*溶解 显示 或 隐藏*/
        dissolveShow: function(){
            var _this = this;
            $('.dongh').addClass('dh1')
            sitime = setTimeout(function(){
                $('.dongh').removeClass('dh1')
                if(_this.site.isAutoPlayFlag){
                    _this.nextAnimFun()
                }
            }, 900)
        },
        dissolveHide: function(){
            var _this = this;
            $('.dongh').addClass('dh2')
            sitime = setTimeout(function(){
                $('.dongh').removeClass('dh2')
                _this.autoAnimteFun()
            }, 900)
        },
    }
})

window.onresize =function(){
    vm.initWidth()
}


})