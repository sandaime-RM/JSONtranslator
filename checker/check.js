import {spinner, getAllValuesWithPath} from "../base.js"

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

//JSONファイルのパスの比較と結果表示
function checkJSON() {
    let paths1 = valuesWithPath[1].map(item => item.path);
    let paths2 = valuesWithPath[2].map(item => item.path);
    let checkedKeys = []; //JSON2の中で、検索された要素のキー

    //表示領域の初期化
    document.getElementById("outputField").innerHTML = "";

    //結果変数
    let result = 0 // 0 : すべてのパスが一致, 1 : JSON1に欠落あり, 2 : JSON2に欠落あり, 3 : 互いに欠落あり

    //JSONファイル1のそれぞれの要素に対してJSONファイル2から検索
    paths1.forEach((path1, index) => {
        var index2 = paths2.indexOf(path1);
        var element1 = valuesWithPath[1][index];
        var checkResult;

        if(index2 != -1) {
            checkResult = '<i class="bi bi-check-lg text-emerald-600 text-xl me-2"></i>' + valuesWithPath[2][index2].value;
            checkedKeys.push(index2);
        } else {
            checkResult = '<i class="bi bi-x-lg text-red-600 text-xl me-2"></i>';
            result = 2; //JSON2に欠落あり
        }
        
        //表示
        document.getElementById("outputField").innerHTML += '<tr><td class="small">' + element1.path +'</td><td><i class="bi bi-check-lg text-emerald-600 text-xl me-2"></i>' + element1.value +'</td><td>' + checkResult + '</td></tr>'
    });

    //JSON2のそれぞれの要素（checkedKeys以外）に対してJSON1から検索
    paths2.forEach((path2, index) => {
        if(checkedKeys.indexOf(index) == -1) {
            var index1 = paths1.indexOf(path2);
            var element2 = valuesWithPath[2][index];
            var checkResult;

            if(index1 != -1) {
                checkResult = '<i class="bi bi-check-lg text-emerald-600 text-xl me-2"></i>' + valuesWithPath[1][index1].value;
            } else {
                checkResult = '<i class="bi bi-x-lg text-red-600 text-xl me-2"></i>';

                if(result == 2) {
                    result = 3; //JSON1, 2に欠落あり
                } else {
                    result = 1; //JSON1に欠落あり
                }
            }
            
            //表示
            document.getElementById("outputField").innerHTML += '<tr><td class="small">' + element2.path +'</td><td>' + checkResult +'</td><td><i class="bi bi-check-lg text-emerald-600 text-xl me-2"></i>' + element2.value + '</td></tr>'

        }
    })
}

window.checkJSON = checkJSON;
export {checkJSON}