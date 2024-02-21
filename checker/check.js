import {setValuesByPaths, spinner, getAllValuesWithPath} from "../base.js"

let newValuePath = [];
const reader = new FileReader();
let valuesWithPath = [[], []];

//JSONを読み込み
function loadJSON(id) {
    spinner(true);
    
    const file = document.getElementById("file" + id).files[0];

    reader.onload = function(event) {
        const json = event.target.result;
        const data = JSON.parse(json);
        console.log(data); // オブジェクトを表示する例

        valuesWithPath[id] = getAllValuesWithPath(data);
        console.log(valuesWithPath[id]);

        spinner(false);
    };

    reader.readAsText(file);
}

window.loadJSON = loadJSON;
export {loadJSON}

//JSONファイルの比較と結果表示
function checkJSON() {

}

window.checkJSON = checkJSON;
export {checkJSON}