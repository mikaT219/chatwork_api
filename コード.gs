function getMessage() {

  //取得するルームのIDを設定
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
    //日付変わったテスト
    //var date = "20191001";    
    //アクティブなシートを取得
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    //シート名を取得する--要：アクティブシートの名前を取得してしまうのでシート数取得して最終シートの名前を取得するに変更
    var ssname = ss.getSheetName();   
    Logger.log('ssname:' + ssname);
    
    //日付を比較して日付が異なればシート追加+インデックス追記
    if (date != ssname) {    
      ss.insertSheet();
      ss.renameActiveSheet(date);

      // ハイパーリンクをインデックスシートに追記
      //ソース／https://qiita.com/okNirvy/items/d1a2f4918cff8e63dcac
      var sheets = SpreadsheetApp.getActive().getSheets();
      var ssId = SpreadsheetApp.getActive().getId();
      
      // ハイパーリンク文字列の配列
      var linkList = [[]];
      
      for(var i=0; i<sheets.length; i++) {
        // シートのIDと名前
        var sheetId = sheets[i].getSheetId();
        var sheetName = sheets[i].getSheetName();
        
        // シートのURLからハイパーリンク文字列を組み立て
        var url = "https://docs.google.com/spreadsheets/d/" + ssId + "/edit#gid=" + sheetId;
        var link = [ '=HYPERLINK("' + url + '","' + sheetName + '")' ];
        
        // ハイパーリンク文字列を配列に格納
        linkList[i] = link;
      }
      
      //インデックスシートに追記
      var sheet = ss.getSheetByName("Index")      
      var cell = sheet.getActiveCell();
      var range = sheet.getRange(cell.getRow() , cell.getColumn() ,  linkList.length , 1);
      range.setValues(linkList);
    }    
    
    //取得したログを該当する日付のスプレッドシートに出力する
    for each(var data in dataArr) {
      var d = new Date( data.send_time * 1000 );
      var year  = d.getFullYear();
      var month = d.getMonth() + 1;
      var day  = d.getDate();
      var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
      var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
      var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
      var send_time = ( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
      ss.appendRow([send_time,data.account.name,data.body]);      
    }    
  }

  Browser.msgBox("fin")
}

//大量シートを消す
function deletesheet() {
   var ash = SpreadsheetApp.getActiveSpreadsheet(); //アクティブなスプレッドlシートを取得 
   var cnt = ash.getNumSheets(); //アクティブなスプレッドシートのシート数を取得
   Logger.log(cnt);
   var sheet = ash.getSheetByName('インデックス'); //残したいシートが存在するスプレッドシートを定義
   SpreadsheetApp.setActiveSheet(sheet); //指定したシート名をアクティブシートにする
   
  　for(var i = cnt;　i >= 2; i--){ 
     //初期値の変数iはシート数を表す変数cnt、iをｰ1していき2以上の間は処理を繰り返し
     var sh = ash.getSheets()[i-1];　//アクティブなスプレッドシートに存在するシートを、[i-1]により配列の要素数で指定して取得し、変数shに代入
     Logger.log(sh);     
     ash.deleteSheet(sh); //シート削除　
   } 
 }

