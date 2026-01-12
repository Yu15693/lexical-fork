/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * 【学习重点】MentionNode.ts - 自定义 TextNode 示例
 *
 * 这是一个典型的 TextNode 扩展示例，展示了如何创建 @提及 功能。
 *
 * 继承 TextNode 的场景：
 * - 需要特殊样式的文本（如 @提及、#话题）
 * - 需要存储额外数据的文本
 * - 需要特殊行为的文本（如不可分割、不可编辑）
 *
 * 实现要点：
 * 1. 继承 TextNode 而不是 LexicalNode
 * 2. 添加自定义属性 __mention 存储提及的用户名
 * 3. 重写 createDOM() 添加自定义样式
 * 4. 实现 importDOM/exportDOM 支持 HTML 复制粘贴
 * 5. 实现 importJSON/exportJSON 支持序列化
 * 6. 设置 isTextEntity() 返回 true 表示这是一个文本实体
 * 7. 设置 canInsertTextBefore/After() 返回 false 防止在节点内插入文本
 *
 * 配合 MentionsPlugin 使用，实现完整的 @提及 功能
 */

import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
  TextNode,
} from 'lexical';

/** 序列化的 MentionNode 类型定义 */
export type SerializedMentionNode = Spread<
  {
    mentionName: string;
  },
  SerializedTextNode
>;

/**
 * DOM 转换函数 - 将 HTML 元素转换为 MentionNode
 * 用于从 HTML 粘贴时识别和转换提及元素
 */
function $convertMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const mentionName = domNode.getAttribute('data-lexical-mention-name');

  if (textContent !== null) {
    const node = $createMentionNode(
      typeof mentionName === 'string' ? mentionName : textContent,
      textContent,
    );
    return {
      node,
    };
  }

  return null;
}

/** 提及节点的默认样式 */
const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';

/**
 * MentionNode - @提及节点
 *
 * 继承自 TextNode，添加了 __mention 属性存储被提及的用户名
 */
export class MentionNode extends TextNode {
  __mention: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    return $createMentionNode(serializedNode.mentionName).updateFromJSON(
      serializedNode,
    );
  }

  constructor(mentionName: string, text?: string, key?: NodeKey) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = 'mention';
    dom.spellcheck = false;

    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    if (this.__text !== this.__mention) {
      element.setAttribute('data-lexical-mention-name', this.__mention);
    }
    element.textContent = this.__text;
    return {element};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: $convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(
  mentionName: string,
  textContent?: string,
): MentionNode {
  const mentionNode = new MentionNode(mentionName, (textContent = mentionName));
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}
