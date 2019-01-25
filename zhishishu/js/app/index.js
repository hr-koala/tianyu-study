$(function(){

$.getJSON("data/main.json" ,function(data,status){
    vm.$data.site = data;
    vm.initData()
}).error(function() {
    vm.initData()
});
var sitime;
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
    },
    computed: {
        /*动画参数*/
        animArr: function(){
            var obj = {
                1: {name: 'drop', option: {direction: 'right'}},
                2: {name: 'scale', option: {}},
                3: {name: 'blind', option: {direction: 'left'}},
                4: {},
                // 4: {name: 'explode', option: {pieces: 4}},
                // 4: {name: 'highlight', option: {}},
                // 4: {name: 'highlight', option: {color: '#fc0505'}},
            };
            return obj;
        },
        /*剩余的叶子id*/
        otherArr: function(){
            var list = this.questionList;
            var arr = [1,2,3,4,5,6,7,8,9,10];
            $.each(list, function(is, it){
                var i = arr.indexOf(it.id);
                if(i >= 0){
                    arr.splice(i, 1)
                }
            })
            return arr;
        }
    },
    methods: {
        /*初始化页面*/
        initData: function(){
            var str = sessionStorage.getItem('zhishishu')
            var obj = JSON.parse(str)
            if(obj){
                this.site = obj;
            }
            console.log(this.site);
            this.title = this.site.questionTitle;
            this.questionList = this.site.questionList;
            this.currentIndex = 0;
            this.currentObj = this.site.questionList[0]
            this.currAnim = this.animArr[this.site.animateType]

            if(this.site.isAutoPlayFlag){
                this.playTime = this.site.playTime * 1000;
                if(this.site.animateType == 4){
                }
            }
            this.autoAnimteFun()
        },
        /*选择叶子*/
        chooseLeafIndex: function(e){
            clearTimeout(sitime)
            var $box = $(e.target).closest('.box');
            var index = $box.data('index');
            this.hideAnim()
            this.currentIndex = index;
            this.currentObj = this.questionList[index];
        },
        /*自动播放动画*/
        autoAnimteFun: function(){
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
        /*下一个*/
        addNextNumFun: function(){
            clearTimeout(sitime)
            this.hideAnim()
            this.currentIndex += 1;
            if(this.currentIndex >= this.questionList.length){
                this.currentIndex = 0;
            }
            this.currentObj = this.site.questionList[this.currentIndex]
        },
        /*下一个动画*/
        nextAnimFun: function(){
            var _this = this;
            sitime = setTimeout(function(){
                _this.addNextNumFun()
                if(_this.site.isAutoPlayFlag){
                    _this.nextAnimFun()
                }
            }, _this.playTime)
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



})