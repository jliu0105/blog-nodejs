const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log('first layer start')
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('first layer end')
});

// x-response-time
app.use(async (ctx, next) => {
  console.log('second layer start')
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('second layer end')
});

// response
app.use(async ctx => {
  console.log('third layer start')
  ctx.body = 'Hello World';
  console.log('third layer end')
});

app.listen(8000);