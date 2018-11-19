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
    sname: "",
    startData: "",
    endData: ""
  },
  handleOnSearchbarIndexTouchMove: function () {
    wx.stopPullDownRefresh();
    return false;
  },
  //页面加载
  onLoad: function () {
    this.listData()
  },
  onShow: function () {
    this.listData()
  },
  /**
   * 登录状态
   */
  listData: function () {
    let self = this
    app.ajax('/v1/liquidation/clinician/list', '', 'get', {
      page: 1,
      pageNum: 100,
      name: self.data.sname,
      startTime: self.data.startData,
      endTime: self.data.endData,
      clinicianId:1
    }, (res) => {
      self.setData({
        patientArray: res.data.data
      })
    })
  }
})
