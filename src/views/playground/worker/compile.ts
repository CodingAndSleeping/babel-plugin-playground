import { transform } from '@babel/standalone';

import { serializeArg } from '@/utils/index';

type consoleType = 'log' | 'warn' | 'error' | 'info' | 'debug';

const consoleProxy = new Proxy(console, {
  get(target, prop: consoleType) {
    if (['log', 'warn', 'error', 'info', 'debug'].includes(prop)) {
      return (...args: any[]) => {
        Reflect.get(target, prop)(...args);
        self.postMessage({
          type: 'CONSOLE',
          result: args.map((arg) => serializeArg(arg)),
        });
      };
    }
    return Reflect.get(target, prop);
  },
});

// 替换全局 console（注意：某些环境可能不允许）
globalThis.console = consoleProxy;

const compile = async (sourceCode: string, pluginCode: string) => {
  const pluginCodeJs = transform(pluginCode, {
    presets: ['typescript'],
    filename: 'source.tsx',
  });

  const url = URL.createObjectURL(
    new Blob([pluginCodeJs.code || ''], { type: 'application/javascript' }),
  );

  const result = await import(url);

  const { code } = transform(sourceCode, {
    presets: ['react', 'typescript'],
    filename: 'source.tsx',
    plugins: [result.default],
  });

  return code;
};

type ReciveMessage = {
  type: 'CODE';
  sourceCode: string;
  pluginCode: string;
};

self.addEventListener('message', async (e: MessageEvent<ReciveMessage>) => {
  const { type, sourceCode, pluginCode } = e.data;
  if (type === 'CODE') {
    try {
      const result = await compile(sourceCode, pluginCode);
      if (result) {
        self.postMessage({ type: 'CODE', result });
      }
    } catch (error) {
      const { message, stack } = error as Error;
      self.postMessage({ type: 'ERROR', result: message + '\n' + stack });
    }
  }
});
