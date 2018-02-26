/**
 * Created by zxh on 2017/4/26.
 */
/**
 * 系统配置==数据库
 */
function backSysConfig_database($scope, $rootScope, $http, interface_url) {
    $scope.checkPwd = function (val) {
        $scope.pwdReg = /^[\w@+]{6,20}$/;
        if ($scope.pwdReg.test(val)) {

        }else {
            $rootScope.showToast('密码必须为6-20位字母和数字混合，请检查');
        }
    };
    $scope.contentList = [];  // 保存列表
    $scope.serverList = [];   // 保存服务器列表
    $scope.selectedServer = {}; // 选中的服务器
    $scope.itemDetail = {};     // 单条数据
    $scope.modifyId = ''; // 正在修改条目的id
    $scope.disableId = '';  // 整在禁用的id
    $scope.delId = '';  // 正在删除条目的id
    // 增加数据库数据保存
    $scope.addItemParams = {
        "name": "",
        "description": "",
        "user": "",
        "password": "",
        "host": "",
        "port": "",
        "is_active": false
    };
    // 修改数据库数据保存
    $scope.modifyParams = {
        "server": null,
        "name": "",
        "description": "",
        "user": "",
        "password": "",
        "host": "",
        "port": "",
        "is_active": false
    };
    // 获取数据库列表
    $scope.getContentList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/database/list/?format=json',
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
                $scope.contentList = data.result;
                $scope.initPageCompomentFun(data.allPage);
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('获取数据库列表失败');
        });
    };
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/database/list/?format=json',
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
        }
            if (data.code === 200 || data.code === '200'){
                $scope.contentList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }).error(function (data) {
            console.info('获取系统列表方法-分页error');
        })
    };
    //创建分页
    $scope.initPageCompomentFun = function (count) {
        $(".ibox-content .tcdPageCode").createPage({
            pageCount : count,
            current: 1,
            backFn: function (page_number) {
                $scope.pageNum=page_number;
                $scope.changePageFun(page_number);
            }
        })
    };
    // 分页结束
    // 获取服务器列表
    $scope.getServerList = function (fn) {
        if ($scope.serverList.length === 0) {
            $http({
                'method': 'GET',
                'url': interface_url + '/interface/server/list/?format=json',
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
                    $scope.serverList = data.result;
                    fn && fn();
                }else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                $rootScope.showToast('获取服务器地址失败');
            });
        } else {
            fn && fn();
        }
    };
    // 确认添加数据库==0410==bug52==数据库必填校验
    $scope.addMethod = function () {
        var pwdReg = /^[\w@+]{6,20}$/;
        /*if (!$scope.addItemParams.server) {
         $rootScope.showToast('请选择服务器') ;
         return;
         }*/
        if (!$scope.addItemParams.name) {
            $rootScope.showToast('请填写数据库名称') ;
            return;
        }
        if (!$scope.addItemParams.description) {
            $rootScope.showToast('请填写数据库描述') ;
            return;
        }
        if (!$scope.addItemParams.user) {
            $rootScope.showToast('请填写用户名') ;
            return;
        }
        if ($scope.addItemParams.password){
            if (!pwdReg.test($scope.addItemParams.password)) {
                $rootScope.showToast('密码必须为6-20位字母和数字混合，请检查');
                return;
            }
        } else {
            $rootScope.showToast('请填写密码');
            return;
        }
        if (!$scope.addItemParams.host) {
            $rootScope.showToast('请填写IP地址') ;
            return;
        }
        if (!$scope.addItemParams.port) {
            $rootScope.showToast('请填写端口') ;
            return;
        }
        $scope.addItemParams.server = $scope.selectedServer.id;
        // console.log($scope.addItemParams);
        $http({
            'method': 'POST',
            'url': interface_url + '/interface/database/add/',
            'data': $scope.addItemParams,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#addModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('添加数据库成功');
                $("#addModal").modal('hide');
                $scope.getContentList(); // 重新渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('添加数据库失败');
        });
    };
    // 复选框 新增状态 是否启用
    $scope.toggle_is_active_add = function () {
        $scope.addItemParams.is_active = !$scope.addItemParams.is_active;
    };
    //  复选框 修改状态 是否启用
    $scope.toggle_is_active_modify = function () {
        $scope.modifyParams.is_active = !$scope.modifyParams.is_active;
    };
    // 查看详情
    /**
     * [seeDes 查看详情]
     * @param  {[string]} id [数据库id]
     * @return {[type]}    [description]
     */
    $scope.seeDes = function (id) {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/database/detail/' + id + '/',
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.itemDetail = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
            // console.log($scope.itemDetail);
        }}).error(function (data) {
            $rootScope.showToast('查看数据库详情失败');
        });
    };
    /**
     * 打开修改，获取数据库的详情
     * @param  {[string]} id [数据库id]
     */
    $scope.modify = function (id) {
        $scope.modifyId = id;
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/database/detail/' + id + '/',
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.modifyParams = data.result;
                $scope.modifyParams.password = '********';
                $scope.getServerList(function () {
                    for (var i = 0; i < $scope.serverList.length; i++) {
                        if ($scope.serverList[i].id === data.result.server_id) {
                            $scope.selectedServer = $scope.serverList[i];
                        }
                    }
                });
            }else {
                $rootScope.showToast(data.message);
            }
            // console.log($scope.itemDetail);
        }}).error(function (data) {
            //console.info('添加系统-error', data)
        });
    };
    // 确认修改
    $scope.modifyMethod = function () {
        /*if (!$scope.addItemParams.server) {
         $rootScope.showToast('请选择服务器') ;
         return;
         }*/
        if (!$scope.modifyParams.name) {
            $rootScope.showToast('请填写数据库名称') ;
            return;
        }
        if (!$scope.modifyParams.description) {
            $rootScope.showToast('请填写数据库描述') ;
            return;
        }
        if (!$scope.modifyParams.user) {
            $rootScope.showToast('请填写用户名') ;
            return;
        }
        if (!$scope.modifyParams.host) {
            $rootScope.showToast('请填写IP地址') ;
            return;
        }
        if (!$scope.modifyParams.port) {
            $rootScope.showToast('请填写端口') ;
            return;
        }
        var pwdReg = /^[\w@+]{6,20}$/;
        if (pwdReg.test($scope.modifyParams.password) || $scope.modifyParams.password === '********') {
            if ($scope.modifyParams.password === '********') {
                $scope.modifyParams.password = '';
            }
            var params = {
                "server": $scope.selectedServer.id,
                "name": $scope.modifyParams.name,
                "description": $scope.modifyParams.description,
                "user": $scope.modifyParams.user,
                "password": $scope.modifyParams.password,
                "host": $scope.modifyParams.host,
                "port": $scope.modifyParams.port,
                "is_active": $scope.modifyParams.is_active
            };
            $http({
                'method': 'PATCH',
                'url': interface_url + '/interface/database/detail/' + $scope.modifyId + '/update/',
                'data': params,
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                    $("#modifyModal").modal('hide');
                    $rootScope.showLogin();
                }else {
                if (data.code === 202 || data.code === '202') {
                    $rootScope.showToast('修改数据库成功');
                    $scope.getContentList(); //  修改后重新渲染列表数据
                    $("#modifyModal").modal('hide');
                } else {
                    $rootScope.showToast(data.message);
                }
            }}).error(function (data) {
                $rootScope.showToast('修改数据库失败');
            })
        } else{
            $rootScope.showToast('密码必须为6-20位字母和数字混合，请检查');
        }
    };

    /**
     * 点击删除按钮打开删除
     * @param {[string]} id    [description]
     * @param {[number]} index [description]
     */
    $scope.Disable = function (id, index) {
        $scope.disableId = id;
        $scope.index = index;
        // console.log(index)
    };
    // 确认禁用
    $scope.DisableMethod = function () {
        var params = {
            is_active: false
        };
        $http({
            'method': 'PATCH',
            'url': interface_url + '/interface/database/detail/' + $scope.disableId + '/update/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#modifyModal").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('禁用成功');
                $scope.contentList[$scope.index].is_active = false;
                //$scope.getContentList(); //  修改后重新渲染列表数据
                $("#modifyModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('禁用失败');
        })
    };
    // 打开删除
    $scope.del = function (id, index) {
        $scope.delId = id;
        $scope.index = index;
    };
    //
    /**
     * 确认删除
     * @return {[type]} [description]
     */
    $scope.delMethod = function () {
        // console.log('sdfsdfsdf')
        $http({
            'method': 'DELETE',
            'url': interface_url + '/interface/database/detail/' + $scope.delId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                // $scope.contentList.splice($scope.index, 1);
                $scope.getContentList(); // 重新渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        });

    };
    // 确认删除
    // 进入页面  获取列表信息;
    $scope.getContentList();
    $scope.getServerList(); // 渲染页面列表
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backSysConfig_database', backSysConfig_database); // 系统配置==数据库