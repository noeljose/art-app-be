type numvar = number | string;

export function empty(data:numvar):boolean{

    if (data === null || data == "") {
        return true
    }

    return false
}