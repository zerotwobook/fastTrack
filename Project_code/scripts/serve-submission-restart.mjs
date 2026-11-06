import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { requireTestDatabase } from '../server/dist/db/test-database.js';
import { createApp } from '../server/dist/app.js';
import { loadConfig } from '../server/dist/config.js';
import { prisma } from '../server/dist/db/client.js';
import { createApplicationRouters } from '../server/dist/modules/index.js';

// Internal restart proof only: validate the reserved target before exposing the app.
requireTestDatabase({ NODE_ENV: process.env.NODE_ENV, DATABASE_URL: process.env.RESTART_PROTECTED_DATABASE_URL,
  TEST_DATABASE_URL: process.env.DATABASE_URL });
const server = createServer();
await new Promise((resolve,reject) => {server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const origin = `http://127.0.0.1:${server.address().port}`;
const config = loadConfig({ ...process.env, NODE_ENV: 'test', APP_ORIGIN: origin });
server.on('request',createApp(config,{logger:()=>undefined,routers:createApplicationRouters({prisma,config}),
  clientDirectory:fileURLToPath(new URL('../client/dist/',import.meta.url))}));
process.send?.({type:'ready',url:origin});
let stopping=false;
const stop=() => {
  if(stopping)return;
  stopping=true;
  server.close(() => {void prisma.$disconnect().finally(() => {process.disconnect?.();process.exitCode=0;});});
  setTimeout(()=>process.exit(1),5000).unref();
};
process.on('message',message=>{if(message==='stop')stop();});
process.once('SIGINT',stop);process.once('SIGTERM',stop);
