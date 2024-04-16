import {setValuesByPaths, spinner, getAllValuesWithPath} from "./base.js"

let newValuePath = [];
const reader = new FileReader();
let valuesWithPath = [];
let beforeText = [];
const outputField = document.getElementById("outputField");
let resultText;
let element;
const showResult = document.getElementById("showResult");

//JSONを読み込み
function loadJSON() {
    spinner(true);
    document.getElementById("progress1").textContent ="準備中…";

    //console.log(document.getElementById("file").files[0]);
    
    const file = document.getElementById("file").files[0];

    reader.onload = function(event) {
        const json = event.target.result;
        const data = JSON.parse(json);
        //console.log(data); // オブジェクトを表示する例

        valuesWithPath = getAllValuesWithPath(data);
        console.log(valuesWithPath);
        setTimeout(translateAll, 20, false);
    };

    reader.readAsText(file);
}

window.loadJSON = loadJSON;
export {loadJSON}


//翻訳し、結果を表にする
//translate : T/F APIを用いて翻訳するかどうか
async function translateAll(translation) {
    spinner(true);
    console.log(translation);

    // API翻訳して良いか確認
    if(translation) {
        let conf = confirm("APIを用いて翻訳してよろしいですか？");
        if(!conf) {
            spinner(false)
            return;
        }
    }
    
    //各行ごとに（翻訳して）表示 Object.keys(valuesWithPath).length
    document.getElementById("outputField").innerHTML = "";
    document.getElementById("progress2").textContent = "";

    let dataNum = Object.keys(valuesWithPath).length;

    for(var i = 0; i < dataNum; i ++) {
        element = valuesWithPath[i];
    
        resultText = element.value; //とりあえず元のJSONのValueを出力値に設定

        //翻訳前後の言語をフォームから取得
        let lang_before = document.getElementById("lang_before").value;
        let lang_after = document.getElementById("lang_after").value;
        let apiKey = document.getElementById("apiKey").value;
        
        if(translation) {
            resultText = translate(element.value, lang_before, lang_after, apiKey);
        }
    
        //outputField.innerHTML += '<tr><td class="text-sm">' + element.path + '</td><td>' + element.value + '</td><td><input id="afterText_' + i + '" class="p-2 rounded border" value="' + resultText + '" onchange="textChange(' + i + ')"></td></tr>'
        
        //出力用のオブジェクトの作成
        newValuePath[i] = {
            path : element.path,
            value : resultText
        }

        beforeText[i] = element.value;

        // 進行状況をパーセンテージで表示
        if(Math.floor(i/30) == i/30) {
            document.getElementById("progress1").textContent = (Math.floor(i/dataNum*500)/10) + "%";
            document.getElementById("progress2").textContent = "(" + i + "/" + dataNum + ")";
            await new Promise( res => setTimeout( res, 0 ) );
        }
    }

    if(showResult.checked == true) {
        //ここから表に描画
        console.log("Making table...");

        for(var i = 0; i < dataNum; i ++) {
            //表として表示
            outputField.innerHTML += await '<tr><td class="text-sm">' + newValuePath[i].path + '</td><td>' + beforeText[i] + '</td><td><input id="afterText_' + i + '" class="p-2 border" value="' + newValuePath[i].value + '" onchange="textChange(' + i + ')"></td></tr>'
            
            if(Math.floor(i/7) == i/7) {
                document.getElementById("progress1").textContent = (Math.floor(i/dataNum*500)/10+50) + "%";
                document.getElementById("progress2").textContent = "(" + i + "/" + dataNum + ")";
                await new Promise( res => setTimeout( res, 0 ) );
            }
        }

        console.log(newValuePath);
    } else {
        //読み込み完了とだけ表示
        document.getElementById("status").style.display = "";
        console.log(newValuePath);
    }
    

    //スピナー非表示
    spinner(false)
}

window.translateAll = translateAll
export{translateAll}

//テキストボックスで翻訳結果が修正された時
function textChange(num) {
    newValuePath[num].value = document.getElementById("afterText_" + num).value
}

window.textChange = textChange
export{textChange}

//翻訳
function translate(text, fromLang, toLang, apiKey) {

    // APIを叩く
    const URL = "https://translation.googleapis.com/language/translate/v2?key="+apiKey+
        "&q="+encodeURI(text)+"&source="+fromLang+"&target="+toLang
    let xhr = new XMLHttpRequest()
    xhr.open('POST', [URL], false)
    xhr.send();
    if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText); 
        return res["data"]["translations"][0]["translatedText"] //翻訳後のテキストを返す
    }
}


//JSON出力
function exportJSON() {
    let outObj = {};
    console.log(newValuePath)

    setValuesByPaths(outObj, newValuePath)

    console.log(outObj);

    let outJSON = JSON.stringify(outObj);
    const blob = new Blob([outJSON], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    // ダウンロード用のリンクを生成
    const a = document.createElement('a');
    a.href = url;
    const date = new Date();
    a.download = 'json_'+date.toLocaleString()+'.json';

    // リンクをクリックしてダウンロードを開始
    document.body.appendChild(a);
    a.click();

    // ダウンロード用のリンクを削除
    document.body.removeChild(a);

    // URLオブジェクトを解放
    URL.revokeObjectURL(url);
}

window.exportJSON = exportJSON;
export{exportJSON}