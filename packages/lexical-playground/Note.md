# Lexical Playground 学习笔记

> 这是 Lexical 官方提供的完整富文本编辑器示例，展示了框架的各种功能和最佳实践。

## 📁 目录结构

```
lexical-playground/
├── src/
│   ├── index.tsx              # 应用入口
│   ├── App.tsx                # 🔥 根组件，编辑器配置
│   ├── Editor.tsx             # 🔥 主编辑器组件，插件组合
│   ├── Settings.tsx           # 设置面板组件
│   ├── appSettings.ts         # 应用设置
│   ├── collaboration.ts       # 协作功能配置
│   │
│   ├── nodes/                 # 🔥 自定义节点
│   │   ├── PlaygroundNodes.ts # 节点注册表
│   │   ├── ImageNode.tsx      # 图片节点 (DecoratorNode)
│   │   ├── MentionNode.ts     # @提及节点 (TextNode)
│   │   ├── EmojiNode.tsx      # 表情节点
│   │   ├── PollNode.tsx       # 投票节点
│   │   ├── StickyNode.tsx     # 便签节点
│   │   ├── EquationNode.tsx   # 数学公式节点
│   │   ├── TweetNode.tsx      # Twitter 嵌入
│   │   ├── YouTubeNode.tsx    # YouTube 嵌入
│   │   ├── FigmaNode.tsx      # Figma 嵌入
│   │   └── ...
│   │
│   ├── plugins/               # 🔥 自定义插件
│   │   ├── ToolbarPlugin/     # 工具栏插件
│   │   ├── MentionsPlugin/    # @提及插件
│   │   ├── ImagesPlugin/      # 图片插件
│   │   ├── TablePlugin.tsx    # 表格插件
│   │   ├── CollapsiblePlugin/ # 折叠面板插件
│   │   ├── CommentPlugin/     # 评论插件
│   │   ├── FloatingLinkEditorPlugin/  # 浮动链接编辑器
│   │   ├── DraggableBlockPlugin/      # 可拖拽块
│   │   └── ...
│   │
│   ├── themes/                # 🔥 主题配置
│   │   ├── PlaygroundEditorTheme.ts   # 主题对象
│   │   └── PlaygroundEditorTheme.css  # 主题样式
│   │
│   ├── ui/                    # UI 组件
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── DropDown.tsx
│   │   ├── ColorPicker.tsx
│   │   └── ...
│   │
│   ├── context/               # React Context
│   │   ├── SettingsContext.tsx      # 设置状态
│   │   ├── SharedHistoryContext.tsx # 历史记录共享
│   │   ├── ToolbarContext.tsx       # 工具栏状态
│   │   └── FlashMessageContext.tsx  # 消息提示
│   │
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useModal.tsx
│   │   └── useFlashMessage.tsx
│   │
│   ├── utils/                 # 工具函数
│   │   ├── getSelectedNode.ts
│   │   └── url.ts
│   │
│   └── images/                # 静态图片资源
│
├── __tests__/                 # 测试文件
│   ├── e2e/                   # 端到端测试
│   ├── unit/                  # 单元测试
│   └── utils/                 # 测试工具
│
├── index.html                 # HTML 入口
├── vite.config.ts             # Vite 配置
└── package.json
```

---

## 🎯 重点学习文件

### 第一优先级：核心架构

| 文件 | 说明 | 学习要点 |
|------|------|----------|
| `App.tsx` | 应用根组件 | Context 组织、编辑器配置、预填充内容 |
| `Editor.tsx` | 主编辑器组件 | 插件组合、条件渲染、状态管理 |
| `nodes/PlaygroundNodes.ts` | 节点注册表 | 节点类型汇总、注册方式 |
| `themes/PlaygroundEditorTheme.ts` | 主题配置 | 主题结构、CSS 类名映射 |

### 第二优先级：自定义节点

| 文件 | 类型 | 学习要点 |
|------|------|----------|
| `nodes/ImageNode.tsx` | DecoratorNode | 装饰器节点、React 组件渲染、嵌套编辑器 |
| `nodes/MentionNode.ts` | TextNode | 文本节点扩展、特殊样式、不可分割文本 |
| `nodes/PollNode.tsx` | DecoratorNode | 交互式组件、状态管理 |
| `nodes/YouTubeNode.tsx` | DecoratorNode | 外部嵌入、iframe 处理 |

### 第三优先级：插件开发

| 文件 | 功能 | 学习要点 |
|------|------|----------|
| `plugins/ToolbarPlugin/` | 工具栏 | 选区监听、格式化命令、状态同步 |
| `plugins/MentionsPlugin/` | @提及 | Typeahead 模式、触发匹配、候选列表 |
| `plugins/ImagesPlugin/` | 图片 | 自定义命令、拖拽处理、文件上传 |
| `plugins/FloatingLinkEditorPlugin/` | 链接编辑 | 浮动 UI、位置计算 |
| `plugins/DraggableBlockPlugin/` | 拖拽块 | 拖拽排序、DOM 操作 |

---

## 🔧 功能模块详解

### 1. 节点类型 (nodes/)

Playground 展示了多种自定义节点的实现方式：

#### DecoratorNode 示例
用于渲染复杂的 React 组件：

```typescript
// ImageNode.tsx - 图片节点
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  
  static getType(): string {
    return 'image';
  }
  
  createDOM(): HTMLElement {
    return document.createElement('div');
  }
  
  decorate(): JSX.Element {
    return <ImageComponent src={this.__src} />;
  }
}
```

#### TextNode 扩展示例
用于特殊样式的文本：

