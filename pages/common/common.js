// pages//common/common.js
const App = getApp();
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,//tab切换
    selected1: false,//tab切换
    isTouchMove: false,// 侧边栏
    hiden: false,
    //swiper相关
    imgList:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,    
    duration: 1000,
    circular: true,
    pic_info: '',//轮播
    goods_list: '',//商品分类
    goods_imgs: '',
    detail_Imgs:'',
    goods_data: '',//商品口味
    // 使用data数据对象设置样式名
    choose_modal: "none",
    isScroll: false,
    spu_id: '',//商品spuid
    contrast: [],//对比
    datasetid: '',
    numberid: '',
    //商品规格
    order_type: '',
    order_model: '',
    goods_price: '',//单个商品价格
    seckill_price:'',//秒杀价格
    list_seckill:'',//选择秒杀价
    num: App.globalData.num,
    list_price: '',//选择价格
    repertory: '',//库存
    pro_attr:[],
    share_modal:'none',
    scrollTop:0,
    floorstatus:false,
    memberLevel:'',
    isCollect:'',
    hasLogin:'',
    delivery:'', //配送说明
    nextAttr:[],
    shareImage:'',
    showSharePic:false,
    good_price:'',
    goodSource:'',
    access_token:'',   //获取的token，便于获得小程序码
    scene:'',    //小程序要携带的参数
    album_mask:'none',   //生成分享朋友圈图片的模态框的显示
    good_mask:'none',  //生成商品二维码图片的模态框
    backImg:'../../image/new/backShare.png',
    radioCode:'',    //圆形二维码
    rectCode:'',      //方形二维码
    canBuy:false,
    plan_group:'',//判断是秒杀情况还是其他情况
    columnShow:'',//判断限时秒抢栏目的显示
    countDownHour:'',
    countDownMinute :'',
    countDownSecond:'',
    marke_price:'',//秒杀价钱
    enabled:'',//选择商品属性的时候判断是不是秒杀的
    skuEnabled:'',//选择商品属性弹框里面的sku是不是秒杀的
    sprice:'',//商品详情页弹框里面的秒杀价格
    goods_sprice: '',//单个商品秒杀价格
    RunningStatus:''//判断商品是开始秒杀还是未开始
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  goHome:function(e){   //回到首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goTop:function(e){   //回到顶部
    this.setData({
      scrollTop:0,
    })
  },

  scroll:function(e,res){
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if(e.detail.scrollTop > 300){
      this.setData({
          floorstatus: true
      });
    }else {
      this.setData({
          floorstatus: false
      });
    }
  },

  onLoad: function (options) {
    var that = this;

    console.log(App.globalData.hasLogin)
    that.setData({
      spu_id: options.spuId,
      // goods_price: App.globalData.goods_price,
      memberLevel: App.globalData.memberLevel,   //纪录用户是否为会员
      hasLogin:App.globalData.hasLogin 
    })
  
   
    /** 判断场景值，1044 为转发场景，包含shareTicket 参数 */
    // if (options.scene == 1047 || options.scene == 1048) {
    //   console.log('小程序码扫码进入')
    //   that.setData({
    //       spu_id: decodeURIComponent(options.scene),
    //   })
    //   console.log(that.data.spu_id)
    // }
    that.getGoodsMsg();  
  },
  /**
   * 选择商品规格
   * @param {detail} 
   */
  getDetail:function(detail){
    // 判断字符串是否为空 undefined 0
    if (typeof(detail) == "undefined" || detail == 0 ) {
        return "";
    }
    console.log(detail);

    // 当前将换行符转换为↵
    detail = detail.replace(/\n\r/g, "↵");
    // 若有转换完成出现两个↵则替换为一个
    detail = detail.replace(/↵↵/g, "↵");
    // 因为会出现多种情况，为了避免截取之后出现多个空格，下面的截取成为数组之后没法判断第一个或者最后一个是几个空格
    // 需要将多个空格转化为一个空格
    detail = detail.replace(/\s+/g, " ");
    // 将替换好的字符串进行截取成数组
    var arr = detail.split(' ');
    
    // 去除第一个数组为空格
    if (arr[0] == ' ' || arr[0] == '') {
        arr.splice(0,1);
    }
    console.log(arr)
    //去除最后一个数组为空格
    if (arr[arr.length-1] == '' || arr[arr.length-1] == ' ') {
        arr.splice(arr.length-1,1);
    }
    // 整理成最终的格式
    var detailArr = [];
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        let tmpArr;
        var timpObj;
        if (element.indexOf('') != -1) {
          tmpArr = element.split(':');
          timpObj = {
            name: tmpArr[0],
            value: tmpArr[1]
          }
        } else if (element.indexOf(',') != -1){
          tmpArr = element
          timpObj = {
            value: tmpArr
          }
        }
        detailArr.push(timpObj);
       
    }
    return detailArr;
    console.log(detailArr)
  },

  //商品加载
  getGoodsMsg() {
    const self = this;
    console.log("商品spu_id="+self.data.spu_id)
    let data = {
      method: 'getSpu',
      spuId: self.data.spu_id,
      token: App.globalData.Apptoken,
      url_type: 'index'
    }
    console.log(data)
    api.reqData({
      data,
      success: (res) => {
        // console.log(res,'哈哈')
        console.log(res.data.result.rs,'商品详情')
        let goodSpu = res.data.result.rs[5].sku;//商品的属性
        let goodTime = res.data.result.rs[4].planGroupInfo;//获得商品的倒计时
        var goodPrice;
        var goodiSprice;
        var plan_group = goodTime[0].plan_group;//判断参加秒杀的商品
        //时间的遍历
        if (plan_group == 1) {
          for (var i = 0; i < goodTime.length; i++){
            //开始时间
              var startTime = goodTime[i].start_time;
              var startDate = new Date(startTime).getTime();
              startTime = "20" + startTime.substring(0, 2) + "/" + startTime.substring(2, 4) + "/" + startTime.substring(4, 6) + " " + startTime.substring(6, 8) + ":" + startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
              var startDate = new Date(startTime).getTime();
              //结束时间
              var endTime = goodTime[i].end_time;
              endTime = "20" + endTime.substring(0, 2) + "/" + endTime.substring(2, 4) + "/" + endTime.substring(4, 6) + " " + endTime.substring(6, 8) + ":" + endTime.substring(8, 10) + ":" + endTime.substring(10, 12);
              var endDate = new Date(endTime).getTime();
              //获取系统当前时间
              var currentDate = new Date();
              currentDate = currentDate.getTime()
              //时间段要注意两种情况一种是刚进来就已经开始倒计时，还有就是到页面还没有倒计时，就用结束的时间减去当前的时间
              var totalSecond;
              //秒抢开始时间减去当前时间就是当前时间到开始倒计时之间的时间段
              var startSecond = startDate - currentDate;
              if (startSecond <= 0) {//已经在倒计时了
                totalSecond = parseInt((endDate - currentDate) / 1000);
                self.setData({
                  columnShow: 2
                })
                self.countdown(totalSecond)
              } else if (startSecond > 0) {//还没有倒计时
                totalSecond = parseInt((endDate - startDate) / 1000);
                self.setData({
                  columnShow:1
                })
                var howmany = parseInt(startSecond / 1000);//当前时间到开始倒计时之间的时间段
                self.countdown(howmany)
                  //倒计时开始时间
                setTimeout(function () {
                  self.countdown(totalSecond)
                }, startSecond)
              }
          }
        }

        for (var i = 0; i < goodSpu.length; i++) {
          var plan_group = goodSpu[i].plan_group;
          var sprice = goodSpu[i].sprice;//商品秒杀价钱
          var skuEnabled = goodSpu[i].enabled;//判断sku里面的状态
          self.setData({
            plan_group: plan_group,
            sprice:sprice,
            skuEnabled:skuEnabled,//判断sku里面的状态
          })
          if (goodSpu[i].is_default == '1') {
            goodPrice = goodSpu[i].market_price;
            self.setData({
              goods_price: goodPrice,
            })
            break;
          }
        } 

        self.setData({
          goods_imgs: res.data.result.rs,
          goods_list: res.data.result.rs[0].spuAttribute,
          imgList: res.data.result.rs[2].showImgs,
          detail_Imgs: res.data.result.rs[3].detailImgs,
          goods_data: res.data.result.rs[1].spuBase[0],
          contrast: res.data.result.rs[5].sku,
          list_price: res.data.result.rs[5].sku[0].market_price,
          repertory: res.data.result.rs[5].sku[0].stock,
          datasetid: res.data.result.rs[5].sku[0].first_attribute_id,
          numberid: res.data.result.rs[5].sku[0].second_attribute_id,
          enabled:res.data.result.rs[5].sku[0].enabled,
          plan_group: res.data.result.rs[4].planGroupInfo[0].plan_group,
          marke_price:res.data.result.rs[4].planGroupInfo[0].marke_price,//商品的秒杀价
          RunningStatus:res.data.result.rs[4].planGroupInfo[0].runing_status,//判断商品是否秒抢
          sprice:res.data.result.rs[5].sku[0].sprice,//商品弹框的秒杀价
          pro_attr:self.getDetail(res.data.result.rs[1].spuBase[0].detail),
          delivery: res.data.result.rs[1].spuBase[0].distribution,
          goodSource:res.data.result.rs[1].spuBase[0].source_code
        })

        if(res.data.result.rs[1].spuBase[0].source_code == 'ZDZ'){
          self.setData({
            canBuy:true
          })
        }else{
          self.setData({
            canBuy:false
          })
        }
      }
    })
  },
  

  //  倒计时方法
  countdown: function (totalSecond) {
    var that = this;
    var interval = setInterval(function () {
      // 总秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      that.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        this.setData({
          plan_group : 2,
        });
      }
    }.bind(that), 1000);

  },
  //弹出
  modal_show: function (e) {
    var that = this;
    var contrast = that.data.contrast;
    var goodslists = that.data.goods_list;
    var imgList = that.data.imgList;
    var skuEnabled =that.data.skuEnabled; //enabled判断商品是不是参与秒杀的
    var RunningStatus = that.data.RunningStatus;//判断商品还没到时间进行秒杀
    console.log(RunningStatus)
    if (contrast.length==1){
      App.globalData.order_model = goodslists[0].attribute_value
      for(var i = 0 ; i <that.data.goods_list.length ; i++){
        // if(that.data.contrast[0].first_attribute_id == that.data.goods_list[i].id){
        //   App.globalData.order_type =that.data.goods_list[i].attribute_value
        // }
        if(that.data.goods_list[i].position == 2){
          App.globalData.order_model = that.data.goods_list[i].attribute_value;
          break ;
        }else{
          App.globalData.order_model = '';
        }  
      } 
      //商品价格通过页面传值的方法传输
      App.globalData.order_price = contrast[0].market_price;
     
      //商品数量通过页面传值的方法传输
      App.globalData.num = this.data.num;
      App.globalData.repertory = this.data.repertory;
      App.globalData.skuEnabled = this.data.skuEnabled;
      App.globalData.RunningStatus = this.data.RunningStatus;
      // App.globalData.enabled = this.data.enabled;
      var sku_id = contrast[0].id;
      var spu_id = this.data.spu_id
        //进行判断商品sku里面的enabled是不是秒杀的情况
        if(RunningStatus==''||RunningStatus==1||RunningStatus==3){
           //商品价格通过页面传值的方法传输
          App.globalData.order_price = contrast[0].market_price;
     }else if(skuEnabled==1 && RunningStatus==2){
         //商品价格通过页面传值的方法传输
         App.globalData.order_prices = contrast[0].sprice;
     }


      if (!App.globalData.hasLogin) {   //需要登录(转发情况)
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }else{
        wx.navigateTo({
          url: '/pages/buy/submitOrder/submitOrder?sku_id=' + sku_id + '&spu_id=' + spu_id,
        })
      }
   }else{ 
    for(var i = 0,autoNextAttr=[]; i < goodslists.length ; i++){   //从goodslists第一个默认显示有几个second的属性
      if(goodslists[i].position == 1){
        for(var j = 0;j<contrast.length;j++){
          if(goodslists[i].id == contrast[j].first_attribute_id){
            autoNextAttr.push(contrast[j].second_attribute_id)
          }
        }
      }
      break;
    }
   
    for(var a=0,attr=[];a<autoNextAttr.length;a++){    //根据找到的规格再遍历goodslists取到属性名字
      for(var i = 0;i<goodslists.length;i++){
        if(autoNextAttr[a] == goodslists[i].id){
          attr.push(goodslists[i])
        }
      }
    }
   
    this.setData({
      //flag: flag,
      choose_modal: "block",
      nextAttr:attr,
   
    });
    console.log(this.data.nextAttr)
   }
  },
  //消失
  modal_none: function () {
    this.setData({
      choose_modal: "none",
    });
    console.log(this.noScroll)
  },

  clickImage: function (e) {   //点击放大图片
    for(var i = 0,arr =[]; i<this.data.imgList.length; i ++){
      arr += this.data.imgList[i].image_path
    }
    arr = arr.split(' ').splice(1)
    var index = e.target.dataset.index;
    wx.previewImage({
      current:arr[index],
      urls: arr,//内部的地址为绝对路径
    })
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  // 减少商品数量
  bindMinus: function () {
    console.log(this.data.num)
    let num = this.data.num
    if (num > 1) {
      num--
    } else {
      num = 1
    }
    this.setData({
      num: num
    })
  },

  //点击加号
  bindPlus: function () {
    console.log(this.data.num)
    let num = this.data.num
    //let nummax = this.data.list[0].sale_qty
    let buyconfineStr = this.data.contrast[0].buyconfine
    let buyconfine = buyconfineStr==""?0:buyconfineStr
    let repertory = this.data.repertory
    if (buyconfine!=0&&num >= buyconfine) {
      wx.showToast({
        title: '此商品限购了',
        duration: 2000
      })
      return
    } 
    if (num >= repertory){
      wx.showToast({
        title: '库存不够哦',
        duration: 2000
      })
      return
    }
    num++
    this.setData({
      num: num
    })
  },

  //获取参数
  switchTab(e) {
    const self = this;
    for(var i = 0,getAttr = []; i < self.data.contrast.length; i ++){
      if(self.data.contrast[i].first_attribute_id == e.target.dataset.id){
        console.log(self.data.contrast[i].id)
        getAttr.push(self.data.contrast[i].second_attribute_id)
      }
    }
    for(var j = 0,attr=[] ; j < self.data.goods_list.length ; j++){
      for(var a = 0 ; a < getAttr.length ; a++){
        if(self.data.goods_list[j].id == getAttr[a]){
           attr.push(self.data.goods_list[j])
        }
      }
    }
    if(attr.length != 0){
      this.setData({
        numberid:attr[0].id,
      })
    }
    this.setData({
      isScroll: true,
      datasetid: e.target.dataset.id,
      nextAttr: attr,
      order_type: e.target.dataset.paramg,
    })
    // setTimeout(function () {
    //   self.setData({
    //     curIndex: e.target.dataset.index,
    //   })
    // }, 0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    }, 1)
    this.listprice();
  },
  //获取参数
  buyTab(e) {
    const self = this;
    this.setData({
      isScroll: true,
      numberid: e.target.dataset.id,
      order_model: e.target.dataset.species
    })
    console.log(this.data.order_model)
    // setTimeout(function () {
    //   self.setData({
    //     curIndexs: e.target.dataset.index,
    //   })
    // }, 0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    }, 1)

    this.listprice();
  },
  //商品价格变动
  listprice: function () {
    var that = this;
    var nums1 = that.data.datasetid;
    var nums2 = that.data.numberid;
    var contrast = that.data.contrast;
    console.log(contrast)
    //遍历筛选出sku_id
    for (var i = 0; i < contrast.length; i++) {
      var first_id = contrast[i].first_attribute_id;
      var second_id = contrast[i].second_attribute_id;
      if (nums1 == first_id && nums2 == second_id) {
        var sku_id = contrast[i].id;
        this.setData({
          list_price: contrast[i].market_price,
          list_seckill: contrast[i].seckill_price,
          repertory: contrast[i].stock,
          enabled:contrast[i].enabled,
          sprice:contrast[i].sprice,
          RunningStatus:contrast[i].runing_status,
          // seckill_price:contrast[i].seckill_price,
        });
      }
    }
  },
  //按钮立即购买
  buyMinus() {
    if (!App.globalData.hasLogin) {   //需要登录
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      var that = this;
      //判断用户是否选择商品属性
      if (that.data.numberid == '' || that.data.datasetid == '') {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
        return;
      }
      var nums1 = that.data.datasetid;
      var nums2 = that.data.numberid;
      var contrast = that.data.contrast;
      console.log(contrast)
      //遍历筛选出sku_id
      for (var i = 0; i < contrast.length; i++) {
        var first_id = contrast[i].first_attribute_id;
        var second_id = contrast[i].second_attribute_id;
        var skuEnabled = contrast[i].enabled;
        var RunningStatus = contrast[i].runing_status;
        if (nums1 == first_id && nums2 == second_id && (skuEnabled==0||RunningStatus==3||RunningStatus==1||RunningStatus=='') ) {//没有参加秒杀的商品
          var sku_id = contrast[i].id;
          var price = contrast[i].market_price;
        }else if(nums1 == first_id && nums2 == second_id && (skuEnabled==1||RunningStatus==2) ){//参加秒杀的商品
          var sku_id = contrast[i].id;
          var prices = contrast[i].sprice;
        }
      }
      //判断sku_id是否为undefined
      if (sku_id == undefined || sku_id==''){
        wx.showModal({
          title: '提示',
          content: '亲,您选择的商品规格库存暂时没有！',
          showCancel: false
        })
        return;
      }
      //商品价格通过页面传值的方法传输
      App.globalData.order_price = price;
      App.globalData.order_prices = prices;
      App.globalData.skuEnabled =skuEnabled;
      App.globalData.RunningStatus =RunningStatus;
      //如果商品规格没有选择的情况下，默认为第一个sku的规格
      // if (that.data.order_type==''){
      //   App.globalData.order_type = that.data.goods_list[0].attribute_value       
      // }
      // if (that.data.order_model == ''){
      //   App.globalData.order_model = that.data.goods_list[1].attribute_value
      // }
      // if (that.data.order_type != '' && that.data.order_type != ''){
      //   App.globalData.order_type = that.data.order_type
      //   App.globalData.order_model = that.data.order_model
      // }


      if (that.data.order_type=='' && that.data.order_model == ''){  //两个属性都没有点
        App.globalData.order_type = that.data.goods_list[0].attribute_value     
        for(var i = 0 ; i <that.data.goods_list.length ; i++){
          if(that.data.goods_list[i].position == 2){
            App.globalData.order_model = that.data.goods_list[i].attribute_value;
            break ;
          }else{
            App.globalData.order_model = '';
          }  
        }
      }else if(that.data.order_type=='' && that.data.order_model != ''){  //点击了第二个属性
        App.globalData.order_type = that.data.goods_list[0].attribute_value
        App.globalData.order_model = that.data.order_model
      }else if(that.data.order_type!='' && that.data.order_model == ''){  //点击了第一个属性
        App.globalData.order_type = that.data.order_type
        for(var i = 0 ; i <that.data.goods_list.length ; i++){
          if(that.data.goods_list[i].position == 2){
            App.globalData.order_model =that.data.goods_list[i].attribute_value;
            break ;
          }else{
            App.globalData.order_model = '';
          }  
        }
      }else if (that.data.order_type != '' && that.data.order_type != ''){  //两个属性都点击了
        App.globalData.order_type = that.data.order_type
        App.globalData.order_model = that.data.order_model
      }
      //商品数量通过页面传值的方法传输
      App.globalData.num = this.data.num;
      App.globalData.repertory = this.data.repertory;
      var spu_id = this.data.spu_id
      wx.navigateTo({
        url: '/pages/buy/submitOrder/submitOrder?sku_id=' + sku_id + '&spu_id=' + spu_id,
      })
    }
  },
  
  getDis:function(){
    wx.showToast({
      title: '功能暂未开放',
      icon: 'none',
      duration: 2000
    })
  },

  //调到分享页面
  goShare:function(){
    this.setData({
      share_modal:'block'
    })
  },
  cancel:function(){    //取消模态框
    this.setData({
      share_modal:'none'
    })
  },
  goCode:function(){
    this.setData({
      share_modal:'none'
    })
    // wx.navigateTo({
    //   url: '/pages/common/shareCode/shareCode'
    // })
    wx.showToast({
      title: '功能暂未开放',
      icon: 'none',
    })
  },
  share:function(){
    this.setData({
      share_modal:'none'
    })
    wx.navigateTo({
      url:'/pages/common/sharePro/sharePro?goods_id='+this.data.spu_id
    })
    
  },

/**
* 用户点击右上角分享
*/  
  onShareAppMessage: function (res) {
    // console.log(res,'转发');
    
    //转发设withShareTicket为true,可以二次转发
    wx.showShareMenu({
      withShareTicket: true
    })

    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route
    url=url+'?code='+this.data.invitecode
    console.log(url)
    var title = "￥" + (this.data.contrast[0].market_price/100).toFixed(2)+' '+this.data.goods_data.spu_name;
    return {
      title: title,
      // path:link,
      success: function (res) {
        // 转发成功
        // console.log(res,'jh');
        var shareTickets = res.shareTickets
        if (shareTickets) {
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({        
            shareTicket: shareTickets[0],
            success: function (res) {
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },

  //点击显现
  del: function (e) {
    console.log(e)
    if (this.data.isTouchMove) {
      this.setData({
        isTouchMove: false,
        hiden: false
      });
    } else {
      this.setData({
        isTouchMove: true,
        hiden: true
      });
    }
  },
  //选项卡切换
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  
  /**
   * 加入购物车
   */
  toAddShopCar:function(){
    wx.showToast({
      title: '暂未开通此功能',
      icon: 'none',
      duration: 2000
    })
  },

  Collecting:function(){     //用户进行收藏
    let data={
      method: 'storeGoods',
      token: App.globalData.Apptoken,
      spuId:this.data.spu_id,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res.data)
        if(res.data.success == 1){
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
    })
  },
  // 1是收藏的  2 没有收藏
  noCollect:function(){   //取消收藏
    let data={
      method: 'unStoreGoods',
      token: App.globalData.Apptoken,
      spuIdStr:this.data.spu_id,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res.data)
        if(res.data.success == 1){
          wx.showToast({
            title: '取消收藏成功',
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },

  noneModal:function(){
    this.setData({
      album_mask:'none',
    
    })
  },

  // 分享到朋友圈
  showShare:function(){
    let that = this;
    that.setData({
      album_mask:'block'
    })
    that.saveImageToPhotosAlbum()
  },
   //分享商品二维码
  goodShare:function(){
    this.setData({
      good_mask:'block'
    })
    this.getGoodCode()
  },

  noGoodModal:function(){
    this.setData({
      good_mask:'none'
    })
  },

  getGoodCode:function(){
    var that = this;
    wx.showLoading({
			title: '正在生成图片...',
			mask: true,
    });
    
    const canvaCtx = wx.createCanvasContext('goodCanvas');
    canvaCtx.drawImage(that.data.backImg,0,0,240,   );
    canvaCtx.drawImage(that.data.rectCode,50,115,140,160);
    
    let codeText = '长按识别二维码';
    canvaCtx.setFontSize(18);
    canvaCtx.setFillStyle('#333333');
    canvaCtx.setTextAlign('right');
    canvaCtx.fillText(codeText, 0, 220);
    canvaCtx.draw()
    wx.hideLoading()
    

    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token', //仅为示例，并非真实的接口地址
      data: {
        grant_type: 'client_credential' ,
        appid: 'wxf2da843fe3bd9967',
        secret:'91bead3947b232ce322001db13884710'
      },
      header: {
        'content-type': 'application/json' // 默认值
      }, 
      success: function(res) {
        console.log(res);
        that.setData({
          access_token: res.data.access_token,
        })
        wx.request({
          url:App.globalData.url_base+'classify?pid='+that.data.spu_id+'type='+'scan',
          data: {
            method: "getGoodsQR",
            access_token: res.data.access_token,
            // scene: 'pid='+that.data.spu_id+'&type=scan',
            path: 'pages/common/common',
            width: 80,
            // url_type: 'classify'
          },
          success:function(){
            that.setData({
              rectCode:App.globalData.url_base+'classify?method=getGoodsQR&access_token='+that.data.access_token+'&path=pages/common/common'+'&width=280',
              share_modal:'none',
              good_mask:'block'
            })        
            console.log('二维码图片'+that.data.rectCode)
            wx.showLoading({
              title: '正在生成图片...',
              icon:'loading',
              mask: true,
            });
            const canvaCtx = wx.createCanvasContext('goodCanvas');
            canvaCtx.drawImage(that.data.backImg,0,0,240,370);
            canvaCtx.drawImage(that.data.rectCode,50,115,140,160);
            
            let codeText = '长按识别二维码';
            canvaCtx.setFontSize(18);
            canvaCtx.setFillStyle('#333333');
            canvaCtx.setTextAlign('right');
            canvaCtx.fillText(codeText, 0, 220);
            canvaCtx.draw()
            wx.hideLoading()
          },
          fail:function(){

          }
        }) 
      }
    })
  },

  saveImageToPhotosAlbum:function () {
    var that = this;
    wx.showLoading({
			title: '正在生成图片...',
			mask: true,
		});
    wx.getImageInfo({
			src: that.data.imgSrc,//服务器返回的带参数的小程序码地址
			success: function (res) {
				//res.path是网络图片的本地地址
				let goodsPicPath = res.path;
				console.log(res)
				that.drawSharePic(goodsPicPath,goodsPicPath)
			},
			fail: function (res) {
        //失败回调
        wx.showToast({
          title:'获取图片资源失败,请重试~',
          icon:'none',
          duration: 1000
        })
			}
		});
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token', //仅为示例，并非真实的接口地址
      data: {
        grant_type: 'client_credential' ,
        appid: 'wxf2da843fe3bd9967',
        secret:'91bead3947b232ce322001db13884710'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res);
        let data ={
          method: "getGoodsQR",
          access_token: res.data.access_token,
          scene: 'pid='+that.data.spu_id+'&type=scan',
          path: 'pages/common/common',
          width: 80,
          url_type: 'classify'
        }
        that.setData({
          access_token: res.data.access_token,
          scene:data.scene
        })
        api.reqData({
          data,
          success: (res) => {
            if (res.statusCode == 200) {
              console.log(that.data.access_token,that.data.scene)
              that.setData({
                radioCode: App.globalData.url_base+'classify?method=getGoodsQR&width=80&path=pages/common/common&access_token='+that.data.access_token+'&scene='+that.data.scene,
                share_modal:'none',
                album_mask:'block'
              })
              that.drawSharePic(that.data.imgList[0].image_path,that.data.radioCode)
            }
          },
          fail: function () {
          },
        })
      }
    })
	},
	/**
	 * 绘制分享的图片
	 * @param goodsPicPath 商品图片的本地链接
	 * @param qrCodePath 二维码的本地链接
	 */
	drawSharePic: function (goodsPicPath, qrCodePath) {
		var that = this;
		
		//y方向的偏移量，因为是从上往下绘制的，所以y一直向下偏移，不断增大。
		let yOffset = 20;
		const goodsTitle = that.data.goods_data.spu_name;
		let goodsTitleArray = [];
		//为了防止标题过长，分割字符串,每行13个
		for (let i = 0; i < goodsTitle.length / 13; i++) {
			if (i > 1) {
				break;
			}
			goodsTitleArray.push(goodsTitle.substr(i * 11, 11));
		}
    const price = (that.data.goods_price/100).toFixed(2);
    var cashBack;
    var goods=that.data.contrast[0];
    cashBack = ((goods.original_price-goods.market_price)*goods.outsider_self/10000).toFixed(2)

		const marketPrice = '128.00';
		const title1 = '您的好友邀请您一起分享精品好货';
		const title2 = '立即打开看看吧';
		const codeText = '长按识别小程序码';
		const imgWidth = 780;
		const imgHeight = 1600;

		const canvasCtx = wx.createCanvasContext('shareCanvas');
		//绘制背景
		canvasCtx.setFillStyle('white');
		canvasCtx.fillRect(0, 0, 242, 377);

		//绘制商品图片
    canvasCtx.drawImage(goodsPicPath, 0, 0, 242, 280);
    console.log(goodsPicPath)
		//绘制商品标题
		yOffset = 300; 
		goodsTitleArray.forEach(function (value) {
			canvasCtx.setFontSize(12);
			canvasCtx.setFillStyle('#333333');
			canvasCtx.setTextAlign('left');
			canvasCtx.fillText(value, 12, yOffset);
			yOffset += 20;
		});
		//绘制价格
		// yOffset += 10;
		canvasCtx.setFontSize(10);
		canvasCtx.setFillStyle('#f9555c');
		canvasCtx.setTextAlign('left');
		canvasCtx.fillText('￥', 14, yOffset);
		canvasCtx.setFontSize(12);
		canvasCtx.setFillStyle('#f9555c');
		canvasCtx.setTextAlign('left');
    canvasCtx.fillText(price, 24, yOffset);
    canvasCtx.fillText(prices, 24, yOffset);
		//绘制原价
	  if(that.data.contrast[0].outsider_self > 0){
      const xOffset = (price.length / 2 + 1) * 12 + 47;
      canvasCtx.setFontSize(10);
      canvasCtx.setFillStyle('#999999');
      canvasCtx.setTextAlign('left');
      canvasCtx.fillText('返现:¥' + cashBack, xOffset, yOffset);
    }
		// //绘制原价的删除线
		// canvasCtx.setLineWidth(1);
		// canvasCtx.moveTo(xOffset, yOffset - 6);
		// canvasCtx.lineTo(xOffset + (3 + marketPrice.toString().length / 2) * 14.5, yOffset - 6);
		// canvasCtx.setStrokeStyle('#999999');
		// canvasCtx.stroke();
		//绘制最底部文字
		// canvasCtx.setFontSize(18);
		// canvasCtx.setFillStyle('#333333');
		// canvasCtx.setTextAlign('right');
		// canvasCtx.fillText(codeText, 230, 980);
		//绘制二维码
    canvasCtx.drawImage(qrCodePath, 160, 290, 70, 70);
    console.log(qrCodePath)
    canvasCtx.draw();
    // console.log('商品链接'+that.data.imgList[0].image_path)
    // console.log('二维码链接'+ that.data.radioCode)
    
    wx.hideLoading();
	
	},
  
  canvasToImage:function(canvas) {  
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,    
      canvasId: canvas,
      quality:1,
      success: function (res) {
        console.log(res.tempFilePath)
        that.setData({
          shareImage: res.tempFilePath,
          showSharePic: true,
          share_modal:'none',
          good_mask:'none'
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath
        })
        wx.showToast({
          title: '已保存到相册'
        })
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading();
      }
    })
  },

  rectToImage:function(){
    this.canvasToImage('goodCanvas')
  },

  radioToImage:function(){
    this.canvasToImage('shareCanvas')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }

})



