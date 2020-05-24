function getpwd(){
//var time=new Date()
var year=new Date().getFullYear()
var month=new Date().getMonth()+1
var date=new Date().getDate()
var day=new Date().getDay()
var hours=new Date().getHours()
var minutes=new Date().getMinutes()
var seconds=new Date().getSeconds()

//return year+","+month+","+date+","+hours+","+minutes+","+seconds+"ÖÜ"+day

return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds
}

// 2020-3-21 23:17:58