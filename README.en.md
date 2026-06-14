# XPath Diner CN

[中文](README.md)

[![License: MPL-2.0](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)
[![Static Site](https://img.shields.io/badge/deploy-static_site-2f8f5b.svg)](#run-locally)
[![i18n](https://img.shields.io/badge/i18n-CN%20%7C%20EN-dd992d.svg)](README.md)
[![Topic: XPath](https://img.shields.io/badge/topic-XPath-5f6fdd.svg)](#what-you-will-practice)

A diner-themed game for learning XPath selectors.  
Practice XPath fundamentals through tables, bentos, and food elements, then move toward locator problems that resemble real page structures.

This project is based on [TopSwagCode/xpath-diner](https://github.com/TopSwagCode/xpath-diner). It adds Chinese/English UI, difficulty-based practice, daily challenges, random practice, and real iframe levels.

## Table of Contents

- [XPath Diner CN](#xpath-diner-cn)
  - [Table of Contents](#table-of-contents)
  - [Why This Exists](#why-this-exists)
  - [Features](#features)
  - [What You Will Practice](#what-you-will-practice)
  - [Run Locally](#run-locally)
  - [Project Notes](#project-notes)
  - [Credits](#credits)
  - [License](#license)

## Why This Exists

There are many XPath references, but beginners often get stuck at the point where they understand the syntax yet do not know how to start from a real HTML structure.  
This project uses a small game to make common XPath thinking feel natural: read the structure, find a stable clue, then compose a selector.

The goal is that after playing, users can look at a normal simple page structure and write a usable XPath without searching through a pile of references.

## Features

| Feature | Description |
| --- | --- |
| Chinese/English UI | Follows the browser language by default, with a manual switch stored locally |
| Main levels | Practice XPath fundamentals through tables, bentos, and food elements |
| Difficulty practice | Daily and random challenges support easy, medium, and hard modes |
| Daily challenge | Stable for the same day and difficulty, then changes the next day |
| Random practice | Generates a new challenge each time and avoids back-to-back repeats by type or answer |
| Real iframe | Runs XPath inside same-origin `srcdoc` iframes to teach frame scope |
| Progressive answer reveal | Generated challenge answers are hidden first and can be revealed after several misses |

## What You Will Practice

| Concept | Example |
| --- | --- |
| Select elements by tag | `//plate` |
| Select elements by attribute | `//*[@id='fancy']` |
| Combine tag, attribute, and hierarchy | `//bento/orange[contains(@class,'small')]` |
| Combine selectors | `//plate|//bento` |
| Select by position | `(//pickle)[3]` |
| Select the last child element | `//plate/*[last()]` |
| Match attribute fragments | `contains()`, `starts-with()`, `substring()` |
| Use stable attributes | `data-testid`, `aria-label` |
| Understand iframe scope | Switch into the frame first, then run XPath inside it |

The game uses custom diner-themed tags such as `plate`, `bento`, and `apple`. The XPath patterns transfer to real HTML tags such as `div`, `button`, and `input`.

## Run Locally

This is a static project. It does not require a backend, database, or external API.

Open directly:

```bash
open index.html
```

Or start a local static server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

## Project Notes

- The first version supports Chinese and English only.
- Daily challenges are generated from the current date and difficulty.
- Random practice stores recent challenge history to reduce short-term repeats.
- iframe practice uses same-origin `srcdoc` to avoid cross-origin document access limits.

## Credits

This project is based on [TopSwagCode/xpath-diner](https://github.com/TopSwagCode/xpath-diner).

The original XPath Diner was inspired by the selector learning style of [CSS Diner](https://github.com/flukeout/flukeout.github.io).

## License

This project keeps the original license: Mozilla Public License 2.0. See [LICENSE](LICENSE).
