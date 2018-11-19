const app = getApp()
Page({
  data: {
    reportDetail:{},
    checkEquip:'',
    audiTime:'',
    writeTime:'',
    project:''
  },
  onLoad: function (options) {
    let self = this,projectArr = [];
    app.ajax('/v1/report/info', '', 'get', {
      id: options.oid
    },(res) => { 
      res.data.data.studyList.forEach(function(item,index){
        projectArr.push(item.posiId)
      })
      let modalityIdArr;
      if (res.data.data.studyList.length === 0) {
        modalityIdArr = []
      } else {
        modalityIdArr = res.data.data.studyList[0].modalityId.length
      }
      self.setData({
        reportDetail: res.data.data,
        audiTime:res.data.data.auditTime.substring(0, 10),
        writeTime: res.data.data.writeTime.substring(0, 10) || '',
        checkEquip: modalityIdArr,
        project: Array.from(new Set(projectArr))
      })
    })
  }
})