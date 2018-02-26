/**
 * Created by Administrator on 2017/4/26.
 */
/**
 * 用例管理----->用例模块
 * @param {any} $scope
 * @param {any} $rootScope
 * @param {any} $http
 * @param {any} interface_url
 */
function backModel($scope, $rootScope, $http, interface_url) {
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
    // 在新增的时候判断是否选中
    $scope.modelIsActive = function () {
        $scope.model.is_active = !$scope.model.is_active;
        //alert($scope.model.is_active);
    };
    // 在新增模块时候默认的值
    $scope.model = {
        'name': '',
        'description': '',
        'system': '',
        'selectedProduct': '',
        'validateText':'',
        'is_active': false
    };

    //  请求用例模块列表接口,放列表接口的数据
    $scope.modelList = [];
    // 获取系统名,在增加模块列表的时候要选某个系统
    $scope.systemNameList = [];
    // 获取产品==0310==zxh
    $scope.productNameList = [];
    $scope.getProductList = function () {
        if ($scope.productNameList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/product/list/?format=json',
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $rootScope.showLogin();
                }else {
                if (data.code === 200 || data.code === '200'){
                    $scope.productNameList = data.result;
                    $scope.queryProductList = data.result;
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
            });
        }
    };
    $scope.getProductList();
    /**
     * 获取某个产品下的系统==0310==zxh
     * @param productid
     * @param  {Function} callback [获取到用例模块后，执行的回调，一般用在查看与新盖的情况下]
     * @return {[type]}            [description]
     */
    $scope.getCaseSystem = function (productid, callback) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/system/list/?product_id=' + productid,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.systemNameList = data.result;
                if ($scope.queryFlag === 1 || $scope.queryFlag === '1'){
                    $scope.querySystemList = data.result;
                }
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
    // 先选择产品，在选择系统，根据产品选择系统
    $scope.selectedProduct = function () {
        $scope.queryFlag = '';
        if (!$scope.model.selectedProduct && !$scope.editMode.selectedProduct)return;
        // 获取当前产品下的 系统
        if ($scope.model.selectedProduct){
            $scope.getCaseSystem($scope.model.selectedProduct.uuid);
        }
        if ($scope.editMode.selectedProduct) {
            $scope.getCaseSystem($scope.editMode.selectedProduct.uuid);
        }
    };
    $scope.queryFlag = '';
    $scope.queryProduct = function () {
        if (!$scope.queryModelParam.product)return;
        // 获取当前产品下的 系统
        $scope.queryFlag = 1;
        $scope.getCaseSystem($scope.queryModelParam.product.uuid);
    };
    // 请求用例模块列表接口
    $scope.getModelList = function () {
        $scope.pageNum=1;
        $scope.forInitPage = true;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/casemodel/list/?format=json',
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
                $scope.modelList = data.result;
                $scope.initPageCompomentFun(data.allPage,".forInit .tcdPageCode");
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        });
    };
    $scope.getModelList(); // 进入页面后渲染列表
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/casemodel/list/?format=json',
            'params': {
                'page': pageNumber,
                'is_active': 'all',
                'product_id': $scope.param_product?$scope.param_product:'',
                'system_id': $scope.param_system?$scope.param_system:'',
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.modelList = data.result;
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
    //查询用例详情==0331==zxh
    $scope.initQueryParam = function () {
        $scope.queryModelParam = {
            product:'',
            system:''
        };
    }
    $scope.initQueryParam();
    // 点击查询
    $scope.queryCase = function () {
        $scope.pageNum=1;
        $scope.forInitPage = false;
        $scope.param_product = $scope.queryModelParam.product?$scope.queryModelParam.product.uuid:'';
        $scope.param_system = $scope.queryModelParam.system?$scope.queryModelParam.system.uuid:'';
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/casemodel/list/?format=json',
            'params': {
                'product_id': $scope.param_product,
                'system_id': $scope.param_system,
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
                $scope.modelList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
            $scope.initPageCompomentFun(data.allPage,".forSearch .tcdPageCode");
        }}).error(function (data) {
            $rootScope.showToast('查询失败');
        })
    };
    // 添加模块接口
    $scope.modelAdd = function () {
        // 添加用户请求接口的参数
        // var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if (!$scope.model.selectedProduct) {
            //$scope.validateText = '请选择产品名称';
            $rootScope.showToast('请选择产品名称');
            return;
        }
        if (!$scope.model.system) {
            //$scope.validateText = '请选择系统名称';
            $rootScope.showToast('请选择系统名称');
            return;
        }
        if (!$scope.model.name) {
            //$scope.validateText = '请填写模块名称';
            $rootScope.showToast('请填写模块名称');
            return;
        }
        if (!$scope.model.description) {
            //$scope.validateText = '请填写模块描述';
            $rootScope.showToast('请填写模块描述');
            return;
        }
        /*if (!usernameReg.test($scope.reg_username) || !$scope.reg_username) {
         $scope.validateText = '请输入正确的用户名（不多于30个字符，只能用字母、数字和字符 @.+-_ ）';
         return;
         }*/
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/casemodel/add/',
            'data': {
                'name': $scope.model.name,
                'system': $scope.model.system.id,
                'is_active': $scope.model.is_active
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#myModel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加模块接口成功');
                $scope.modelList.push(data.result);
                $scope.reset($scope.model, ['name', 'description', 'system', 'selectedProduct', 'is_active']);
                $("#myModal").modal('hide'); //  隐藏弹窗
                $scope.getModelList(); // 从新渲染列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('添加模块接口失败');
            $("#myModal").modal('hide'); //  隐藏弹窗
        })
    };

    // 查看模块详情
    $scope.detail = {
        system_name: '',
        product_name: '',
        name: '',
        description: '',
        edit_validateText:'',
        is_active: false
    };
    //
    /**
     * 查询某条数据 模型信息
     * @param id
     * @param  {[string]} objBox [保存请求到的数据保存到objBox下]
     */
    $scope.queryModelInfo = function (id, objBox) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/casemodel/detail/' + id + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope[objBox] = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('查看模块详情失败');
        })
    };

    // 查看模块
    /**
     * 查看的情况下,查询某条数据
     * @param  {[string]} itemId [某条环境的id]
     */
    $scope.seeModelDes = function (itemId) {
        $scope.queryModelInfo(itemId, 'detail');
    };

    // 编辑模块默认值
    $scope.editMode = {};
    // 编辑某个环境的id
    $scope.editDetailModelId = '';
    $scope.EditDetailModel = {};
    // 修改模块
    $scope.editModel = function (itemId) {
        $scope.editDetailModelId = itemId;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/casemodel/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (resp) {
            if(resp.code === 403 || resp.code === '403'){
                $rootScope.showLogin();
            }else {
            var data = resp.result;
            $scope.editMode = data;
            // 渲染产品==0309==zxh==修改时不能回显(productNameList里边没有)
            for (var i = 0; i < $scope.productNameList.length; i++) {
                if ($scope.productNameList[i].id == data.product_id) {
                    //// console.log($scope.productNameList[i]);
                    $scope.editMode.selectedProduct = $scope.productNameList[i];
                    break;
                }
            }
            var systemId = data.system_id;
            $scope.getCaseSystem = function (productid, callback) {
                $http({
                    'method': 'GET',
                    'url': interface_url + '/interface/system/list/?product_id=' + productid,
                    'headers': {
                        'Authorization': 'Token ' + localStorage.getItem('auth_token')
                    }
                }).success(function (data) {
                    if(data.code === 403 || data.code === '403'){
                        $rootScope.showLogin();
                    }else {
                    if (data.code === 200 || data.code === '200'){
                        $scope.systemNameList = data.result;
                        callback && callback();
                        // 渲染系统==0310==zxh==修改时不能回显
                        for (var i = 0; i < $scope.systemNameList.length; i++) {
                            if ($scope.systemNameList[i].id == systemId) {
                                $scope.editMode.system = $scope.systemNameList[i];
                                break;
                            }
                        }
                    }else {
                        $rootScope.showToast(data.message);
                    }
                }}).error(function (data) {
                })
            };
            $scope.getCaseSystem(data.product_id);
        }}).error(function (data) {

        });
    };

    //更改模块
    $scope.editModelMethod = function () {
        if (!$scope.editMode.selectedProduct) {
            //$scope.edit_validateText = '请选择产品名称';
            $rootScope.showToast('请选择产品名称');
            return;
        }
        if (!$scope.editMode.system) {
            //$scope.edit_validateText = '请选择系统名称';
            $rootScope.showToast('请选择系统名称');
            return;
        }
        if (!$scope.editMode.name) {
            //$scope.edit_validateText = '请填写模块名称';
            $rootScope.showToast('请填写模块名称');
            return;
        }
        if (!$scope.editMode.description) {
            //$scope.edit_validateText = '请填写模块描述';
            $rootScope.showToast('请填写模块描述');
            return;
        }
        function isObject(obj) {
            if (typeof obj === 'string') {
                return JSON.parse(obj);
            } else if (obj instanceof Object) {
                return obj;
            }
        }
        $http({
            'method': 'PUT',
            'url': interface_url + '/interface/casemodel/detail/' + $scope.editDetailModelId + '/update/',
            'data': {
                'name': $scope.editMode.name,
                'description': $scope.editMode.description,
                'is_active': $scope.editMode.is_active,
                'system': $scope.editMode.system.id
                //'product': $scope.editMode.selectedProduct.id
            },
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#editModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改模块成功');
                $scope.getModelList(); // 更改了列表数据,重新加载列表
                $("#editModel").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改模块失败');
            $("#editModel").modal('hide');
        })
    };
    // 要修改系统的id
    $scope.systemId = '';
    //  修改系统是放的初始值
    $scope.editMode = {
        'name': '',
        'description': '',
        'system': '',
        //'selectedProduct': '',
        'is_active': false
    };
    // 是否开启系统
    $scope.sysIsActive = function () {
        $scope.editMode.is_active = !$scope.editMode.is_active;
    };
    // 删除指定id模块
    $scope.delItemId = '';
    // 删除模块
    $scope.delModel = function (itemId) {
        $scope.delItemId = itemId;
    };
    //确定删除
    $scope.sureDelModel = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/casemodel/detail/' + $scope.delItemId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#delDodel").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $("#delDodel").modal('hide');
                $scope.getModelList(); // 进入页面后渲染列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        })
    };
    // 需要禁用模块的id
    $scope.disableModelID = '';
    // 禁用模块
    $scope.disableModel = function (itemid) {
        $scope.disableModelID = itemid;
    };

    // 确定禁用
    $scope.disableModelItem = function () {
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/casemodel/detail/' + $scope.disableModelID + '/update/',
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
                $scope.getModelList(); // 重新渲染列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用失败');
        })
    }
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backModel', backModel); // 用例管理== 模块
