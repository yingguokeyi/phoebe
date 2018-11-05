// pages/index/switchcity/switchcity.js
const api = require('../../../utils/api.js');
const app = getApp();
const city = require('../../../utils/city.js');
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中",
    currentCityCode: '',
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' }, { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' },],
    inputName: '',
    completeList: [],
    county: '',
    condition: false,
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    const searchLetter = city.searchLetter;
    const cityList = city.cityList();
    const sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    const winHeight = sysInfo.windowHeight;
    const itemH = winHeight / searchLetter.length;
    let tempArr = [];

    searchLetter.map(
      (item, index) => {
        let temp = {};
        temp.name = item;
        temp.tHeight = index * itemH;
        temp.bHeight = (index + 1) * itemH;
        tempArr.push(temp)
      }
    );
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempArr,
      cityList: cityList,
      city: options.city
    });
  },

  onHide: function () {
    // 生命周期函数--监听页面隐藏\
    app.globalData.city = this.data.city
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
    console.log(this.data)
    app.globalData.city = this.data.city
    console.log(app.globalData.city);
  },

  clickLetter: function (e) {
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })

    const that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)
  },

  reGetLocation: function () {
    app.globalData.city = this.data.city
    //返回首页
    // wx.switchTab({
    //   url: "/pages/index/index"
    // })
    wx.navigateBack()
  },
  //选择城市
  bindCity: function (e) {
    this.setData({
      condition: true,
      city: e.currentTarget.dataset.city,
      currentCityCode: e.currentTarget.dataset.code,
      scrollTop: 0,
      completeList: [],
    })

    app.globalData.city = this.data.city
    this.reGetLocation();
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },

  bindBlur: function (e) {
    this.setData({
      inputName: ''
    })
  },
  bindKeyInput: function (e) {
    console.log("input: " + e.detail.value);
    this.setData({
      inputName: e.detail.value
    })
    this.auto()
  },
  auto: function () {
    let inputSd = this.data.inputName.trim()
    let sd = inputSd.toLowerCase()
    let num = sd.length
    const cityList = city.cityObjs
    let finalCityList = []
    let temp = cityList.filter(
      item => {
        let text = item.short.slice(0, num).toLowerCase()
        return (text && text == sd)
      }
    )
    //在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    let tempShorter = cityList.filter(
      itemShorter => {
        if (itemShorter.shorter) {
          let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
          return (textShorter && textShorter == sd)
        }
        return
      }
    )

    let tempChinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.city.slice(0, num)
        return (textChinese && textChinese == sd)
      }
    )

    if (temp[0]) {
      temp.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      )
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempShorter[0]) {
      tempShorter.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      );
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempChinese[0]) {
      tempChinese.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        })
      this.setData({
        completeList: finalCityList,
      })
    } else {
      return
    }
  },
})