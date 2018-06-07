
var options = {
    hostname: 'localhost',
    port: '3000',
    path: '/client/modify.html'
}
function getFirstKeywordModel(response) {
    var result = 0;
    var myHeaders = new Headers();
    var config = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    fetch('../api/result/admin/show', config).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        var site = document.getElementById("site");
        var makeUpTemplate =document.createElement('div');
        makeUpTemplate.setAttribute('class','panel-group');
        makeUpTemplate.setAttribute('id','accordion');
        //site.appendChild(makeUpTemplate);
        for (var i = 0; i < json.length; i++)
            makeTemplate(json[i], i);
        return;
    })
};


function makeTemplate(json, i) {
    console.log("makeTemplate");
    var site = document.getElementById("accordion");
    var makeTemplate = document.createElement('div');
    if (json.ref.length == 0) {
        var img = "";
    }
    else {
        var img = "";
        for (var j = 0; j < json.ref.length; j++) {
            img += "<img class=\"img-with-k" + (json._id+1) + "\"id =\"img-with-k" + (json._id+1) + "_" + j + "\"src = \"" + json.ref[j].img_path + "\"><input type=\"checkbox\" id=\"c" + json._id + "_" + j + "\" name=\"cc\"/>\n";
        }
    }
    
        makeTemplate.setAttribute('class', 'panel');
        makeTemplate.innerHTML =
            `<div class="panel-heading">
            <h4 class="panel-title"  id="panel-title`+ (json._id+1) + `">` + json.keyword + `</h4>
            <a data-toggle="collapse" data-parent="#accordion" href="#accordion`+ (json._id+1)+ `"></a>
        </div>
        <div id="accordion`+ (json._id+1) + `"class="panel-collapse collapse">
            <div class="panel-body">
            <p> Modify your analysis </p>
            <textarea class="addanalysisinput`+ (json._id+1) + `" rows="4" cols="90">` + json.analysis + `</textarea> 
            <div class="buttons">
                <button class="snip1535_analy" id="button-analy`+(json._id+1)+ `"> Analysis Modify</button></div><div class= \"img\"><p>Choose the image to delete</p>`
            + img + `</div>
            </div>
        
        <div class="buttons">
            <button class="snip1535" id ="button-img`+ (json._id+1)+ `">Img Modify</button>
        </div></div>
        `
    
    site.appendChild(makeTemplate);
}
function findJSON(json, json_id) {
    for (var i = 0; i < json.length; i++) {
        if (json[i]._id == json_id)
            return json[i];
    }
}
function POST_AnalysisModified(analysis, json_id) {
    var myHeaders = new Headers();
    var config_get = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    fetch('../api/result/admin/show', config_get).then(function (response) {
        return response.json();
    }).then(function (json) {
        var jsonobject = findJSON(json, json_id);
        const jsonModified = { 'keyword': jsonobject.keyword, 'analysis': analysis[0].value };
        console.log(jsonModified);
        const config_post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonModified),
            credentials: 'same-origin',
        };
        fetch('../api/result/admin/edit/' + json_id, config_post).then(function (response) {
            
        }).then(function () {
            window.location.reload();
       });;
    })

}
function POST_ImgModified(img, json_id) {
    var myHeaders = new Headers();
    var config_get = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    fetch('../api/result/admin/show', config_get).then(function (response) {
        return response.json();
    }).then(function (json) {
        var jsonobject = findJSON(json, json_id);
        const data = [];

        for (var i = 0; i < img.length; i++) {
            for (var j = 0; j < jsonobject.ref.length; j++) {
                var imgsrc = img[i].src;
                if ('' + imgsrc == '' + jsonobject.ref[j].img_path) {
                    data.push(jsonobject.ref[j]);
                    break;
                }
            }
        };
        console.log(jsonobject);
        const jsonModified = { 'keyword': jsonobject.keyword, 'ref': data };
        console.log(jsonModified);
        const config_post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonModified),
            credentials: 'same-origin',
        };
        fetch('../api/result/admin/edit/' + json_id, config_post).then(function (response) {
            
        }).then(function () {
             window.location.reload();
        });
    });
}

/* Demo purposes only */
$(".hover").mouseleave(
    function () {
        $(this).removeClass("hover");
    }
);

$(document).on('click', '.snip1535', function () {

    console.log("IMG");
    var $this = $(this);
    var $this_id = $this[0].id;
    var $id_num_tmp = $this_id.split("button-img");
    var $id_num= parseInt($id_num_tmp[1]);
    console.log($id_num);
    var img = document.getElementsByClassName("img-with-k" + $id_num);
    var imgTosend = [];
    for (var i = 0; i < img.length; i++) {
        var checkbox = document.getElementById("c" + $id_num + "_" + i);
        if (checkbox.checked);
        else
            imgTosend.push(document.getElementById("img-with-k" + $id_num + "_" + i));
    }
    POST_ImgModified(imgTosend, ($id_num-1));
    alert('Image modified');
});

$(document).on('click', '.snip1535_analy', function () {
    console.log("ANALYSIS");
    var $this = $(this);
    var $this_id = $this[0].id;
    var $id_num_tmp = $this_id.split("button-analy");
    var $id_num= parseInt($id_num_tmp[1]);
    console.log($id_num);
    var analysis = document.getElementsByClassName("addanalysisinput" + $id_num);
    POST_AnalysisModified(analysis, ($id_num-1));
    alert('Analysis modified');
});
(function ($) {
    getFirstKeywordModel();

})(jQuery);