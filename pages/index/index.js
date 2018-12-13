const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],   //轮播图设置
    recommendList: [],    // 产品推荐
    setmeal: [],          //套餐推荐
    discount: [],         //打折商品
    tuijian: [],          // 推荐商品
    activeList: [],       //活动商品
   
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,//是否自动切换
    interval: 3000,//自动切换时间间隔
    duration: 1000,
    current: 0,// 当前所在滑块的 index
    circular: true,
    city: '',//城市
    memberLevel: '',   //判断是会员还是非会员
    timer: null,//定时器时间
    speed: -1,//速度
    vertical: true ,//滑动方向是否为纵向

    sekillStartTime:'',//开始倒计时时间
    // finishTime:'',//结束倒计时时间
    imagePath:'',//限时秒抢图
    friendImage:'',//你的好友还买的图
    countDownList: [],
    actEndTimeList: [],
    hou:'',
    min:'',
    sec:'',
    countDownHour: '',
    countDownMinute: '',
    countDownSecond: '',
    linguisticShow:true,//判断今日秒抢是结束还是进行时
    message:'',
    site:'',//外网地址
    seckillId:'',//商品的标记
    sid:'',//商品的id商品的id
    isHasBanner:false,
    pddGoods:[],
    page:0,
    isFixNav:false,   //是否固定导航栏
    menuTop:'',      //导航栏距顶部的距离
    navList:[],     //导航栏的菜单
    navNow:'',   //当前选中的分类
    height:'',    //分类的高度
    hasMore:false,     //是否还可下拉
    plan_group:'',//判断是否秒抢商品
    bIsPaste:false
  },

  // 获取拼多多商品
  pddMenu:function(){
    let that = this;
    let data = {
      url_type:'classify',
      method:'getPddMenu',
      page:that.data.page*15+1,
      limit:15
    }
    api.reqData({
      data,
      success:function(res){
        console.log(res,'拼多多')
        data,
        wx.hideLoading()
        let pddGood = res.data.result.rs[0].pddGoods.result.rs;
        that.setData({
          navNow:res.data.result.rs[1].pddMenu.result.rs[0].opt_id,
          navList:res.data.result.rs[1].pddMenu.result.rs,
          pddGoods:pddGood,
          page:that.data.page+1
        })
        that.getAllRects('.navItem',function (res) {
          that.setData({
            itemLeftArr:res
          },function () {
              that.initClientRect();
          })
        });
      }
    })
  },

  selectNav:function(e){     //当前选中的分类并且刷新商品
    let index = e.currentTarget.dataset.index;
    // console.log(this.data.isFixNav,this.data.height)
    if(this.data.isFixNav){
      wx.pageScrollTo({
        scrollTop:this.data.height,
        duration:0
      })  
    }
    this.setData({
      navNow:e.currentTarget.dataset.id,
      scrollLeft:this.data.itemLeftArr[index]-this.data.windowWidth/2,
      page:0,
      hasMore:false,
    })
    this.getPddGoodsByMenu()
  },

  getPddGoodsByMenu:function(){
    let that = this;
    let data={
      url_type:'classify',
      method:'getPddGoodsByMenu',
      page:that.data.page*15+1,
      limit:15,
      menuId:that.data.navNow
    }
    api.reqData({
      data,
      success:function(res){
        that.setData({
          pddGoods:res.data.result.rs[0].pddGoods.result.rs,
          page:that.data.page+1
        })
      }
    })
  },

  loadMorePdd:function(){
    wx.showLoading({
      title:'加载中'
    })
    let that = this;
    let data={
      url_type:'classify',
      method:'getPddGoodsByMenu',
      page:that.data.page*15+1,
      limit:15,
      menuId:that.data.navNow
    }
    api.reqData({
      data,
      success:function(res){
        wx.hideLoading()
        let pddGood = res.data.result.rs[0].pddGoods.result.rs;
        if(pddGood.length != 0){
          that.setData({
            pddGoods:that.data.pddGoods.concat(pddGood),
            page:that.data.page+1
          })
        }else{
          that.setData({
            hasMore:true
          })
        }
        
      }
    })
  },

  // 1.查询菜单栏距离文档顶部的距离menuTop
  initClientRect : function () {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('#affix').boundingClientRect()
    query.exec(function (res) {
      // console.log(res)
      that.setData({
        menuTop: res[0].top,
        classifyHeight:res[0].height
      })
    })
  },

  countHeight:function(){
    var that = this;
    var query = wx.createSelectorQuery()
    if(that.data.message == 3){
      // console.log('无秒杀');
      query.select('#limitBuy').boundingClientRect()
      query.exec(function (res) {
        // console.log(res)
        that.setData({
          height:res[0].top,
        })
       
      })
    }else{
      // console.log('有秒杀商品');
      query.select('#goodList').boundingClientRect()
      query.exec(function (res) {
        // console.log(res)
        that.setData({
          height: res[0].top-40,
        })
      })
    }
    
  },

  //   // 2.监听页面滚动距离scrollTop
  onPageScroll: function (e) {
    if(e.scrollTop > this.data.windowHeight){
      this.setData({
          floorstatus: true
      });
    }else {
      this.setData({
          floorstatus: false
      });
    }
    if(e.scrollTop >= this.data.menuTop){
      if(this.data.isFixNav){
        return 
      }
      this.setData({
        isFixNav:true
      })
    }else{
      this.setData({
        isFixNav:false
      })
    } 
  },

  //获取分类的位置
	getAllRects: function (ele,callBack) {
		var that = this;
		wx.createSelectorQuery().selectAll(ele).boundingClientRect(function (rects) {
			let arr = [];
			rects.forEach(element => {
				arr.push(element.left);
      });
			callBack(arr);
		}).exec()

  },
 
  goTop:function(e){   //回到顶部
    wx.pageScrollTo({
      scrollTop:0,
      duration:1500
    })
  },

  toDetail:function(e){
console.log(e,'jk')
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

  //跳转商品
  togoodList: function (e) {
    let category = e.currentTarget.id;
    let uri = e.currentTarget.dataset.uri;
    if (category == 1) {
      //商品详情页 1
      wx.navigateTo({
        url: '/pages/common/common?' + uri,

      })
    } else if (category == 2) {
      //商品列表 2
      wx.navigateTo({
        url: '/pages/buy/goodslist/goodslist?' + uri,
      })
    } else if (category == 3) {

      //待定落地页
     
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function(){
      wx.hideLoading()
    },2000)
    that.pddMenu();
    
     
    // 获取窗口大小信息
		wx.getSystemInfo({
			success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight:res.windowHeight
        })
			}
		});
  },
 
