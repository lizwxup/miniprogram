
const app= getApp()
Page({
  data: {
    name:'',
    hospital:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hospital: options.hospital,
      name: options.nickName
    })
  },
  //判断编辑名称和医院
  editName(){
    wx.navigateTo({
      url: '../updateMsg/updateMsg?id='+1,
    })
  },
  editHospital(){
    wx.navigateTo({
      url: '../updateMsg/updateMsg?id=' + 2,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    this.setData({
      name: wx.getStorageSync('nickName'),
      hospital: wx.getStorageSync('hospital')
    })
  },

  
})