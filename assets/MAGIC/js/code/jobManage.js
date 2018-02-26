/**
 * Created by Administrator on 2017/6/27.
 */
/**
 * 代码 管理-->任务管理
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 */
function jobManage($scope, $rootScope, $http, interface_url) {
    // 获取部门
    $scope.queryDepartmentList = [];
    $scope.getDepartmentList = function () {
        if ($scope.queryDepartmentList.length == 0) {
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
            }).error(function (data) {
                //console.info(data);
            });
        }
    };
    $scope.getDepartmentList();
    // 先选择部门，在选择产品，根据部门选择产品
    $scope.selectedProduct = function () {
        if (!$scope.addDetailParam.product && !$scope.EditDetailProduct)return;
        // 获取当前产品下的 系统
        $scope.queryFlag = '';
        if ($scope.addDetailParam.product) {
            $scope.getCaseSystem($scope.addDetailParam.product.id);
        }
        if ($scope.EditDetailProduct) {
            $scope.getCaseSystem($scope.EditDetailProduct.id);
        }
    };
    $scope.queryFlag = 1;
    $scope.queryDepartment = function (callback) {
        if (!$scope.queryDetailParam.department)return;
        $scope.queryFlag = 1;
        var departmentid = $scope.queryDetailParam.department.id
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?product_id=' + departmentid,
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
        }).error(function (data) {
        })
    };


    // 2、点击查询
    $scope.queryCaseJob = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.product_id = $scope.queryDetailParam.product?$scope.queryDetailParam.product.id:"";
        $scope.department_id = $scope.queryDetailParam.department?$scope.queryDetailParam.department.id:'';
        $scope.warehouse = $scope.queryDetailParam.warehouse?$scope.queryDetailParam.warehouse.uuid:'';
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/job/',
            'params': {
                'product': $scope.product_id,
                'department': $scope.department_id,
                'source_warehouse': $scope.warehouse,
                'page': 1,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                if (data.result) {
                    $scope.jobList = data.result;
                    $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
                }
            }
        }).error(function (data) {
            $rootScope.showToast('查询失败');
        });
    };
    // 引用结束

    //$scope.IsAdminUser = sessionStorage.getItem('IsAdminUser'); // 权限

    // 获取jenkins列表
    $scope.jenkinsList = [];
    $scope.getJenkinsList = function () {
        if ($scope.jenkinsList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/jenkins/server/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.jenkinsList = data.result;
                    }
                }
            }).error(function (data) {
            });
        }
    };
    $scope.getJenkinsList();
    // 获取构建类型列表
    $scope.buildTypeList = [];
    $scope.getBuildTypeList = function () {
        if ($scope.buildTypeList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/build/type/?format=json',
                'params': {
                    'type_hood': 'cmc'
                },
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.buildTypeList = data.result;
                    }
                }
            }).error(function (data) {
            });
        }
    };
    $scope.getBuildTypeList();

    // 获取数据仓库列表
    $scope.dataStorageList = [];
    $scope.queryWarehouselList = [];
    $scope.getDataStorageList = function () {
        if ($scope.dataStorageList.length == 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/gdc/warehouse/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403') {
                    $rootScope.showLogin();
                }else if (data.code === 200 || data.code === '200'){
                    if (data.result) {
                        $scope.dataStorageList = data.result;
                        $scope.queryWarehouselList = data.result;
                    }
                }
            }).error(function (data) {
            });
        }
    };
    $scope.getDataStorageList();
    //根据代码仓库选择对比分支
    $scope.selectedSourceCode = function(){
        for (var i = 0; i < $scope.dataStorageList.length; i++) {
            if ($scope.dataStorageList[i].uuid === $scope.params.source_warehouse.uuid) {
                $scope.branchListA = $scope.dataStorageList[i].branch;
                $scope.branchListB = $scope.dataStorageList[i].branch;
                break;
            }
        }
    }

    // dialog配置
    $scope.dialog = {
        header: '',
        input_isClick: false,
        detail: false,
        add: false,
        edit: false,
        status: ''
    };
    // 初始化参数，清空新增完保存的数据
    $scope.initParam = function () {
        $scope.params = {
            name: '',
            job_name: '',
            jenkins: '',
            source_warehouse: '',
            branch_A: '',
            branch_B: '',
            build_type: '',
            //job_status: false,
            is_active: false
        };
    };

    // 打开新增页面，初始化参数，配置dialog的内容
    $scope.openJobConstruct = function () {
        $scope.initParam();
        $scope.dialog = {
            header: '新增任务',
            input_isClick: false,
            add: true,
            status: 'create'
        };
    };
    //1、获取任务列表
    $scope.jobList = [];
    $scope.getJobConstructList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/job/',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if(resp.code === 403 || resp.code === '403') {
                    $rootScope.showLogin();
            }else if(resp.code === 200 || resp.code === '200'){
                if(resp.result){
                    $scope.jobList = resp.result;
                    $scope.initPageCompomentFun(resp.allPage,".forInit .tcdPageCode");
                }
            } else {
                $rootScope.showToast(resp.message)
            }
        }).error(function (data) {
            $rootScope.showToast('获取Job列表失败');
        });
    };
    // 调用job接口
    $scope.getJobConstructList();
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/job/',
            'params': {
                'product_id': $scope.product_id?$scope.product_id:'',
                'system_id': $scope.system_id?$scope.system_id:'',
                'env_id': $scope.env_id?$scope.env_id:'',
                'page': pageNumber,
                'is_active': 'all'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if(resp.code === 403 || resp.code === '403') {
                    $rootScope.showLogin();
            }else if (resp.code === 200 || resp.code === '200'){
                $scope.jobList = resp.result;
            } else {
                $rootScope.showToast(resp.message)
            }
        }).error(function (data) {
            //console.info('执行结果列表方法-分页error');
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
    // 确认添加
    $scope.addJobConstructConfirm = function () {
        //校验项目名称
        if (!$scope.params.job_name) {
            $rootScope.showToast('请输入任务名称') ;
            return;
        } else{
            var nameReg= /^[^\u4E00-\u9FA5]+$/;
            if (nameReg.test($scope.params.job_name)) {
            }else {
                $rootScope.showToast('任务名称只允许输入数字、英文和字符');
                return;
            }
        }
        var params = {
            name: $scope.params.name,
            job_name: $scope.params.job_name,
            jenkins: $scope.params.jenkins?$scope.params.jenkins.uuid:'',
            source_warehouse: $scope.params.source_warehouse?$scope.params.source_warehouse.uuid:'',
            branch_A: $scope.params.branch_A?$scope.params.branch_A.uuid:'',
            branch_B: $scope.params.branch_B?$scope.params.branch_B.uuid:'',
            build_type: $scope.params.build_type?$scope.params.build_type.uuid:'',
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/cmc/job/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#DisableModel").modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加Job成功');
                $('#myModal').modal('hide');
                $scope.getJobConstructList();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
            // $('#myModal').modal('hide');
        })
    };
    /**
     * 查看Job
     * @param  {[string]} itemId [查看某条代码分支的id]
     * @return {[type]}        [description]
     */
        // 某条详情对应的默认值
    $scope.seeJobConstructVal = {};
    $scope.seeJobConstruct = function (itemId) {
        $scope.dialog = {
            header: '查看',
            input_isClick: true,
            detail: true,
            status: 'see'
        };
        $scope.getJobConstructDetail(itemId);
    };

    // 查看某条详情的方法
    $scope.getJobConstructDetail = function (itemId, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/cmc/job/' + itemId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else{
                $scope.params = data.result;
                callback ? callback(data) : '';
                if ($scope.dialog.status === 'see' || $scope.dialog.status === 'modify') {
                    // 渲染jenkins
                    for (var i = 0; i < $scope.jenkinsList.length; i++) {
                        if ($scope.jenkinsList[i].uuid == data.result.jenkins) {
                            $scope.params.jenkins = $scope.jenkinsList[i];
                            break;
                        }
                    }
                // 渲染代码仓库
                for (var i = 0; i < $scope.dataStorageList.length; i++) {
                    if ($scope.dataStorageList[i].uuid == data.result.source_warehouse) {
                        $scope.params.source_warehouse = $scope.dataStorageList[i];
                        $scope.branchListA = $scope.dataStorageList[i].branch;
                        $scope.branchListB = $scope.dataStorageList[i].branch;
                        break;
                    }
                }
                // 渲染对比分支
                $scope.branchA = data.result.branch_A;
                if ($scope.branchListA) {
                    for (var i = 0; i < $scope.branchListA.length; i++) {
                        if ($scope.branchListA[i].uuid == $scope.branchA) {
                            $scope.params.branch_A = $scope.branchListA[i];
                            break;
                        }
                    }
                }
                // 渲染被对比分支
                $scope.branchB = data.result.branch_B;
                if ($scope.branchListB) {
                    for (var i = 0; i < $scope.branchListB.length; i++) {
                        if ($scope.branchListB[i].uuid == $scope.branchB) {
                            $scope.params.branch_B = $scope.branchListB[i];
                            break;
                        }
                    }
                }
                // 渲染构建类型
                for (var i = 0; i < $scope.buildTypeList.length; i++) {
                    if ($scope.buildTypeList[i].uuid == data.result.build_type) {
                        $scope.params.build_type = $scope.buildTypeList[i];
                        break;
                    }
                }
            }
            }
        }).error(function (data) {
            $rootScope.showToast('查看Job失败');
        })
    };

    // 要修改的id
    $scope.editJobConstructId = '';
    /**
     * [editCase 修改情况下]
     * @param  {[string]} itemId [修改代码分支的id
     * @return {[type]}        [description]
     */
    $scope.editJobConstruct = function (itemId) {
        $scope.dialog = {
            header: '修改',
            input_isClick: false,
            input_readOnly: true,   // mag-270 修改时不让修改系统和环境
            add:true,
            edit:true,
            status: 'modify'
        };
        $scope.getJobConstructDetail(itemId);
        $scope.editJobConstructId = itemId;
    };
    // 确认修改Job
    $scope.editJobConstructConfirm = function () {
        var params = {
            name: $scope.params.name,
            job_name: $scope.params.job_name,
            jenkins: $scope.params.jenkins.uuid,
            source_warehouse: $scope.params.source_warehouse?$scope.params.source_warehouse.uuid:"",
            branch_A: $scope.params.branch_A?$scope.params.branch_A.uuid:"",
            branch_B: $scope.params.branch_B?$scope.params.branch_B.uuid:"",
            build_type: $scope.params.build_type?$scope.params.build_type.uuid:"",
            //job_status: $scope.params.job_status,
            is_active: $scope.params.is_active
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/cmc/job/' + $scope.editJobConstructId +'/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#DisableModel").modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改Job成功');
                // 初始化页面调用代码分支列表
                $scope.getJobConstructList();
                $("#myModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }

        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };
    // 删除某条Job
    $scope.delJobConstructId = '';
    // 获取某条要删除job的id
    $scope.delJobConstruct = function (itemId, index) {
        $scope.delJobConstructId = itemId;
        $scope.delIndex = index;
        $scope.dialog = {
            header: '删除',
            status: 'del'
        };
    };
    // 确认删除job
    $scope.delJobConstructConfirm = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/cmc/job/' + $scope.delJobConstructId + '/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#DisableModel").modal('hide');
            }else if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除job成功');
                // 初始化页面调用代码分支列表
                $scope.getJobConstructList();
                $("#DisableModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
        })
    };

    // 禁用某条代码分支
    $scope.disableJobConstructId = '';
    $scope.disableJobConstruct = function (itemId, index) {
        $scope.disableJobConstruct = itemId;
        $scope.disableIndex = index;
        $scope.dialog = {
            header: '禁用',
            status: 'disable'
        };
    };
    // 确认禁用某条job
    $scope.disableJobConstructConfirm = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/cmc/job/' + $scope.disableJobConstruct + '/',
            'data': {
                'is_active': false
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#DisableModel").modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用job成功');
                $scope.jobList[$scope.disableIndex].is_active = false;
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
    .controller('jobManage', jobManage)    //代码管理==业务管理
