import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import path from 'path';

function CustomHmr() {
  return {
    name: 'custom-hmr',
    enforce: 'post',
    // HMR
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.json')) {
        console.log('reloading json file...');

        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
      }
    },
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default defineConfig((...args) => {
  const rootPath = '../';

  const config = {
    plugins: [
      react(),
      tsconfigPaths({
        projects: [rootPath + 'tsconfig.vite.json'],
      }),
      CustomHmr(),
    ],
    root: '.',
    base: '/dnd-encounters/',
    publicDir: rootPath + 'public',
    build: {
      outDir: rootPath + 'dist',
      assetsDir: 'release',
      cssCodeSplit: false,
    },
    chokidarWatchOptions: {
      usePolling: true,
    },
    server: {
      port: '3005',
      host: '0.0.0.0',
      watch: {
        usePolling: true,
      },
      // open: '/',
      // proxy: {
      //   '^/api/.*': 'http://localhost:3006/',
      //   '^/res/.*': 'http://localhost:3006/',
      //   '^/socket.io/.*': 'http://localhost:3006/',
      //   '/ws': {
      //     target: 'ws://localhost:3006',
      //     changeOrigin: true,
      //     ws: true,
      //   },
      // },
    },
  };
  return config;
});