// banner广告接口的获取
  getThemBy:function(){
    var that = this;
    let data = {
      method: 'getAdvertBanner',
      page_location:'1',
      url_type: 'index'
    }
    api.reqData({
      data,
      success: (res) => {
        // console.log(res)
        var resultList = res.data.result.rs[0].result.result.rs;
        if(JSON.stringify(resultList) !='{}'){
          that.setData({
            imgUrls: resultList,
          })
        }else{
          that.setData({
            isHasBanner:true
          })
        }
      },
      fail: function () {
      },
    })
  },
  // 首页的跳转
  togood: function (e) {
    let category = e.currentTarget.id;
    let uri = e.currentTarget.dataset.uri;
    // console.log(uri)
    if (category == 1) {
      //商品详情页 1
      wx.navigateTo({
        url: '/pages/common/common?' + uri,
      })
    } else if (category == 2) {
      //商品列表 2
      wx.navigateTo({
        url: '/pages/buy/goodslist/goodslist?' + uri,
      })
    } else if (category == 3) {
      //跳到活动页面
      wx.navigateTo({
        url: '/pages/index/vacancy/vacancy?site=' + uri,
      })
    }
   
  },
  //限时秒抢倒时和图片接口
  inhourFormula:function(e){
    var that = this;
    let data={
      method:'getColumnListInfo',
      url_type:'recommen'
    }
    api.reqData({
      data:data,
      success: (res) => {
        // console.log(res,'倒计时')
         var resultLis =res.data.result.rs;
          console.log(typeof(resultLis))
         var message = resultLis[0].planGroup0.message;
        //  console.log(message)
         if (resultLis != '') {
           if (message ==1){
                  //获取时间
            var sekillStartTime = resultLis[0].planGroup0.sekillStartTime;//开始时间
            var sekillEndTime = resultLis[0].planGroup0.sekillEndTime;//结束时间
            //  开始时间的总秒数ps:这里var的话是页面传的值的名字也是sekillStartTime这个
            var startTimetm = "20" + sekillStartTime.substring(0, 2) + "/" + sekillStartTime.substring(2, 4) + "/" + sekillStartTime.substring(4, 6) + " " + sekillStartTime.substring(6, 8) + ":" + sekillStartTime.substring(8, 10) + ":" + sekillStartTime.substring(10, 12);
            var startDate = new Date(startTimetm).getTime();
            // 结束时间的总秒数
            sekillEndTime = "20" + sekillEndTime.substring(0, 2) + "/" + sekillEndTime.substring(2, 4) + "/" + sekillEndTime.substring(4, 6) + " " + sekillEndTime.substring(6, 8) + ":" + sekillEndTime.substring(8, 10) + ":" + sekillEndTime.substring(10, 12);
            var endTDate = new Date(sekillEndTime).getTime();
            //秒抢的开始时间
            var newTime = sekillStartTime.substring(6, 8) + ":" + sekillStartTime.substring(8, 10) + ':' + sekillStartTime.substring(10, 12);
            //获取系统当前时间
            var currentDate = new Date();
            currentDate = currentDate.getTime()
            //时间段要注意两种情况一种是刚进来就已经开始倒计时，还有就是到页面还没有倒计时，就用结束的时间减去当前的时间
            var totalSecond;
            //秒抢开始时间减去当前时间就是当前时间到开始倒计时之间的时间段
            var startSecond = startDate - currentDate;
            if (startSecond <= 0) {//已经在倒计时了
              totalSecond = parseInt((endTDate - currentDate) / 1000);
              // that.countdown(totalSecond)
            } else if (startSecond > 0) {//还没有倒计时
              totalSecond = parseInt((endTDate - startDate) / 1000);
            }

            var howmany = parseInt(startSecond / 1000);//当前时间到开始倒计时之间的时间段
            that.countdown(howmany)
              //倒计时开始时间
            setTimeout(function () {
              that.countdown(totalSecond)
            }, startSecond)

            that.setData({
              result: resultLis,
              imagePath: resultLis[0].planGroup0.imagePath,//秒抢图
              seckillid: resultLis[0].planGroup0.seckillid,//秒抢商品标记
              friendImage: resultLis[1].planGroup1.imagePath,//你的好友还买图
              sekillStartTime: newTime,//开始秒抢的时间
              message: message,
            })    
            that.countHeight()
           } else if (message == 2){
             that.setData({
               message: message,
               result: resultLis,
               imagePath: resultLis[0].planGroup0.imagePath,//秒抢图
               friendImage: resultLis[1].planGroup1.imagePath,//你的好友还买图
             })
             that.countHeight()
           
           } else if (message == 3){
             that.setData({
               message: message,
               result: resultLis,
               friendImage: resultLis[1].planGroup1.imagePath,//你的好友还买图
             })
             that.countHeight()
           }
         }
      },
      fail: function () {
      },
    })
  },

