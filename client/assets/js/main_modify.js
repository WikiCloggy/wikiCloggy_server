
var options = {
    hostname: 'localhost',
    port: '3000',
    path: '/client/modify.html'
}

//get data about keyword from server
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
        var makeUpTemplate = document.createElement('div');
        makeUpTemplate.setAttribute('class', 'panel-group');
        makeUpTemplate.setAttribute('id', 'accordion');
        //site.appendChild(makeUpTemplate);
        for (var i = 0; i < json.length; i++)
            makeTemplate(json[i], i);
        return;
    })
};

// make modify.html according to keywords, analysis, img_paths from server result
function makeTemplate(json, i) {
    console.log("makeTemplate");
    var site = document.getElementById("accordion");
    var makeTemplate = document.createElement('div');
    if (json.img_paths.length == 0) {
        var img = "";
    }
    else {
        var img = "";
        for (var j = 0; j < json.img_paths.length; j++) {
            img += "<img class=\"img-with-k" + (json._id + 1) + "\"id =\"img-with-k" + (json._id + 1) + "_" + j + "\"src = \"" + json.img_paths[j].img_path + "\"><input type=\"checkbox\" id=\"c" + (json._id + 1) + "_" + j + "\" name=\"cc\"/>\n";
        }
    }

    makeTemplate.setAttribute('class', 'panel');
    makeTemplate.innerHTML =
        `<div class="panel-heading">
            <h4 class="panel-title"  id="panel-title`+ (json._id + 1) + `">` + json.keyword + `</h4>
            <a data-toggle="collapse" data-parent="#accordion" href="#accordion`+ (json._id + 1) + `"></a>
        </div>
        <div id="accordion`+ (json._id + 1) + `"class="panel-collapse collapse">
            <div class="panel-body">
            <p> Modify your analysis </p>
            <textarea class="addanalysisinput`+ (json._id + 1) + `" rows="4" cols="90">` + json.analysis + `</textarea> 
            <div class="buttons">
                <button class="snip1535_analy" id="button-analy`+ (json._id + 1) + `"> Analysis Modify</button></div><div class= \"img\"><p>Choose the image to delete</p>`
        + img + `</div>
            </div>
        
        <div class="buttons">
            <button class="snip1535" id ="button-img`+ (json._id + 1) + `">Img Modify</button>
        </div></div>
        `

    site.appendChild(makeTemplate);
}

//find one Json from json array
function findJSON(json, json_id) {
    for (var i = 0; i < json.length; i++) {
        if (json[i]._id == json_id)
            return json[i];
    }
}

//post analysis and modify analysis of keyword from server
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
        //find one json obejct from json array with json id
        var jsonobject = findJSON(json, json_id);
        // make variable with new analysis and existing keyword
        const jsonModified = { 'keyword': jsonobject.keyword, 'analysis': analysis[0].value };
        console.log(jsonModified);
        const config_post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
             //change body to jsonModified to modify analysis
            body: JSON.stringify(jsonModified),
            credentials: 'same-origin',
        };
        //edit keyword info with above json 
        fetch('../api/result/admin/edit/' + json_id, config_post).then(function (response) {

        }).then(function () {
            //after modifying reload the modify.html 
            window.location.reload();
        });;
    })

}

//post Img and modify Img of keyword from server
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
        //find one json obejct from json array with json id
        var jsonobject = findJSON(json, json_id);
        const data = [];
        // make data array with new Imgs 
        for (var i = 0; i < img.length; i++) {
            for (var j = 0; j < jsonobject.img_paths.length; j++) {
                var imgsrc = img[i].src;
                if ('' + imgsrc == '' + jsonobject.img_paths[j].img_path) {
                    data.push(jsonobject.img_paths[j]);
                    break;
                }
            }
        };
        console.log(jsonobject);
        // make variable with new Img array and existing keyword
        const jsonModified = { 'keyword': jsonobject.keyword, 'img_paths': data };
        console.log(jsonModified);
        const config_post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //change body to jsonModified to modify Imgs
            body: JSON.stringify(jsonModified),
            credentials: 'same-origin',
        };
        //edit keyword info with above json 
        fetch('../api/result/admin/edit/' + json_id, config_post).then(function (response) {

        }).then(function () {
            //after modifying reload the modify.html 
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
//

//event when you clicked Img modify button
$(document).on('click', '.snip1535', function () {

    console.log("IMG");
    var $this = $(this);
    //find json_id
    var $this_id = $this[0].id;
    var $id_num_tmp = $this_id.split("button-img");
    var $id_num = parseInt($id_num_tmp[1]);
    //
    console.log($id_num);
    var img = document.getElementsByClassName("img-with-k" + $id_num);
    //pick out the imgs which survived
    var imgTosend = [];
    for (var i = 0; i < img.length; i++) {
        var checkbox = document.getElementById("c" + $id_num + "_" + i);
        if (checkbox.checked);
        else
            imgTosend.push(document.getElementById("img-with-k" + $id_num + "_" + i));
    }
    //send img array which survived
    POST_ImgModified(imgTosend, ($id_num - 1));
    //notice that your data modified
    alert('Image modified');
});

//event when you clicked Analysis modify button
$(document).on('click', '.snip1535_analy', function () {
    console.log("ANALYSIS");
    var $this = $(this);
    //find json_id
    var $this_id = $this[0].id;
    var $id_num_tmp = $this_id.split("button-analy");
    var $id_num = parseInt($id_num_tmp[1]);
    //
    console.log($id_num);
    //pick out the analysis
    var analysis = document.getElementsByClassName("addanalysisinput" + $id_num);
    //send analysis
    POST_AnalysisModified(analysis, ($id_num - 1));
    //notice that your data modified
    alert('Analysis modified');
});
(function ($) {
    //make html when your html first pop-up 
    getFirstKeywordModel();

})(jQuery);