$(document).ready(function() {
  $('#mode').prop('value', 'UAT');
  $('button').click(function() {
    var continueFlag = true;
    var qrCode = '';
    var amount = $('#amount').val();
    var stan = $('#STAN').val();
    var tid = $('#TID').val();
    var mid = $('#MID').val();
    var apikey = $('#apiKey').val();
    var apiSecret = $('#secretKey').val();
    var urlOrder = '';
    var urlQuery = '';
    var dt = new Date();
    var transaction_time = moment().format('hhmmss');
    var transaction_date = moment().format('MMDD');

    if ($('#mode').val() == 'UAT') {
      console.log($('#mode').val())
      urlOrder = 'https://uat-api.nets.com.sg:9065/uat/merchantservices/qr/dynamic/v1/order/request';
      urlQuery = "https://uat-api.nets.com.sg:9065/uat/merchantservices/qr/dynamic/v1/transaction/query";
    } else if ($('#mode').val() == "Production") {
      console.log($('#mode').val())
      urlOrder = 'https://api.nets.com.sg/merchantservices/qr/dynamic/v1/order/request';
      urlQuery = "https://api.nets.com.sg/merchantservices/qr/dynamic/v1/transaction/query";
    }


    var data = JSON.stringify({"mti":"0200","process_code":"990000","amount":amount,"stan":stan,"transaction_time":transaction_time,"transaction_date":transaction_date,"entry_mode":"000","condition_code":"85","institution_code":"20000000001","host_tid":tid,"host_mid":mid,"npx_data":{"E103":tid,"E201":"00000123","E202":"SGD"},"communication_data":[{"type":"http","category":"URL","destination":"https://your-domain-name:8801/demo/order/notification","addon":{"external_API_keyID":"8bc63cde-2647-4a78-ac75-d5f534b56047"}}],"getQRCode":"Y"});


    var sign = btoa(sha256(data+apiSecret).match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(''));

    $.ajax({
      type: 'POST',
      url: urlOrder,
      async: false,
      process_data: 'false',
      headers: {
        'KeyId': apikey,
        'Sign': sign,
        'Content-Type': 'application/json'
      },
      data: data,

      dataType: 'text',
      success: function(result) {
        console.log(result);
        json_result = jQuery.parseJSON(result)
        qrCode = json_result.txn_identifier;
        $('#payment_image').html('<img id="netspay-mobile-link" class="hidden-xs" height="180" width="180" src="data:image/png;base64,' + json_result.qr_code + '" /> <a href="netspay://payment/?source=com.nets.netspay&amp;urlscheme=netspay&amp;qrdata=' + encodeURIComponent(qrCode) + '"> <img class="hidden-md hidden-lg height="180" width="180" " src="./assets/images/netspay.png" /></a>');
        setTimeout(function() {
          query_function();
        }, 3000);
        $("#netspay-mobile-link").on('load', function() {
          $('html,body').animate({
          scrollTop: $("#payment_image").offset().top},
          '2500');
        });
      },
      error: function(result) {
        alert(result);
      }
    });

    var inquiryCount = 1;

    data2 = JSON.stringify({"mti":"0100","process_code":"330000","stan":stan,"transaction_time":transaction_time,"transaction_date":transaction_date,"entry_mode":"000","condition_code":"85","institution_code":"20000000001","host_tid":tid,"host_mid":mid,"npx_data":{"E103":tid,"E201":"00000123","E202":"SGD"},"txn_identifier":qrCode});
    sign = btoa(sha256(data2+apiSecret).match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(''));
    query_function = (function() {
      $.ajax({
        type: "POST",
        async: false,
        process_data: 'false',
        headers: {
          'KeyId': apikey,
          'Sign': sign,
          'Content-Type': 'application/json'
        },
        url: urlQuery,
        data: data2,
        success: function(result) {
          console.log(result);
          if (result.response_code == '09' && inquiryCount < 20) {
            setTimeout(function() {
              query_function();
            }, 2500);
            inquiryCount++;
          } else {
            $('#payment_image').hide();
            if (result.response_code == '00') {
              $('#result_image').html('<img src="https://www.svgrepo.com/show/13650/success.svg" alt="Transaction Successful" height="100" width="100"><h4>Payment Success!</h4>');
            } else {
              $('#result_image').html('<img src="https://www.svgrepo.com/show/13658/error.svg" alt="Transaction Failure" height="100" width="100"><h4>Payment Failure!</h4>');
            }
          }
        },
        error: function(result) {
          // alert('error');
        }
      });
    });
    $(this).hide();
  });
});
