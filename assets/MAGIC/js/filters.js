/**
 * Created by Administrator on 2017/2/13.
 */
/*---IF interfaceCenter*/
function IFaddUrl(input){
    return function(input){
        //return '11'+input;
    }

}
function defaultValue(){
    return function (input) {
        if(!input){
            return '----';
        }
    }
}
/** 过滤是否启用 */
function ableOrDisable(item){
    switch (item) {
        case 'true':
            return '启用';
        case 'false':
            return '禁用';
    }
}
/*------*/
angular
    .module('inspinia')
    .filter('IFaddUrl',IFaddUrl)
    .filter('defaultValue','defaultValue')
    .filter('ableOrDisable','ableOrDisable');

