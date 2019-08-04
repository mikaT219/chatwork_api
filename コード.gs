function getMessage() {

  // 取得するルームのIDを設定
  var roomID = "156248553";

  // APIトークンを設定
  var apiToken = "3f3cdc86a0e2a18b772925da35eebe96";

  // api url
  //force=0　追加メッセージ取得
  //force=1　全メッセージ取得　
  var url = "https://api.chatwork.com/v2/rooms/" + roomID + "/messages?force=1";

  // apiに渡すパラメータを設定
  var params = {
    headers : {"X-ChatWorkToken" : apiToken},
    method : "GET"
  };

  // 実行
  var res = UrlFetchApp.fetch(url, params);

  // 結果が存在した場合、json形式で取得した結果をparseする
  if (res != "") {
    var dataArr = JSON.parse(res.getContentText()); 
    //シートを追加する
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.insertSheet();
    for each(var data in dataArr) {
      //log
      Logger.log(data);
      //unixtime>jst
      var d = new Date( data.send_time * 1000 );
      var year  = d.getFullYear();
      var month = d.getMonth() + 1;
      var day  = d.getDate();
      var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
      var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
      var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
      var send_time = ( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
      //spreadsheet
      ss.appendRow([send_time,data.account.name,data.body]);    
    }     
  }


  Browser.msgBox("fin")
}