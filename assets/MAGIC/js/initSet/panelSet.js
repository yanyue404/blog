/**
 * Created by Administrator on 2017/5/16.
 */
/**
 * 初始化设置=='平台设置'
 */
function initSetPanelSet($scope, $rootScope, $http, interface_url) {
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/platform/',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'name': $scope.queryPanelParam?$scope.queryPanelParam.panelName:"",
                'description': $scope.queryPanelParam?$scope.queryPanelParam.panelDes:""
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.panelList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
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
    // 1、获取平台列表
    $scope.panelList = [];
    $scope.getPanelList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'url': interface_url + '/uasc/platform/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.panelList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
                //$scope.queryStorageList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        });
    };
    $scope.getPanelList();
    // 2、查询平台列表
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        var sendData = {
            'name': $scope.queryPanelParam.panelName,
            'description': $scope.queryPanelParam.panelDes,
            'is_active': 'all',
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/platform/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.panelList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };

    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            panelName: '',
            panelDes: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openPanel = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增平台',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };

    // 3、添加平台
    $scope.addPanelConfirm = function () {
        if (!$scope.params.panelName) {
            $rootScope.showToast('请输入平台名称') ;
            return;
        }
        if (!$scope.params.panelDes) {
            $rootScope.showToast('请输入平台描述') ;
            return;
        }
        var paramsAll = {
            'name': $scope.params.panelName,
            'description': $scope.params.panelDes,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/uasc/platform/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加平台成功');
                $('#myModal').modal('hide');
                $scope.getPanelList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    /**
     * 3、查看平台
     * @param  {[string]} itemId [查看的id]
     * @return {[type]}        [description]
     */
    $scope.seePanel = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getPanelDetail(itemId);
    };
    // 通过id查看平台详情的方法
    $scope.getPanelDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/platform/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                $scope.params.panelName = data.result.name;
                $scope.params.panelDes = data.result.description;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看平台详情失败');
        });
    };

    // 4、要修改的id
    $scope.editPanelId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改的id
     * @return {[type]}        [description]
     */
    $scope.editPanel = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editPanelId = itemId;
        $scope.getPanelDetail(itemId);
    };
    // 确认修改平台
    $scope.editPanelConfirm = function () {
        var paramsAll = {
            'name': $scope.params.panelName,
            'description': $scope.params.panelDes,
            'is_active': $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/uasc/platform/' + $scope.editPanelId +'/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                $scope.getPanelList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 删除
    $scope.delPanelId = '';
    // 获取某条要删除系统的id
    $scope.delPanel = function (itemId, index) {
        $scope.delPanelId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除平台
    $scope.delPanelConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/uasc/platform/' + $scope.delPanelId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#DisableModel').modal('hide');
            }else if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $("#DisableModel").modal('hide');
                $scope.getPanelList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 禁用
    $scope.disablePanelId = '';
    $scope.disablePanel = function (itemId, index) {
        console.log(itemId)
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disablePanelId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disablePanelConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/uasc/platform/' + $scope.disablePanelId + '/',
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
                $scope.panelList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('禁用失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('initSetPanelSet', initSetPanelSet) // 初始化设置==平台设置