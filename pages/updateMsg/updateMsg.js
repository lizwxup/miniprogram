// pages/updateMsg/updateMsg.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    typeId:1,
  },
  editName(e){
    this.setData({
      name:e.detail.value
    })
  },
  sureName(){
    let that = this
    if (this.data.typeId === '1') {
      app.ajax('/v1/personal/clinician/name', '', 'put', {
        name: this.data.name
      }, (res) => {
        if (res.data.code === 1 ) {
            wx.showToast({
              icon:'success',
              title: '修改成功'
            })
            wx.setStorage({
              key: 'nickName',
              data: that.data.name,
            })
         // app.globalData.nickName = that.data.name
          wx.navigateBack({})
        } 
      })
    } else if (this.data.typeId === '2') {
      app.ajax('/v1/personal/clinician/hospital', '', 'put', {
        hospitalName: this.data.name
      }, (res) => {
        if (res.data.code === 1) {
          wx.showToast({
            icon: 'success',
            title: '修改成功'
          })
          wx.setStorage({
            key: 'hospital',
            data: that.data.name,
          })
          // app.globalData.hospital = that.data.name
          wx.navigateBack({})
        } 
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id === "1") {
      this.setData({
        name: wx.getStorageSync('nickName')
      })
    } else{
      this.setData({
        name: wx.getStorageSync('hospital')
      })
    }
    this.setData({
      typeId: options.id
    })
  },
})