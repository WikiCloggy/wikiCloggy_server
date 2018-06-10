var options = {
    hostname: 'localhost',
    port: '3000',
    path: '/client/checkdataset.html'
}
//find one Json from json array
function findJSON(json, json_id) {
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
    fetch('../api/board/admin/keyword', config).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        //new Json Array to put json Object in
        var aJsonArray = new Array();
        // new Json obejct to get data which admin want
        var aJson = new Object();
        var site = document.getElementById("two");
        var makeUpTemplate = document.createElement('div');
        makeUpTemplate.setAttribute('class', 'inner');
        makeUpTemplate.setAttribute('id', 'inner');
        site.appendChild(makeUpTemplate);
        //add json data which admin want and make Template with those datas
        for (var i = 0; i < json.length; i++) {
            aJson.adminChecked = json[i].adminChecked;
            aJson._id = json[i]._id;
            aJson.comments = json[i].comments;
            aJson.img_path = json[i].img_path;
            aJsonArray.push(aJson);
            makeTemplate(aJson, i);
        }
        return;
    })
};

function getEngKeyword(){
    var myHeaders = new Headers();
    var config = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    fetch('../api/result/admin/getEngKeyword',config)
    .then(function (res){
        return engKeyList;
    })
    .then(function(engKeyList){
        return engKeys
    })
}

function makeEngKeySelect(){
    var html = ``;
    var engKeyList = getEngKeyword();
    for(var i =0;i<engKeyList.length;i++){
        html += `<option value ="`+engKeyList[i]+`">`+engKeyList[i]+`</option>\n`
    }
    return html;
}
// make checkdataset.html according to img and comments from the server board
function makeTemplate(json, i) {
    console.log("makeTemplate");
    var engKeyListHtml= makeEngKeySelect();
    var site = document.getElementById("inner");
    var makeTemplate = document.createElement('div');
    var comments = "";
    //make comments template
    for(var j=0; j< json.comments.length; j++){
        comments += "<p id= \"comment"+json._id+"_"+j+"\">"+json.comments[j].keyword+"</p><input type=\"checkbox\" id=\"c" + (json._id) + "_" + j + "\" name=\"cc\"/>\n";
    };
    makeTemplate.setAttribute('class', 'spotlight');
    makeTemplate.innerHTML =
        `<div class="image" id= img`+json._id+`>
            <img src="`+ json.img_path + `" alt="" />
            </div>
            <div class="content">
                <h3>Keywords List</h3>`
                +comments+`
                <ul class=" actions">
                <li><a href="#" class="button alt" id= button`+json._id+`>Register</a></li>
                </ul>
            </div>
            <div class = "eng_content">
                <h3> English Keywords </h3>
                <select name="eng_key">영어키워드선택\n`+engKeyListHtml+`</select></div>`;

    site.appendChild(makeTemplate);
};

function POST_RegisterData(keyword,json_id){
    var myHeaders = new Headers();
    var config_get = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    //PATH = BOARD
    fetch('../api/board/admin/show', config_get).then(function (response) {
        return response.json();
    }).then(function (json) {
        //find one json obejct from json array with json id
        var jsonobject = findJSON(json, json_id);
        console.log(jsonobject);
        // make variable with new keyword and new img_path
        const jsonModified = { 'keyword': keyword, 'img_paths': jsonobject.img_path };
        console.log(jsonModified);
        const config_post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //change body to jsonModified to make new dataset
            body: JSON.stringify(jsonModified),
            credentials: 'same-origin',
        };
        //NEED TO CHANGE THE PATH 
        /*
        fetch('../api/' + json_id, config_post).then(function (response) {

        }).then(function () {
            //after modifying reload the modify.html 
            window.location.reload();
        });*/
    });
}

//event when you clicked Register button
$(document).on('click', '.button alt', function () {

    console.log("Register");
    var $this = $(this);
    //find json_id
    var $this_id = $this[0].id;
    var $id_num_tmp = $this_id.split("button");
    var $id_num = parseInt($id_num_tmp[1]);
    //
    console.log($id_num);
    //img to to register keyword
    var img = document.getElementsById("img" + $id_num);
    var selected="";
    for (var i = 0; i < img.length; i++) {
        var checkbox = document.getElementById("c" + $id_num + "_" + i);
        if (checkbox.checked){
            selected = document.getElementById("comment"+$id_num+"_"+i);
            return;
        }
    }
    //send selected keyword
    POST_RegisterData(selected,$id_num);
    //notice that your data added
    alert('Data added');
});
(function ($) {
    //make html when your html first pop-up 
    getDataFromServer();

})(jQuery);