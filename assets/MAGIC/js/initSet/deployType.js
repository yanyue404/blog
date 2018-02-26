/**
 * Created by Administrator on 2017/4/26.
 */
/**
 * 系统配置==部署类型==0316
 */
// bug73==部署类型 新增字段==zxh
function deployment_type($scope, $rootScope, $http, interface_url) {
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            dataStorageName: '',
            name: '',
            source_status: false,
            deploy_status: false,
            interface_status: false,
            is_init: false,
            is_tmc: false,
            is_gdc: false,
            is_uasc: false,
            is_cmc: false,
            is_active: false
        };
        // params
        $scope.paramsArr = [{
            key: '',
            value: '',
            is_select: false
        }];
    };
    // type是否tmc
    $scope.typeIsTmc = function () {
        $scope.params.is_tmc = !$scope.params.is_tmc;
    };
    // type是否gdc
    $scope.typeIsGdc = function () {
        $scope.params.is_gdc = !$scope.params.is_gdc;
    };
    // type是否uasc
    $scope.typeIsUasc = function () {
        $scope.params.is_uasc = !$scope.params.is_uasc;
    };
    // type是否cmc
    $scope.typeIsCmc = function () {
        $scope.params.is_cmc = !$scope.params.is_cmc;
    };
    // 将type以字符串形式传入
    $scope.getType = function () {
        var is_type = "";
        if ($scope.params.is_tmc){
            if (is_type === ""){
                is_type = is_type + "tmc";
            } else {
                is_type = is_type + ",tmc";
            }
        }
        if ($scope.params.is_gdc){
            if (is_type === ""){
                is_type = is_type + "gdc";
            } else {
                is_type = is_type + ",gdc";
            }
        }
        if ($scope.params.is_uasc){
            if (is_type === ""){
                is_type = is_type + "uasc";
            } else {
                is_type = is_type + ",uasc";
            }
        }
        if ($scope.params.is_cmc){
            if (is_type === ""){
                is_type = is_type + "cmc";
            } else {
                is_type = is_type + ",cmc";
            }
        }
        return is_type;
        /*if ($scope.params.is_tmc && $scope.params.is_gdc && $scope.params.is_uasc) {
            return "tmc,gdc,uasc"
        }else if ($scope.params.is_tmc && $scope.params.is_gdc) {
            return "tmc,gdc"
        }else if ($scope.params.is_gdc && $scope.params.is_uasc) {
            return "gdc,uasc"
        } else if ($scope.params.is_tmc && $scope.params.is_uasc) {
            return "tmc,uasc"
        }else if ($scope.params.is_tmc) {
            return "tmc"
        } else if ($scope.params.is_gdc){
            return "gdc"
        }else if ($scope.params.is_uasc){
            return "uasc"
        } else {
            return "";
        }*/
    };
    // 将type转化为回原来的形式
    $scope.getTypeBack = function (val) {
        var tempval = val.split(/\,/);
        for (var i=0;i<tempval.length;i++){
            if (tempval[i]==="tmc"){
                $scope.params.is_tmc = true;
            }
            if (tempval[i]==="gdc"){
                $scope.params.is_gdc = true;
            }
            if (tempval[i]==="uasc"){
                $scope.params.is_uasc = true;
            }
            if (tempval[i]==="cmc"){
                $scope.params.is_cmc = true;
            }
        }
        /*if (val == 'gdc,tmc,uasc' || val == 'gdc,uasc,tmc' || val == 'tmc,gdc,uasc'|| val == 'tmc,gdc,uasc,gdc' || val == 'uasc,gdc,tmc'|| val == 'uasc,tmc,gdc') {
            $scope.params.is_tmc = true;
            $scope.params.is_gdc = true;
            $scope.params.is_uasc = true;
        } else if (val == 'gdc,tmc' || val == 'tmc,gdc') {
            $scope.params.is_tmc = true;
            $scope.params.is_gdc = true;
        } else if (val == 'gdc,uasc' || val == 'uasc,gdc') {
            $scope.params.is_uasc = true;
            $scope.params.is_gdc = true;
        } else if (val == 'uasc,tmc' || val == 'tmc,uasc') {
            $scope.params.is_tmc = true;
            $scope.params.is_uasc = true;
        } else if (val == 'tmc') {
            $scope.params.is_tmc = true;
        } else if (val == 'gdc'){
            $scope.params.is_gdc = true;
        }else if (val == 'uasc'){
            $scope.params.is_uasc = true;
        } else {
            $scope.params.is_tmc = false;
            $scope.params.is_gdc = false;
            $scope.params.is_uasc = false;
        }*/
    };
    // [plus 增加输入框]
    $scope.plus = function (name, index) {
        // console.log('plus');
        $scope[name][$scope[name].length] = {
            key: '',
            value: '',
            is_select: false
        };
    };
    // 点击减号框，删除本输入框
    $scope.minus = function (name, index) {
        // console.log('minus');
        // console.log(index);
        if ($scope[name].length > 1) {
            $scope[name].splice(index, 1);
        }
    };
    // 转换为键值对;
    $scope.transKeyValue = function (arr) {
        if (!arr)return;
        var res = {};  //0311==没有值的时候传空字符串==zxh
        for (var i = 0; i < arr.length; i++) {
            // console.log(arr);
            if (arr[i].is_select){
                if (arr[i].key===''){
                    res = '';
                } else {
                    res[arr[i].key] =  '${' + arr[i].value + '}$';
                }
            } else {
                if (arr[i].key===''){
                    res = '';
                } else {
                    res[arr[i].key] =  arr[i].value ;
                }
            }
            //res[arr[i].key] = '${' + arr[i].value + '}$';
        }
        if (res === ''){
            return res;
        } else {
            return JSON.stringify(res);
        }
    };
    // 将字符串json  转换为数组 用来 ng-repeat
    $scope.transToArray = function (str) {
        if (str){
            var obj = JSON.parse(str);
            var resArr = [];
            for (var i in obj) {
                resArr.push({key: i, value: obj[i]});
            }
            $scope.originParamsList = resArr;
            return resArr;
        } else {
            var resArr = [];
            resArr.push({key: '', value: ''});
            $scope.originParamsList = resArr;
            return resArr;
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openDeployType = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增部署类型',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.deployTypeList = [];
// 获取代码分支列表接口
    $scope.getDeployTypeList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/build/type/?format=json',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.deployTypeList = data.result;
                    $scope.initPageCompomentFun(data.allPage);
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('获取代码分支列表失败');
        });
    };
    // 调用代码分支接口
    $scope.getDeployTypeList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/build/type/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.deployTypeList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            console.info('获取列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count) {
        $(".back-server-frame .tcdPageCode").createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
    // 确认添加
    $scope.addDeployTypeConfirm = function () {
        var params = {
            name: $scope.params.name,
            format_param: $scope.transKeyValue($scope.paramsArr),
            source_status: $scope.params.source_status,
            deploy_status: $scope.params.deploy_status,
            interface_status: $scope.params.interface_status,
            is_init: $scope.params.is_init,
            type_hood: $scope.getType(),
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/build/type/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加成功');
                $('#myModal').modal('hide');
                $scope.getDeployTypeList();
            }else {
                if (data.message){
                    $rootScope.showToast(data.message);
                }else{
                    $rootScope.showToast(data);
                }
            }
        }).error(function (data) {
            if (data.message){
                $rootScope.showToast(data.message);
            }else{
                $rootScope.showToast(data);
            }
        })
    };
    /**
     * 查看代码分支
     * @param  {[string]} itemId [查看某条代码分支的id]
     * @return {[type]}        [description]
     */
        // 某条详情对应的默认值
    $scope.seeTypeVal = {};
    $scope.seeDeployType = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.seeDeployTypeId = itemId;
        $scope.getDeployTypeDetail('seeTypeVal', itemId, function (){
            $scope.paramsArr = $scope.transToArray($scope.seeTypeVal.format_param);
        });

    };
    // 查看某条详情的方法
    $scope.getDeployTypeDetail = function (obj, itemId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/build/type/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope[obj] = data.result;
                $scope.params = data.result;
                $scope.getTypeBack($scope.params.type_hood);
                callback && callback(data);
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };

    // 通过id查看代码分支的方法
    //$scope.getDeployTypeDetail = function (id) {
    //    $http({
    //        'method': 'GET',
    //        'url': interface_url + '/gdc/build/type/' + id + '/',
    //        'headers': {
    //            'Authorization': 'Token ' + localStorage.getItem('auth_token')
    //        }
    //    }).success(function (data) {
    //        $scope.params = data.result;
    //        // 查看某个代码分支的情况下，将之前保存的数据渲染出来
    //        if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
    //            // 渲染数据仓库
    //
    //        }
    //    }).error(function (data) {
    //        $rootScope.showToast('查看代码分支失败');
    //    });
    //};

    // 要修改的id
    $scope.editDeployTypeId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.editDeployType = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editDeployTypeId = itemId;
        $scope.getDeployTypeDetail('seeTypeVal', itemId, function (){
            $scope.paramsArr = $scope.transToArray($scope.seeTypeVal.format_param);
        });
    };
    // 确认修改代码分支==0410
    $scope.editDeployTypeConfirm = function () {
        var params = {
            format_param: $scope.transKeyValue($scope.paramsArr),
            name: $scope.params.name,
            source_status: $scope.params.source_status,
            deploy_status: $scope.params.deploy_status,
            interface_status: $scope.params.interface_status,
            is_init: $scope.params.is_init,
            type_hood: $scope.getType(),
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/build/type/' + $scope.editDeployTypeId +'/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                // 初始化页面调用代码分支列表
                $scope.getDeployTypeList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    // 删除某条代码分支库
    $scope.delDeployTypeId = '';
    // 获取某条要删除代码分支的id
    $scope.delDeployType = function (itemId, index) {
        $scope.delDeployTypeId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除代码分支
    $scope.delDeployTypeConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/build/type/' + $scope.delDeployTypeId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#DisableModel').modal('hide');
            }else if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                // 初始化页面调用代码分支列表
                $scope.getDeployTypeList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };

    // 禁用某条代码分支
    $scope.disableDeployTypeId = '';
    $scope.disableDeployType = function (itemId, index) {
        $scope.disableDeployType = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条代码分支
    $scope.disableDeployTypeConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/build/type/' + $scope.disableDeployType + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#DisableModel').modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.deployTypeList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('deployment_type', deployment_type)    // 系统配置==部署类型
