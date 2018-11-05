const api = require('../../../utils/api.js');
const area = require('../../../utils/area.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressId: "",                 //地址id
    addressList: [],                //地址列表
    firstimg: "../../../image/nogx.png",
    secondimg: "../../../image/new/selectf.png",
    thirdimg:"../../../image/new/default.png",
  },
  
  selectAdd:function(e){
    console.log(e)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面        
     //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
         currentAdd:e.currentTarget.dataset.addid
    })
    wx.navigateBack();
    
  },
  //新增收货地址
  toAddressAdd: function () {
    //新增情况addressId不存在，所以传0值方便做逻辑判断
    app.WxService.navigateTo('/pages/mine/add-address/add-address', {
      addressId: 0,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getaddressList()                     //查询地址的方法                  
  },

  //查询地址列表

  getaddressList() {

    //查询地址接口
    let data = {
      method: 'getAddress',
      addressId: this.data.addressId,
      token: app.globalData.Apptoken,
      url_type: 'my'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log("+++++++++++++++++++++++++接口返回收货地址列表")
        console.log(res)
        if (res.data.success == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.errorMessage,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {  //用户点击确定
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              } 
            }
          })
          return;
        }
        this.setData({
          addressList: res.data.result.rs
        })
      },
      fail: function () {

      },
    })


  },


  //删除收货地址
  deladdress: function (e) {
    const delid = e.currentTarget.dataset.id
    const that = this
    wx.showModal({
      title: '提示',
      content: '是否要删除地址',
      success: function (res) {
        if (res.confirm) {
          let data = {
            method: 'delAddress',
            addressId: delid,
            token: app.globalData.Apptoken,
            url_type: 'my'
          }
          api.reqData({
            data,
            success: (res) => {
              if (res.data.success == 1) {
                wx.showToast({
                  title: '删除地址成功',
                  icon: 'success',
                  duration: 2000
                })
                that.getaddressList()
              }
            },
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**去编辑收货地址页面 */
  toAddressEdit(e) {
    console.log(111)
    app.WxService.navigateTo('/pages/mine/add-address/add-address', {
      addressId: e.currentTarget.dataset.addressid,
      suoyin: e.currentTarget.dataset.index
    }) 
  },





  //设置默认地址
  setdefault: function (e) {
    const delid = e.currentTarget.dataset.id
    console.log(delid)
    let data = {
      method: 'serDefault',
      addressId: delid,
      token: app.globalData.Apptoken,
      url_type: 'my'
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res)
        if (res.data.success == 1) {
          this.getaddressList()
        }
      },
      fail: (res) => {
        console.log("设置默认地址失败")
      }
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
    this.getaddressList()
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