export function getValueArray(ArrayObj, filed) {//ArrayObj:传入数组对象，filed：所需要你取出来的字段
    let data
    if (ArrayObj && typeof (ArrayObj) && ArrayObj.length > 0) {//如果数组对象存在且长度大于0，返回所需value数组
        data = ArrayObj.map(element => {
            return element[filed]
        })
    } else {//否则返回空数组
        data = []
    }


    return data;
}