# XPath Diner CN

[English](README.en.md)

[![License: MPL-2.0](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)
[![Static Site](https://img.shields.io/badge/deploy-static_site-2f8f5b.svg)](#本地运行)
[![i18n](https://img.shields.io/badge/i18n-CN%20%7C%20EN-dd992d.svg)](README.en.md)
[![Topic: XPath](https://img.shields.io/badge/topic-XPath-5f6fdd.svg)](#你会练到什么)

用餐厅小游戏学习 XPath selector。  
通过餐桌、餐盒和餐点练习 XPath 基础，并逐步过渡到更接近真实网页定位的问题。

在线体验：[https://c1499.github.io/xpath-diner-cn/](https://c1499.github.io/xpath-diner-cn/)

本项目基于 [TopSwagCode/xpath-diner](https://github.com/TopSwagCode/xpath-diner) 改造，加入了中英切换、难度练习、每日一题、随机练习和真实 iframe 关卡。

## 目录

- [为什么做这个](#为什么做这个)
- [功能一览](#功能一览)
- [你会练到什么](#你会练到什么)
- [本地运行](#本地运行)
- [项目说明](#项目说明)
- [来源](#来源)
- [License](#license)

## 为什么做这个

XPath 的资料很多，但初学者经常卡在“看得懂语法，但看到一段 HTML 不知道怎么下手”。  
这个项目希望用游戏方式把常见 XPath 思路练熟：先看结构，再找稳定线索，最后组合出 selector。

目标是：玩完后，用户看到普通不复杂的网页结构时，能写出可用的 XPath，而不用临时找一堆资料。

## 功能一览

| 功能 | 说明 |
| --- | --- |
| 中英切换 | 默认跟随浏览器语言，也可以手动切换，选择会保存在本地 |
| 主线关卡 | 通过餐桌、餐盒和餐点逐步练习 XPath 基础 |
| 难度练习 | 每日一题和随机练习支持简单、中等、困难三档 |
| 每日一题 | 同一天同难度固定，第二天自动更换 |
| 随机练习 | 每次生成新题，并尽量避免连续出现同类型或同答案题目 |
| 真实 iframe | 在同源 `srcdoc` iframe 中运行 XPath，练习 frame scope |
| 渐进答案 | 生成题默认隐藏标准答案，答错几次后再允许查看 |

## 你会练到什么

| 知识点 | 示例 |
| --- | --- |
| 按 tag 选择 element | `//plate` |
| 按 attribute 选择 element | `//*[@id='fancy']` |
| 组合 tag、attribute 和层级 | `//bento/orange[contains(@class,'small')]` |
| 合并多个 selector | `//plate|//bento` |
| 按位置选择 | `(//pickle)[3]` |
| 选择最后一个子 element | `//plate/*[last()]` |
| 匹配 attribute 片段 | `contains()`、`starts-with()`、`substring()` |
| 使用稳定 attribute | `data-testid`、`aria-label` |
| 理解 iframe scope | 先切到 frame，再在 frame 内运行 XPath |

游戏里的 `plate`、`bento`、`apple` 等是餐厅主题的自定义 tag；XPath 思路可以迁移到真实网页里的 `div`、`button`、`input` 等 HTML tag。

## 本地运行

这是一个纯静态项目，不需要后端、数据库或外部 API。

直接打开：

```bash
open index.html
```

或者启动本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000/
```

## 项目说明

- 第一版只支持中文和英文。
- 每日一题通过日期和难度生成固定 seed。
- 随机练习会记录近期题目，减少短时间内重复。
- iframe 练习使用同源 `srcdoc`，避免跨域读取限制。

## 来源

本项目基于 [TopSwagCode/xpath-diner](https://github.com/TopSwagCode/xpath-diner) 改造。

原 XPath Diner 的学习形式受到 [CSS Diner](https://github.com/flukeout/flukeout.github.io) 启发。

## License

本项目保留原许可证：Mozilla Public License 2.0。详见 [LICENSE](LICENSE)。
