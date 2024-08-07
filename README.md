# 友链朋友圈

![插入网页示例](https://github.com/user-attachments/assets/bcb1fa6f-9c05-433e-a0ed-47c6e9f0c11d)

## 搭建

Fork 本项目，在 Actions 中开启 workflows，然后开启叫作 Friend Circle 的 workflow，关闭叫作 Lint Commit Messages 的 workflow，之后在 Settings 的 Pages 中将 Branch 选为 gh-pages。

## 配置

links 文件用于配置各个博客的 RSS 地址和头像：

```
https://mumulhl.eu.org/index.xml https://mumulhl.eu.org/img/avatar_hub440208ea63c4061633255bf6046ed7b_104338_300x0_resize_q75_h2_box_2.webp
```

在 workflow 中配置输出的文章数量：

```yml
- name: Friend Circle
  uses: mumu-lhl/simple-friend-circle@main
  with:
    max_everyone: 5 # 每个博客最多的文章数量
    max_number: 50 # 总共最多的文章数量
```

## 插入网页

你可以在网页上插入这些代码来显示友链朋友圈：

```html
<iframe src="https://YOUR GITHUB NAME.github.io/simple-friend-circle/" width="100%" height="400rem" style="border:none;"></iframe>
```

## 主题

默认的主题来自我用的 [Hugo Stack 主题](https://stack.jimmycai.com)，改主题的话到 public/main.css 自行改吧。
