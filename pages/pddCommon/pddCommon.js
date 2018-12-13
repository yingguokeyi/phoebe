// pages//pddCommon/pddCommon.js
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
    // 使用data数据对象设置样式名

  
    //商品规格

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
    RunningStatus:'',//判断商品是开始秒杀还是未开始
    good_id:'',   //商品id
    endTime:'',    //优惠券使用的结束时间
    gPrice:'',     //商品的最低拼团价格
    image:'',
    minOrder:'',    //优惠券的门槛价格
    nPrice:'',      //商品的单独购买价格
    name:'',      //商品的标题
    sold:'',      //商品售卖数量
    start:'',     //优惠券使用的开始时间
    count:'',     //优惠券的面额
    desc:'',       //商品描述
    phone:'',      //用户手机号
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

   //获取手机号
   getphone:function() {
    let data = {
      method: 'inviteFriends',
      token: App.globalData.Apptoken,
      url_type: 'myself'
    }
    api.reqData({
      data,
      success: (res) => {
        if (res.data.success==1){
          console.log(res.data)
          this.setData({
            phone: res.data.result.rs[0].inviteCode[0].InvitationCode
          })
        }else{
          console.log('获取手机号错误')
        }        
      },
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
    // console.log(options,'品多')
    var that = this;
    let detail_img = options.swiper;
    detail_img = detail_img.substring(1,detail_img.length-1);
    detail_img = detail_img.replace(/"/g,'');
    detail_img = detail_img.split(',');
    var imgObj;
    var imgStr = [];
    for(var i = 0 ; i < detail_img.length; i ++){
      const element = detail_img[i];
      if(element.indexOf('') != -1){
        imgObj = {
          path:detail_img[i]
        }
      }
      imgStr.push(imgObj)
    }
    that.setData({
      spu_id: options.spuId,
      goods_price: App.globalData.goods_price,
      memberLevel: App.globalData.memberLevel,   //纪录用户是否为会员
      hasLogin:App.globalData.hasLogin,
      good_id:options.goodId,
      endTime:util.js_date_time(options.endTime),    //优惠券使用的结束时间
      gPrice:options.gPrice,     //商品的最低拼团价格
      image:options.image,
      minOrder:options.minOrder,    //优惠券的门槛价格
      nPrice:options.nPrice,      //商品的单独购买价格
      name:decodeURIComponent(options.name),      //商品的标题
      sold:options.sold,      //商品售卖数量
      start:util.js_date_time(options.start),     //优惠券使用的开始时间
      count:options.count,     //优惠券的面额
      desc:decodeURIComponent(options.desc),
      detail_Imgs:imgStr
    })
    console.log(that.data.count,'ll')
    
    /** 判断场景值，1044 为转发场景，包含shareTicket 参数 */
    // if (options.scene == 1047 || options.scene == 1048) {
    //   console.log('小程序码扫码进入')
    //   that.setData({
    //       spu_id: decodeURIComponent(options.scene),
    //   })
    //   console.log(that.data.spu_id)
    // }
 
  },
  /**
   * 选择商品规格
   * @param {detail} 
   */
 
  

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

  //按钮立即购买
  buyMinus() {
    var that = this;
    if (!App.globalData.hasLogin) {   //需要登录
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {     //已经登录

      let good = '[' + that.data.good_id + ']';
      if (that.data.phone == '') {
        App.globalData.hasLogin = false;
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return;
      }
      let data = {
        url_type: 'pdd',
        method: 'getUrlGenerate',
        goods_id_list: good,
        phone: that.data.phone
      }
      api.reqData({
        data,
        success: (res) => {
          // console.log(res.data, 'df')
          //拿到的路径     
          let appData = res.data.result.rs[0].result.goods_promotion_url_generate_response.goods_promotion_url_list[0].we_app_info;
          console.log(appData)
          wx.navigateToMiniProgram({
            appId: appData.app_id,
            path: appData.page_path,
            extraData: {
              foo: 'bar'
            },
            envVersion: 'release',
            success(res) {
              // 打开成功
              console.log(res)
            }
          })
        },
      })

    }
   
  },

/**
* 用户点击右上角分享
*/  
  onShareAppMessage: function (res) {
    // console.log(res,'小xiao');
    
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
    // var title = "￥" + (this.data.contrast[0].market_price/100).toFixed(2)+' '+this.data.goods_data.spu_name;
    var title = "￥" + ((this.data.gPrice - this.data.count )/ 100).toFixed(2) + ' ' + this.data.name;
    return {
      title: title,
      // path:link,
      success: function (res) {
        // 转发成功
        console.log(res);
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
 
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getphone()
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



