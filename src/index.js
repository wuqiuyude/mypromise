function Promise(fn) {
  const self = this;
  self.status = "pending"; // 用户标识promise的三种状态
  self.value = undefined;
  function resolve(value) {
    if (self.status === "pending") {
      self.status = "resolved";
      self.value = value;
      return new Promise(self.data);
    }
  }
  function reject(value) {
    if (self.status === "pending") {
      self.status = "rejected";
      self.value = value;
      return new Promise(self.value);
    }
  }
  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

Promise.prototype.then = function() {};
