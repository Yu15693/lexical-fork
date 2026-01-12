/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * 【学习重点】PlaygroundNodes.ts - 节点注册表
 *
 * 这个文件定义了 Playground 编辑器支持的所有节点类型。
 * 在创建编辑器时，需要将所有要使用的节点类型注册到编辑器中。
 *
 * 节点分类：
 *
 * 1. 官方包提供的节点（@lexical/* 包）：
 *    - HeadingNode, QuoteNode: 富文本节点 (@lexical/rich-text)
 *    - ListNode, ListItemNode: 列表节点 (@lexical/list)
 *    - CodeNode, CodeHighlightNode: 代码块节点 (@lexical/code)
 *    - TableNode, TableCellNode, TableRowNode: 表格节点 (@lexical/table)
 *    - LinkNode, AutoLinkNode: 链接节点 (@lexical/link)
 *    - HashtagNode: 话题标签节点 (@lexical/hashtag)
 *    - MarkNode: 标记节点 (@lexical/mark)
 *    - OverflowNode: 溢出节点 (@lexical/overflow)
 *    - HorizontalRuleNode: 水平分割线 (@lexical/react)
 *
 * 2. Playground 自定义节点（./nodes/ 目录）：
 *    - ImageNode: 图片节点（DecoratorNode 示例）
 *    - MentionNode: @提及节点（TextNode 扩展示例）
 *    - EmojiNode: 表情节点
 *    - PollNode: 投票节点
 *    - StickyNode: 便签节点
 *    - EquationNode: 数学公式节点
 *    - ExcalidrawNode: 绘图节点
 *    - TweetNode, YouTubeNode, FigmaNode: 嵌入节点
 *    - CollapsibleContainerNode 等: 折叠面板节点
 *    - LayoutContainerNode, LayoutItemNode: 布局节点
 *    - PageBreakNode: 分页符节点
 *    - DateTimeNode: 日期时间节点
 *    - KeywordNode: 关键词节点
 *    - SpecialTextNode: 特殊文本节点
 *    - AutocompleteNode: 自动补全节点
 */

import type {Klass, LexicalNode} from 'lexical';

import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {HashtagNode} from '@lexical/hashtag';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {MarkNode} from '@lexical/mark';
import {OverflowNode} from '@lexical/overflow';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {TableCellNode, TableNode, TableRowNode} from '@lexical/table';

import {CollapsibleContainerNode} from '../plugins/CollapsiblePlugin/CollapsibleContainerNode';
import {CollapsibleContentNode} from '../plugins/CollapsiblePlugin/CollapsibleContentNode';
import {CollapsibleTitleNode} from '../plugins/CollapsiblePlugin/CollapsibleTitleNode';
import {AutocompleteNode} from './AutocompleteNode';
import {DateTimeNode} from './DateTimeNode/DateTimeNode';
import {EmojiNode} from './EmojiNode';
import {EquationNode} from './EquationNode';
import {ExcalidrawNode} from './ExcalidrawNode';
import {FigmaNode} from './FigmaNode';
import {ImageNode} from './ImageNode';
import {KeywordNode} from './KeywordNode';
import {LayoutContainerNode} from './LayoutContainerNode';
import {LayoutItemNode} from './LayoutItemNode';
import {MentionNode} from './MentionNode';
import {PageBreakNode} from './PageBreakNode';
import {PollNode} from './PollNode';
import {SpecialTextNode} from './SpecialTextNode';
import {StickyNode} from './StickyNode';
import {TweetNode} from './TweetNode';
import {YouTubeNode} from './YouTubeNode';

const PlaygroundNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  PollNode,
  StickyNode,
  ImageNode,
  MentionNode,
  EmojiNode,
  ExcalidrawNode,
  EquationNode,
  AutocompleteNode,
  KeywordNode,
  HorizontalRuleNode,
  TweetNode,
  YouTubeNode,
  FigmaNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  PageBreakNode,
  LayoutContainerNode,
  LayoutItemNode,
  SpecialTextNode,
  DateTimeNode,
];

export default PlaygroundNodes;
