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
    
    //日付を確認する    
    var date = String(Utilities.formatDate(new Date(), "JST", "yyyyMMdd"));
    //日付テスト用
    //var date = '20190801';
    
    //アクティブなシートを取得
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var shts = ss.getSheets();
    //一番左のシートの名前を取得（シート削除後は1シート挿入してから実行（エラー回避））
    var sht1 = shts[1].getName();
    Logger.log('sht1:' + sht1);
    
    //日付を比較して日付が異なればシート追加する
    if (date != sht1) {    
      //シートを追加する
      //var ss = SpreadsheetApp.getActiveSpreadsheet();
      ss.insertSheet();
      ss.renameActiveSheet(date);
      
      //インデックスシートに実行を追記
      var sh = ss.getSheetByName("インデックス");
      Logger.log(sh);      
      //ss.setActiveSheet(objSheet);
      //var rowContents = String(date);
      //sh.appendRow(rowContents);
    }    
    
    for each(var data in dataArr) {
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

//シートを消すとき実行
function deletesheet() {
   var ash = SpreadsheetApp.getActiveSpreadsheet(); //アクティブなスプレッドlシートを取得 
   var cnt = ash.getNumSheets(); //アクティブなスプレッドシートのシート数を取得
   Logger.log(cnt);
   var sheet = ash.getSheetByName('テスト'); //残したいシートが存在するスプレッドシートを定義
   SpreadsheetApp.setActiveSheet(sheet); //指定したシート名をアクティブシートにする
   
  　for(var i = cnt;　i >= 2; i--){ 
     //初期値の変数iはシート数を表す変数cnt、iをｰ1していき2以上の間は処理を繰り返し
     var sh = ash.getSheets()[i-1];　//アクティブなスプレッドシートに存在するシートを、[i-1]により配列の要素数で指定して取得し、変数shに代入
     Logger.log(sh);     
     ash.deleteSheet(sh); //シート削除　
   } 
 }
