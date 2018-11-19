const app = getApp()
Page({
  data: {
    userInfo:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mobile:'',
    nickName:'',
    avatarUrl:'',
    gender:'',
    hospital:'',
    rsHistory:[],
    rsMonth:[],
    rsToday:[],
    rsrMonth:[]
  },
  editName(){
    wx.navigateTo({
      url: '../editName/editName?hospital=' +this.data.hospital+'&nickName='+this.data.nickName,
    })
  },
  //事件处理函数
  //onload
  onLoad: function () {
    var that = this;
    // 获取session中的号码
    //console.log(this.data.avatarUrl)
    
    that.setData({
     // avatarUrl: app.globalData.avatarUrl,
      hospital: wx.getStorageSync('hospital'),
      nickName: wx.getStorageSync('nickName')
    })
    app.ajax('/v1/statistical/list','','get','',(res)=>{
      that.setData({
        rsrMonth: res.data.data.rsrMonth,
        rsToday: res.data.data.rsToday,
        rsMonth: res.data.data.rsMonth,
        rsHistory: res.data.data.rsHistory
      })
    })
  },
  goToDetail(){
    wx.navigateTo({
      url: '../distributeDetail/distributeDetail',
    })
  },
  onShow(){
    this.setData({
      hospital: wx.getStorageSync('hospital'),
      nickName: wx.getStorageSync('nickName')
    })
  }
})
