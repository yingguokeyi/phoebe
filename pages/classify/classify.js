// pages/classify/classify.js
const App = getApp();
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    category:'',
    curIndex: 0,
    isScroll: false,
    classify_list:'',
    toView: 0,
    navLeftItems: [],
    navRightItems: [],
  },

  //跳转商品列表
  productlist: function (e) {
    // let category = e.currentTarget.id;
    let uri = e.currentTarget.dataset.uri;
    console.log(uri)
    //商品列表 2
    wx.navigateTo({
      url: '/pages/buy/goodslist/goodslist?dictDataValue='+ uri
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.classify();
    console.log(options.toView)
  },

//分类接口http://10.1.2.113:8080/uranus/classify?method=classifyGoods
  classify() {
    const self = this;
    let data = {
      method: 'classifyGoods',
      spuId: 1,
      url_type: 'classify'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res.data);
        self.setData({
          navLeftItems: res.data,
          navRightItems: res.data,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  switchTab(e) {
    const self = this;
    this.setData({
      isScroll: true
    })
    
    var  index = parseInt(e.target.dataset.index);
    setTimeout(function () {
      self.setData({
        curIndex: e.target.dataset.index,
        toView: index 
      })
    }, 0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    }, 1)

  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {

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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})