const App = getApp();
const api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dictDataValue: "",
    goodList: [],
    page_no: 1,//
    page_size: 6,//请求数量
    hasMoreData: true,
    goods_price: "",//单个商品价格
    memberLevel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
       dictDataValue: options.dictDataValue,
       memberLevel: App.globalData.memberLevel
    })
    console.log(this.data.dictDataValue)
    this.getMusicInfo()
  },
  //商品列表查询
  getMusicInfo: function () {
    var that = this
    var data = {
      begin: this.data.page_no,
      end: this.data.page_size,
      method: 'getGoodsListByCategoryId',
      dictDataValue: this.data.dictDataValue,
      url_type: 'classify'
    }

    //限制请求次数，防止商品重复
  // if (wx.getStorageSync("getDayUpte") == "") {
  //   wx.setStorageSync("getDayUpte", "getDayUpte")
    api.reqData({
      data,
      success: (res) => {
        console.log(res)
        var contentlistTem = that.data.goodList
        if (that.data.page_no == 1) {
          contentlistTem = []
        }
        var goodList = res.data.result.rs[0].getGoodsList.result.rs
         {
          that.setData({
            goodList: contentlistTem.concat(goodList),
            hasMoreData: true,
            page_no:that.data.page_no + 6
          })
        }
        // wx.removeStorageSync("getDayUpte");
      },
    })
  // }
},


  //跳转商品详情
  tocommon: function (e) {
    var spu_id = e.currentTarget.id;
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
    this.getMusicInfo()
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
      this.getMusicInfo()
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