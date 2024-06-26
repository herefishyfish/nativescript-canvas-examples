import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.app',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc --allow-natives-syntax --turbo-fast-api-calls',
    // v8Flags: '--expose_gc',
    markingMode: 'none',
  },
} as NativeScriptConfig;
