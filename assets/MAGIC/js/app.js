/**
 * INSPINIA - Responsive Admin Theme    Mustang
 *于module的定义为：angular.module(‘com.ngbook.demo’, [])
 * name：模块定义的名称
 * requires：模块的依赖
 * configFn： 模块的启动配置函数，在angular config阶段会调用该函数，
 */
    //  实例化module 配置app 将依赖的js注入  加载配置
    var app = angular.module('inspinia', ['ui.router','oc.lazyLoad','ui.bootstrap','pascalprecht.translate','ngIdle','ngSanitize' ]);
    app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
        function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
        }]);
    // 按模块化加载其他的脚本文件    ocLazyLoad加载模块的配置：
    app.constant('Modules_Config', [
        {
            name: 'ngPage',    // 这个没用
            serie: true,
            module:true,
            files: [""]
        }
    ]);
    //  懒加载的配置方法
    app.config(["$ocLazyLoadProvider","Modules_Config",routeFn]);

    function routeFn($ocLazyLoadProvider,Modules_Config){
        $ocLazyLoadProvider.config({                //  （如果不去配置Modules_Config直接写这个也行？）
            debug:false,    // 是否启用调试模式
            events:false,   // 事件绑定是否启用
            modules:Modules_Config
        });
    }
