/**
 * Created by mustang on 2017/10/21.
 */
 function systemManage ($scope, $rootScope, $http, interface_url) {
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
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/system/',
            'params': {
                'page': pageNumber,
                'department_id': $scope.department_sys,
                'product_id': $scope.product_sys,
                'name': $scope.name_sys
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            console.info('获取列表方法-分页error');
        })
    };
	// 获取部门列表
	$scope.queryDepartmentList = [];
    $scope.getDepartmentMethod = function (obj) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.queryDepartmentList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        })
    };
    $scope.getDepartmentMethod();
    // 获取部门下的产品列表
    $scope.queryProductList=[];
    $scope.queryDepartment = function (callback) {
        if (!$scope.querySystemParam.department)return;
        var departmentid = $scope.querySystemParam.department.uuid;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?department_id=' + departmentid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.queryProductList = data.result;
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        })
    };
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.department_sys = $scope.querySystemParam.department?$scope.querySystemParam.department.uuid:'';
        $scope.product_sys = $scope.querySystemParam.product?$scope.querySystemParam.product.uuid:'';
        $scope.name_sys = $scope.querySystemParam.name;
        var sendData = {
            'department': $scope.department_sys,
            'product': $scope.product_sys,
            'name': $scope.name_sys,
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/system/',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
 	// 1、获取系统列表
    $scope.systemList = [];
    $scope.getSystemList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'params': {
                'page': 1
            },
            'url': interface_url + '/uasc/system/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.systemList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
        });
    };
    $scope.getSystemList();
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            departmentName: '',
            productName: '',
            name: '',
            os: '',
            package_name: '',
            active_page: '',
            browser_path: '',
            browser_url: '',
            comment: '',
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openSystem = function () {
        $scope.initParam();
        $scope.getOperaSysList();
        $scope.dialog = {
            header: '新增系统',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    // 通过部门获取产品
    $scope.selectProductByDepent = function() {
    	if (!$scope.params.departmentName)return;
        var departmentid = $scope.params.departmentName.uuid;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?department_id=' + departmentid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.queryProductList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        })
    }
    // 选择产品得操作系统
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
    // 3、添加系统
    $scope.addSystemConfirm = function () {
    	if (!$scope.params.departmentName) {
            $rootScope.showToast('请选择部门') ;
            return;
        }
        if (!$scope.params.productName) {
            $rootScope.showToast('请选择产品') ;
            return;
        }
        if (!$scope.params.name) {
            $rootScope.showToast('请填写系统名称') ;
            return;
        }
        if (!$scope.params.os) {
            $rootScope.showToast('请选择操作系统');
            return;
        }
        if (!$scope.params.os.name === 'web') {
           if (!$scope.params.browser_path || !$scope.params.browser_url) {
	            $rootScope.showToast('信息填写不完整');
	            return;
	        }
        } else {
        	if (!$scope.params.package_name || !$scope.params.active_page) {
	            $rootScope.showToast('信息填写不完整');
	            return;
	        }
        }
        var paramsAll = {
            'department': $scope.params.departmentName.uuid,
            'product': $scope.params.productName.uuid,
            'name': $scope.params.name,
            'os': $scope.params.os.uuid,
            'package_name': $scope.params.package_name,
            'active_page': $scope.params.active_page,
            'browser_path': $scope.params.browser_path,
            'browser_url': $scope.params.browser_url,
            'comment': $scope.params.comment
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/uasc/system/',
            'data': paramsAll,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $('#myModal').modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加系统成功');
                $('#myModal').modal('hide');
                $scope.getSystemList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    // 点击查看
    $scope.seeSystem = function (itemId) {
        $scope.getOperaSysList();
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getSystemDetail(itemId);
    };
    // 通过id查看系统详情的方法
    $scope.getSystemDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/uasc/system/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                var current_pro =data.result.product;
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                	// 匹配部门
                    for (var i = 0; i < $scope.queryDepartmentList.length; i++) {
                        if ($scope.queryDepartmentList[i].uuid == data.result.department) {
                            $scope.params.departmentName = $scope.queryDepartmentList[i];
                            break;
                        }
                    };
                    $http({
			            'method': 'GET',
			            'url': interface_url + '/interface/product/list/?department_id=' + $scope.params.departmentName.uuid,
			            'headers': {
			                'Authorization': 'Token ' + localStorage.getItem('auth_token')
			            }
			        }).success(function (data) {
			            if (data.code === 200 || data.code === '200'){
			                $scope.queryProductList = data.result;
			                 // 匹配产品
		                    for (var i = 0; i < $scope.queryProductList.length; i++) {
		                        if ($scope.queryProductList[i].uuid == current_pro) {
		                            $scope.params.productName = $scope.queryProductList[i];
		                            break;
		                        }
		                    };
			            }
			        })
                    // 匹配操作系统
                    for (var i = 0; i < $scope.OperaSysList.length; i++) {
                        if ($scope.OperaSysList[i].uuid == data.result.os) {
                            $scope.params.os = $scope.OperaSysList[i];
                            break;
                        }
                    };
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };
    // 4、要修改的id
    $scope.editSystemId = '';
    $scope.editSystem = function (itemId) {
        $scope.getOperaSysList();
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editSystemId = itemId;
        $scope.getSystemDetail(itemId);
    };
    // 确认修改系统
    $scope.editSystemConfirm = function () {
        var paramsAll = {
            'department': $scope.params.departmentName.uuid,
            'product': $scope.params.productName.uuid,
            'name': $scope.params.name,
            'os': $scope.params.os.uuid,
            'package_name': $scope.params.package_name,
            'active_page': $scope.params.active_page,
            'browser_path': $scope.params.browser_path,
            'browser_url': $scope.params.browser_url,
            'comment': $scope.params.comment
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/uasc/system/' + $scope.editSystemId +'/',
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
                $scope.getSystemList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 禁用
    $scope.disableSystemId = '';
    $scope.disableSystem = function (itemId, index) {
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
        $scope.disableSystemId = itemId;
        $scope.disableIndex = index;
    };
    // 确认禁用
    $scope.disableSystemConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/uasc/system/' + $scope.disableSystemId + '/',
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
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('禁用失败');
        });
    };
    // 删除
    $scope.delSystemId = '';
    // 获取某条要删除系统的id
    $scope.delSystem = function (itemId, index) {
        $scope.delSystemId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除系统
    $scope.delSystemConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/uasc/system/' + $scope.delSystemId + '/',
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
                $scope.getSystemList();
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };
 }
 /**
 * Pass all functions into module
 * 业务管理--系统管理
 */
 angular
  .module('inspinia')
  .controller('systemManage', systemManage)