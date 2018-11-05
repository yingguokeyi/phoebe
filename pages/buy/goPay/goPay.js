// pages/buy/goPay/goPay.js
const App = getApp();
const api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        name: 'wxpay', value: '微信支付',
        img: '../../../image/wx.png',
        isSelect: true,//   暂时只有微信支付，默认选中
      },
    ],
    currentAdd:'',
    name:'',
    phone:'',
    address:'',
    imgSrc:'',
    source:'',
    orderNo:'',
    spuAttr:'',
    skuId:'',
    total:'',
    num:'',
    spuName:'',
    buylimit:'',
    stock:'',
    order_price:'',
    buyMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    let order_price = (options.total/options.num/100).toFixed(2);
    that.setData({
      name:options.name,
      phone:options.phone,
      address:options.address,
      imgSrc:options.imageSrc,
      source:options.type,
      orderNo:options.orderNo,
      spuAttr:options.attr,
      skuId:options.sku,
      total:options.total,
      num:options.num,
      spuName:options.spuName,
      order_price:order_price
    })
    that.getGoodsOder()
  },

  getAddressMsg(){
    var that = this;
    if(that.data.currentAdd != ''){
      let data = {
        method: 'getAddress',
        token: App.globalData.Apptoken,
        url_type: 'index',
      }
      api.reqData({
        data,
        success: (res) => {
          console.log(res)
          let deliveryResult =  res.data.result.rs
          for (var i = 0; i < deliveryResult.length;i++){
            if(that.data.currentAdd != ''){  //用户选择了地址
              if(deliveryResult[i].id == that.data.currentAdd){
                that.setData({
                  name:deliveryResult[i].consignee,
                  phone:deliveryResult[i].consignee_tel,
                  address:deliveryResult[i].delivery_address+deliveryResult[i].delivery_addressSec
                })
              } 
            }
          }
        },
      })
    }
  },
//  加载商品信息
  getGoodsOder(e) {
    const self = this;
    let data = {
      method: 'getGoodsBySkuId',
      skuId: self.data.skuId,
      url_type: 'index'
    }
    api.reqData({
      data,
      success: (res) => {
        let skuList = res.data.result.rs
        console.log(skuList)
        self.setData({
          buylimit:skuList[0].buyconfine,
          stock:skuList[0].stock
        })
      }
    })
  },

   //跳转修改地址信息
   toDeliveryMsg(e) {
    wx.navigateTo({
      url: '/pages/mine/myaddress/myaddress'
    })
  },

  //加载收获地址信息
  getDeliveryMsg() {
    const self = this;
    let data = {
      method: 'getAddress',
      token: App.globalData.Apptoken,
      url_type: 'index',
    }
    
  },

   //点击加号
  bindPlus: function () {
    let num = this.data.num                                           
    let buyconfineStr = this.data.buylimit
    let buyconfine = buyconfineStr == "" ? 0 : buyconfineStr
    let repertory = this.data.stock;
    console.log(num,buyconfine,repertory)
    if (buyconfine != 0 && num >= buyconfine) {
      wx.showToast({
        title: '此商品限购了',
        duration: 2000
      })
      return
    } 
    if (num >= repertory) {
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

  //  绑定减数量事件

 bindMinus: function () {
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

 getBuyMsg:function(e){
   this.setData({
    buyMsg:e.detail.value
   })
 },
//  * 计算总价格
  // getTotalPrice() {
  //   this.setData({      // 最后赋值到data中渲染到页面
  //     totalPrice: (this.data.order_price * this.data.num).toFixed(2)
  //   });
  // },


    //获取js_code
  getJscode() {
    const self = this;
    //发起网络请求
    wx.login({
      success: function (res) {
        if (res.code) {
          //创建精品自营订单
          self.setData({
            js_code: res.code
          })
          console.log(res.code);
          self.wetPayPre();
        }
      } 
      
    })
  },
    //提交订单
  submitForm(e) {
    //判断收获地址为空的情况

    if (this.data.address == undefined || this.data.address == '') {
      wx.showToast({
        title: '地址不能为空',
        icon: 'fail',
        duration: 2000
      })
      return
    }
    //禁止重复点击按钮
    this.setData({
      disabled: true,
      buyerMsg: e.detail.value.textarea   //用户留言
    })
    this.getJscode();
    // this.createOrder();
  },
  
  /* 获取prePayId */
  wetPayPre() {
    const self = this;
    //精品自营商品支付(带存存储客户留言)
    let data = {
      jsCode: self.data.js_code,
      method: 'createOrder',
      transactionBody: self.data.spuName,//商品名称
      orderNo: self.data.orderNo,//订单号
      token: App.globalData.Apptoken,
      skuId:self.data.skuId,
      deliveryAddress:self.data.address,
      consignee:self.data.name,
      consigneeTel:self.data.phone,
      skuNumber:self.data.num,
      remark:self.data.buyMsg,
      dataSource: 'miniWetCat',
      orderType:self.data.source,
      url_type: 'order',
      paymentWaykey:'WetCat',
    }
    console.log(data)
    api.reqData({
      data,
      success: (res) => {
        console.log(JSON.stringify(res.data) + "---------------------------");
        if (res.data.success === 7) {
          self.setData({
            wetPayData: res.data.result.rs
          })
          console.log(res)
          //微信支付
          self.pay()
      } else if (res.data.success === 2){
          wx.showToast({
            title: '亲，商品下架了',
            icon: 'fail',
            duration: 3000
          });
        }else if (res.data.success === 3) {
          wx.showToast({
            title: '亲,商品限购了',
            icon: 'fail',
            duration: 3000
          });
        } else if (res.data.success === 4) {
          wx.showToast({
            title: '亲,库存不足',
            icon: 'fail',
            duration: 3000
          });
        } else if (res.data.success === 5) {
          wx.showToast({
            title: '亲,用户限购了',
            icon: 'fail',
            duration: 3000
          });
        }
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },

   /* 微信支付 */
   pay: function () {
    const self = this;
    wx.requestPayment({
      timeStamp: self.data.wetPayData[0].timeStamp,
      package: self.data.wetPayData[1].package,
      paySign: self.data.wetPayData[2].paySign,
      signType: 'MD5',
      nonceStr: self.data.wetPayData[4].nonceStr,
      success: function (res) {
        console.log(res);
        //礼包商品支付成功，用户升级为会员账户
        if (self.data.source == "LB") {
          App.globalData.memberLevel = 1
        }
        wx.navigateTo({
          url: '/pages/common/payment/payment?source=' + self.data.source,
        })
      },
      fail: function (res) {
        App.globalData.currentType = 1,
          App.globalData.status = 101,
          wx.navigateTo({
            url: '/pages/mine/order-list/order-list',
          })
      },
      complete: function (res) {
        // complete  
        wx.switchTab({
          url: '/pages/mine/order-list/order-list',
        })
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
     this.getAddressMsg()
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