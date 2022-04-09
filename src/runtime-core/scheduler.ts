const quenes: any[] = [];
const p = Promise.resolve();
// 避免重复执行
let isFlushPending = false;

export function nextTicket(fn) {
  return fn ? p.then(fn) : p;
}

export function queneJob(job) {
  if (!quenes.includes(job)) {
    quenes.push(job);
  }
  queneFlash();
}

function queneFlash() {
  if (!isFlushPending) {
    isFlushPending = true;
    nextTicket(flushJobs);
  }
}

function flushJobs() {
  let job;
  isFlushPending = false;
  while ((job = quenes.shift())) {
    nextTicket(job);
  }
}