//  倒计时方法
  countdown: function (totalSecond){
    // console.log(typeof(totalSecond))
    var that=this;
    clearInterval(that.interval);
     that.interval = setInterval(function () {
      // console.log('i')
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
      if (totalSecond <= 0) {
        clearInterval(that.interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });

      }
    }.bind(that), 1000);

  },

//限时秒抢商品列表
  secondsToTakeGoods: function (e) {
    let data = {
      method: 'getBanner',
      url_type: 'index',
    }
    api.reqData({
      data,
      success: (res) => {
        var resList = res.data.result.rs;
        let setmeal = [];
        for (var i = 0; i < resList.length; i++) {
          if (resList[i].plan_group == 1) {
            setmeal.push(resList[i])
          }

        }

        this.setData({
          setmeal: setmeal,
        })
      },
      fail: function () {
      },
    })

  },

  //点击限时秒抢跳到秒抢商品列表
  products: function (e) {
    wx.navigateTo({
      url: '/pages/index/flashSale/flashSale?seckillId=' + this.data.seckillid,
    })
  },
  //点击限时秒抢跳到秒抢商品列表message == 2
  products2: function (e) {
    var sid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/flashSale/flashSale?seckillId=' + sid,

    })
  },
  //你的好友还购买了的商品列表
  getdiscount() {
    let data = {
      method: 'getBanner',
      url_type: 'index',
    }
    api.reqData({
      data,
      success: (res) => {
        // console.log(res)
        this.setData({
          discount: res.data.result.rs
        })
        
      },
      fail: function () {
      },
    })

  },

