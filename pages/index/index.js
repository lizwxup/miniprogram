//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
      userInfo:'',
      refresh:"true",
      windowHeight:'',              
      isPhoneShow:false,
      scrollTop:0,
      patientArray:[],
      numCheck:0,
      loading:true,
      num:0,
      endData:'',
      sname:'',
      startData:'',
      timeFlag:false, //判断显示与隐藏 时间和姓名过滤
      nameFlag:false,
      page:1,
      scrollFlag:true,
      height:'100%',
      scrollHeight:0,
      reachData: false//判断是否加载
    },   
  handleOnSearchbarIndexTouchMove:function(){
    wx.stopPullDownRefresh();
    return false;
  },
  //过滤姓名和时间
  searchName(e){
    this.setData({
       sname: e.detail.value
    })
  },
  showMask(){
    this.setData({
      nameFlag: false,
      timeFlag: false
    })  
  },
  sureNameSear(){
    this.setData({
      nameFlag:false,
      timeFlag:false
    })  
    this.getDocListData()
    this.setData({
      endData : "",
      startData : "",
      sname : "",
      page:1
    })
  },
//下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()  //在标题栏中显示加载
   // this.getDocListData()
  },
  bindstartDateChange: function (e) {
    this.setData({
      startData: e.detail.value
    })
  },
  bindendDateChange: function (e) {
    this.setData({
      endData: e.detail.value
    })
  },
  onReachBottom(){  //加载数据
    if (!this.data.reachData) {
      this.data.page++
      this.getDocListData('bottom')
    } else {
      wx.showToast({
        title:'已加载完成',
        icon:'none'
      })
    }
  },
  nameShow(e){
    let type = e.currentTarget.dataset.id
    if (type === 'name'){
      this.setData({
        nameFlag:true,
        timeFlag:false
      })
    } else{
      this.setData({
        timeFlag:true,
        nameFlag:false
      })
    }
  },
  //页面加载
  onLoad: function () {
    this.getDocListData()
  },
  /**
   * 获取列表的数据
   */
  onShow(){
    this.setData({
     page:1
    })
  },
  onPageScroll(e){
    //获取屏幕高度和当前页面高度中的
    let relHeight = (this.data.height > e.scrollTop) ? this.data.height : e.scrollTop;
    this.setData({
      scrollHeight: e.scrollTop,
      height: relHeight+1000
    })
  },
  getDocListData(type){
     let self = this
    //  if (app.globalData.contId && app.globalData.contId != ''){
    //    console.log('判断是否为空')
    //  } else {
    //    app.employIdCallback = employId => {
    //    console.log('-----------')
    if (self.data.scrollFlag && wx.getStorageSync('sessionKey')) {
      app.ajax('/v1/reservation/list', '加载中', 'get', {
        page: self.data.page,
        pageNum: 10,
        name: self.data.sname,
        startTime: self.data.startData,
        endTime: self.data.endData
      }, (res) => {
        let resData  = res.data.data 
        if (resData === undefined && type === 'bottom') {
            resData = []
            self.setData({
              patientArray:self.data.patientArray.concat(resData),
              scrollFlag: true,
              reachData: true
            })
            wx.showToast({
              title:'已加载完成',
              icon:'none'
            })
        }else if (type === undefined && resData === undefined) {
            self.setData({
              patientArray:[]
            })
        }else{
            let DataList = []
            DataList = self.data.patientArray === [] ? res.data.data : self.data.patientArray.concat(resData)
            self.setData({
              patientArray: DataList,
              scrollFlag: true
            })
         }
        }
      )
    }
  }
})
  