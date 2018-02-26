/**
 * Created by Administrator on 2017/6/8.
 */
/**
 * [微信号]
 */
function weChatNum($scope, $rootScope, $http, interface_url) {
    //过滤匹配结果
    $scope.showMatch = function (input) {
        if (input === 0) {
            return '已匹配';
        }
        if (input === 1) {
            return '匹配失败';
        }
        if (input === 2) {
            return '未匹配';
        }
    };
    $scope.updateID = function (){
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechat/syn/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $rootScope.showToast(data.message);
                $scope.getWechatList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        // console.log($scope)
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechat/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'name': $scope.name
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.wechatList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('获取列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count,select) {
        $(select).createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    // 1、获取系统列表
    $scope.wechatList = [];
    $scope.getWechatList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/gdc/wechat/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.wechatList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
                //$scope.queryStorageList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        });
    };
    $scope.getWechatList();
	
// 2、查询系微信号列表
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        var sendData = {
            'name': $scope.queryWechatParam.name,
            'is_active': 'all',
            'page': 1
        };
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechat/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.wechatList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            name: '',
            wechat: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openWechat = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增微信号',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // 3、添加微信号
    $scope.addWechatConfirm = function () {
        if (!$scope.params.name) {
            $rootScope.showToast('请输入名称') ;
            return;
        }
        if (!$scope.params.wechat) {
            $rootScope.showToast('请输入微信号') ;
            return;
        }
        var paramsAll = {
            'name': $scope.params.name,
            'wechat': $scope.params.wechat,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/wechat/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加成功');
                $('#myModal').modal('hide');
                //$scope.seeSystem(data.result.uuid);
                $scope.getWechatList();
            }else {
                if(data.message){
                    $rootScope.showToast(data.message);
                } else {
                    $rootScope.showToast(data);
                }
            }
        }}).error(function (data) {
            if(data.message){
                $rootScope.showToast(data.message);
            } else {
                $rootScope.showToast(data);
            }
        })
    };
    /**
     * 3、查看微信号
     * @param  {[string]} itemId [查看的id]
     * @return {[type]}        [description]
     */
    $scope.seeWechat = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getWechatDetail(itemId);
    };
    // 通过id查看系统详情的方法
    $scope.getWechatDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/wechat/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };

    // 4、要修改的id
    $scope.editWechatId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改的id
     * @return {[type]}        [description]
     */
    $scope.editWechat = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editWechatId = itemId;
        $scope.getWechatDetail(itemId);
    };
    // 确认修改系统
    $scope.editWechatConfirm = function () {
        var paramsAll = {
            'name': $scope.params.name,
            'wechat': $scope.params.wechat,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/wechat/' + $scope.editWechatId +'/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#myModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改代成功');
                $scope.getWechatList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除
    $scope.delWechatId = '';
    // 获取某条要删除系统的id
    $scope.delWechat = function (itemId, index) {
        $scope.delWechatId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除
    $scope.delWechatConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/wechat/' + $scope.delWechatId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#DisableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $("#DisableModel").modal('hide');
                $scope.getWechatList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用
    $scope.disableWechatId = '';
    $scope.disableWechat = function (itemId, index) {
        // console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableWechatId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disableWechatConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/wechat/' + $scope.disableWechatId + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#DisableModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.wechatList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('weChatNum', weChatNum); // 用户管理==用户
