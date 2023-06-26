start: npm run dev  or yarn dev
1.短信平台配置:
验证码格式或说短信格式:签名(【腾讯】)+模板(您的验证码是...)
容联云通讯:免费、简洁
注意pages下api文件夹下的文件实际是在服务端（后端）执行的。
axios是一个同构库，即既支持node服务端也支持浏览器客户端。
后端构造的验证码应该保存在redis缓存中，不应保存至内存中，原因在于生产环境服务器可能有多台，另一台服务器无法获取这个服务器内存中的数据。但我们练手的项目不涉及redis，因此借助iron-session库还是保存在内存中。
2.使用 navicat 管理 MySql ，建立两张表, users(保存用户的基本信息(nickname,avatar,job,introduce))和user_auths(保存较隐私的敏感数据(用户id，identity_type登录类型是手机号还是github，credential为验证码(若为手机登录)或者token(若为github登录)))
3.引入typeorm库，用于支持在js中如同管理js对象一般管理mysql数据库
4.使用mysql2库用于支持mysql和项目的互联。

