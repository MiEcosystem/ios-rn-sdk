# rn开发非小米蓝牙协议设备oc端嵌入文件步骤

1. 下载合作开发的sdk，用于调试，具体下载方式找米家开发人员。

2. 找米家工作人员配置此设备model对应的快连方式（插件内快连）

3. 实现相关类
   1. MHDeviceBluetooth的子类

      - 实现load方法注册设备model
      - 给出设置控制类的类型

      ```objective-c
      + (void)load{
          // 注册设备model，开发不支持小米蓝牙协议的普通蓝牙设备，请打开
          [MHDevListManager registerDeviceModelId:XMBand2Model className:NSStringFromClass([self class]) isRegisterBase:YES];
      }

      + (Class)iOTDeviceClass{
          return [XMBand2BtDevice class];
      }
      ```

   2. MHBtDevice

      - 传入广播参数，判断是否是本类设备广播   **不要误判，会把别人的广播识别成自己的设备**
      - 传入广播参数，返回设备did值，did保证每个设备唯一且不变，通过uuid似乎可以，或者自己去实现
      - 传入广播参数，返回设备类model，返回本设备model就行

      ```objective-c
      + (BOOL)isDeviceHit:(MHBluetoothBroadcastPackage *)broadcast{
          NSDictionary *dic = broadcast.advertisementData;
          if ([[dic objectForKey:@"kCBAdvDataLocalName"] isEqualToString:@"MI Band 2"]) {
              return YES;
          }
          return NO;
      }

      +(NSString *)didOfBroadcast:(MHBluetoothBroadcastPackage *)broadcast{
          return broadcast.peripheral.identifier.UUIDString ;
      }

      + (NSString *)deviceModelOfBroadcast:(MHBluetoothBroadcastPackage *)broadcast{
          return XMBand2Model;
      }
      ```

4. 进入插件后，相关流程参见文档

   1. MHPluginSDK中有把设备添加到设备列表中的相关方法
   2. MHBluetoothLE中有蓝牙读写的相关方法
   3. **SDK 提供了一个蓝牙示例插件，见 com.xiaomi.corebledemo.ios 目录**

5. 如有问题，请联系米家人员