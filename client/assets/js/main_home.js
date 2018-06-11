var trainState = document.getElementsByClassName("trainState");
var result="success";

$(window).on('load', function(){
  var config = {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
  };

  return fetch('../api/result/admin/getTrainedDate',config)
  .then((res) => {
    return res.json();
  })
  .then((json) =>{
    result=json.result;
    console.log(result);
    var makeTemplate = document.createElement('div');
    makeTemplate.setAttribute('class', 'update');
    makeTemplate.innerHTML =
    `<div class = "date"> Last date when admin trained data : ` + json.updateDate + ` </div>`;
    trainState[0].appendChild(makeTemplate);

  });
});

$(document).on('click', '#button_train', function () {

    var con_test = confirm("학습을 시키겠습니까?");
    if(con_test == true){

      fetch('../api/result/admin/training');
      if(result =="success")
        alert("Training Successed");
      else
        alert("Training Failed, Try again next time");
   }
   else
     alert("Training Cancelled");
});
