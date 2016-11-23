require('MiotStoreSDK');
dispatch_async_main(function(){
  MiotStoreSDK.sharedInstance().simulateJSOpenUrl_withNaviController_withOpenNewView('http://home.mi.com/shop/search?keyword=%E7%B1%B3%E5%AE%B6%E6%89%AB%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA',gDeviceViewController().navigationController(),true);
})

