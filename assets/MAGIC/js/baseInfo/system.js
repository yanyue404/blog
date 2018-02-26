/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 基本信息=='系统'
 */
function backSystem($scope, $rootScope, $http, interface_url) {
    $scope.systemListArr = []; // 存放系统类别数据
    $scope.producNameList = []; // 所有产品的列表
    $scope.warehouseList = []; // 数据仓库的列表
    // 请求产品的接口
    $http({
        'method': 'GET',
        'url': interface_url + '/interface/product/list/?format=json',
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('auth_token')
        }
    }).success(function (data) {
        if (data.code === 403 || data.code === '403') {
            $rootScope.showLogin();
        } else if (data.code === 200 || data.code === '200') {
            $scope.producNameList = data.result;
        } else {
            $rootScope.showToast(data.message);
        }
    }).error(function (data) {});
    //20170829==根据产品查询数据仓库
    $scope.getWarehouse = function (productid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/gdc/warehouse/search/?product=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else {
                if (data.code === 200 || data.code === '200') {
                    $scope.warehouseList = data.result;
                    $scope.searchResultFlag = true; //新加数据仓库多选
                    // console.log($scope.warehouseList) //数据仓库列表
                    callback && callback();
                } else {
                    $rootScope.showToast(data.message);
                }
            }
        }).error(function (data) {})
    };
    // 先选择产品，再根据产品选择数据仓库
    $scope.selectedProduct = function () {
        if (!$scope.system.selectedProduct) return;
        // 
        // console.log($scope.system.selectedProduct)
        $scope.getWarehouse($scope.system.selectedProduct.uuid);
    };
    // 系统列表接口
    $scope.getSystemListMethod = function () {
        $scope.pageNum = 1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/list/?format=json',
            'params': {
                'is_active': 'all',
                'page': 1
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.systemListArr = data.result;
                console.log($scope.systemListArr)
                $scope.initPageCompomentFun(data.allPage, ".forInit .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('获取系统列表失败');
        });
    };
    $scope.getSystemListMethod(); //  获取系统列表
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/list/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'department_id': $scope.department_case ? $scope.department_case : '',
                'product_id': $scope.system_case ? $scope.system_case : ''
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.systemListArr = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            console.info('获取系统列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count, select) {
        $(select).createPage({
            pageCount: count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum = page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束

    // 获取部门列表==0412
    $scope.queryProductList = [];
    $scope.getDepartmentMethod = function (obj) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/list/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.queryDepartmentList = data.result;
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {});
    };
    // 获取部门列表
    $scope.getDepartmentMethod();
    $scope.queryFlag = 1;
    $scope.queryDepartment = function (callback) {
        if (!$scope.querySystemParam.department) return;
        // 获取当前产品下的 系统
        $scope.queryFlag = 1;
        var departmentid = $scope.querySystemParam.department.uuid;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?department=' + departmentid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.queryProductList = data.result;
                callback && callback();
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {})
    };
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum = 1;
        $scope.forInitPage = false;
        $scope.department_case = $scope.querySystemParam.department ? $scope.querySystemParam.department.uuid : '',
            $scope.system_case = $scope.querySystemParam.product ? $scope.querySystemParam.product.uuid : '';
        var sendData = {
            'department': $scope.department_case,
            'product': $scope.system_case,
            'is_active': 'all',
            'page': 1
        }
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/list/?format=json',
            'params': sendData,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.systemListArr = data.result;
                $scope.initPageCompomentFun(data.allPage, ".forSearch .tcdPageCode");
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
    // 新增系统时候的默认值
    $scope.system = {
        // is_tmc: false,
        // is_gdc: false,
        sysName: '', //系统名
        // sysDes: '', // 系统描述
        // type: '',
        // sysSort: '', // 排序
        selectedProduct: '', // 已经选中的产品
        isActive: false // 是否启用
    };

    // 重置系统选项的值
    $scope.resetVal = function (obj) {
        // obj.is_tmc = false;
        // obj.is_gdc = false;
        obj.sysName = ''; // 系统名
        // obj.sysDes = ''; // 系统描述
        // obj.sysSort = ''; // 系统排序
        obj.selectedProduct = ''; // 已经选中的产品
        obj.isActive = false; // 是否启用
    };
    // 要修改系统的id
    $scope.systemId = '';
    //  修改系统是放的初始值
    $scope.system = {};
    // 是否开启系统
    $scope.sysIsActive = function () {
        $scope.system.isActive = !$scope.system.isActive;
    };
    // 是否展示看板
    $scope.sysIsBoardDisplay = function () {
        $scope.system.is_board_display = !$scope.system.is_board_display;
    };
    // type是否tmc
    // $scope.typeIsTmc = function () {
    //     $scope.system.is_tmc = !$scope.system.is_tmc;
    // };
    // type是否gdc
    // $scope.typeIsGdc = function () {
    //     $scope.system.is_gdc = !$scope.system.is_gdc;
    // };
    // 将type以字符串形式传入
    // $scope.getType = function () {
    //     if ($scope.system.is_tmc && $scope.system.is_gdc) {
    //         return "tmc,gdc"
    //     } else if ($scope.system.is_tmc) {
    //         return "tmc"
    //     } else if ($scope.system.is_gdc){
    //         return "gdc"
    //     } else {
    //         return "";
    //     }
    // };
    // 将type转化为回原来的形式
    // $scope.getTypeBack = function (val) {
    //     if (val == 'gdc,tmc' || val == 'tmc,gdc') {
    //         $scope.sys.is_tmc = true;
    //         $scope.sys.is_gdc = true;
    //     } else if (val == 'tmc') {
    //         $scope.sys.is_tmc = true;
    //     } else if (val == 'gdc'){
    //         $scope.sys.is_gdc = true;
    //     } else {
    //         $scope.sys.is_tmc = false;
    //         $scope.sys.is_gdc = false;
    //     }
    // };
    // $scope.getTypeBackEdit = function (val) {
    //     if (val == 'gdc,tmc' || val == 'tmc,gdc') {
    //         $scope.editSytem.is_tmc = true;
    //         $scope.editSytem.is_gdc = true;
    //     } else if (val == 'tmc') {
    //         $scope.editSytem.is_tmc = true;
    //     } else if (val == 'gdc'){
    //         $scope.editSytem.is_gdc = true;
    //     } else {
    //         $scope.editSytem.is_tmc = false;
    //         $scope.editSytem.is_gdc = false;
    //     }
    // };


    // 添加系统
    $scope.systemAadd = function () {

        if (!$scope.system.selectedProduct) {
            //$scope.validateText = '请选择部门';
            $rootScope.showToast('请选择产品');
            return;
        }
        if (!$scope.system.sysName) {
            //$scope.validateText = '请填写产品名称';
            $rootScope.showToast('请填写系统名称');
            return;
        }
        $http({
            method: 'POST',
            url: interface_url + '/interface/system/add/',
            data: {
                'product': $scope.system.selectedProduct.uuid,
                // 'type': $scope.getType(),
                //'name': $scope.system.sysName,
                'name': $scope.system.sysName,
                'warehouse': $scope.selectSearchResult,
                // 'warehouse': $scope.system.selectedWarehouse.id,
                'is_active': $scope.system.isActive,
                'seq': $scope.system.sysSort,
                'is_board_display': $scope.system.isBoardDisplay
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#myModal").modal('hide');
            } else if (data.code === 201 || data.code === '201') {
                $rootScope.showToast("新增系统成功");
                // $scope.systemListArr.push(data);
                $scope.getSystemListMethod(); //  获取系统列表
                // 添加系统成功，清空新增框里的内容
                $("#myModal").modal('hide');
                $scope.resetVal($scope.system); // 0306=zxh
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('新增系统失败');
            //$("#myModal").modal('hide');
        })
    };
    // 查看系统详情
    $scope.seeSytemDes = function (itemId) {

        // 第一次进来时候的值
        $scope.sys = {
            id: '',
            // is_tmc: '',
            // is_gdc: '',
            name: '',
            // description: '',
            is_active: '',
            seq: '',
            is_board_display: '',
            created: '',
            modified: '',
            product_name: ''
        };
        // 查看系统详情
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {

            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.sys = data.result;

                // $scope.getTypeBack($scope.sys.type);
                // 0401===渲染产品==修改时不能回显
                //console.log($scope.producNameList)

                for (var i = 0; i < $scope.producNameList.length; i++) {
                    // 没有id

                    if ($scope.producNameList[i].id == data.result.product_id) {
                        $scope.editSytem.product_name = $scope.producNameList[i];

                        break;
                    }
                }
                //20170829渲染数据仓库
                var productId = data.result.product_id;
                // 没有ID
                var warehouseId = data.result.warehouse_id;
                // alert("productId"+productId)
                // alert("warehouseId"+warehouseId)
                $http({
                    'method': 'GET',
                    'url': interface_url + '/gdc/warehouse/?product_id=' + productId,
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    if (data.code === 403 || data.code === '403') {
                        $rootScope.showLogin();
                    } else {
                        if (data.code === 200 || data.code === '200') {
                            $scope.warehouseList = data.result;
                            for (var i = 0; i < $scope.warehouseList.length; i++) {
                                alert($scope.warehouseList[i].id)
                                if ($scope.warehouseList[i].id == warehouseId) {

                                    $scope.sys.warehouse = $scope.warehouseList[i].name;


                                    break;
                                }
                            }
                        } else {
                            $rootScope.showToast(data.message);
                        }
                    }
                }).error(function (data) {})
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };
    // 要修改系统的id
    $scope.systemId = '';
    //  修改系统是放的初始值
    $scope.editSytem = {
        // type: '',
        name: '', //系统名
        // description: '', // 系统描述
        // seq: '', // 排序
        product: '',
        is_board_display: '',
        selectedProduct: '', // 已经选中的产品
        // is_tmc: false,
        // is_gdc: false,
        isActive: false // 是否启用
    };
    // $scope.getTypeEdit = function () {
    //     if ($scope.editSytem.is_tmc && $scope.editSytem.is_gdc) {
    //         return "tmc,gdc"
    //     } else if ($scope.editSytem.is_tmc) {
    //         return "tmc"
    //     } else if ($scope.editSytem.is_gdc){
    //         return "gdc"
    //     } else {
    //         return "";
    //     }
    // };
    // 是否启用
    $scope.EditSysIsActiveMethod = function () {
        $scope.editSytem.is_active = !$scope.editSytem.is_active;
    };
    // 是否tmc
    // $scope.editTypeIsTmc = function () {
    //     $scope.editSytem.is_tmc = !$scope.editSytem.is_tmc;
    // };
    // 是否gdc
    // $scope.editTypeIsGdc = function () {
    //     $scope.editSytem.is_gdc = !$scope.editSytem.is_gdc;
    // };
    // 修改系统
    $scope.editSystem = function (itemId) {
        $scope.systemId = itemId;
        // 查看系统详情
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 200 || data.code === '200') {
                $scope.editSytem = data.result;
                // $scope.getTypeBackEdit($scope.editSytem.type);
                // 0401===渲染产品==修改时不能回显
                //console.log($scope.producNameList)
                for (var i = 0; i < $scope.producNameList.length; i++) {
                    if ($scope.producNameList[i].uuid == data.result.product_id) {
                        $scope.editSytem.product_name = $scope.producNameList[i];
                        break;
                    }
                }
                //20170829渲染数据仓库
                var productId = data.result.product_id;
                var warehouseId = data.result.warehouse_id;
                console.log(data.result)
                $http({
                    'method': 'GET',
                    'url': interface_url + '/gdc/warehouse/?product_id=' + productId,
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    if (data.code === 403 || data.code === '403') {
                        $rootScope.showLogin();
                    } else {
                        if (data.code === 200 || data.code === '200') {
                            $scope.warehouseList = data.result;
                            // console.log($scope.warehouseList)
                            // console.log($scope.warehouseList)
                            for (var i = 0; i < $scope.warehouseList.length; i++) {
                                if ($scope.warehouseList[i].uuid == data.result.warehouseId) {
                                    $scope.editSytem.warehouse = $scope.warehouseList[i];
                                    break;
                                }
                            }
                        } else {
                            $rootScope.showToast(data.message);
                        }
                    }
                }).error(function (data) {})
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看系统详情失败');
        });
    };
    // 确认修改0329
    $scope.editSytemMethod = function () {
        if (!$scope.editSytem.product_name) {
            //$scope.validateText = '请选择部门';
            $rootScope.showToast('请选择产品');
            return;
        }
        if (!$scope.editSytem.name) {
            //$scope.validateText = '请填写产品名称';
            $rootScope.showToast('请填写系统名称');
            return;
        }
        /*if (!$scope.editSytem.description) {
            //$scope.validateText = '请填写产品描述';
            $rootScope.showToast('请填写系统描述') ;
            return;
        }*/
        //bug65==zxh
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/system/detail/' + $scope.systemId + '/update/',
            'data': {
                'selectedProduct': $scope.editSytem.product_name.uuid,
                'product': $scope.editSytem.product_name.uuid,
                // 'type': $scope.getTypeEdit(),
                'name': $scope.editSytem.name,
                // 'description': $scope.editSytem.name,
                'warehouse': $scope.editSytem.warehouseList,
                'is_active': $scope.editSytem.is_active,
                'seq': $scope.editSytem.seq
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#editSytem").modal('hide');
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('修改系统成功');
                $scope.getSystemListMethod(); //  获取系统列表
                $("#editSytem").modal('hide');
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改系统失败');
        })
    };
    // 要删除系统的id
    $scope.delSystemId = '';
    // 删除系统
    $scope.delSyetem = function (itemId) {
        $scope.delSystemId = itemId;
    };

    // 确认删除
    $scope.sureDelSye = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/system/detail/' + $scope.delSystemId + '/del/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 204 || data.code === '204') {
                $rootScope.showToast('删除成功');
                $scope.getSystemListMethod(); //  获取系统列表
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };

    // 要禁用系统的id
    $scope.delSystemId = '';
    // 产品禁用
    $scope.disableSystem = function (itemId) {
        $scope.delSystemId = itemId;
    };
    $scope.deleteSelectItem = function (index) {
        $scope.selectSearchResult.splice(index, 1)
        // console.log(123456)
    }
    // 数据仓库多选逻辑
    /**
     * 点击检索到的列表item，将该item放入   $scope.selectSearchResult
     * @return {[type]}       [description]
     * @param index
     */
    $scope.selectSearchResult = [];
    $scope.selectSearchItem = function (index) {
        // $scope.warehouseList_S = $scope.warehouseList
        if ($scope.selectSearchResult.length === $scope.warehouseList.length) {
            alert("不可重复添加")
            return false;
        }
        $scope.selectSearchResult.push($scope.warehouseList[index]);
    };
    // 数据仓库多选逻辑结束
    // 确定禁用
    $scope.DisableSystemMethod = function () {
        // alert('确定禁用')
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/system/detail/' + $scope.delSystemId + '/update/',
            'data': {
                is_active: 0
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if (data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            } else if (data.code === 202 || data.code === '202') {
                $rootScope.showToast('禁用成功');
                $scope.getSystemListMethod(); // 渲染页面列表
            } else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('禁用失败');
        })
    };
};
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSystem', backSystem) // 后台系统列表