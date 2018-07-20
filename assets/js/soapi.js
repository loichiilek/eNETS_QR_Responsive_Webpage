$(document).ready(function() {
  $('#mode').prop('value', 'UAT');
  $('button').click(function() {
    var continueFlag = true;
    var amount = $('#amount').val();
    var umid = $('#umid').val();
    var apikey = $('#apiKey').val();
    var apiSecret = $('#secretKey').val();
    var dt = new Date();
    var merchantTxnDtm = moment().format('YYYYMMDD hh:mm:ss.SSS');
    var merchantTxnRef = moment().format('YYYYMMDD hh:mm:ss');

    var script1 = document.createElement("SCRIPT");
    var script2 = document.createElement("SCRIPT");
    var script1Loaded = false;
    var script2Loaded = false;

    if ($('#mode').val() == 'UAT') {
      console.log($('#mode').val())
      script1.src = 'https://uat2.enets.sg/GW2/pluginpages/env.jsp';
      document.getElementsByTagName('head')[0].appendChild(script1);

      script1.onload = function() {
        script2.src = 'https://uat2.enets.sg/GW2/js/apps.js';
        script2.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script2);
      };

    } else if ($('#mode').val() == "Production") {
      console.log($('#mode').val())
      script1.src = 'https://www2.enets.sg/GW2/pluginpages/env.jsp';
      document.getElementsByTagName('head')[0].appendChild(script1);

      script1.onload = function() {
        script2.src = 'https://www2.enets.sg/GW2/js/apps.js';
        script2.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script2);
      };
    }


    var data = JSON.stringify({"ss":"1","msg":{"netsMid":umid,"tid":"","submissionMode":"B","txnAmount":amount,"merchantTxnRef":merchantTxnRef,"merchantTxnDtm":merchantTxnDtm,"paymentType":"SALE","currencyCode":"SGD","paymentMode":"","merchantTimeZone":"+8:00","b2sTxnEndURL":"https://httpbin.org/post","b2sTxnEndURLParam":"","s2sTxnEndURL":"https://sit2.enets.sg/MerchantApp/rest/s2sTxnEnd","s2sTxnEndURLParam":"","clientType":"W","supMsg":"","netsMidIndicator":"U","ipAddress":"127.0.0.1","language":"en"}});

    console.log(data+apiSecret);

    var sign = btoa(sha256(data+apiSecret).match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(''));

    console.log(sign);

    script2.onload = function() {
      sendPayLoad(data, sign, apikey);
    };
    $(this).hide();

  });
});