```typescript
// MentionNode.ts - @提及节点
export class MentionNode extends TextNode {
  __mention: string;
  
  static getType(): string {
    return 'mention';
  }
  
  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.className = 'mention';
    return dom;
  }
  
  isTextEntity(): true {
    return true;
  }
}
```

### 2. 插件模式 (plugins/)

Playground 展示了多种插件模式：

#### 命令处理插件
```typescript
// ImagesPlugin - 处理图片插入命令
function ImagesPlugin(): null {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  
  return null;
}
```

#### Typeahead 插件
```typescript
// MentionsPlugin - @提及自动补全
function MentionsPlugin(): JSX.Element {
  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(anchorElement, ...) => (
        <MentionsMenu ... />
      )}
    />
  );
}
```

#### 工具栏插件
```typescript
// ToolbarPlugin - 监听选区并更新状态
function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);
  
  return (
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
      Bold
    </button>
  );
}
```

### 3. 主题系统 (themes/)

主题配置将 CSS 类名映射到节点类型：

```typescript
const theme: EditorThemeClasses = {
  // 文本格式
  text: {
    bold: 'PlaygroundEditorTheme__textBold',
    italic: 'PlaygroundEditorTheme__textItalic',
    underline: 'PlaygroundEditorTheme__textUnderline',
  },
  // 块级元素
  paragraph: 'PlaygroundEditorTheme__paragraph',
  heading: {
    h1: 'PlaygroundEditorTheme__h1',
    h2: 'PlaygroundEditorTheme__h2',
  },
  // 列表
  list: {
    ul: 'PlaygroundEditorTheme__ul',
    ol: 'PlaygroundEditorTheme__ol',
    listitem: 'PlaygroundEditorTheme__listItem',
  },
};
```

### 4. Context 管理 (context/)

Playground 使用多个 Context 管理状态：

```typescript
// 组件层级
<SettingsContext>           // 全局设置
  <FlashMessageContext>     // 消息提示
    <LexicalComposer>       // 编辑器
      <SharedHistoryContext>  // 历史记录
        <TableContext>        // 表格状态
          <ToolbarContext>    // 工具栏状态
            <Editor />
          </ToolbarContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  </FlashMessageContext>
</SettingsContext>
```

---

## 📝 插件清单

### 核心插件（来自 @lexical/react）
| 插件 | 功能 |
|------|------|
| RichTextPlugin | 富文本编辑支持 |
| PlainTextPlugin | 纯文本编辑支持 |
| HistoryPlugin | 撤销/重做 |
| ListPlugin | 列表支持 |
| CheckListPlugin | 待办列表 |
| TablePlugin | 表格支持 |
| LinkPlugin | 链接支持 |
| AutoFocusPlugin | 自动聚焦 |
| MarkdownShortcutPlugin | Markdown 快捷键 |

### Playground 自定义插件
| 插件 | 功能 | 学习价值 |
|------|------|----------|
| ToolbarPlugin | 工具栏 | ⭐⭐⭐ 选区监听、命令分发 |
| MentionsPlugin | @提及 | ⭐⭐⭐ Typeahead 模式 |
| ImagesPlugin | 图片 | ⭐⭐⭐ 自定义命令、拖拽 |
| FloatingLinkEditorPlugin | 链接编辑 | ⭐⭐ 浮动 UI |
| DraggableBlockPlugin | 拖拽块 | ⭐⭐ 拖拽排序 |
| CollapsiblePlugin | 折叠面板 | ⭐⭐ 复合节点 |
| CommentPlugin | 评论 | ⭐⭐ 标记系统 |
| CodeHighlightPlugin | 代码高亮 | ⭐ 语法高亮 |
| AutoEmbedPlugin | 自动嵌入 | ⭐ URL 识别 |
| EmojiPickerPlugin | 表情选择 | ⭐ 弹出菜单 |

---

## 🚀 学习建议

### 入门路径

1. **理解整体架构**
   - 阅读 `App.tsx` 了解编辑器配置
   - 阅读 `Editor.tsx` 了解插件组合

2. **学习节点系统**
   - 从 `MentionNode.ts` 开始（简单的 TextNode 扩展）
   - 然后学习 `ImageNode.tsx`（DecoratorNode 示例）

3. **学习插件开发**
   - 从简单插件开始（如 `KeywordsPlugin`）
   - 然后学习 `MentionsPlugin`（Typeahead 模式）
   - 最后学习 `ToolbarPlugin`（复杂状态管理）

4. **学习主题定制**
   - 阅读 `PlaygroundEditorTheme.ts`
   - 修改 `PlaygroundEditorTheme.css` 实践

### 实践项目

1. **添加新的文本格式**
   - 如：添加"标记"格式

2. **创建简单的自定义节点**
   - 如：创建一个"分隔符"节点

3. **创建 Typeahead 插件**
   - 如：创建 #话题 插件

4. **创建工具栏按钮**
   - 如：添加"插入日期"按钮

---

## 🔗 相关资源

- [Lexical 官方文档](https://lexical.dev/)
- [Lexical Playground 在线版](https://playground.lexical.dev/)
- [Lexical GitHub](https://github.com/facebook/lexical)

---

## 📌 注意事项

1. **插件顺序**：某些插件有依赖关系，注意加载顺序
2. **节点注册**：使用的节点必须在 `nodes` 配置中注册
3. **命令优先级**：合理设置命令优先级避免冲突
4. **性能优化**：大量节点时注意使用 `editor.update()` 批量更新
5. **调试技巧**：使用 TreeViewPlugin 查看节点树结构

---

*本文档基于 Playground 源码分析，如有更新请参考最新代码。*
