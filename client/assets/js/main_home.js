$(document).on('click', '#button_train', function () {

    var con_test = confirm("학습을 시키겠습니까?");
    if(con_test == true){

      fetch('../api/result/admin/training');
      alert("Training Successed");
   }
   else
     alert("Training Cancelled");
});
