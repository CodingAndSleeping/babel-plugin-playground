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
