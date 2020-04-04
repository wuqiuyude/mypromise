function Promise(fn) {
  const self = this;
  self.status = "pending"; // 用户标识promise的三种状态
  self.value = undefined;
  self.onFulfilledQueue = []
  self.onRejectedQueue = []
  function resolve(value) {
    if (self.status === "pending") {
      self.status = "fulfilled";
      self.value = value;
      self.onFulfilledQueue.forEach(function(fulfilledCallback) {
        fulfilledCallback();
      });
      // return new Promise(self.value);
    }
  }
  function reject(value) {
    if (self.status === "pending") {
      self.status = "rejected";
      self.reason = value;
      self.onRejectedQueue.forEach(function(rejectedCallback) {
        rejectedCallback();
      });
      // return new Promise(self.value);
    }
  }
  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  onFuifilled = typeof onFuifilled === 'function' ? onFuifilled : value => {return value;};
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};
  let promise2 = null;
  let self = this;
  promise2 = new Promise((resolve, reject) => {
    if(this.status === "pending") {
      if(onFulfilled) this.onFulfilledQueue.push(() => {
        try {
          let x = onFulfilled(self.value);
          self.resolvePromise(promise2, x, resolve, reject);
        } catch(reason) {
          reject(reason);
        }
      })
      if(onRejected) this.onFulfilledQueue.push(() => {
        try {
          let x = onRejected(self.reason);
          self.resolvePromise(promise2, x, resolve, reject);
        } catch(reason) {
          reject(reason);
        }
      })
    }
    if(this.status === 'fulfilled') {
      try {
        let x = onFulfilled(self.value);
        self.resolvePromise(promise2, x, resolve, reject);
      } catch(reason) {
        reject(reason);
      }
    }
    if(this.status === 'rejected') {
      try {
        let x = onRejected(self.reason);
        self.resolvePromise(promise2, x, resolve, reject);
      } catch(reason) {
        reject(reason);
      }
    }
  })
  return promise2
};

Promise.prototype.resolvePromise = function(promise2, value, resolve, reject) {
  let self = this;
  let called = false;
  if(promise2 === value) {
    return reject(new TypeError('循环引用'));
  }
  if(value !== null && (Object.prototype.toString.call(value) === '[Object, Object]' || typeof value === 'function')) {
    try {
      then = value.then
      if(typeof then === 'function') {
        then.call(x, (res) => {
          if(called) return
          called = true
          self.resolvePromise(promise2, res, resolve, reject)
        }, (res) => {
          if(called) return
          called = true
          reject(res)
        })
      } else {
        if (called) return ;
        called = true;
        resolve(x);
      }

    } catch(err){
      reject(err)
    }
  } else {
    resolve(value)
  }
}

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(222)
  }, 200)
})

console.log(promise)
promise.then(res => {
  console.log(111, res)
  return res
}).then(res => {
  return new Promise((resolve, reject) => {
    reject('has error2');
  });
}).catch(res =>{
  console.log(res)
})
