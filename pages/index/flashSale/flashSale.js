const App = getApp();
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dictDataValue: "",
    productList: [],
    page_no: 1,//
    page_size: 6,//请求数量
    hasMoreData: true,
    goods_price: "",//单个商品价格
    selected: true,//判断选择哪个开抢时间
    selected1: false,//判断选择哪个开抢时间
    memberLevel: '',
    startTime:'',//秒抢开始时间
    laterTime: '',//第二个秒抢开始时间
    seckillId: '',//商品的标记
    first_attribute:'',// 规格属性1
    second_attribute:'',//规格属性2
    RunningStatus1:'',//判断商品是立即购买还是啥的状态
    RunningStatus2: '',//判断商品是立即购买还是啥的状态
    runningStatus:'',   //当前页面的购售状态
    stock :'',//判断商品是不是卖完
    id1:'',
    id2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      seckillId: options.seckillId,
    })

    console.log(that.data.seckillId)
    // that.selected()
    that.startPanicBuying()//调取限时秒抢的开枪时间接口
    that.productList()//调取限时秒抢的商品列表的接口

  },
  // 判断点击的那个时间段
  selected: function (e) {
    console.log(e)
    let seKillId = e.currentTarget.dataset.price;
    let status = e.currentTarget.dataset.status;
    console.log(seKillId)
    console.log(status)
    var that = this;
    that.setData({
      selected1: false,
      selected: true,
      seckillId: seKillId,
      runningStatus:status
    })
    console.log(that.data.runningStatus)
    that.productList()
  },
  selected1: function (e) {
    let seKillId = e.currentTarget.dataset.price;
    let status = e.currentTarget.dataset.status;
    console.log(seKillId)
    console.log(status)
    var that = this;
    that.setData({
      selected: false,
      selected1: true,
      seckillId: seKillId,
      runningStatus:status
    })
    that.productList()
  },
   
   //调取限时秒抢的开枪时间接口
  startPanicBuying:function(){
    var that=this;
    let data={
      method:'getSeckillTimeList',
      url_type:'recommen',
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res);
        var resultList = res.data.result.rs;
        console.log(resultList)
        for(var i=0 ; i < resultList.length; i ++){
          if(that.data.seckillId == resultList[i].id){
            that.setData({
              runningStatus:resultList[i].runing_status
            })
          }
        }
      
        var nowTime = resultList[0].start_time;
        var quickTime = resultList[1].start_time;
        nowTime = nowTime.substring(6, 8) + ":" + nowTime.substring(8, 10) + ':' + nowTime.substring(10, 12);
        quickTime = quickTime.substring(6, 8) + ":" + quickTime.substring(8, 10) + ':' + quickTime.substring(10, 12);
        that.setData({
          startTime: nowTime,
          laterTime: quickTime,
          RunningStatus1: resultList[0].runing_status,
          RunningStatus2: resultList[1].runing_status,
          id1: resultList[0].id,
          id2: resultList[1].id,
        })
      
      },
      fail: function () {
      },
    })

  },

  //限时秒抢列表里面的商品列表
  productList:function(e){
    var that = this;
    wx.showLoading({
      title:'加载中'
    })
    // let seKillId = e.currentTarget.
    let data ={
      method: 'getSeckillGoodsList',
      seckillId: that.data.seckillId,
      url_type:'recommen',
    }
    api.reqData({
      data,
      success:(res)=>{
        wx.hideLoading()
        var productList = res.data.result.rs;
        // console.log(productList)
        if (productList !=''){
          that.setData({
            result: productList,
          })
          console.log(that.data.result)
        }
        // else {
        //   that.setData({
        //     result: '',
        //   })
        // }
      },
      fail: function () {
      },
    })

  },
  //跳转商品详情
  tocommon: function (e) {
    var spu_id = e.currentTarget.dataset.id;
    console.log(spu_id)
    App.globalData.goods_price = e.currentTarget.dataset.price
    wx.navigateTo({
      url: '/pages/common/common?spuId=' + spu_id,
    })
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
    console.info('onPullDownRefresh')
    this.productList()
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.productList()
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})