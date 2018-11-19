//index.js
//获取应用实例
const app = getApp()
var requestLoad = require("../../resources/request.js");
Page({
  data: {
    userInfo: '',
    refresh: "true",
    windowHeight: '',
    positionTop: "25%",
    scrollTop: 0,
    patientArray: [],
    checkOrder: [],  //检查预约
    numCheck: 0,
    loading: false,
    sname:"",
    startData:"",
    endData:"",
    optionsId:'',
    orderTime:''
  },
  handleOnSearchbarIndexTouchMove: function () {
    wx.stopPullDownRefresh();
    return false;
  },
  //页面加载
  onLoad: function (options) {
    this.setData({
      optionsId: options.id
    })
    this.listData()
  },
  onShow: function () {
    //this.listData()
  },
  /**
   * 登录状态
   */
  listData: function () {
    let self = this
    app.ajax('/v1/report/list', '', 'get', {
      id: self.data.optionsId
    }, (res) => {
      self.setData({
        patientArray: res.data.data
      })
    })
  }
})
