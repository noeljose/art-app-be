//CUSTOME TYPES
type naso = number | [] | string | object;

export function empty(data:naso):boolean{

    if (typeof data == 'undefined') {
        return true
    }
    return false
}


