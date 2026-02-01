const cryptoModule = require("node:crypto");
const { createHash, webcrypto } = cryptoModule;

const ensureHash = (target) => {
  if (!target || typeof target.hash === "function") return;
  Object.defineProperty(target, "hash", {
    configurable: true,
    enumerable: false,
    writable: false,
    value: (algorithm, data, encoding = "hex") => {
      const hash = createHash(algorithm);
      if (typeof data === "string" || Buffer.isBuffer(data)) {
        hash.update(data);
      } else if (ArrayBuffer.isView(data)) {
        hash.update(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
      } else if (data instanceof ArrayBuffer) {
        hash.update(Buffer.from(data));
      } else {
        hash.update(String(data));
      }
      const digest = hash.digest();
      if (!encoding || encoding === "hex") return digest.toString("hex");
      if (encoding === "buffer") return digest;
      return digest.toString(encoding);
    }
  });
};

ensureHash(cryptoModule);
ensureHash(webcrypto);

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto ?? cryptoModule;
}

ensureHash(globalThis.crypto);
