### 此项目精简自如下项目

[太狼: teambition/learning-rxjs](https://github.com/teambition/learning-rxjs)

主要是删除了一些，然后通过学习思路重组了一下，大家也可以看**太狼**的原文：

- [Hello RxJS](https://zhuanlan.zhihu.com/p/23331432)
- [用 RxJS 连接世界](https://zhuanlan.zhihu.com/p/23464709)

好了，接下来是目前项目情况的说明。

```bash
├── package.json
├── src
│   ├── TodoItem.ts // DOM 相关
│   ├── WebUtil.ts // 模拟后端
│   ├── app.ts // 应用入口
│   ├── index.html
│   ├── inter // 接口
│   └── style.css
├── tsconfig.json
└── webpack.config.js
```

其他和文章中差不多，不过过滤了一下，实现了 `search`、`add`、`del`、`toggle` 四个方法，编辑还没做。
其实挺简单的，主要是要记住流的数据类型和流的顺序。