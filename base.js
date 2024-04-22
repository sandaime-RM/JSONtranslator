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
  
    currentObj[keys[keys.length - 1]] = unescapeHtml(value);
  }
  
function setValuesByPaths(obj, values) {
    values.forEach(({ path, value }) => {
        setValueByPath(obj, path, value);
    });
}

//スピナー表示
function spinner(on) {
    if(on) {
        document.getElementById("spinner").style.display = "";
    } else {
        document.getElementById("spinner").style.display = "none";
    }
}

//export functions
window.spinner = spinner;
window.setValuesByPaths = setValuesByPaths;
window.getAllValuesWithPath = getAllValuesWithPath;
export {spinner, getAllValuesWithPath, setValuesByPaths}


/**
 * HTML文字列をアンエスケープ
 * @param {string} str エスケープされたHTML文字列
 * @return {string} アンエスケープされたHTML文字列を返す
 * https://shanabrian.com/web/javascript/unescape-html.php
 */
var unescapeHtml = function(str) {
	if (typeof str !== 'string') return str;

	var patterns = {
		'&lt;'   : '<',
		'&gt;'   : '>',
		'&amp;'  : '&',
		'&quot;' : "'",
		'&#x27;' : "'",
		'&#x60;' : '`',
    '&#39;'  : "'",
	};

	return str.replace(/&(lt|gt|amp|quot|#x27|#x60|#39);/g, function(match) {
		return patterns[match];
	});
};