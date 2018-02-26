/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 系统配置==数据仓库==0316
 */
function backSysConfig_dataStorage($scope, $rootScope, $http, interface_url) {
    // 数据仓库类型
    $scope.dateStorageType = [{type: 'git'}, {type: 'svn'}];
    // 请求类型
    $scope.codeType = [{type: 'source'}, {type: 'deploy'}];
    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        status: ''
    };
    $scope.departmentList = [];
    $scope.productList = [];
    $scope.getDepartmentList = function () {
        if ($scope.departmentList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/department/list/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.departmentList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                //console.info(data);
            });
        }
    };
    $scope.getDepartmentList();
    // 先选择部门，在选择产品，根据部门选择产品
    $scope.selectDepartment = function (callback) {
        if (!$scope.params.department)return;
        var departmentid = $scope.params.department.uuid;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?department_id=' + departmentid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.productList = data.result;
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
    $scope.updateID = function (){
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/syn/warehouse/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $rootScope.showToast(data.message);
                $scope.getDateStorageList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            scm_type: {},
            code_type: {},
            name: '',
            http_address: '',
            ssh_address: '',
            login_user: '',
            login_password: '',
            is_active: false
        }
    };
    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openDateStorage = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增数据仓库',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    $scope.dateStorageList = [];
// 获取数据仓库列表接口
    $scope.getDateStorageList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/warehouse/?format=json',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.dateStorageList = data.result;
                    $scope.initPageCompomentFun(data.allPage);
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取数据仓库列表失败');
        });
    };
    // 调用数据仓库接口
    $scope.getDateStorageList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/warehouse/?format=json',
            'params': {
                'page': pageNumber,
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
                $scope.dateStorageList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('数据仓库列表方法-分页error');
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
    $scope.addDateStorageConfirm = function () {
        console.log($scope.params.department)
        var params = {
            department:$scope.params.department.uuid,
            product:$scope.params.product.uuid,
            scm_type: $scope.params.scm_type.type,
            code_type: $scope.params.code_type.type,
            name: $scope.params.name,
            http_address: $scope.params.http_address,
            ssh_address: $scope.params.ssh_address,
            login_user: $scope.params.login_user,
            login_password: $scope.params.login_password,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/warehouse/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#myModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加数据仓库成功');
                $('#myModal').modal('hide');
                $scope.getDateStorageList();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('添加数据仓库失败');
            // $('#myModal').modal('hide');
        })
    };
    /**
     * 查看数据仓库
     * @param  {[string]} itemId [查看某条J数据仓库的id]
     * @return {[type]}        [description]
     */
    $scope.seeDateStorage = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getDateStorageDetail(itemId);
    };

    // 通过id查看数据仓库的方法
    $scope.getDateStorageDetail = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/warehouse/' + id + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.params = data.result;
                // 查看某个用例的情况下，将之前保存的数据渲染出来
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 渲染部门
                    for (var i = 0; i < $scope.departmentList.length; i++) {
                        if ($scope.departmentList[i].id === data.result.department) {
                            $scope.params.department = $scope.departmentList[i];
                            break;
                        }
                    }
                    var departmentid =  data.result.department.id;
                    //console.log(departmentid)
                    var productid =  data.result.product;
                    $http({
                        'method': 'GET',
                        'url': interface_url + '/interface/product/list/?department_id=' + departmentid,
                        'headers': {
                            'Authorization': 'Token ' + localStorage.getItem('auth_token')
                        }
                    }).success(function (data) {
                        if(data.code === 403 || data.code === '403'){
                            $rootScope.showLogin();
                         }else {
                        if (data.code === 200 || data.code === '200'){
                            $scope.productList = data.result;
                            // 渲染产品
                            for (var i = 0; i < $scope.productList.length; i++) {
                                if ($scope.productList[i].id === productid) {
                                    $scope.params.product = $scope.productList[i];
                                    break;
                                }
                            }
                        }else {
                            $rootScope.showToast(data.message);
                        }
                    }}).error(function (data) {
                    })
                    // 渲染数据仓库类型
                    for (var i = 0; i < $scope.dateStorageType.length; i++) {
                        if ($scope.dateStorageType[i].type === data.result.scm_type) {
                            $scope.params.scm_type = $scope.dateStorageType[i];
                            break;
                        }
                    }
                    // 渲染代码类型
                    for (var i = 0; i < $scope.codeType.length; i++) {
                        if ($scope.codeType[i].type === data.result.code_type) {
                            $scope.params.code_type = $scope.codeType[i];
                            break;
                        }
                    }
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看数据仓库失败');
        });
    };

    // 要修改的id
    $scope.editDateStorageId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改用例接口的id
     * @return {[type]}        [description]
     */
    $scope.editDateStorage = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            add:true,
            status: 'modify'
        };
        $scope.editDateStorageId = itemId;
        $scope.getDateStorageDetail(itemId);
    };
    // 确认修改数据仓库
    $scope.editDateStorageConfirm = function () {
        var params = {
            department:$scope.params.department.id,
            product:$scope.params.product.id,
            scm_type: $scope.params.scm_type.type,
            code_type: $scope.params.code_type.type,
            name: $scope.params.name,
            http_address: $scope.params.http_address,
            ssh_address: $scope.params.ssh_address,
            login_user: $scope.params.login_user,
            login_password: $scope.params.login_password,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/warehouse/' + $scope.editDateStorageId +'/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改数据仓库成功');
                // 初始化页面调用Jenkins服务器列表
                $scope.getDateStorageList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改数据仓库失败');
        })
    };
    // 删除某条数据仓库
    $scope.delDateStorageId = '';
    // 获取某条要删除Jenkins服务器的id
    $scope.delDateStorage = function (itemId, index) {
        $scope.delDateStorageId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除数据仓库
    $scope.delDateStorageConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/gdc/warehouse/' + $scope.delDateStorageId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除数据仓库成功');
                // 调用数据仓库接口
                $scope.getDateStorageList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除数据仓库失败');
        })
    };

    // 禁用某条数据仓库
    $scope.disableDateStorageId = '';
    $scope.disableDateStorage = function (itemId, index) {
        $scope.disableDateStorage = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条数据仓库
    $scope.disableDateStorageConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/gdc/warehouse/' + $scope.disableDateStorage + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用数据仓库成功');
                $scope.dateStorageList[$scope.disableIndex].is_active = false;
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用数据仓库失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSysConfig_dataStorage', backSysConfig_dataStorage); // 系统配置==数据仓库