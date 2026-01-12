# Lexical 框架学习笔记

> 本文档是对 lexical-fork 仓库的学习指南，帮助你快速理解 Lexical 框架的架构和核心概念。

## 📁 仓库结构概览

```
lexical-fork/
├── packages/
│   ├── lexical/                    # 🔥 核心包 - 最重要
│   ├── lexical-react/              # 🔥 React 绑定 - 必学
│   ├── lexical-playground/         # 🔥 完整示例 - 参考学习
│   ├── lexical-clipboard/          # 剪贴板功能
│   ├── lexical-code/               # 代码块支持
│   ├── lexical-history/            # 撤销/重做
│   ├── lexical-html/               # HTML 导入导出
│   ├── lexical-link/               # 链接节点
│   ├── lexical-list/               # 列表节点
│   ├── lexical-markdown/           # Markdown 支持
│   ├── lexical-rich-text/          # 富文本支持
│   ├── lexical-selection/          # 选区工具
│   ├── lexical-table/              # 表格支持
│   ├── lexical-text/               # 文本工具
│   ├── lexical-utils/              # 通用工具
│   └── ...
├── examples/                       # 各种使用示例
└── scripts/                        # 构建脚本
```

## 🎯 学习路径建议

### 第一阶段：理解核心概念

1. **阅读核心包源码** (`packages/lexical/src/`)
   - `LexicalEditor.ts` - 编辑器主类
   - `LexicalNode.ts` - 节点基类
   - `LexicalUpdates.ts` - 更新机制
   - `LexicalReconciler.ts` - DOM 协调

2. **理解节点系统** (`packages/lexical/src/nodes/`)
   - `LexicalElementNode.ts` - 容器节点基类
   - `LexicalTextNode.ts` - 文本节点
   - `LexicalDecoratorNode.ts` - 装饰器节点

### 第二阶段：学习 React 集成

3. **React 绑定** (`packages/lexical-react/src/`)
   - `LexicalComposer.tsx` - 入口组件
   - `LexicalComposerContext.ts` - Context 管理
   - 各种插件组件

### 第三阶段：实践应用

4. **Playground 示例** (`packages/lexical-playground/src/`)
   - `Editor.tsx` - 完整编辑器示例
   - `nodes/` - 自定义节点示例
   - `plugins/` - 自定义插件示例

---

## 🔑 核心概念详解

### 1. LexicalEditor（编辑器）

编辑器是 Lexical 的核心，负责：
- 管理编辑器状态 (EditorState)
- 处理 DOM 绑定
- 协调更新
- 事件处理
- 命令系统

```typescript
// 创建编辑器
const editor = createEditor({
  namespace: 'MyEditor',
  theme: myTheme,
  nodes: [HeadingNode, ListNode, ...],
  onError: (error) => console.error(error),
});

// 更新编辑器状态
editor.update(() => {
  const root = $getRoot();
  const paragraph = $createParagraphNode();
  const text = $createTextNode('Hello World');
  paragraph.append(text);
  root.append(paragraph);
});
```

**重要文件**: `packages/lexical/src/LexicalEditor.ts`

### 2. EditorState（编辑器状态）

EditorState 是不可变的数据结构，包含：
- 节点树 (NodeMap)
- 选区状态 (Selection)

```typescript
// 读取状态
editor.getEditorState().read(() => {
  const root = $getRoot();
  const text = root.getTextContent();
});

// 序列化状态
const json = editor.getEditorState().toJSON();

// 恢复状态
const state = editor.parseEditorState(json);
editor.setEditorState(state);
```

**重要文件**: `packages/lexical/src/LexicalEditorState.ts`

### 3. LexicalNode（节点）

所有内容都由节点组成。节点类型继承关系：

```
LexicalNode
├── ElementNode (容器节点)
│   ├── RootNode (根节点)
│   ├── ParagraphNode (段落)
│   ├── HeadingNode (标题)
│   ├── ListNode (列表)
│   └── ...
├── TextNode (文本节点)
│   ├── HashtagNode
│   ├── MentionNode
│   └── ...
├── LineBreakNode (换行)
├── TabNode (制表符)
└── DecoratorNode (装饰器节点)
    ├── ImageNode
    ├── VideoNode
    └── ...
```

**重要文件**: 
- `packages/lexical/src/LexicalNode.ts`
- `packages/lexical/src/nodes/LexicalElementNode.ts`
- `packages/lexical/src/nodes/LexicalTextNode.ts`

### 4. Selection（选区）

Lexical 支持三种选区类型：
- **RangeSelection**: 文本范围选区
- **NodeSelection**: 节点选区（用于选中图片等）
- **GridSelection**: 表格单元格选区

```typescript
editor.update(() => {
  const selection = $getSelection();
  
  if ($isRangeSelection(selection)) {
    // 处理文本选区
    selection.formatText('bold');
  }
  
  if ($isNodeSelection(selection)) {
    // 处理节点选区
    const nodes = selection.getNodes();
  }
});
```

**重要文件**: `packages/lexical/src/LexicalSelection.ts`

### 5. Commands（命令）

命令系统提供可扩展的操作机制：

```typescript
// 注册命令监听器
editor.registerCommand(
  FORMAT_TEXT_COMMAND,
  (payload) => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.formatText(payload);
    }
    return true; // 返回 true 表示已处理
  },
  COMMAND_PRIORITY_EDITOR
);

// 分发命令
editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
```

### 6. Transforms（转换）

Transform 在节点变化时自动执行：

