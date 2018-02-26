/**
 * Created by mustang on 2017/10/21.
 */
 function deviceManage ($scope, $rootScope, $http, interface_url) {
	// 获取操作系统
    $scope.getOperaSysList = function() {
    	$http({
            'method': 'GET',
            'url': interface_url + '/uasc/platform/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.OperaSysList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        })
    }
    $scope.getOperaSysList();
    // 获取设备列表
    $scope.deviceList = [];
    $scope.getDeviceList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'page': 1
            },
            'url': interface_url + '/uasc/device/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.deviceList = data.result;
                // $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        });
    };
    $scope.getDeviceList();
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.os = $scope.queryDeviceParam.os?$scope.queryDeviceParam.os.uuid:'';
        $scope.version = $scope.queryDeviceParam.version;
        $scope.name_dev = $scope.queryDeviceParam.name;
        var sendData = {
            'os': $scope.os,
            'version': $scope.version,
            'name': $scope.name_dev,
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/device/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.deviceList = data.result;
                // $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
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
            name: '',
            nickname: '',
            os: '',
            version: '',
            serial_num: '',
            resolution: '',
            phone_ip: '',
            pc_user: '',
            pc_password: '',
            comment: '',
            pc_ip: '',
            is_public: '',
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openSystem = function () {
        $scope.initParam();
        // $scope.getOperaSysList();
        $scope.dialog = {
            header: '新增系统',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // 新增设备
    $scope.addSystemConfirm = function () {
    	if (!$scope.params.name || !$scope.params.nickname || !$scope.params.os || !$scope.params.version) {
            $rootScope.showToast('信息填写不完整') ;
            return;
        }
        if (!$scope.params.os.name === 'web') {
           if (!$scope.params.pc_user || !$scope.params.pc_password || !$scope.params.pc_ip) {
           		$scope.params.serial_num = null;
           		$scope.params.resolution = null;
           		$scope.params.phone_ip = null;
	            $rootScope.showToast('信息填写不完整');
	            return;
	        }
        } else {
        	if (!$scope.params.serial_num || !$scope.params.resolution || !$scope.params.phone_ip) {
           		$scope.params.pc_user = null;
           		$scope.params.pc_password = null;
           		$scope.params.pc_ip = null;
	            $rootScope.showToast('信息填写不完整');
            	return;
	        }
        }
        var paramsAll = {
            'name': $scope.params.name,
            'nickname': $scope.params.nickname,
            'version': $scope.params.version,
            'os': $scope.params.os.uuid,
            'serial_num': $scope.params.serial_num,
            'resolution': $scope.params.resolution,
            'phone_ip': $scope.params.phone_ip,
            'pc_user': $scope.params.pc_user,
            'pc_password': $scope.params.pc_password,
            'pc_ip': $scope.params.pc_ip,
            'comment': $scope.params.comment,
            'is_public': $scope.params.is_public,
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/uasc/device/',
            'data': paramsAll,
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
                $scope.getDeviceList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    // ===
 }
 /**
 * Pass all functions into module
 * 业务管理--设备管理
 */
 angular
  .module('inspinia')
  .controller('deviceManage', deviceManage)