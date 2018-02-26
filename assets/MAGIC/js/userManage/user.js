/**
 * Created by Administrator on 2017/4/27.
 */
/**
 * [用户登录，列表展示]
 */
function backUserLogin($scope, $rootScope, $http, $state, $stateParams, interface_url, code_url) {
    $scope.userName = localStorage.getItem('username');

    // console.log($scope.role);
    $scope.isOpen = false;
    $scope.numBlur = function () {
        if ($scope.login_username && $scope.login_password) {
            $scope.isOpen = true;
        }
    };
    $scope.pswBlur = function () {
        if ($scope.login_username && $scope.login_password) {
            $scope.isOpen = true;
        }
    };
    // 判断是否在数组中
    $scope.in_array = function (arr,str) {
        // console.log(arr+'---'+ JSON.stringify(str));  
        if (str) {
            Array.prototype.S=String.fromCharCode(2);
            Array.prototype.in_array=function(e){
                var r=new RegExp(this.S+e+this.S);
                return (r.test(this.S+this.join(this.S)+this.S));
            };
            return arr.in_array(str.role);//bool
        }
    };
    // 保存用户列表数组信息
    $scope.userList = [];
    // 请求获取所有用户，保存在userList
    $scope.getUserList = function () {
        $http({
            'method': 'get',
            'url': interface_url + '/auth/user/list/',
            'params': {
                'is_active': 'all'
            },
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.userList = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // alert('登录失败，请检查账户和密码')
            $rootScope.showToast('获取列表失败');
        });
    };

    /**
     *  点击修改，获取用户详情方法
     * @param  {[string]} itemId [用户id]
     */
    $scope.editUserDes = function (itemId) {
        $http({
            'method': 'GET',
            'url': interface_url + '/auth/user/detail/' + itemId + '/?format=json',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.editUser = data.result;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // console.log('失败')
            // console.log(data)
        })
    };

    // 修改是否禁用
    $scope.editIs_staffActive = function () {
        $scope.editUser.is_active = !$scope.editUser.is_active;
    };


    /**
     * 提交用户修改用户方法
     * @param  {[string]} itemId [用户id]
     */
    $scope.editUserMethod = function (itemId) {
        var editUserData = {
            username: $scope.editUser.username,
            email: $scope.editUser.email,
            role: $scope.editUser.role,
            is_active: $scope.editUser.is_active,
            id: $scope.editUser.id
        };
        // 调用接口，完成修改
        postEditUser(editUserData, $scope.editUser.id)
    };
    //  修改用户信息与禁用用户 使用的是同一个接口，单独封装；
    /**
     * 通过patch修改用户数据
     * @param  {[json]} data [借口参数]
     * @param  {[string]} id   [用户id]
     */
    function postEditUser(data, id) {
        $http({
            'method': 'PATCH',
            'url': interface_url + '/auth/user/detail/' + id + '/update/',
            'data': data,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                $("#editUser").modal('hide'); // 关闭弹窗
                $scope.getUserList(); // 渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改失败');
        });
    }

    // 如果本地未存储sessionStorage  ,显示登录框，登录中显示用户列表
    if (localStorage.getItem('auth_token')) {
        $scope.isLogin = true;
        $scope.getUserList();
    } else {
        $scope.isLogin = false;

    }
    // 登录方法 登录成功显示后台列表
    $scope.loginTo = function () {
        $http({
            'method': 'POST',
            'url': interface_url + '/auth/login/',
            'data': {
                username: $scope.login_username,
                password: $scope.login_password
            }
        }).success(function (data) {
            // if(data.code === 403 || data.code === '403'){
            //     $rootScope.showLogin();
            // }else {
            if (data.code === 200 || data.code === '200'){
                //sessionStorage.setItem('auth_token', data.result.auth_token);
                localStorage.setItem('auth_token', data.result.auth_token);
                //sessionStorage.setItem('username', data.result.username);
                localStorage.setItem('username', data.result.username);
                //sessionStorage.setItem('IsAdminUser', data.result.IsAdminUser);
                //sessionStorage.setItem('IsSuperUser', data.result.IsSuperUser);
                // sessionStorage.setItem('role', data.result.role);
                // localStorage.setItem('role', data.result.role);
                $rootScope.role = data.result;
                $scope.isLogin = true;
                // $scope.getUserList();        MAG-281  mustang
                // $rootScope.getRole();
                $state.go('backUseCase.design');
                $http({
                    'method': 'POST',
                    'url': code_url + '/api/authentication/login?login='+$scope.login_username + '&password='+$scope.login_password
                }).success(function () {
                    console.log('登录');
                }).error(function () {
                    console.log('错误');
                })
            }else {
                $rootScope.showToast(data.message);
            }
        // }
        }).error(function (data) {
            // alert('登录失败，请检查账户和密码')
            // bug46==登录密码输入错误没有任何提示信息==zxh
            // $rootScope.showToast('登录失败，请检查账户和密码');
            $rootScope.showToast(data)
        });
    };

    // // 点击退出，显示前台登录框
    // $scope.showLogin = function () {
    //     //$scope.isLogin = !$scope.isLogin;
    //     sessionStorage.removeItem('auth_token');
    //     localStorage.removeItem('auth_token');
    //     //sessionStorage.removeItem('IsAdminUser');
    //     sessionStorage.removeItem('IsSuperUser');
    //     sessionStorage.removeItem('username');
    //     sessionStorage.removeItem('role');
    //     localStorage.removeItem('username');
    //     localStorage.removeItem('role');
    //     localStorage.clear();
    //     $rootScope.role = null;
    //     $state.go('login');
    // };
    // 去前台
    $scope.goFront = function () {
        //$scope.isLogin = !$scope.isLogin;
        $state.go('interface.center');
    };
    // 去后台
    $scope.goBack = function () {
        //$scope.isLogin = !$scope.isLogin;
        $state.go('backUseCase.design');
    };
    /**
     * 将json类型接口参数数据转为字符串
     * @param  {[json]} json [借口参数]
     * @return {[string]}      [返回的字符串url]
     */
    $scope.toParamsString = function (json) {
        var str = '';
        for (var i in json) {
            str += (i + '=' + json[i] + '&');
        }
        return str.slice(0, -1);
    };
    $scope.validate = {};
    // 增加用户
    $scope.addUser = function () {
        // 添加用户请求接口的参数
        var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var usernameReg = /^[a-z0-9A-Z\@\.\+\-\_ ]{1,34}$/;
        var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if (!emailReg.test($scope.reg_email)) {
            $scope.validateText = '请输入正确邮箱';
            return;
        }

        if (!usernameReg.test($scope.reg_username) || !$scope.reg_username) {
            $scope.validateText = '请输入正确的用户名（不多于30个字符，只能用字母、数字和字符 @.+-_ ）';
            return;
        }
        if ($scope.reg_password && $scope.reg_password_confirm){
            if (!pwdReg.test($scope.reg_password) || !pwdReg.test($scope.reg_password_confirm)) {
                $scope.validateText = '密码必须为8-20位字母和数字混合，请检查';
                return;
            }
        } else {
            $scope.validateText = '密码不能为空';
            return;
        }

        if ($scope.reg_password !== $scope.reg_password_confirm) {
            $scope.validateText = '两次输入的密码不一致';
            return;
        }

        var addUserPostParam = {
            username: $scope.reg_username,
            password: $scope.reg_password,
            email: $scope.reg_email,
            role: $scope.reg_limit
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/auth/register/',
            'data': addUserPostParam,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 201 || data.code === '201'){
                $rootScope.showToast('新增成功');
                $scope.getUserList();
                $('#myModal').modal('hide'); // 隐藏模态窗
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // alert('添加失败')
            $rootScope.showToast('新增失败');
            // $('#myModal').modal('hide'); // 隐藏模态窗
        });

    };


    // 删除产品
    $scope.delUser = function (itemId) {
        $scope.delUserId = itemId;
    };
    // 确认删除
    $scope.sureDelUser = function () {
        // console.log($scope.delUserId)
        $http({
            'method': 'DELETE',
            'url': interface_url + '/auth/user/detail/' + $scope.delUserId + '/del/',
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 204 || data.code === '204'){
                $rootScope.showToast('删除成功');
                $scope.getUserList(); // 渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
        });
    };
    /**
     * 禁用用户转台
     * @param  {[string]} id [当前用户的id]
     * @return {[type]}    [description]
     */
    $scope.disableUser = function (id) {
        $scope.disableUserId = id;
    };
    // 确认禁用该用户
    $scope.disableUserMethod = function () {
        var data = {
            is_active: false
        };
        postEditUser(data, $scope.disableUserId);
    };
    /**
     * 修改密码
     * @param  {[string]} id [当前用户的]
     * @return {[type]}    [description]
     */
    $scope.modifyPass = function (id) {
        $scope.modifyPassUserId = id;
    };
    $scope.modifyPassMethod = function () {
        //return ;
        // 未完成修改密码功能;
        /*   var data = {

         };
         postEditUser()*/
        if (!$scope.modify_password || !$scope.modify_password_confirm) {
            // $scope.validateText = '密码不能为空';
            $rootScope.showToast('密码不能为空');
            return;
        }
        if ($scope.modify_password !== $scope.modify_password_confirm) {
            // $scope.validateText = '两次输入的密码不一致';
            $rootScope.showToast('两次输入的密码不一致');
            return;
        }
        var modifyPwd = {
            user: $scope.modifyPassUserId,
            //current_password: $scope.current_password,
            new_password: $scope.modify_password
        };
        $http({
            'method': 'POST',
            'url': interface_url + '/auth/password/',
            'data': modifyPwd,
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $("#modifyPass").modal('hide');
                $rootScope.showLogin();
            }else {
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('修改成功');
                $scope.getUserList();
                $('#modifyPass').modal('hide'); // 隐藏模态窗
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            $rootScope.showToast('修改失败');
            $('#modifyPass').modal('hide'); // 隐藏模态窗
        });

    };

    $scope.userGroupList = [];
    // 打开用户组管理，获取当前用户所属于的用户组;
    $scope.manageUserGroup = function (id, index) {
        $scope.editGroupUserId = id;
        $scope.index = index;
        $scope.getUserGroup();
        $scope.getAllGroupList();

    };

    $scope.getUserGroup = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/auth/user/group/list/?user_id=' + $scope.editGroupUserId,
            'params': {
                'is_active': 'all'
            },
            // 'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            if (data.code === 200 || data.code === '200'){
                $scope.userGroupList = data.result[0].groups;
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // alert('登录失败，请检查账户和密码')
        });
    };
    // 删出用户的用户组
    $scope.delUserGroup = function (id, index) {
        // console.log(id);
        // console.log(index);
        $http({
            'method': 'DELETE',
            'url': interface_url + '/auth/user/group/del/?user_id=' + $scope.editGroupUserId + '&group_id=' + id,
            'data': {},
            'headers': {
                'Authorization': 'Token ' + localStorage.getItem('auth_token')
            }
        }).success(function (data) {
            if(data.code === 403 || data.code === '403'){
                $rootScope.showLogin();
            }else {
            $rootScope.showToast('删除成功');
            $scope.userGroupList.splice(index, 1);
        }}).error(function (data) {
            $rootScope.showToast('删除失败');
            // alert('登录失败，请检查账户和密码')
        });
    };
    // 添加用户到用户组
    $scope.addGroupUser = function () {
        var params = {
            user_id: $scope.editGroupUserId,
            group_id: $scope.selectedGroup.id
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
            if (data.code === 202 || data.code === '202'){
                $rootScope.showToast('添加成功');
                $("#addModal").modal('hide');
                $scope.getUserGroup();// 重新渲染页面列表
            }else {
                $rootScope.showToast(data.message);
            }
        }}).error(function (data) {
            // alert('添加失败');
            $rootScope.showToast('添加失败');
        });
    };
    // 获取所有的用户组
    $scope.allCroupList = [];
    $scope.selectedGroup = {}; // 保存选择的用户组信息;
    $scope.getAllGroupList = function () {
        $http({
            'method': 'GET',
            'url': interface_url + '/auth/group/list/',
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
            $rootScope.showToast('获取列表失败');
        });
    };



}
/**
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('backUserLogin', backUserLogin); // 用户管理==用户
