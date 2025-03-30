import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate';

// import { VISITOR_KEYS } from '@babel/types';

// import Babel from '@babel/core';

import { packages } from '@babel/standalone';

/**
 * 压缩字符串
 * @param data 原始数据
 * @returns
 */
export function compress(data: string) {
  if (!data) return;
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const str = strFromU8(zipped, true);
  return btoa(str);
}

/**
 *  解压字符串
 * @param base64 压缩后的base64字符串
 * @returns
 */
export function uncompress(base64: string) {
  if (!base64) return;
  const binary = atob(base64);

  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
}

/**
 * 安全序列化方法（发送端使用）
 * @param arg
 * @returns
 */
export const serializeArg = (arg: any): any => {
  // 0. 处理 undefined（JSON.stringify 会丢弃它）
  if (arg === undefined) return '[undefined]';

  // 1. 处理基本类型
  if (arg === null || typeof arg !== 'object') {
    return arg;
  }

  // 2. 处理 Babel AST 节点（关键修复！）
  // 动态引入 Babel 类型检测

  if (arg?.type && arg.type in packages.types.VISITOR_KEYS) {
    return safeSerializePath(arg);
  }

  // 3. 处理函数
  if (typeof arg === 'function') {
    return `Function<${arg.name || 'anonymous'}>`;
  }

  // 4. 处理不可序列化对象
  if (
    arg instanceof Promise ||
    arg instanceof WeakMap ||
    arg instanceof WeakSet
  ) {
    return `${arg.constructor.name}`;
  }

  // 5. 处理循环引用
  const cache = new WeakSet();
  return JSON.parse(
    JSON.stringify(arg, (_, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) return '[Circular]';
        cache.add(value);
      }
      return value;
    }),
  );
};

// 辅助函数
const safeSerializePath = (path: any): any => {
  if (!path || typeof path !== 'object') return path;

  // 1. 基础属性处理
  const serialized: Record<string, any> = {
    __type: 'BabelPath',
    nodeType: path.node?.type,
    type: path.type,
    key: path.key,
    listKey: path.listKey,
    parentKey: tryCall(() => path.parentKey),
    container: safeSerialize(path.container),
    node: safeSerialize(path.node),
    parent: safeSerialize(path.parent),
    parentPath: '[Circular]', // 避免循环引用
    scope: safeSerializeScope(path.scope),
    hub: '[BabelHub]', // 通常不需要序列化整个 hub
    opts: safeSerialize(path.opts),
    _traverseFlags: path._traverseFlags,
  };

  // 2. 动态获取方法状态
  const methods = {
    inList: tryCall(() => path.inList),
    removed: tryCall(() => path.removed),
    shouldSkip: tryCall(() => path.shouldSkip),
    shouldStop: tryCall(() => path.shouldStop),
  };

  return { ...serialized, ...methods };
};

// 安全序列化 Scope（简化版）
function safeSerializeScope(scope: any) {
  if (!scope) return null;
  return {
    uid: scope.uid,
    block: scope.block?.type,
    bindings: Object.keys(scope.bindings || {}),
  };
}

// 安全执行 getter 方法
function tryCall(fn: () => any) {
  try {
    const result = fn();
    return typeof result === 'function' ? '[Function]' : result;
  } catch {
    return '[ErrorAccess]';
  }
}

// 通用安全序列化（处理循环引用）
function safeSerialize(obj: any, cache = new WeakSet()): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (cache.has(obj)) return '[Circular]';
  cache.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeArg(item));
  }

  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    try {
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      if (desc) {
        result[key] = desc.get ? '[Getter]' : serializeArg(desc.value);
      }
    } catch {
      result[key] = '[Inaccessible]';
    }
  });
  return result;
}
