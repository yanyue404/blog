/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 系统配置==环境
 */
function backSysConfig_env($scope, $rootScope, $http, interface_url) {
    $scope.envListArr = []; // 存放系统类别数据
    // 环境列表接口
    // 请求列表的接口
    $scope.getEnvList = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/env/list/?format=json',
            'params': {
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.envListArr = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取环境列表失败');
        });
    };
    $scope.getEnvList(); //  渲染列表数据
    /**
     * 重置基本参数
     * @param {any} obj [需要放入到该对象里面]
     * @param {any} arr [分别要重置的值]
     * @returns
     */
    $scope.reset = function (obj, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === 'is_active') {
                obj[arr[i]] = false;
            } else {
                obj[arr[i]] = '';
            }
        }
        return obj;
    };

    $scope.addEnv = {
        name: '',
        description: '',
        is_init: false,
        is_active: false
    };
    // 新增环境
    $scope.addEnvMethod = function () {
        if (!$scope.addEnv.name) {
            $rootScope.showToast('请填写名称') ;
            return;
        }
        if (!$scope.addEnv.description) {
            $rootScope.showToast('请填写环境描述') ;
            return;
        }
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/env/add/',
            'data': $scope.addEnv,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $scope.envListArr.push(data.result);
                $rootScope.showToast('新增环境详情成功');
                $scope.reset($scope.addEnv, ['name', 'description', 'is_active', 'is_init']);
                $scope.getEnvList(); //  渲染列表数据
                $('#myModal').modal('hide'); // 隐藏模态窗
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('新增环境详情失败');
            $scope.reset($scope.addEnv, ['name', 'description', 'is_active', 'is_init']);
        });
    };

    // 是否启用
    $scope.isEnvActiveMethod = function () {
        $scope.addEnv.is_active = !$scope.addEnv.is_active;
    };
    // 是否为初始化数据
    $scope.isEnvInitMethod = function () {
        $scope.addEnv.is_init = !$scope.addEnv.is_init;
    };

    //
    /**
     * [请求某条环境的详情
     * @param  {[string]} obj [$scope下的某个变量，根据传入的参数不同，保存不一样的名字]
     * @param  {[string]} id  [某个环境id]
     * @return {[type]}     [description]
     */
    $scope.getEnvDetail = function (obj, id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/env/detail/' + id + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope[obj] = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看详情失败');
        });
    };

    // 查看环境详情
    $scope.seeEnvDes = function (itemId) {
        // 默认环境详情
        $scope.seeEnv = {
            name: '',
            description: '',
            is_init: false,
            is_active: false
        };
        $scope.getEnvDetail('seeEnv', itemId);
    };

    // 修改环境的默认值
    $scope.editEnv = {};
    // 修改某条环境的id
    $scope.editEnvId = '';
    // 在更改环境时是否是启用
    $scope.editEnvActive = function () {
        $scope.editEnv.is_active = !$scope.editEnv.is_active;
    };
    // 在更改环境时是否是启用
    $scope.editEnvInit = function () {
        $scope.editEnv.is_init = !$scope.editEnv.is_init;
    };
    // 修改环境
    $scope.editEnvDes = function (itemId) {
        $scope.editEnvId = itemId;
        $scope.getEnvDetail('editEnv', itemId);
    };
    // 确认修改环境
    $scope.editEnvMethod = function () {
        if (!$scope.editEnv.name) {
            $rootScope.showToast('请填写名称') ;
            return;
        }
        if (!$scope.editEnv.description) {
            $rootScope.showToast('请填写环境描述') ;
            return;
        }
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/env/detail/' + $scope.editEnvId + '/update/',
            'data': $scope.editEnv,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#editModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改环境成功');
                $scope.getEnvList(); //  修改后重新渲染列表数据
                $("#editEnv").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };

    // 某条环境数据的id
    $scope.EnvDetailId = '';
    // 禁用某条环境数据
    $scope.DisableEnv = function (itemId) {
        $scope.EnvDetailId = itemId;
    };
    // 确认禁用某条环境
    $scope.DisableEnvMethod = function () {
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/env/detail/' + $scope.EnvDetailId + '/update/',
            'data': {
                is_active: 0
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.getEnvList(); //  渲染列表数据
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    // 某条环境id
    $scope.delEnvId = '';
    // 删除环境
    $scope.delEnv = function (itemId) {
        $scope.delEnvId = itemId;
    };
    // 确认删除某条环境
    $scope.sureDelEnv = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/env/detail/' + $scope.delEnvId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#delEnv").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $scope.getEnvList(); //  渲染列表数据
                $("#delEnv").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSysConfig_env', backSysConfig_env); // 系统配置==环境