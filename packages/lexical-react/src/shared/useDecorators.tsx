/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {LexicalEditor, NodeKey} from 'lexical';
import type {JSX} from 'react';

import {Suspense, useEffect, useMemo, useState} from 'react';
import * as React from 'react';
import {createPortal, flushSync} from 'react-dom';
import useLayoutEffect from 'shared/useLayoutEffect';

type ErrorBoundaryProps = {
  children: JSX.Element;
  onError: (error: Error) => void;
};

export type ErrorBoundaryType =
  | React.ComponentClass<ErrorBoundaryProps>
  | React.FC<ErrorBoundaryProps>;

export function useDecorators(
  editor: LexicalEditor,
  ErrorBoundary: ErrorBoundaryType,
): Array<JSX.Element> {
  const [decorators, setDecorators] = useState<Record<NodeKey, JSX.Element>>(
    () => editor.getDecorators<JSX.Element>(),
  );

  // Subscribe to changes
  useLayoutEffect(() => {
    return editor.registerDecoratorListener<JSX.Element>((nextDecorators) => {
      // 确保状态同步更新
      // 确保在下次绘制前状态已更新
      flushSync(() => {
        setDecorators(nextDecorators);
      });
    });
  }, [editor]);

  useEffect(() => {
    // If the content editable mounts before the subscription is added, then
    // nothing will be rendered on initial pass. We can get around that by
    // ensuring that we set the value.
    setDecorators(editor.getDecorators());
  }, [editor]);

  // Return decorators defined as React Portals
  return useMemo(() => {
    const decoratedPortals = [];
    const decoratorKeys = Object.keys(decorators);

    for (let i = 0; i < decoratorKeys.length; i++) {
      const nodeKey = decoratorKeys[i];
      // 渲染元素，来自 DecoratorNode.decorate
      // 支持异步组件加载、错误处理
      const reactDecorator = (
        <ErrorBoundary onError={(e) => editor._onError(e)}>
          <Suspense fallback={null}>{decorators[nodeKey]}</Suspense>
        </ErrorBoundary>
      );
      // 占位符元素，来自 DecoratorNode.createDOM
      const element = editor.getElementByKey(nodeKey);

      if (element !== null) {
        // 将渲染元素渲染到占位符元素中，连接 React 组件系统与 Lexical DOM 系统
        // 使用 createPortal 的好处：
        // 1. 架构分离：React 组件与 Lexical DOM 解耦
        // 2. 功能完整：保持 React 生态（Hooks、Context、错误边界等）
        // 3. 性能优化：渲染隔离，避免不必要的更新
        // 4. 开发体验：使用熟悉的 React 模式，易于调试
        // 5. 扩展性：支持复杂 UI 组件，易于添加新装饰器
        decoratedPortals.push(createPortal(reactDecorator, element, nodeKey));
      }
    }

    return decoratedPortals;
  }, [ErrorBoundary, decorators, editor]);
}
