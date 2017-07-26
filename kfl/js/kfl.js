/**
 * Created by bjwsl-001 on 2017/5/16.
 */

var app = angular.module('kfl', ['ng', 'ngRoute']);

app.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
  function($rootScope, $browser, $q, $exceptionHandler) {
    var deferreds = {},
      methods = {},
      uuid = 0;

    function debounce(fn, delay, invokeApply) {
      var deferred = $q.defer(),
        promise = deferred.promise,
        skipApply = (angular.isDefined(invokeApply) && !invokeApply),
        timeoutId, cleanup,
        methodId, bouncing = false;

      // check we dont have this method already registered
      angular.forEach(methods, function(value, key) {
        if (angular.equals(methods[key].fn, fn)) {
          bouncing = true;
          methodId = key;
        }
      });

      // not bouncing, then register new instance
      if (!bouncing) {
        methodId = uuid++;
        methods[methodId] = { fn: fn };
      } else {
        // clear the old timeout
        deferreds[methods[methodId].timeoutId].reject('bounced');
        $browser.defer.cancel(methods[methodId].timeoutId);
      }

      var debounced = function() {
        // actually executing? clean method bank
        delete methods[methodId];

        try {
          deferred.resolve(fn());
        } catch (e) {
          deferred.reject(e);
          $exceptionHandler(e);
        }

        if (!skipApply) $rootScope.$apply();
      };

      timeoutId = $browser.defer(debounced, delay);

      // track id with method
      methods[methodId].timeoutId = timeoutId;

      cleanup = function(reason) {
        delete deferreds[promise.$$timeoutId];
      };

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;
      promise.then(cleanup, cleanup);

      return promise;
    }


    // similar to angular's $timeout cancel
    debounce.cancel = function(promise) {
      if (promise && promise.$$timeoutId in deferreds) {
        deferreds[promise.$$timeoutId].reject('canceled');
        return $browser.defer.cancel(promise.$$timeoutId);
      }
      return false;
    };

    return debounce;
  }
]);


//配置路由词典
app.config(function ($routeProvider) {
  $routeProvider
    .when('/kflStart', {
      templateUrl: 'tpl/start.html'
    })
    .when('/kflMain', {
      templateUrl: 'tpl/main.html',
      controller: 'mainCtrl'
    })
    .when('/kflDetail/:id', {
      templateUrl: 'tpl/detail.html',
      controller: 'detailCtrl'
    })
    .when('/kflOrder/:did', {
      templateUrl: 'tpl/order.html',
      controller: 'orderCtrl'
    })
    .when('/kflMyOrder', {
      templateUrl: 'tpl/myOrder.html',
      controller: 'myOrderCtrl'
    })
    .otherwise({redirectTo: '/kflStart'})
});

//创建控制器，封装了跳转的方法
app.controller('parentCtrl',
  ['$scope', '$location',
    function ($scope, $location) {
      $scope.jump = function (desPath) {
        $location.path(desPath);
      }
    }
  ])

app.controller('mainCtrl',
  ['$scope', '$http','$debounce',
    function ($scope, $http,$debounce) {

      $scope.hasMore = true;

      //  加载到代码片段，进到控制器处理函数中，发起请求拿数据
      $http
        .get('data/dish_getbypage.php?start=0')
        .success(function (data) {
          //console.log(data);
          $scope.dishList = data;
        });

      //  监听用户的输入
      $scope.$watch('kw', function () {
        //放抖动处理
        $debounce(watchHandler,300);
      })

      watchHandler = function () {
        console.log($scope.kw);
        if ($scope.kw) {
          $http
            .get('data/dish_getbykw.php?kw=' + $scope.kw)
            .success(function (data) {
              console.log(data);
              //搜索是由结果的
              if (data.length > 0) {
                //将搜索到的结果显示在main页面的列表上
                $scope.dishList = data;
              }
            })
        }
      }

      //加载更多
      $scope.loadMore = function () {
        $http
          .get('data/dish_getbypage.php?start='
          + $scope.dishList.length)
          .success(function (data) {
            if (data.length < 5) {
              //没有更多数据：将按钮隐藏掉，显示一个提示信息
              $scope.hasMore = false;
            }
            //数组拼起来保存在dishList
            $scope.dishList = $scope.dishList.concat(data);
          })
      }

    }])

app.controller('detailCtrl',
  ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http) {
      var did = $routeParams.id;
      console.log(did);
      $http
        .get('data/dish_getbyid.php?id=' + did)
        .success(function (data) {
          console.log(data);
          $scope.dish = data[0];
        })
    }
  ]
);

app.controller('orderCtrl', [
  '$scope', '$routeParams', '$http', '$httpParamSerializerJQLike',
  function ($scope, $routeParams, $http, $httpParamSerializerJQLike) {

    $scope.order = {did: $routeParams.did};

    $scope.submitOrder = function () {
      //先去获取用户输入的各个信息
      console.log($scope.order);

      //将输入的信息 发送 给服务器端
      var params = $httpParamSerializerJQLike($scope.order);
      console.log(params);

      $http
        .get('data/order_add.php?' + params)
        .success(function (data) {
          //解析服务端返回的结果
          console.log(data);
          if (data[0].msg == 'succ') {
            $scope.result = "下单成功，订单编号为" + data[0].oid;
            //方案1
            sessionStorage.setItem('phone', $scope.order.phone)
            //方案2 $rootScope

          }
          else {
            $scope.result = "下单失败！";
          }
        })


    }

  }
]);

app.controller('myOrderCtrl', [
  '$scope', '$http', function ($scope, $http) {
    //拿到手机号
    var phone = sessionStorage.getItem('phone');
    console.log(phone);
    //发起网络请求
    $http
      .get('data/order_getbyphone.php?phone=' + phone)
      .success(function (data) {
        //将服务器端返回的订单列表保存在$scope中的orderList
        $scope.orderList = data;
      })
  }
]);