// 社区服务中心的广告轮播效果
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  verticalChange:function(e){
    this.setData({
      vertical: e.detail.value
    })
  },
  currentChange: function (e) {
    this.setData({
      current: e.detail.value
    })
  },
 
  //跳转搜索页
  tosearch: function () {
    wx.navigateTo({
      url: '/pages/classify/Search/Search',
    })
  },
  
  // 跳转到消息服务中心
  toNewsDetail:function(){
    wx.navigateTo({
      url:'/pages/index/newSquare/newSquare'
    })
  },

  //获取用户经纬度和地理信息
  getLocation: function (e) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log("-----" + JSON.stringify(res))
        app.globalData.locationInfo = res

        const data = {
          ak: app.globalData.ak,
          location: res.latitude + "," + res.longitude,
          output: 'json',
          coordtype: 'wgs84'
        }
        var self = that
        api.getAddressByLocation({
          data,
          success: (res) => {
            if (res.data.status != '220') {
              self.setData({
                city: res.data.result.addressComponent.city
              })
            }
          }
        })
      }
    })
  },
  
  //跳转选择城市
  Location: function () {
    // console.log(this.data.city)
    wx.navigateTo({
      url: "/pages/index/switchcity/switchcity?city=" + this.data.city
    })
  },
  //跳转消息
  toxiaoxi: function () {
    wx.navigateTo({
      url: '/pages/mine/news/news'
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
    var that = this;
    //页面显示时显示位置 
    if (this.data.city == '') {
      that.getLocation()          //如果地址为空的话，就加载获取地址 
    }

    that.setData({
      city: app.globalData.city
    })

    // 首页普通商品
    let data = {
      method: 'getBanner',
      url_type: 'index'
    }
    api.reqData({
      data,
      success: (res) => {
        let allData = res.data.result.rs;
        let imgUrls = [], recommend = [], setmeal = [], discount = [], tuijian = [], activeList = [];
        for (var i = 0; i < allData.length; i++) {
          if (allData[i].plan_group == 1) {
            setmeal.push(allData[i])
          } else if (allData[i].plan_group == 2) {
            discount.push(allData[i])
          }
        }
        that.setData({
          setmeal: setmeal,
          discount: discount,
          memberLevel: app.globalData.memberLevel
        })
      },
      fail: function () {
      },
    })
    that.getThemBy()//banner广告
    that.inhourFormula()//限时秒抢倒时和图片
    that.secondsToTakeGoods()//限时秒抢商品列表
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
   
    if(this.data.hasMore == false){
      this.loadMorePdd()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})