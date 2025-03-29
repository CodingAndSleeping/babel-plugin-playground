import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate';
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
export const safeSerialize = (arg: any): any => {
  // 1. 处理基本类型（直接返回）
  if (arg === null || typeof arg !== 'object') {
    return arg; // 保留 boolean/number/string/undefined 等原始类型
  }

  // 1. 处理函数类型（直接返回函数体字符串）
  if (typeof arg === 'function') {
    return arg.toString(); // 特殊标记函数
  }

  // 2. 处理不可序列化的特殊对象
  if (
    arg instanceof Promise ||
    arg instanceof WeakMap ||
    arg instanceof WeakSet
  ) {
    return arg.constructor.name; // 标记类型
  }

  // 3. 尝试结构化克隆（自动处理Date/Map/Set等）
  try {
    return structuredClone(arg);
  } catch (error) {
    // 4. 回退到JSON序列化（处理普通对象/数组）
    try {
      return JSON.parse(
        JSON.stringify(arg, (_, value) => {
          if (typeof value === 'function') {
            return value.toString(); // 嵌套函数处理
          }
          return value;
        }),
      );
    } catch {
      // 5. 终极回退：返回类型字符串
      return String(arg);
    }
  }
};
