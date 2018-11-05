// pages/classify/Search/Search.js
//index.js
//获取应用实例
var WxSearch = require('../wxSearch/wxSearch.js')
var App = getApp()
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
Page({
  searchstring: "",
  data: {
    sort_state:-1,                       //对应服务端价格排序的状态码 0 为升序 1 为降序  -1 为不排序
    num: 0,                              //控制选中筛选的条件样式
    search_data: [],                     //页面加载用的数据
    wxSearchData: {
      view: {
        isShow: true
      }
    },
    focus: true,
    searchstring: '',
    sousuo:[],
    goods_price: "",//单个商品价格
    memberLevel:"",
    saleMark:0,
    page:0,   //加载的页数
    isLoad:false,
  },

  //页面跳转
  toDetail: function (e) {
    //根据taobao_link字段的有无判断是淘宝或精品商品
    //再传与后台值的时候 ds:0 表示精品 ds:1表示淘宝
    console.log(e)
    let spu_id = e.currentTarget.id;   
    console.log(e.currentTarget.dataset.price)
    App.globalData.goods_price = e.currentTarget.dataset.price
      wx.navigateTo({
        url: `/pages/common/common?spuId=` + spu_id,
      });

  },

  toPdd:function(e){
    let goodId = e.currentTarget.dataset.id;
    let count = e.currentTarget.dataset.count;
    let endTime = e.currentTarget.dataset.endtime;
    let minOrder = e.currentTarget.dataset.minorder;
    let start = e.currentTarget.dataset.start;
    let name = e.currentTarget.dataset.name;
    let gPrice = e.currentTarget.dataset.gprice;
    let nPrice = e.currentTarget.dataset.nprice;
    let sold = e.currentTarget.dataset.sold;
    let image = e.currentTarget.dataset.image;
    let desc = e.currentTarget.dataset.desc;
    let swiper = e.currentTarget.dataset.swiper;
    let source = e.currentTarget.dataset.source;
    wx.navigateTo({
      url:'/pages/pddCommon/pddCommon?goodId='+goodId+'&count='+count+'&endTime='+endTime+'&minOrder='+minOrder+'&start='+start+'&name='+name+'&gPrice='+gPrice+'&nPrice='+nPrice+'&sold='+sold+'&image='+image+'&desc='+desc+
      '&swiper='+swiper
    })
  },
  // -========================增加部分开始====================================================
  changeFilterRules:function (e) { 
    var that = this;
    that.setData({
      sousuo:[],
      page:0
    })
    let type = e.currentTarget.dataset.num;
    let data;
    // 判断当前点击的是哪个按钮
    switch (type) {
      // 当前点击的是综合
      case '0':
        that.setData({
          saleMark:-1,
          sort_state:-1,
          num:type
        })
        data = {
          url_type: 'classify',
          method: 'searchPddGoods',
          begin: that.data.page*5+1,
          end:5,
          goodsName: that.data.searchstring,
        }
        break;
        // 当前点击的是销量
      case '1':
        // 销量排序 0 为升序 1为降序 -1 为不排序
        that.setData({
          sort_state:-1,
          num:type
        })
        that.saleSortFun();
        console.log('==============销量排序====================');
        data = {
          url_type: 'classify',
          method: 'searchPddGoods',
          begin: that.data.page*5+1,
          end:5,
          goodsName: that.data.searchstring,
          saleMark:that.data.saleMark,
        }
        break;
        // 
        
      case '2':
        // 设置价格首次点击是升序 对应服务端升序降序状态码
        that.setData({
          saleMark:-1,
          num:type
        })
        that.priceSortFun();
        console.log('=========价格排序=======');
        data = {
          url_type: 'classify',
          method: 'searchPddGoods',
          begin:  that.data.page*5+1,
          end:5,
          goodsName: that.data.searchstring,
          priceMark:that.data.sort_state    //当前点击之后的状态码
        }
        break;
      default:
        break;
    }
    that.wxSearchFn(data);
    WxSearch.wxSearchAddHisKey(that);
  },
  // 处理价格排序状态
  priceSortFun:function () {
    var that = this;
    // 设置价格首次点击是升序 对应服务端升序降序状态码
    // 如果当前状态码为-1当前状态为不排序，应该改变排序规则为升序
    
    if (that.data.sort_state === -1) {
      that.setData({
        sort_state:0
      })
      return;
    }
    // 如果当前状态码为1 当前状态为降序，应该改变排序规则为升序
    if (that.data.sort_state === 1) {
      that.setData({
        sort_state:0
      })
      return;
    }

      // 如果当前状态码为0 当前状态为升序，应该改变排序规则为降序
      if (that.data.sort_state === 0) {
      that.setData({
        sort_state:1
      })
      return;
    }
  },
  // 处理销量排序状态
  saleSortFun:function () {
    var that = this;
    // 设置价格首次点击是升序 对应服务端升序降序状态码
    // 如果当前状态码为-1当前状态为不排序，应该改变排序规则为升序
    
    if (that.data.saleMark === -1) {
      that.setData({
        saleMark:1
      })
      return;
    }
    // 如果当前状态码为1 当前状态为降序，应该改变排序规则为升序
    if (that.data.saleMark === 1) {
      that.setData({
        saleMark:0
      })
      return;
    }

      // 如果当前状态码为0 当前状态为升序，应该改变排序规则为降序
      if (that.data.saleMark === 0) {
      that.setData({
        saleMark:1
      })
      return;
    }
  },
  // -========================增加部分结束=======================
  /**
   * 生命周期函数--监听页面加载
   * @pram options--页面跳转带来的参数
   */
  onLoad: function (options) {
    const _this = this;
    //初始化的时候渲染wxSearchdata
    WxSearch.init(_this , 43, ['眼影', '的', 'wxParse', 'wxSearch', 'wxNotification']);
    WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
    _this.setData({
      memberLevel: App.globalData.memberLevel
    })
  },
  //==================修改部分，重新构造回调接收数据的方法,传入服务器端请求需要传入的参数===========================

  wxSearchFn: function (data) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    // const sousuo = this.data.sousuo
    api.reqData({
      data,
      success: (res) => {
        var searchData = res.data;
        var sousuo = searchData.result.rs[1].searchGoods.result.rs;
        if(sousuo.length != 0 || searchData.result.rs[0].searchPddGoods.result.rs.length!= 0){
          for (var i = 0; i < sousuo.length; i++) {
            sousuo[i].pic_info_url = sousuo[i].image.replace("https", "http")
          }
          let goods = (searchData.result.rs[0].searchPddGoods.result.rs).concat(sousuo)
          that.setData({
            page:that.data.page+1,
            sousuo: that.data.sousuo.concat(goods),
            searchstring: this.data.searchstring,
          })
          console.log('下一页是'+that.data.page)
        }else if(sousuo.length == 0 || searchData.result.rs[0].searchPddGoods.result.rs.length== 0){
          that.setData({
            isLoad:true
          })
        }
       
      },
      fail: (res) => {
        console.log("fail 返回 res.data>>>");
      },
      complete: (res) => {
        console.log("complete 返回 res.data>>>");
      }
    })
  },

  //确定时完成的事件
  wxSearchfirm: function (e) {
    var that = this
    this.setData({
      searchstring: e.detail.value,
      saleMark:-1,
      sort_state:-1
    })
    const data = {
      url_type: 'classify',
      method: 'searchPddGoods',
      begin: 1,
      end:5,
      goodsName: that.data.searchstring,
    }
    this.wxSearchFn(data);
    WxSearch.wxSearchAddHisKey(that);
  },
  //当键盘输入时，触发input事件
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
    that.setData({
      sousuo:[]
    })
  },
  //输入框聚焦时触发
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
    that.setData({
      sousuo:[]
    })
  },
  //输入框失去焦点时触发
  wxSearchBlur: function(e){
    var that = this
    WxSearch.wxSearchBlur(e,that);
  },
  wxSearchKeyTap: function (e) {
    var that = this;
    this.setData({
      searchstring: e.currentTarget.dataset.key,
      saleMark:-1,
      sort_state:-1
    })
    const data = {
      url_type: 'classify',
      method: 'searchPddGoods',
      begin: 1,
      end:5,
      goodsName: that.data.searchstring,
    }
    this.wxSearchFn(data);
    WxSearch.wxSearchKeyTap(e, that);
  },


  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  onReachBottom: function () {
    console.log(this.data.page)
    var data;
    if(this.data.num == 1){     //销量
      data = {
        url_type: 'classify',
        method: 'searchPddGoods',
        begin: this.data.page*5+1,
        end:5,
        goodsName: this.data.searchstring,
        saleMark:this.data.saleMark  
      }
    }else if(this.data.num == 2){   //价格排序
      data = {
        url_type: 'classify',
        method: 'searchPddGoods',
        begin: this.data.page*5+1,
        end:5,
        goodsName: this.data.searchstring,
        priceMark:this.data.sort_state,
      }
    }else if(this.data.num == 0){
      data = {
        url_type: 'classify',
        method: 'searchPddGoods',
        begin: this.data.page*5+1,
        end:5,
        goodsName: this.data.searchstring,
      }
    } 
    if(this.data.isLoad == false){
      this.wxSearchFn(data);
    }
 
  },

  
})
