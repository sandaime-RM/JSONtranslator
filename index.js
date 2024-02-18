let newValuePath = [];
const reader = new FileReader();
let valuesWithPath = [];

//JSONを読み込み
function loadJSON() {
    spinner(true);

    console.log(document.getElementById("file").files[0]);
    
    const file = document.getElementById("file").files[0];

    reader.onload = function(event) {
        const json = event.target.result;
        const data = JSON.parse(json);
        console.log(data); // オブジェクトを表示する例

        valuesWithPath = getAllValuesWithPath(data);
        console.log(valuesWithPath);
        setTimeout(translateAll, 50, false);
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

    for(var i = 0; i < Object.keys(valuesWithPath).length; i ++) {
        let element = valuesWithPath[i];
        let resultText
    
        resultText = "----";

        //翻訳前後の言語をフォームから取得
        let lang_before = document.getElementById("lang_before").value;
        let lang_after = document.getElementById("lang_after").value;
        let apiKey = document.getElementById("apiKey").value;
        
        if(translation) {
            resultText = await translate(element.value, lang_before, lang_after, apiKey);
        }
    
        //表として表示
        document.getElementById("outputField").innerHTML += '<tr><td class="text-sm">' + element.path + '</td><td>' + element.value + '</td><td><input id="afterText_' + i + '" class="p-2 rounded border" value="' + resultText + '" onchange="textChange(' + i + ')"></td></tr>'
        
        //出力用のオブジェクトの作成
        newValuePath[i] = {
            path : element.path,
            value : resultText
        }
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

//スピナー表示
function spinner(on) {
    if(on) {
        document.getElementById("spinner").style.display = "";
    } else {
        document.getElementById("spinner").style.display = "none";
    }
}
window.spinner = spinner;
export {spinner}

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

//Object内の全てのValueとPathを取得
function getAllValuesWithPath(obj, path = []) {
    let result = [];
  
    for (const key in obj) {
      const value = obj[key];
      const currentPath = [...path, key];
  
      if (typeof value === 'object' && value !== null) {
        result = result.concat(getAllValuesWithPath(value, currentPath));
      } else {
        result.push({ path: currentPath.join('/'), value });
      }
    }
    
    return result;
}

//ValueとパスからObjectを取得
function setValueByPath(obj, path, value) {
    const keys = path.split('/');
    let currentObj = obj;
  
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
  
    currentObj[keys[keys.length - 1]] = value;
  }
  
function setValuesByPaths(obj, values) {
    values.forEach(({ path, value }) => {
        setValueByPath(obj, path, value);
    });
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