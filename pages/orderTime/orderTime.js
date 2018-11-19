// pages/orderTime/orderTime.js
var utilTime = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    equipName:'',
    equipTimePlanList:[],
    num:0,
    selectIndex:'0'
  },
  sureTime(){
    if (this.data.selectIndex === '0') {
      wx.showToast({
        icon:'none',
        title: '请选择预约时间段',
      })
    } else{
      app.globalData={
        selectHosIndex: this.data.selectIndex,
        selectHospital: this.data.hostipalId,
        equipTimePlan: this.data.equipTimePlanList 
      }
      wx.navigateBack()
    }
  },
  selectTimeChange(e){
    this.setData({
      selectIndex: e.currentTarget.dataset.id
    })
    wx.setStorage({
      key: 'selectTime',
      data: this.data.selectIndex,
    })

  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    self.setData({
      hostipalId: options.hostipal
    })
    var orderTime = '/v1/center/timebucket/reservation/list';
    app.ajax(orderTime,'','get',{
      centerId: self.data.hostipalId,
      itemId: options.methodId
    },(res)=>{
      self._formatListData(res.data.data)
      self.setData({
        equipTimePlanList: res.data.data
      })
      app.equipTimePlan = this.data.equipTimePlanList 
    })
  },
  _formatListData(list) {  //格式化返回的时间戳类型
    return list.map((item) => {
        return item.child.map((itm)=>{
          let startDate = utilTime.splitString(itm.startTime);
          let endDate = utilTime.splitString(itm.endTime)
          itm.splitStartTime = startDate
          itm.splitEndTime = endDate
          return itm
        })  
      
    })
  },
  bindOrderTime(e){
    this.setData({
      num: e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

})