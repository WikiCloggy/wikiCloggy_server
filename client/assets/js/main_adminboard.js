var options = {
    hostname: 'localhost',
    port: '3000',
    path: '/client/checkdataset.html'
}
//find one Json from json array
function findJSONBoard(json, json_id) {
    for (var i = 0; i < json.length; i++) {
        if (json[i]._id == json_id)
            return json[i];
    }
}

//get data about borad from server
function getDataFromServer() {
    var result = 0;
    var myHeaders = new Headers();
    var config = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    fetch('../api/board/admin/show', config).then(function (response) {
        return response.json();
    }).then(function (json) {
        var site = document.getElementById("two");
        var makeUpTemplate = document.createElement('div');
        makeUpTemplate.setAttribute('class', 'inner');
        makeUpTemplate.setAttribute('id', 'inner');
        site.appendChild(makeUpTemplate);
        for (var i = 0; i < json.length; i++)
            makeTemplate(json[i]);
    })
};




// make checkdataset.html according to img and comments from the server board
function makeTemplate(json) {
    console.log("makeTemplate");
    var title = json.title;
    var content = json.content;
    var img_path = json.img_path;
    var site = document.getElementById("inner");
    var makeTemplate = document.createElement('div');
    var comments = "";
    //make comments template

    makeTemplate.setAttribute('class', 'spotlight');
    makeTemplate.innerHTML =
        `<div class="image" id= "img` + json._id + `float: left; width: 33%;">
            <img src="`+ img_path + `" onerror="this.src='./images/pic01.jpg'" />
            </div>
          
              
        
            <div class="content" float: left; width: 33%;>
            <h3> Title </h3>
            <div type="textarea">`
            + title + `<p></p></div>
                <h3>Content</h3>
                <div type="textarea">`
                 + content + `<p></p></div>
                 <div>
                <ul class="actions">
                <li><a href="#" class="button alt" id="button`+ json._id + `">Delete</a></li>
                </ul>
            </div>`;

    site.appendChild(makeTemplate);
};



function DELETE(board_id) {
    var myHeaders = new Headers();
    var config_get = {
        method: 'DELETE',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    fetch(`../api/board/delete/${board_id}`, config_get)
        .then((res) => {
            alert("Board Deleted");
            window.location.reload();
        })
}

//event when you clicked Register button
$(document).on('click', '.button', function () {

    console.log("Delete");
    var $this = $(this);
    //find json_id
    var $this_id = $this[0].id;
    var $id_num_tmp = $this_id.split("button");
    var $id_num = parseInt($id_num_tmp[1]);
    //
    console.log($id_num);
    //img to to register keyword
    // var img = document.getElementsById("img" + $id_num);

    DELETE($id_num);
    //notice that your data added

});
(function ($) {
    //make html when your html first pop-up 
    getDataFromServer();

})(jQuery);