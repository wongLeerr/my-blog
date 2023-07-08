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
5.无论是新用户注册还是老用户登录，只要验证码验证成功我们就会将其个人信息存储至session中，因此session可以通过session中存储的值来判断用户是否处于登录状态。
6.使用cookie（使用了next-cookie库）解决刷新丢失全局数据的问题，
7.可以成为项目难点的地方 :登录成功后，用户信息（id，工作，头像，介绍，）会传给前端，但刷新会使得前端数据完全丢失， 如何维持全局 store ，使得刷新后仍然前端可以拿到应有的数据，借助cookie来完成这个需求，cookie是一种服务器返回给前端的，会自动保存在浏览器中的可存储少量数据的介质，基于这个特性，安装next-cookie库来完成，什么时候往cookie中存数据?在服务器返回给前端登录成功响应时，注意无论是新用户还是老用户都应该存，什么时候取，在哪取？ 在app根组件中，有一个服务端执行的方法 , getInitialProps()此方法在服务端执行，里面会注入cookie相关信息，于是在这里就可以将我们想要的cookie信息以props的形式传入各个组件,在app中组件中，我们实际上传给了store（通过provider），也就是说store中现在已经有了刷新数据依旧可以保持store中用户信息相关数据的能力。
8.登录成功：查数据库->将用户信息存储至session（为了实现判断用户是否是登录状态）->将用户信息存储至cookie（为了使得前端可以实现持久化存储）。退出登录：清空session（表明用户退出登录了），清空cookie（前端关于用户信息的数据也请空了）
9.在mobx中，组件中依赖的store中的数据变化时，组件并不会实时的更新，需要调用API将将组件observe起来才可以
10.可以成为项目难点的地方 : 验证码验证环节，用户输入手机号和验证码 ，后台比对验证码是否正确，由于验证码是后台是生成的，因此验证码不仅要把生成的验证码返回给前端，还要自己保存在服务器，保存在哪？保存在内存中吗？事实上，服务器在上线环境下运行是集群的，若保存在内存中可能轮到其他服务器为这次请求服务其将无法比对验证码的正确性，因此需要一个中间媒介（session），实现中间存储作用，使得各个服务器都可以拿到生成的验证码，这样可以实现任何一个一台服务器都可以拿到存储的验证码进行比对。
11.文章发布页主要思路:首先必须保证登录态才可以写文章，求助一些三方库实现md编辑器的功能，文章就包含两部分（title和content），为文章管理单独创建数据库表articles（包含id，title，content，create_time(文章创建时间)，update_time(更新时间),is_delete(用于实现假删除),views(访问量)，userId（用于和用户关联）），点击发布时存入数据库表中，并跳转到个人主页（/user/${userId}）。
12.文章详情逻辑: 点击主页文章列表的某一项，进入文章详情页，在文章详情页当中如果判断当前登录的用户就是该文章的作者，那么会展示可编辑的按钮（怎么判断，通过store中的userId和从查询这篇文章关联的用户id作比较，若一致，则表明就是一样的）
13.文章阅读次数逻辑:由于每次点击文章详情页都会跳转到文章详情页并且进行查询articles文章数据库表的操作，我们在每次查表操作之后就将文章的访问次数加一。
14.文章评论功能的实现:新建一张表comments,在此表中有评论的内容(centent),评论人(user_id),评论的是哪篇文章(article_id)，仅当处于登录态时查看文章详情页面才会有评论框的出现，某用户在篇文章下面评论以后，点击提交按钮会向comments表中写入一条数据，这条数据记录了评论的内容，写评论的人是谁，和评论的哪篇文章。
15.由于此项目为SSR项目，因此


