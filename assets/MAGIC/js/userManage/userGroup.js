/**
 * Created by Administrator on 2017/4/27.
 */
/**
 * [backUser_usergroup description] 用户组管理登录
 * @param $rootScope
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $http         [description]
 * @param  {[type]} $state        [description]
 * @param  {[type]} $stateParams  [description]
 * @param  {[type]} interface_url [description]
 * @return {[type]}               [description]
 */
function backUser_usergroup($rootScope, $scope, $http, $state, $stateParams, interface_url) {
    $scope.contentList = [];  // 保存列表
    $scope.addItemParams = {  // 新增参数
        "name": ""
    };
    $scope.modifyParams = {   // 修改参数
        "name": ""
    };
    $scope.index = '';  // 正在操作的item
    $scope.addGroupUserId = ''; // 保存添加用户的用户组的id;
    $scope.allUserList = [];  // 保存所有用户
    $scope.selectedUser_add = {};
    // 获取用户组列表
    $scope.getContentList = function () {
        $scope.pageNum=1;
        $http({
            'method': 'GET',
            'url': interface_url + '/auth/group/list/',
            'params': {
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
        }}).error(function () {
            $rootScope.showToast('获取列表失败');
        });
    };
    // 分页开始
    //点击分页执行的函数
    $scope.changePageFun = function (pageNumber) {
        $http({
            'method': 'GET',
            'url': interface_url + '/auth/group/list/',
            'params': {
                'page': pageNumber
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
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            console.info('执行结果列表方法-分页error');
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
    // 确认增加用户组
    $scope.addMethod = function () {
        // console.log($scope.addItemParams);
        $http({
            'method': 'POST',
            'url': interface_url + '/auth/group/add/',
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
                $rootScope.showToast('新增成功');
                $("#addModal").modal('hide');
                $scope.getContentList(); // 重新渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('新增失败');
        });
    };

    // 查看
    $scope.seeDes = function (id, index) {
        $scope.modifyId = id;
        $scope.index = index;
        $scope.modifyParams = {   // 修改参数
            "name": $scope.contentList[index].name
        };
    };
    // 修改
    /**
     * 点击修改按钮
     * @param  {[String]} id    [用户组id]
     * @param  {[number]} index [当前index]
     *
     */
    $scope.modify = function (id, index) {
        $scope.modifyId = id;
        $scope.index = index;
        $scope.modifyParams = {   // 修改参数
            "name": $scope.contentList[index].name
        };
    };
    // 确认根据id修改
    $scope.modifyMethod = function () {
        var params = {
            "name": $scope.modifyParams.name
        };
        $http({
            'method': 'PATCH',
            'url': interface_url + '/auth/group/' + $scope.modifyId + '/update/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast(data.message);
                // 删除用户组列表当前
                $scope.contentList[$scope.index].name = params.name;
                //$scope.getContentList(); //  修改后重新渲染列表数据
                $("#modifyModal").modal('hide');
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改失败');
        })
    };
    // 打开删除
    /**
     * 点击删除按钮，保存id与索引
     * @param  {[String]} id    [用户组id]
     * @param  {[number]} index [用户组索引]
     * @return {[type]}       [description]
     */
    $scope.del = function (id, index) {
        $scope.delId = id;
        $scope.index = index;
    };
    /**
     * 确认删除用户组
     * @return {[type]} [description]
     */
    $scope.delMethod = function () {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/auth/group/' + $scope.delId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            $rootScope.showToast('删除成功');
            $scope.contentList.splice($scope.index, 1);
            //$scope.getContentList(); // 重新渲染页面列表
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        });
    };
    /**
     * 增加用户到用户组
     * @param {[type]} id    [用户组id]
     * @param {[type]} index [用户组索引]
     */
    $scope.addUser = function (id, index) {
        // console.log(id);
        // console.log(index);
        $scope.addGroupUserId = id;
        $scope.index = index;
        $scope.getAllUser();
    };
    /**
     * 获取所有的用户
     * 保存在 allUserList 中
     */
    $scope.getAllUser = function () {
        if ($scope.allUserList.length === 0) {
            $http({
                'method': 'get',
                'url': interface_url + '/auth/user/list/ ',
                'data': {},
                'headers': {
                    'Authorization': 'Token ' + localStorage.getItem('auth_token')
                }
            }).success(function (data) {
                if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
                $scope.allUserList = data.result;
            }}).error(function (data) {
                // alert('登录失败，请检查账户和密码')
            });
        }
    };
    /**
     * [toParamsString 将json数组 拼接为URL参数]
     * @param  {[json]} json [请求参数]
     * @return {[string]}      [拼接成的URL参数]
     */
    $scope.toParamsString = function (json) {
        var str = '';
        for (var i in json) {
            str += (i + '=' + json[i] + '&');
        }
        return str.slice(0, -1);
    };
    /**
     * [addGroupUser 用户组增加用户]
     */
    $scope.addGroupUser = function () {
        var params = {
            user_id: $scope.selectedUser_add.id,
            group_id: $scope.addGroupUserId
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/auth/user/group/add/?' + $scope.toParamsString(params),
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#addModal").modal('hide');
                $rootScope.showLogin();
            }else {
            $rootScope.showToast('新增成功');
            $("#addModal").modal('hide');
            //$scope.getContentList(); // 重新渲染页面列表
        }}).error(function (data) {
            // alert('添加失败');
            $rootScope.showToast('新增失败');
        });
    };

    // 打开页面执行，获取用户组列表
    $scope.getContentList();
    /** 0304==zxh
     *  用户组关联部门，一个用户可以添加多个部门
     *  部门接口：（1）查询所有部门
     *          （2）通过ID查询部门
     *          （3）添加关联的部门
     *          （4）删除关联的部门
     *          */
    $scope.userGroupList = [];
    // 打开用户组管理，获取当前用户所属于的用户组;
    $scope.manageDepart = function (id, index) {
        $scope.editGroupUserId = id;
        $scope.index = index;
        $scope.getDepart();
        $scope.getAllDepart();
    };

    $scope.getDepart = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/auth/group/department/list/?group_id=' + $scope.editGroupUserId,
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                if (data.result) { // 数据存在时执行，有数据时去掉length--0304==zxh
                    //$scope.userGroupList = data[0].groups;
                    $scope.userGroupList = data.result;
                }
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // alert('登录失败，请检查账户和密码')
        });
    };
    // 删出用户的用户组
    $scope.delDepart = function (de_id,pro_id,index) {
        $http({
            'method': 'DELETE',
            'url': interface_url + '/auth/group/department/del/',
            'params': {
                "group_id": $scope.editGroupUserId,
                "department_id": de_id,
                "product_id": pro_id
            },
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $scope.userGroupList.splice(index, 1);
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast(data.message);
        });
    };
    // 添加用户到用户组
    $scope.addDepart = function () {
        var params = {
            group: $scope.editGroupUserId,
            department: $scope.selectedGroup.id,
            product: $scope.selectedGroupProduct.id
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/auth/group/department/add/',
            'data': params,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#addModal").modal('hide');
                $rootScope.showLogin();
            }else {
            $rootScope.showToast('新增成功');
            $("#addModal").modal('hide');
            $scope.getDepart();// 重新渲染页面列表
        }}).error(function (data) {
            $rootScope.showToast('新增失败');
        });
    };
    // 获取所有的用户组0322
    $scope.allCroupList = [];
    $scope.selectedGroup = {}; // 保存选择的用户组信息;
    // 获取所有的部门
    $scope.getAllDepart = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/interface/department/list/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.allGroupList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            //console.log(data)
        });
    };
    // 根据部门选择产品
    $scope.selecteDepartment = function () {
        if (!$scope.selectedGroup)return;
        // 获取当前产品下的 系统
        $scope.getProduct($scope.selectedGroup.id);
    };
    $scope.allProductList = [];
    $scope.getProduct = function (departmentid, callback) {
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
                $scope.allProductList = data.result;
                callback && callback();
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
        })
    };
}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backUser_usergroup', backUser_usergroup); // 用户管理==用户组
