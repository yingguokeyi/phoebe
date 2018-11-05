const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      {
        name: "全部",
      },

      {
        name: "待付款",
      },
      {

        name: "待收货",
      },
      {

        name: "已完成",
      },
      {

        name: "已取消",
      },
    ],
    currentType:0,
    orderList: [],   
    //取消订单备注
    remark_cancel: '',
    modalHidden_cancle: true,   
    order_id:"",
    page:1,
    remark_apply:'',
    applyHidden_cancle:true,
    jsCode:'',
    transactionBody:'',//商品名称
    orderNo:'',//订单号,
    skuId:'',  //skuid
    deliveryAddress:'',
    consignee:'',
    consigneeTel:'',
    skuNumber:'',
    remark:'',

    // 退款备注

  },

  autoClickTab:function(){
    wx.showLoading({
      title:'加载中',
    })
    let that = this;
    var data;
    console.log(typeof(that.data.currentType))
    switch(that.data.currentType){
      case 0:    //当前点击的是全部
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: 1,
          end: 20,
          url_type: 'order'
        }
        break;
      case 1:    //当前点击的是待付款
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: 1,
          end: 20,
          url_type: 'order',
          status:101
        }
        break;  
      case 2:    //当前点击的是待收货
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: 1,
          end: 20,
          url_type: 'order',
          status:102
        }
        break;
      case 3:    //当前点击的是已完成
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: 1,
          end: 20,
          url_type: 'order',
          status:107,
        }
        break; 
      case 4:    //当前点击的是已取消
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin:1,
          end: 20,
          url_type: 'order',
          status:110
        }
        break; 
        default:
        break;    
    }
    console.log(data)
    that.searchorder(data)
  },

  //切换导航
  changeTab: function (e) {
    let that = this;
    that.setData({
      currentType: e.currentTarget.dataset.index,
      changecolor: true,
      page:1
    })
    that.autoClickTab()
  },

   //查询订单列表
  searchorder(data) {
    api.reqData({
      data,
      success: (res) => {
        wx.hideLoading()
        console.log(res);
        var orderlistRes = res.data.result;
        this.setData({
          orderList: orderlistRes,
        })
       }
    })
  },

  goPddPay:function(e){
    let that = this;
    let good = '['+e.currentTarget.dataset.sku+']';
    let phone = e.currentTarget.dataset.phone
    let data={
      url_type: 'pdd',
      method: 'getUrlGenerate',
      goods_id_list:good,
      phone:that.data.phone
    }
    api.reqData({
      data,
      success: (res) => {
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
  },

  //跳转订单详情页
  todetails: function (e) {
    console.log('点击普通商品了')
    let statuscode = e.currentTarget.dataset.status
    let ordercode = e.currentTarget.dataset.no
    let orderdate = e.currentTarget.dataset.date
    let price = e.currentTarget.dataset.price
    let image = e.currentTarget.dataset.image
    let name = e.currentTarget.dataset.name
    let gift = e.currentTarget.dataset.gift
    let desc = e.currentTarget.dataset.desc
    let buyer = e.currentTarget.dataset.buyer
    let phone = e.currentTarget.dataset.phone
    let address = e.currentTarget.dataset.address
    let back = e.currentTarget.dataset.back
    wx.navigateTo({
      url: '/pages/mine/order-details/order-details?statuscode=' + statuscode + '&ordercode=' + ordercode + '&orderdate=' + orderdate + '&price=' + price + '&image=' + image + '&name=' + name + '&gift=' + gift +'&desc=' + desc +'&buyer='+buyer + '&phone='+phone+'&address='+address+'&backMoney='+back,
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('当前选中的状态'+that.data.currentIndex)
    if (app.globalData.currentType == '') {
      that.setData({
        currentType: parseInt(options.navid),
      })
    } else {
      that.setData({
        currentType: app.globalData.currentType,
      })
    }
    that.autoClickTab()
  },

  // 点击各种状态的请求参数



 


  //获取取消订单备注
  remarkInput: function (e) {
    this.setData({
      remark_cancel: e.detail.value
    })
  },

  //取消订单页面弹出半透明窗口js
  cancelorder: function (e) {
    const that = this
    const order_id = e.currentTarget.dataset.id
    this.setData({
      remark_cancel: '',
      modalHidden_cancle: false,
      order_id: order_id
    })
  },

  //物流信息页面
  findLogisticsMsg: function (e) {
    const that = this
    const logistics_numbers = e.currentTarget.dataset.id;
    const company = e.currentTarget.dataset.company;
    wx.navigateTo({
      url: '/pages/mine/logistics/logistics?logistics_numbers='+logistics_numbers+'&expressCom='+company,
    })
  },

  confirm:function(e){     //确认收货
    var that = this;
    let order_id = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '您确认已经收到商品了吗',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let data={
             method:'complteOrder',
             token: app.globalData.Apptoken,
             orderNo:order_id,
             url_type: 'order'
          }
          api.reqData({
            data,
            success: (res) => {
              if (res.data.success == 1) {
                wx.showToast({
                  title: '确定收货成功',
                  icon: 'success',
                  duration: 1000
                })
                that.setData({
                  currentType: 3,
                  page:1,
                  hasMore:true
                })
                that.searchorder()
              }
            },
          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  noOpen:function(){
    wx.showToast({
      title:'暂未开通此功能',
      icon:'none'
    })
  },
  
  goPay:function(e){   //继续购买
    let name = e.currentTarget.dataset.name;
    let phone = e.currentTarget.dataset.phone;
    let address = e.currentTarget.dataset.address;
    let orderNo = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let sku = e.currentTarget.dataset.sku;
    let attr = e.currentTarget.dataset.attr;
    let num = e.currentTarget.dataset.num;
    let total = e.currentTarget.dataset.total;
    let imageSrc = e.currentTarget.dataset.image;
    let spuName = e.currentTarget.dataset.spu
    wx.navigateTo({
      url:'/pages/buy/goPay/goPay?name='+name+'&phone='+phone+'&address='+address+'&orderNo='+orderNo+'&type='+type+'&sku='+sku+'&attr='+attr+'&num='+num+'&total='+total+'&imageSrc='+imageSrc+'&spuName='+spuName,
    })
  },

  goToPay:function(e){   //去支付
    let that = this;
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    let name = e.currentTarget.dataset.name;
    let phone = e.currentTarget.dataset.phone;
    let address = e.currentTarget.dataset.address;
    let orderNo = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let sku = e.currentTarget.dataset.sku;
    let attr = e.currentTarget.dataset.attr;
    let num = e.currentTarget.dataset.num;
    let total = e.currentTarget.dataset.total;
    let imageSrc = e.currentTarget.dataset.image;
    let spuName = e.currentTarget.dataset.spu
    
    that.setData({
      transactionBody:spuName,
      orderNo:orderNo,
      skuId:sku,
      deliveryAddress:address,
      consignee:name,
      consigneeTel:phone,
      skuNumber:num,
    })
    that.getJscode();
  },

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

  /* 获取prePayId */
  wetPayPre() {
    const self = this;
    console.log(self.data.address,self.data.orderNo)
    //精品自营商品支付(带存存储客户留言)
    let data = {
      jsCode: self.data.js_code,
      method: 'repOrderCreate',
      transactionBody: self.data.transactionBody,//商品名称
      orderNo: self.data.orderNo,//订单号
      token: app.globalData.Apptoken,
      skuId:self.data.skuId,
      deliveryAddress:self.data.deliveryAddress,
      consignee:self.data.consignee,
      consigneeTel:self.data.consigneeTel,
      skuNumber:self.data.skuNumber,
      remark:self.data.buyMsg,
      url_type: 'order',
      paymentWaykey:'WetCat',
    }
    console.log(data)
    api.reqData({
      data,
      success: (res) => {
        console.log(JSON.stringify(res.data) + "---------------------------去支付");
        wx.hideLoading()
        if (res.data.success === 1) {
          self.setData({
            wetPayData: res.data.result.rs
          })
         
          //微信支付
          self.pay()
        } else {
          wx.showToast({
            title: '预支付失败了哦',
            icon: 'fail',
            duration: 3000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        console.log(res)
      },
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
        // app.globalData.currentType = 1; 
        // app.globalData.status = 101;
        self.autoClickTab()
      },
      // complete: function (res) {
      //   // complete  
      //   wx.switchTab({
      //     url: '/pages/mine/order-list/order-list',
      //   })
      // }
    })
  },
  
//取消订单
  modalChange_cancel:function(){
    this.setData({
      modalHidden_cancle: true
    })
    //调用确定订单接口
    const that = this;
    let data = {
      method: 'cancelOrder',
      token: app.globalData.Apptoken,
      orderNo: that.data.order_id,
      remark: that.data.remark_cancel,
      url_type: 'order'
    }
    api.reqData({
      data,
      success: (res) => {
        if (res.data.success == 1) {
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            currentType: 4
          })
          that.searchorder()
        }
      },
    })

  },
  //取消订单对话框取消按钮
  modalChange1_cancel: function (e) {
    this.setData({
      modalHidden_cancle: true
    })
  },

//  申请退款

  applyMon:function(){
    this.setData({
      applyHidden_cancle: false
    })
  },

  applyInput:function(e){
    this.setData({
      remark_apply:e.detail.value
    })
  },

  applyChange1_cancel:function(e){   //模态框点击取消
    this.setData({
      applyHidden_cancle: true
    })
  },

  applyChange_cancel:function(e){   //模态框点击确定
    
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

    //setTimeout(function(){
            //wx.stopPullDownRefresh()
        //},1000)
      // "enablePullDownRefresh":true
      
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  loadOrderState:function(){
    let that = this;
    let data;
    console.log(typeof(that.data.currentType))
    switch(that.data.currentType){
      case 0:    //当前点击的是全部
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: this.data.page*20+1,
          end: 20,
          url_type: 'order'
        }
        break;
      case 1:    //当前点击的是待付款
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: this.data.page*20+1,
          end: 20,
          url_type: 'order',
          status:101
        }
        break;  
      case 2:    //当前点击的是待收货
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: this.data.page*20+1,
          end: 20,
          url_type: 'order',
          status:102
        }
        break;
      case 3:    //当前点击的是已完成
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: this.data.page*20+1,
          end: 20,
          url_type: 'order',
          status:107,
        }
        break; 
      case 4:    //当前点击的是已取消
        data = {
          method: 'findOrderList',
          token: app.globalData.Apptoken,
          begin: this.data.page*20+1,
          end: 20,
          url_type: 'order',
          status:110
        }
        break; 
        default:
        break;    
    }
    console.log(data)
    this.loadOrder(data)
  },

  loadOrder:function(data){
    api.reqData({
      data,
      success: (res) => {
        console.log(res)
        var orderlistRes = res.data.result;
       if(orderlistRes != ''){   //如果有返回的数据
          console.log(orderlistRes)
          var lengthnum = util.formatTimeStyle(orderlistRes);
          var page = this.data.page+1
          console.log(page)
          console.log(orderlistRes.length)
          this.setData({
            orderList: this.data.orderList.concat(lengthnum),  //如果返回的数据小于20条
            page:page,
          })
          wx.hideLoading(); 
       }else{   //没有返回的数据
         wx.hideLoading();
         wx.showToast({
           title:'已加载全部订单资源',
           icon:'none'
         })
       }
      }
    }) 
  },

  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadOrderState();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})