# git 入门与实践

###### 推荐

- [猴子都能懂的GIT入门](https://backlog.com/git-tutorial/cn/)
- [Git --everything-is-loca 官方文档](https://git-scm.com/book/zh/v2)
- [Git 教程-廖雪峰](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

git 客户端有图形化（小乌龟 ），有命令行（git bash）等...

## 基本配置

### 配置用户名和邮箱:

```bash
git config --global user.name "自己的名字"  # 用户名
git config --global user.email "自己的邮箱" # 邮箱
git config --list
```

> 补充，其实是保存了用户名和邮箱到 C:\Users\[用户名]\.gitconfig 文件中

### 公用的电脑来备份(github)(远端仓库)

github 本身是个网站,但是这个网站所在的电脑可以做为公用的电脑来备份代码!

1. 注册 github 账号，并登陆
2. 先使用 git bash 窗口，输入

```bash

ssh-keygen -t rsa || ssh-keygen
```

> 这个命令就会生成一个标识,我们需要把这个标识上传到服务器会在 【/c/Users/[用户名]/.ssh】目录中生成两个文件:【id_rsa, id_rsa.pub】, 我们用编辑器打开 id_rsa.pub,复制内容并关闭

3.在 github 网站上,把复制的密钥,添加到 github 上去!

4.测试 `$ ssh -T git@github.com`

> 如果能看到类似于**Hi XXXX! You've successfully authenticated, but GitHub does not provide shell access.**这样的提示，则表示 ssh key 配置成功！

## Git 工作区、暂存区和版本库

我们先来理解下 Git 工作区、暂存区和版本库概念

- 工作区：就是你在电脑里能看到的目录。
- 暂存区：英文叫 stage, 或 index。一般存放在"git 目录"下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）。
- 版本库：工作区有一个隐藏目录.git，这个不算工作区，而是 Git 的版本库。

下面这个图展示了工作区、版本库中的暂存区和版本库之间的关系：

![201609291519223166.png](http://ww1.sinaimg.cn/large/df551ea5ly1g8f09hs019j20je093djl.jpg)

## 工作流

1. 在项目根目录下创建`.git`文件，暂存区和版本库的代码都在此文件夹下

```bash

git init
```

2. 添加文件到暂存区

```bash

git add A4.txt //添加单一文件
git add -A    //把自上一次git commit后，修改过的文件全部添加到暂存区
```

3. 放到仓库

```bash

git commit -m "注释" // 是把暂存区的代码，放到仓库
```

4. git 上传代码到远端分支

```bash
git push git@github.com:yanyue404/fed02.git master
```

##### 简化命令

```bash
git remote add origin git@github.com:yanyue404/fed02.git
git push origin master
```

> // 这个 origin 随便起, 就相当于设置`var origin = "git@github.com:yanyue404/fed02.git"`,将本地的 master 分支推送到 origin 主机的 master 分支

5.  忽略清单文件(.gitignore)

在项目根目录，新建一个名为 .gitignore 的文件 。假如，我们希望 test 文件中的内容不被备份, 就在.gitignore 文件中添加一行

```bash
# 忽略项目根目录的test文件夹中的内容
/test
# 忽略项目中所有名为test的文件夹，或者文件
test
# 忽略项目中的名为app.js的文件
app.js
# 忽略项目中的所有js
*.js
/test/*.*
```

### 常用命令:

- `git status` // 查看有哪些修改后的文件在暂存区，哪些不在
- `git log` //只能看到 head 指向之前的提交记录
- `git reflog` // 查看所有的操作记录

## 版本回退

默认 head 指向 master,就会把 master 中的提交的代码拿到工作区

- `git reset --hard 提交的id`
- `git reset --hard 53bd6a3cd5b9ff5782af4837985c1e3023412d23`

强制提交:

```bash
git push -f
```

> 注意，如果是回退到最近的一次提交的状态，不需要添加 commit_id，直接 `git reset --hard head`

## 分支

默认只有一个 master 分支（主分支），可以创建新的分支，然后在分支中提交代码!，直到这个功能完成了，就可以回到 master 分支，然后合并。

```bash
git branch # 查看本地分支
git branch -r # 查看所有远程分支
git branch -a # 查看所有远程分支和本地分支

git branch [branch-name]  # 新建一个分支，但依然停留在当前分支
git checkout [branch-name]  # 切换到指定分支，并更新工作区
git checkout -b [branch-name] #  创建一个分支并切换到该分支中,相当于以上两条命令

git merge [branch-name] # 合并指定分支到当前分支

git branch -d [branch-name] # 删除分支
git push origin --delete [branch-name] # 删除远程分支
```

## 标签

```bash
git tag # 列出所有tag
git tag [tag] # 新建一个tag在当前commit
git tag [tag] [commit] # 新建一个tag在指定commit
git tag -d [tag] # 删除本地tag
git push origin :refs/tags/[tagName] # 删除远程tag
git show [tag] #查看tag信息
git push [remote] [tag] # 提交指定tag
```

## 远程同步

```bash

git fetch [remote] # 下载远程仓库的所有变动

git remote -v # 显示所有远程仓库
git remote show [remote] # 显示某个远程仓库的信息
git remote add [shortname] [url] # 增加一个新的远程仓库，并命名

git pull [remote] [branch] # 取回远程仓库的变化，并与本地分支合并

git push [remote] [branch] # 上传本地指定分支到远程仓库
git push [remote] --force # 强行推送当前分支到远程仓库，即使有冲突
git push [remote] --all # 推送所有分支到远程仓库
```

## 流程(针对于一个项目 project)

```bash
git init # 是第一次建立版本库
git clone [url] # 下载一个项目和它的整个代码历史

git pull origin master    # 从远程获取最新版本并merge到本地等同于
git checkout -b dev       # 这里在新分支上开发，考虑实际是否需要
git add -A, git commit -m # 一样是这两个命令功能完成之后回到 master 分支
git checkout master
git merge dev

# 删除本地 dev分支和远程的dev分支
git branch -d dev
git push origin --delete dev
```

## git 常用命令速查表

![1486348362884912.jpg](http://ww1.sinaimg.cn/large/df551ea5ly1g8ezswhp6wj21lo14qgqu.jpg)

#### 参考链接

- http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html
- [Git workflow 详谈](https://juejin.im/post/5844507761ff4b006c3359a9)
