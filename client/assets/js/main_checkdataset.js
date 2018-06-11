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
    fetch('../api/board/admin/keyword', config).then(function (response) {
        return response.json();
    }).then(function (json) {
        makeEngKeySelect(json);
    })
};

function makeEngKeySelect(Boardjson) {
    var myHeaders = new Headers();
    var config = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    return fetch('../api/result/admin/getEngKeyword', config)
        .then((res) => {
            return res.json();

        }).then((json) => {
            console.log(json);
            var html = ``;
            for (var i = 0; i < json.length; i++) {
                html += `<option value ="` + json[i].eng_keyword + `">` + json[i].eng_keyword + `</option>\n`
            }

            return html;
        }).then((html) => {
            console.log(html);
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
            for (var i = 0; i < Boardjson.length; i++) {
                aJson.adminChecked = Boardjson[i].adminChecked;
                aJson._id = Boardjson[i]._id;
                aJson.comments = Boardjson[i].comments;
                aJson.img_path = Boardjson[i].img_path;
                aJsonArray.push(aJson);
                makeTemplate(aJson, i, html);
            }
        });

}


// make checkdataset.html according to img and comments from the server board
function makeTemplate(json, i, html) {
    console.log("makeTemplate");
    var engKeyListHtml = html;
    var site = document.getElementById("inner");
    var makeTemplate = document.createElement('div');
    var comments = "";
    //make comments template
    for (var j = 0; j < json.comments.length; j++) {
        comments += "<div><input type=\"checkbox\" class=\"cb" + json._id + 
        "\" id=\"c" + (json._id) + "_" + j + "\" name=\"cc\" value=\""+json.comments[j].keyword+"\"><lable>" 
        + json.comments[j].keyword + "</label></div>\n";
    };
    makeTemplate.setAttribute('class', 'spotlight');
    makeTemplate.innerHTML =
        `<div class="image" id= "img` + json._id + `float: left; width: 33%;">
            <img src="`+ json.img_path + `" alt="../images/pic01" height="100" width="100" />
            <div class ="L" id= "L`+ json._id + `"><input type="checkbox" class="left" id="left` + json._id + `" name="left">
            <lable>LEFT</label></div><div class ="R" id= "R`+ json._id + `"><input type="checkbox" class="right" id="right`+ json._id + `"name="right"><lable>RIGHT</lable>
                  </div></div></div>
            <div class="content" float: left; width: 33%;>
                <h3>Keywords List</h3>`
        + comments + `
                <ul class=" actions">
                <li><a href="#" class="button alt" id= button`+ json._id + `>Register</a></li>
                </ul>
            </div>
            <div class = "eng_content"  float: left; width: 33%;>
                <h3> English Keywords </h3>
                <div><select name="eng_key" id =select_engkey`+ json._id + `>영어키워드선택` + engKeyListHtml + `</select></div></div>`;

    site.appendChild(makeTemplate);
};

function POST_RegisterData(board_id,selected_keyword_eng,selected_keyword_kor,selected_LR) {
    var myHeaders = new Headers();
    var config_get = {  
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    //PATH = BOARD
    fetch(`../api/board/details/${board_id}`, config_get).then(function (response) {
        return response.json();
    }).then(function (json) {
        //find one json obejct from json array with json id
        var jsonobject = findJSONBoard(json,board_id);
        // make variable with new keyword and new img_path 
        const jsonModified = { '_id':board_id,'eng_keyword': selected_keyword_eng, 'keyword':selected_keyword_kor,
         'flip':selected_LR,'img_path': jsonobject.img_path };
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
        return fetch("../api/result/admin/addKeyword",config_post)
        //NEED TO CHANGE THE PATH 
        /*
        fetch('../api/' + json_id, config_post).then(function (response) {

        }).then(function () {
            //after modifying reload the modify.html 
            window.location.reload();
        });*/
    }).then((res)=>{
    });
}

//event when you clicked Register button
$(document).on('click', '.button', function () {

    console.log("Register");
    var $this = $(this);
    //find json_id
    var $this_id = $this[0].id;
    var $id_num_tmp = $this_id.split("button");
    var $id_num = parseInt($id_num_tmp[1]);
    //
    console.log($id_num);
    //img to to register keyword
    // var img = document.getElementsById("img" + $id_num);
    var selected_keyword = "";

    var checkboxArray  = document.getElementsByClassName("cb" + $id_num);
    var checkbox;
    for (var i = 0; i < checkboxArray.length; i++) {
        checkbox= document.getElementById("c" + $id_num+"_"+i);
        if (checkbox.checked) {
            var selected_keyword_eng = document.getElementById("select_engkey"+$id_num).value;
            var selected_keyword_kor = checkbox.value;
            
            console.log(selected_keyword);
            break;
        }
        if(i==checkboxArray.length-1){
            alert("Need to choose one of the keyword");
            return;
        }
    }
    //getLeftorRight
    var selected_LR=""; 
    console.log(document.getElementById("left" + $id_num));
    if(document.getElementById("left" + $id_num).checked)
        selected_LR="left";
    else if(document.getElementById("right" + $id_num).checked)
        selected_LR="right";
    else{
        alert("Need to choose direction of the head");
        return;
    }

    console.log(selected_LR);
    //send selected keyword
    POST_RegisterData($id_num,selected_keyword_eng,selected_keyword_kor,selected_LR);
    //notice that your data added
    alert('Data added');
});
(function ($) {
    //make html when your html first pop-up 
    getDataFromServer();

})(jQuery);