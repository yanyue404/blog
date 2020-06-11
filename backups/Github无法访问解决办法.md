## 添加dns解析

> C:\Windows\System32\drivers\etc\hosts

在线工具：[IPAddress.com The Best IP Address Tools](https://www.ipaddress.com/ip-lookup)

https://github.com.ipaddress.com/www.github.com

Domain | github.com
-- | --
IP Address | 140.82.112.3
Web Server Location | United States

https://githubusercontent.com.ipaddress.com/avatars0.githubusercontent.com

Domain | githubusercontent.com
-- | --
IP Address | 199.232.68.133
Web Server Location | United States

**hosts** 文件追加

```bash
# localhost name resolution is handled within DNS itself.

  140.82.112.3  github.com  
  199.232.68.133 githubusercontent.com
```

windows 刷新 dns 解析

```bash
xiaoyueyue@LAPTOP-FBB3CVU9 C:\Users\xiaoyueyue\Desktop
$ ipconfig /flushdns

Windows IP 配置

已成功刷新 DNS 解析缓存。
```


