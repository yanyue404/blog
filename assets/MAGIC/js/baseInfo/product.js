/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 基本信息==产品
 */
function backProductList($scope, $rootScope, $http, interface_url) {
    $scope.ckeckProName = function (val) {
        // $scope.reg= /^[^\u4E00-\u9FA5]+$/;
        // if ($scope.reg.test(val)) {

        // }else {
        //     $rootScope.showToast('产品名称不能为空');
        // }
    };
    // 产品列表初始状态
    $scope.productList = [];
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all'

            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.productList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast(data.message);
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
    // 获取产品列表的方法
    $scope.getProductList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/list/?format=json',
            'params': {
                'is_active': 'all',
                'page':'1'
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.productList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('获取产品列表失败');
        });
    };
    $scope.getProductList(); // 渲染页面列表
    // 增加产品的具体值
    $scope.addProduct = {
        name: '',
        // description: '',
        is_active: false,
        department_name: ''
    };
    // 是否开启产品
    $scope.addProductisActive = function () {
        $scope.addProduct.is_active = !$scope.addProduct.is_active;
    };
    // 保存部门列表
    $scope.departmentNameList = [];
    // 获取部门列表
    $scope.getDepartmentListMethod = function (obj) {
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
                $scope[obj] = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            }
        )
    };
    // 获取产品
    $scope.getDepartmentListMethod('departmentNameList');
    // 产品默认值==zxh==0306
    $scope.resetProVal = function (obj) {
        obj.name = ''; // 系统名
        obj.department_name = ''; // 系统描述
        // obj.description = ''; // 系统描述
        obj.is_active = false; // 是否启用
        $scope.validateText = '';
    };
    // 确认新增产品
    $scope.addDepartmentMethod = function () {
        if (!$scope.addProduct.department_name) {
            $rootScope.showToast('请选择部门');
            return;
        }
        // if (!$scope.addProduct.name) {
        //     $rootScope.showToast('请填写产品名称');
        //     return;
        // }
        if (!$scope.addProduct.name) {
            $rootScope.showToast('请填写产品名称');
            return;
        }
        $http({
            'method': 'POST',
            'url': interface_url + "/interface/product/add/",
            'data': {
                department: $scope.addProduct.department_name.uuid,
                name: $scope.addProduct.name,
                // description: $scope.addProduct.description,
                is_active: $scope.addProduct.is_active
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#myModal").modal('hide');
            }else if (data.code === 201 || data.code === '201'){
                $scope.productList.push(data.result);
                $scope.getProductList(); // 重新渲染页面列表
                $("#myModal").modal('hide');
                $rootScope.showToast('新增产品成功');
                $scope.resetProVal($scope.addProduct);
                $scope.validateText = '';
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $("#myModal").modal('hide');
            $rootScope.showToast('新增产品失败');
            $scope.validateText = '';
        })
    };
    // 查看详情
    $scope.seeProduct = {};
    // 查看详情的方法
    $scope.seeProductDes = function (itemId) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.seeProduct = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看产品详情失败');
        })
    };
    // 修改产品
    $scope.editProduct = {}; // 修改产品时的默认值
    $scope.editProductId = ''; // 要修改产品的id
    $scope.editDepartmentNameList = []; // 获取部门
    $scope.getDepartmentListMethod('editDepartmentNameList'); // 获取产品
    $scope.editProductDes = function (itemId) {
        $scope.editProductId = itemId;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/product/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 200 || data.code === '200'){
                $scope.editProduct = data.result;
                // 0313===渲染部门==修改时不能回显
                for (var i = 0; i < $scope.editDepartmentNameList.length; i++) {
                    if ($scope.editDepartmentNameList[i].uuid == data.result.department_uuid) {
                        $scope.editProduct.department_name = $scope.editDepartmentNameList[i];
                        break;
                    }
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('查看产品详情失败');
        })
    };
    // 确认修改产品
    $scope.editProductMethod = function () {
        if (!$scope.editProduct.department_name) {
            $rootScope.showToast('请选择部门') ;
            return;
        }
        if (!$scope.editProduct.name) {
            $rootScope.showToast('请填写产品名称') ;
            return;
        }
        
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/product/detail/' + $scope.editProductId + '/update/',
            'data': {
                name: $scope.editProduct.name,
                // description: $scope.editProduct.description,
                is_active: $scope.editProduct.is_active,
                department: $scope.editProduct.department_name
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
                $("#editProduct").modal('hide');
            }else if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改产品成功');
                $scope.getProductList(); // 渲染页面列表
                $("#editProduct").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('修改产品失败');
        });
    };
    $scope.editIsActive = function () {
        $scope.editProduct.is_active = !$scope.editProduct.is_active;
    };
    // 要禁用产品的id
    $scope.disabaleDetailId = '';
    // 产品禁用
    $scope.disableProduct = function (itemId) {
        $scope.disabaleDetailId = itemId;
    };
    // 确定禁用
    $scope.DisableProductMethod = function () {
        // alert('确定禁用')
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/product/detail/' + $scope.disabaleDetailId + '/update/',
            'data': {
                is_active: 0
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 202 || data.code === '202'){
                $scope.getProductList(); // 渲染页面列表
                $rootScope.showToast('禁用成功');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('禁用失败');
        })
    };
    // 删除产品
    $scope.delProductId = '';
    $scope.delProduct = function (itemId) {
        $scope.delProductId = itemId;
    };
    // 确认删除
    $scope.sureDelProduct = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/product/detail/' + $scope.delProductId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403') {
                $rootScope.showLogin();
            }else if (data.code === 204 || data.code === '204'){
                $scope.getProductList(); // 渲染页面列表
                $rootScope.showToast('删除产品成功');
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            $rootScope.showToast('删除产品失败');
        });
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backProductList', backProductList) // 后台产品列表