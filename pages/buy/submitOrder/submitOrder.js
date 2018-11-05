// pages/buy/submitOrder/submitOrder.js
const App = getApp();
const util = require('../../../utils/util.js');
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
    totalPrice: 0,    // 总价，初始为0
    totalPrices:0,
    form: {
      name: '',
      is_def: 0,
    },
    //禁止按钮
    disabled: false,
    //页面数据
    buyerMsg: '',
    deliveryMsg: '',
    wetPayData: '',
    //OpenIdData:'',
    order_data: '',
    //页面跳转
    tapType_set: '',
    currentType: 0,
    contact_person: '',
    delivery_address: '',
    delivery_area_desc: '',
    app_token: '',
    js_code: '',
    goods_list: '',//商品分类
    goods_data: '',//商品口
    sku_id: '',//商品规格
    goodList: '',//商品列表
    num: '',//商品数量
    rps_order: '',//订单
    source: '',   //判断是否是会员商品
    orderType: '',
    order_price: "",//确认订单价格传参
    order_prices:'',//确定订单秒杀价的传参
    order_model: "",//确认订单规格传参
    order_type: "",//确认订单规格传参
    name:'',        //会员名字
    img:'',         //会员图片
    price:'',       //会员价格 
    spu_attribute:'',//会员商品规格
    currentAdd:'',
    skuEnabled:'',//判断商品sku里面enabled是什么状态
    RunningStatus:''//判断商品是不是抢购的状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      sku_id:options.sku_id,
      spu_id:options.spu_id,
      num: App.globalData.num,
      order_model: App.globalData.order_model,
      order_type: App.globalData.order_type,
      order_price: App.globalData.order_price,
      order_prices:App.globalData.order_prices,
      repertory: App.globalData.repertory,
      source: options.source,                     //判断是不是会员商品
      name: options.name,                                    //会员名
      img: options.img,                                         // 会员图片
      price: options.price,                                       //会员价格
      spu_attribute: options.spu_attribute
    })
    this.getDeliveryMsg();
    this.getGoodsOder();
    this.getTotalPrice();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //重新启动按钮点击
    this.setData({
      disabled: false
    })
   this.getDeliveryMsg();
    this.getGoodsOder();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },



  //普通商品加载
  //接口//http://10.1.2.113:8080/uranus/index?method=getSpu&spuId=1
  getGoodsOder(e) {
    const self = this;
    console.log(self.options.spu_id)
    let data = {
      method: 'getSpu',
      spuId: self.options.spu_id,
      token: App.globalData.Apptoken,
      url_type: 'index'
    }
    api.reqData({
      data,
      success: (res) => {
        let skuList = res.data.result.rs[5].sku;
        // let running = res.data.result.rs[5].planGroupInfo[0].runing_status;
        var timeList = []
        console.log(skuList)
        for (var i = 0; i < skuList.length; i++) {
          let sku_id = self.data.sku_id;
         
          if(skuList[i].id == sku_id){
            timeList.push(skuList[i])
          }
          console.log(timeList)
        }
        self.setData({
          goods_list: res.data.result.rs,
          goods_data: res.data.result.rs[1].spuBase[0],
          contrast: timeList[0],
          skuEnabled: timeList[0].enabled,//判断商品sku里是不是参与秒杀的
          RunningStatus:timeList[0].runing_status,
        })
        console.log(self.data.RunningStatus,self.data.goods_list)
      }
    })
  },


  /**
   * 绑定加数量事件
   */
  //点击加号
  bindPlus: function () {
    let num = this.data.num                                           
    let buyconfineStr = this.data.contrast.buyconfine
    let buyconfine = buyconfineStr == "" ? 0 : buyconfineStr
    let repertory = this.data.repertory
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
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
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
    this.getTotalPrice();
  },
  /**
 * 计算总价格
 */
  getTotalPrice() {

    this.setData({      // 最后赋值到data中渲染到页面
      totalPrice: (this.data.order_price * this.data.num).toFixed(2),
      totalPrices:(this.data.order_prices * this.data.num).toFixed(2),
    });
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
    api.reqData({
      data,
      success: (res) => {
        //这个得写法和格式 setData({........})
        console.log(res)
        let deliveryResult =  res.data.result.rs
        for (var i = 0; i < deliveryResult.length;i++){
          if(self.data.currentAdd != ''){  //用户选择了地址
            if(deliveryResult[i].id == self.data.currentAdd){
              self.setData({
                deliveryMsg: deliveryResult[i],
              })
            } 
          }else{
            if (deliveryResult[i].is_default == 1) { //沒有默认地址就是第一个地址 
              self.setData({
                deliveryMsg: deliveryResult[i],
              })
            } else if (deliveryResult[i].is_default != 1) {//多个地址就默认是第一个地址 
              self.setData({
                deliveryMsg: deliveryResult[0],
              })
            }
          }
        }
      
      },
    })
  },

  //获取js_code
  getJscode() {
    const self = this;
    //发起网络请求
    wx.login({
      success: function (res) {
        if (res.code) {     //创建精品自营订单
          self.setData({
            js_code: res.code
          })
          console.log(res.code);
          //self.wetPayPre();
          self.createOrder();
        }
      }
    })
  },

  /** 创建自营订单 */
  createOrder() {
    const self = this;
    var deliveryMsg = self.data.deliveryMsg;
    var sku_id = self.data.sku_id;   
    var deliveryAddress = deliveryMsg.delivery_address + deliveryMsg.delivery_addressSec    
    let data = {
      method: 'createOrder',
      skuId: self.data.sku_id,//skuId商品id
      // skuId:1,
      token: App.globalData.Apptoken,//token
      deliveryAddress: deliveryAddress,//地址
      consignee: deliveryMsg.consignee,//姓名
      consigneeTel: deliveryMsg.consignee_tel,//手机号
      dataSource: 'miniWetCat',
      paymentWaykey:'WetCat',
      orderType: self.data.goods_data.source_code,
      skuNumber: self.data.num,//商品数量
      remark: self.data.buyerMsg,//用户留言
      url_type: 'order',
      jsCode: self.data.js_code,
      transactionBody: self.data.goods_data.spu_name//商品名称
    }
    api.reqData({
      data,
      success: (res) => {
        console.log(res);
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


  //提交订单
  submitForm(e) {
    console.log(App.globalData.hasLogin)
    //判断收获地址为空的情况
    if (!App.globalData.hasLogin) {
      wx.showModal({
        title: '提示',
        content: '您还未登陆，请先登录',
        success: function (res) {
          if (res.confirm) {  //用户点击确定
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.deliveryMsg == undefined || this.data.deliveryMsg == '') {
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
    //this.createOrder();
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

  bindTextAreaBlur: function (e) {
    this.setData({
      buyerMsg: e.detail.value
    })

  },

  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 1500,
    })
      .then(() => App.WxService.navigateBack())
  },
})