```typescript
editor.registerNodeTransform(TextNode, (node) => {
  // 自动将 URL 转换为链接
  const text = node.getTextContent();
  if (isUrl(text)) {
    const link = $createLinkNode(text);
    node.replace(link);
  }
});
```

---

## 📝 创建自定义节点

### ElementNode 示例

```typescript
class CalloutNode extends ElementNode {
  __type: 'info' | 'warning' | 'error';

  static getType(): string {
    return 'callout';
  }

  static clone(node: CalloutNode): CalloutNode {
    return new CalloutNode(node.__type, node.__key);
  }

  constructor(type: 'info' | 'warning' | 'error', key?: NodeKey) {
    super(key);
    this.__type = type;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('div');
    dom.className = `callout callout-${this.__type}`;
    return dom;
  }

  updateDOM(prevNode: CalloutNode, dom: HTMLElement): boolean {
    if (prevNode.__type !== this.__type) {
      dom.className = `callout callout-${this.__type}`;
    }
    return false;
  }

  static importJSON(json: SerializedCalloutNode): CalloutNode {
    return new CalloutNode(json.calloutType);
  }

  exportJSON(): SerializedCalloutNode {
    return {
      ...super.exportJSON(),
      type: 'callout',
      calloutType: this.__type,
    };
  }
}
```

### DecoratorNode 示例

```typescript
class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__key);
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <VideoPlayer src={this.__src} />;
  }
}
```

**参考示例**: `packages/lexical-playground/src/nodes/ImageNode.tsx`

---

## 🔌 创建自定义插件

```typescript
function MyPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // 注册命令监听器
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        // 处理回车键
        return false; // 返回 false 让其他处理器继续处理
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  useEffect(() => {
    // 注册更新监听器
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // 读取状态
      });
    });
  }, [editor]);

  return null;
}
```

**参考示例**: `packages/lexical-playground/src/plugins/`

---

## 🔄 更新机制详解

Lexical 的更新流程：

```
editor.update(() => { ... })
         ↓
    克隆 EditorState
         ↓
    执行更新回调
         ↓
    运行 Transforms
         ↓
    规范化文本节点
         ↓
    垃圾回收
         ↓
    DOM 协调 ($reconcileRoot)
         ↓
    更新 DOM 选区
         ↓
    触发监听器
```

**重要文件**: 
- `packages/lexical/src/LexicalUpdates.ts`
- `packages/lexical/src/LexicalReconciler.ts`

---

## 📚 重点学习文件清单

### 必读文件（按优先级排序）

1. **`packages/lexical/src/LexicalEditor.ts`**
   - `createEditor()` - 创建编辑器
   - `LexicalEditor` 类 - 编辑器核心

2. **`packages/lexical/src/LexicalNode.ts`**
   - `LexicalNode` 类 - 节点基类
   - `getLatest()` / `getWritable()` - 不可变数据操作

3. **`packages/lexical/src/nodes/LexicalElementNode.ts`**
   - `ElementNode` 类 - 容器节点

4. **`packages/lexical/src/nodes/LexicalTextNode.ts`**
   - `TextNode` 类 - 文本节点

5. **`packages/lexical/src/LexicalUpdates.ts`**
   - `updateEditor()` - 更新入口
   - `$commitPendingUpdates()` - 提交更新

6. **`packages/lexical/src/LexicalReconciler.ts`**
   - `$reconcileRoot()` - DOM 协调

7. **`packages/lexical-react/src/LexicalComposer.tsx`**
   - `LexicalComposer` - React 入口组件

8. **`packages/lexical-playground/src/Editor.tsx`**
   - 完整编辑器示例

### 推荐阅读顺序

```
LexicalEditor.ts → LexicalNode.ts → LexicalElementNode.ts 
→ LexicalTextNode.ts → LexicalUpdates.ts → LexicalReconciler.ts
→ LexicalComposer.tsx → Editor.tsx (playground)
```

---

## 💡 常见模式

### $ 前缀函数

以 `$` 开头的函数只能在 `editor.update()` 或 `editor.read()` 回调中使用：

```typescript
// ✅ 正确
editor.update(() => {
  const root = $getRoot();
  const selection = $getSelection();
});

// ❌ 错误
const root = $getRoot(); // 会抛出错误
```

### 不可变数据

节点是不可变的，修改需要获取可写版本：

```typescript
editor.update(() => {
  const node = $getNodeByKey(key);
  
  // ❌ 错误 - 直接修改
  node.__text = 'new text';
  
  // ✅ 正确 - 获取可写版本
  const writable = node.getWritable();
  writable.__text = 'new text';
});
```

### 节点遍历

```typescript
editor.update(() => {
  const root = $getRoot();
  
  // 遍历所有子节点
  root.getChildren().forEach(child => {
    if ($isTextNode(child)) {
      // 处理文本节点
    }
    if ($isElementNode(child)) {
      // 递归处理元素节点
    }
  });
});
```

---

## 🔗 相关资源

- [Lexical 官方文档](https://lexical.dev/)
- [Lexical GitHub](https://github.com/facebook/lexical)
- [Lexical Playground](https://playground.lexical.dev/)

---

## 📌 注意事项

1. **版本兼容性**: 本仓库基于特定版本的 Lexical，API 可能与最新版本有差异
2. **实验性功能**: 部分功能（如 NodeState）仍处于实验阶段
3. **性能考虑**: 大量节点操作时注意使用批量更新
4. **调试技巧**: 使用 TreeViewPlugin 可视化节点树结构

---

*本文档由学习笔记自动生成，如有问题请参考源码注释。*
