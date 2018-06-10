const file = document.querySelector('.addkeywordfileinput');
//const form = document.querySelector('.js-form');
const submit = document.querySelector('.addkeyword-form-btn');
const keyword = document.querySelector('.addkeywordinput_kor');
const keywordEng = document.querySelector('.addkeywordinput_eng');
const analysis = document.querySelector('.addanalysisinput');

function uploadFile(id) {

    const data = new FormData();

    data.append('queryFile', file.files[0]);

    const config = {
        method: 'POST',
        body: data,
        credentials: 'same-origin',
    };

    return fetch(`/api/result/files/${id}`, config)
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {

                return res.json();
            }

        })
        .catch((ex) => {
            console.log('request failed', ex);
        });

}
function createKeyword() {
    const json = { 'keyword': keyword.value, 'eng_keyword': keywordEng.value, 'analysis': analysis.value };
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
        credentials: 'same-origin',
    };
    return fetch('/api/result/', config)
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            }
            const error = new Error(res.statusText);
            error.res = res;
            throw error;
        })
        .catch((ex) => {
            console.log('form request failed', ex);
        })
        .then((json) => {
            if (json) {
                console.log(json);
                if (file.files[0]) {
                    console.log(json[0]._id);
                    return uploadFile(json[0]._id);
                }
                // uploadFile(keyword.value);

            }
        })
        .catch((f) => {
            console.log('file upload failed', f);
        });
}


//event when you clicked Img modify button
$(document).on('click', '.addkeyword-form-btn', function () {

    console.log("REGISTER KEYWORD");
    if (file.files[0]) {
        const check = file.files[0].name.split('.').pop().toLowerCase();
        if (check !== 'bmp' && check !== 'jpg' && check !== 'png') {
            file.value = '';
            alert('Select img file!');
        }
    }
    Promise.all([createKeyword()]);
    alert('Create Keyword Done! check on modify Keyword!');
    window.location.reload();
});
