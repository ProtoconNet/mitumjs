## Abstraction

- __mitum.js__ is the framework of the mitum blockchain written in the typescript language.
- The Mitum blockchain operates on a __multi-sig account__ basis. However, for user convenience, __single-sig__ is prioritized.
- Name the method so that it can be called intuitively from the user's perspective.
- For consistency, method names use camel notation.
- To eliminate confusion about the singular/plural representation of method names, we unify the singular notation.
    
    The exception is when there are more than one method with the same function and the return value is singular and plural.
    

## **Install**

- Both commonjs (cjs) and ES2020 (esm) are available.
    
    The typescript code is already compiled in both ways and can be downloaded from the github repository below.
    (It hasn't been registered on npm yet).
    

```bash
$ git clone https://github.com/ProtoconNet/mitumjs.git
# or
$ git clone git@github.com:ProtoconNet/mitumjs.git
```

## Usage

- Assume that the paths where CJS and ESM code is stored are "./cjs" and "./esm" respectively.

- This is an example of how to 'require' a CJS module.
    
    Enter an RPC-URL to communicate with the node.
    
    You can omit the RPC-URL if you don't need to communicate with the node (for example, to generate a simple key pair or an operation for signing).
    
    You can set the RPC-URL as shown below.
    

```jsx
const { Mitum } = require("./cjs");

const mitum = new Mitum(/* "RPC-URL" */);

// You can set the RPC-URL as shown below.
const rpcurl = "http://127.0.0.1:54320";
mitum.setNode(rpcurl);
```

- This is an example of using an ESM module by 'importing' it.
    
    The rest of the usage is the same, except for the syntax to 'import' the Mitum module at the beginning.
    

```jsx
import Mitum from "./esm/index.js";

const mitum = new Mitum(/* "RPC-URL" */);
```

## Functions

**Important note** **about using functions…**

The operation of Mitum is a transaction ‘message’.

Thus if function returns an operation object, remember that you **haven't sent an operation to the network.**

Any operation returned by the function is a raw transaction object, which **requires additional signing.**

Signed operation object must be **sent to the network via the operation.send() function.**
(This is similar to web3.js and ethers.js).

## Basic Functions

### version()

| Feature | Get the version of the mitum.js framework. |
| --- | --- |
| Parameters | null |
| Return Value | string version |

__example__

```jsx
const info = mitum.version();
console.log(info);

// output
v1.0.0 Prehistoric
```

### node()

| Feature | Get information from the RPC node. |
| --- | --- |
| Parameters | null |
| Return Value | object infomation |

__example__

```jsx
// Note: an asynchronous request.
const nodeInfo = async () => {
  const info = await mitum.node();
  console.log(info.data);
};
nodeInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _embedded: [
    {
      network_id: 'bWl0dW0=',
      last_manifest: [Object],
      network_policy: [Object],
      local: [Object],
      consensus: [Object],
      _hint: 'node-info-v0.0.1'
    }
  ],
  _links: { self: { href: '/' } }
}
```

### setNode(provider)

| Feature | Set the RPC-URL. |
| --- | --- |
| Parameters | string rpcUrl |
| Return Value | null |

__example__

```jsx
mitum.setNode("http://127.0.0.1:54320");
mitum.getNode();

// output
http://127.0.0.1:54320
```

### getNode()

| Feature | Get the RPC-URL. |
| --- | --- |
| Parameters | null |
| Return Value | string rpcUrl |

__example__

```jsx
const info = mitum.getNode();

// output
http://127.0.0.1:54320
```

### chain()

| Feature | Get the mitum network ID in use. |
| --- | --- |
| Parameters | null |
| Return Value | string chainID |

__example__

```jsx
const info = mitum.chain();

// output
mitum
```

### setChain(chainID)

| Feature | Set the mitum network ID. |
| --- | --- |
| Parameters | string chainID |
| Return Value | null |

__example__

```jsx
mitum.setChain("<new Mitum network id>");
```

### setDefaultCurrency(currencyID)

| Feature | Set the default currency ID. Note: The default currency can be navite coin, or it can be a background currency that simply exists for account creation. |
| --- | --- |
| Parameters | string currency ID |
| Return Value | null |

__example__

```jsx
mitum.setDefaultCurrency("MCC");
console.log(mitum.getDefaultCurrency);

// output
MCC
```

### getDefaultCurrency()

| Feature | Get the value of the default currency ID. Note: The default currency can be navite coin, or it can be a background currency that simply exists for account creation. |
| --- | --- |
| Parameters | null |
| Return Value | string currency ID |

__example__

```jsx
const defaultCurrency = mitum.getDefaultCurrency();
console.log(defaultCurrency);

// output
PEN
```

## Account Functions

### key(?: seed)

| Feature | If you put seed as a parameter, it will generate a key pair. If nothing is provided (null), a random key pair is generated. Note: if you include a seed, it must be at least 36 characters long. |
| --- | --- |
| Parameters | null or string seed |
| Return Value | object key pair |

__example__

```jsx
const key = mitum.account.key();
console.log(key);

const seed = "The socialinfratech is the future of blockchain industry!";
const seedKey = mitum.account.key(seed);
console.log(seedKey);

// output : random key pair
{
  privateKey: Key {
    key: '3p8PpX3FxBS6D7PJKG8EqpfbhT6KebxcZ9tjHUMjjmgP',
    suffix: 'mpr',
    version: 'm2',
    type: 'btc',
    isPriv: true
  },
  signer: <Buffer 29 ca 08 1b 1c c5 c5 d6 96 ec 47 4f 10 bf f1 02 62 8d 2f e1 c8 00 ed 5b 91 8e d3 2d a8 67 03 8c>,
  publicKey: Key {
    key: '238z7hLaZv7xBEffnytn7Xez96EyDh4gf9HdBcBSbcFPy',
    suffix: 'mpu',
    version: 'm2',
    type: 'btc',
    isPriv: false
  }
}

// output : seed key pair
{
  privateKey: Key {
    key: '85fCr2jtCpsCQm6Q9G9NUzzyFMkHhaR9TC619Pfd5HYk',
    suffix: 'mpr',
    version: 'm2',
    type: 'btc',
    isPriv: true
  },
  signer: <Buffer 69 33 54 52 57 79 79 51 ae 54 81 8a 78 ab a7 5a a5 63 6f 4e b5 4a c7 15 6b 2c d4 07 df c7 e9 91>,
  publicKey: Key {
    key: 'mx9migsrkE29sZge6RT82SKnkmJ6AjQWacbx9VxsJhyw',
    suffix: 'mpu',
    version: 'm2',
    type: 'btc',
    isPriv: false
  }
}
```

### keys(n)

| Feature | Returns as many BTC key pairs as the number of parameter given. |
| --- | --- |
| Parameters | int n |
| Return Value | object key pairs |

__example__

```jsx
const keys = mitum.account.keys(2);
console.log(keys);

// output
{
  keys: Keys { _keys: [ [PubKey], [PubKey] ], threshold: Big { big: 100n } },
  keypairs: [
    M2KeyPair {
      privateKey: [Key],
      signer: <Buffer 0f 7a 15 be 11 b9 1c 8a b3 71 22 a9 a2 24 63 40 7b d2 4f 9e 6b d2 25 3c 8d 23 1e 56 72 b2 2a c1>,
      publicKey: [Key]
    },
    M2KeyPair {
      privateKey: [Key],
      signer: <Buffer e0 0e 58 4b d7 bb d8 47 c2 78 a3 89 0b 1e 06 de ae 92 50 52 8e 6f 7d f1 92 43 08 ba e3 2d d6 f3>,
      publicKey: [Key]
    }
  ]
}
```

### fromPrivateKey(privatekey)

| Feature | Obtain the public key that is derived from the private key. Note: It can be used for both BTC and ETH private key. |
| --- | --- |
| Parameters | string privatekey |
| Return Value | object keyPair |

__example__

```jsx
const BTC_PRIVATE_KEY = "62LMhQdA2BabwWTyA5Y4gipeby8uUtz39MWJt8vSXxGvmpr";
const ETH_PRIVATE_KEY = "010c2b32a9b4363026d899aaabf8fd824097c9ba7058eeaf278a1adb61ae85b0epr";

const btcKeypair = mitum.account.fromPrivateKey(BTC_PRIVATE_KEY);
const ethKeypair = mitum.account.fromPrivateKey(ETH_PRIVATE_KEY);

console.log(btcKeypair);
console.log(ethKeypair);

// output BTC keypair
{
  privateKey: Key {
    key: '62LMhQdA2BabwWTyA5Y4gipeby8uUtz39MWJt8vSXxGv',
    suffix: 'mpr',
    version: 'm2',
    type: 'btc',
    isPriv: true
  },
  signer: <Buffer 4a a1 e6 fc 65 a9 3d 05 1b 18 e0 e9 79 31 d0 76 04 ab d0 69 ab 77 53 ce 73 eb f8 d0 0e fb bd f7>,
  publicKey: Key {
    key: 'diLUcZugeDFW6ftQdcjdz8Ks1KBGiACo9GAcKQUgwFdf',
    suffix: 'mpu',
    version: 'm2',
    type: 'btc',
    isPriv: false
  }
}

// output ETH keypair
{
  privateKey: Key {
    key: '010c2b32a9b4363026d899aaabf8fd824097c9ba7058eeaf278a1adb61ae85b0',
    suffix: 'epr',
    version: 'm2',
    type: 'ether',
    isPriv: true
  },
  signer: Wallet {
    privateKey: <Buffer 01 0c 2b 32 a9 b4 36 30 26 d8 99 aa ab f8 fd 82 40 97 c9 ba 70 58 ee af 27 8a 1a db 61 ae 85 b0>,
    publicKey: <Buffer 8b bb c4 79 6a 0a 31 07 62 f0 86 11 df 35 c3 79 9c e2 dc b4 6f 77 98 5b 05 47 3e 33 2c ad 1c e3 8a 60 40 3e 17 42 33 4d 03 91 a6 49 36 b1 d0 a6 45 17 ... 14 more bytes>
  },
  publicKey: Key {
    key: '048bbbc4796a0a310762f08611df35c3799ce2dcb46f77985b05473e332cad1ce38a60403e1742334d0391a64936b1d0a64517730e73ab14493c0c8b725e4b1130',
    suffix: 'epu',
    version: 'm2',
    type: 'ether',
    isPriv: false
  }
}
```

### **etherKey(?: seed)**

| Feature | f you put seed as a parameter, it will generate a Ethereum’s key pair. If nothing is provided (null), a random key pair is generated. Note: if you include a seed, it must be at least 36 characters long. |
| --- | --- |
| Parameters | null or string seed |
| Return Value | key pair |

__example__

```jsx
const key = mitum.account.etherKey();
console.log(key);

const seed = "The socialinfratech is the future of blockchain industry!";
const seedKey = mitum.account.etherKey(seed);
console.log(seedKey);

// output : random key pair
{
  privateKey: Key {
    key: '67d276253eec1b555f378aff76bfed90bda78570983b65a13dbf60d114057f3c',
    suffix: 'epr',
    version: 'm2',
    type: 'ether',
    isPriv: true
  },
  signer: Wallet {
    privateKey: <Buffer 67 d2 76 25 3e ec 1b 55 5f 37 8a ff 76 bf ed 90 bd a7 85 70 98 3b 65 a1 3d bf 60 d1 14 05 7f 3c>,
    publicKey: <Buffer b0 55 b3 34 b6 77 aa 9a da a7 8e 6b 13 44 e4 ee 51 bb 79 92 9b bf da 50 e8 28 77 82 33 a2 32 f4 fc bc 21 fe 7d 31 f6 73 07 2e 15 a2 9a cd c9 b2 08 2b ... 14 more bytes>
  },
  publicKey: Key {
    key: '04b055b334b677aa9adaa78e6b1344e4ee51bb79929bbfda50e828778233a232f4fcbc21fe7d31f673072e15a29acdc9b2082b106b7a272e4de30327fa2aa3cc1e',
    suffix: 'epu',
    version: 'm2',
    type: 'ether',
    isPriv: false
  }
}

// output : seed key pair
{
  privateKey: Key {
    key: '6933545257797951ae54818a78aba75aa5636f4eb54ac7156b2cd407dfc7e991',
    suffix: 'epr',
    version: 'm2',
    type: 'ether',
    isPriv: true
  },
  signer: Wallet {
    privateKey: <Buffer 69 33 54 52 57 79 79 51 ae 54 81 8a 78 ab a7 5a a5 63 6f 4e b5 4a c7 15 6b 2c d4 07 df c7 e9 91>,
    publicKey: <Buffer 9b e3 16 30 4e 2a 6a 81 c1 df 5e d0 29 75 6b b6 f8 39 9d 70 9c b0 6a 10 fd 65 10 b1 50 5f 1b ae f7 38 89 62 82 ab c4 6d bb bb 15 fb f9 52 79 aa 86 f1 ... 14 more bytes>
  },
  publicKey: Key {
    key: '049be316304e2a6a81c1df5ed029756bb6f8399d709cb06a10fd6510b1505f1baef738896282abc46dbbbb15fbf95279aa86f159aea94011c8ed6a01c8eb280026',
    suffix: 'epu',
    version: 'm2',
    type: 'ether',
    isPriv: false
  }
}
```

### **etherKeys(n)**

| Feature | Returns as many Ethereum’s key pairs as the number of parameter given. |
| --- | --- |
| Parameters | int n |
| Return Value | key pair |

__example__

```jsx
const keys = mitum.account.etherKeys(2);
console.log(keys);

// output
{
  keys: Keys { _keys: [ [PubKey], [PubKey] ], threshold: Big { big: 100n } },
  keypairs: [
    M2KeyPair { privateKey: [Key], signer: [Wallet], publicKey: [Key] },
    M2KeyPair { privateKey: [Key], signer: [Wallet], publicKey: [Key] }
  ]
}
```

### address(publickey)

| Feature | Compute and return the account's address from the public key. Note: The account address is only calculated, not created on the mitum network. |
| --- | --- |
| Parameters | string publickey |
| Return Value | string address |

__example__

```jsx
const PUBLIC_KEY = "diLUcZugeDFW6ftQdcjdz8Ks1KBGiACo9GAcKQUgwFdfmpu";
const address = mitum.account.address(PUBLIC_KEY);
console.log(address);

// output
2VKEH78tLMJ71KXzYQUFej5LmwprqiRSC44E2ax2tn8Bmca
```

### etherAddress(etherPublickey)

| Feature | Compute and return the account's address from the Ethereum’s public key. Note: The account address is only calculated, not created on the mitum network. |
| --- | --- |
| Parameters | string publickey |
| Return Value | string address |

__example__

```jsx
const ETH_PUBLIC_KEY = "048bbbc4796a0a310762f08611df35c3799ce2dcb46f77985b05473e332cad1ce38a60403e1742334d0391a64936b1d0a64517730e73ab14493c0c8b725e4b1130epu";
const address = mitum.account.address(ETH_PUBLIC_KEY);
console.log(address);

// output
3053a018f11efb96750d49273cc8137dc11140dceca
```

### addressForMultiSig(publickeys, threshold)

| Feature | Compute and return the account's address from multiple public keys. Each public key should have a weight set based on its priority or importance in the multi sig account. The threshold must be less than or equal to 100, and the sum of the weights assigned to each publickey must be greater than or equal to the threshold. Note: The account address is only calculated, not created on the mitum network. |
| --- | --- |
| Parameters | Array object { publickey, weight }, int threshold |
| Return Value | string address |

__example__

```jsx
const pubkey01 = {
		key: "28V9psXoGyjQ5cVtDLSFddHSaBnMYV95Y8kpJUk4rQKREmpu",
		weight: 50
};
const pubkey02 = {
		key: "diLUcZugeDFW6ftQdcjdz8Ks1KBGiACo9GAcKQUgwFdfmpu",
		weight: 50
};
const keysArray = [pubkey01, pubkey02];
const threshold = 100;

const multisigAddress = mitum.account.addressForMultiSig(keysArray, threshold);
console.log(multisigAddress);

// output
HWSPS3UyBByUg8eWTm3xM6Z2JXFq4Lqsj1fiVcsj15YVmca
```

### etherAddressForMultiSig(etherPublickeys, threshold)

| Feature | Compute and return the account's address from multiple Ethereum’s public keys. Each public key should have a weight set based on its priority or importance in the multi sig account. The threshold must be less than or equal to 100, and the sum of the weights assigned to each publickey must be greater than or equal to the threshold. Note: The account address is only calculated, not created on the mitum network. |
| --- | --- |
| Parameters | Array object { publickey, weight }, int threshold |
| Return Value | string address |

__example__

```jsx
const etherPubkey01 = {
		key: "04569fc4e3c36321ca0f9da4474a7c048d9aa43cfed9e5ff2814b5012514a599c8176b67a30609948a525d4ba75ff8d23507f126dec4fd4b72dc56d273da3ed03eepu",
		weight: 50
};
const etherPubkey02 = {
		key: "048bbbc4796a0a310762f08611df35c3799ce2dcb46f77985b05473e332cad1ce38a60403e1742334d0391a64936b1d0a64517730e73ab14493c0c8b725e4b1130epu",
		weight: 50
};
const keysArray = [etherPubkey01, etherPubkey02];
const threshold = 100;

const multisigAddress = mitum.account.etherAddressForMultiSig(keysArray, threshold);
console.log(multisigAddress);

// output
75caf01896527a1bd3b35de6aaded5090cd18b94eca
```

### createWallet(sender, currencyID, amount, ?:seed, ?:weight)

| Feature | Create an operation to create a new account. Notes: While the Mithumb network requires a native token transaction to create an account, this function easily abstracts the account creation by sending 1 token internally. seed, weight are optional, and for the weight value, threshold will also have the same value internally. |
| --- | --- |
| Parameters | string sender, string currencyID, int amount, string seed (optional), number weight (default = 100) |
| Return Value | object { wallet, rawOperation } |

__example__

```jsx
const sender = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
const currencyID = "FEN";
const amount = 10;
const seed = "The MITUM blockchain is evolving every day.";
const weight = 80;

const { wallet, operation } = mitum.account.createWallet(sender, currencyID, amount, seed, weight);
console.log(wallet);
console.log(operation);

// output
{
  privatekey: '6Ck2iySxuzLh3BZzte1BYpgzKDomiELKsQUFn4DsvVHompr',
  publickey: 'mFiiJi9BEBg1TUA17G2VvbRSFcWRpWqgRUER6Fa14Cc6mpu',
  address: '5nqwreAMCMdXXoAfJqHu8NPNQQ9AAdWsJrFKEB9e5DxDmca'
}
{
  id: 'mitum',
  memo: '',
  fact: CreateAccountsFact {
    hint: Hint { s: 'mitum-currency-create-accounts-operation-fact' },
    token: Token { s: '2023-06-26 05:55:59.339 +0000 UTC' },
    _hash: <Buffer 30 29 a7 d6 25 3d ba 84 7b 2e 61 76 4b d4 ce ad 64 aa 10 b0 17 19 e2 de b5 f3 46 c2 d6 1c 76 ae>,
    sender: Address {
      s: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca',
      type: 'btc'
    },
    items: [ [CreateAccountsItem] ]
  },
  hint: Hint { s: 'mitum-currency-create-accounts-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### touch(privatekey, operation)

| Feature | Create a new account from Ethereum’s publickey. Note: In mitum network, a native-token transaction is required to create an account. Therefore, the sender's address, currency ID, and amount must be entered. |
| --- | --- |
| Parameters | string privatekey, object wallet (return value of ‘function createWallet’) |
| Return Value | object httpResponse |

__example__

```jsx
const sender = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
const currencyID = "FEN";
const amount = 10;
const seed = "The MITUM blockchain is evolving every day.";
const weight = 80;

const wallet = mitum.account.createWallet(sender, currencyID, amount, seed, weight);

const privatekey = "DNQF7ruLFUD8ZXXrZimjFZdHAJSwc754dz1JdGADwTEDmpr";

const res = await mitum.account.touch(privatekey, wallet);
console.log(res.data);

// output
...
```

### create(sender, receiverPubkey, currencyID, amount)

| Feature | Create a new account. Note: In mitum network, a native-token transaction is required to create an account. Therefore, the sender's address, currency ID, and amount must be entered. |
| --- | --- |
| Parameters | string senderAddress, string receiverPublickey, string currency ID, int amount |
| Return Value | object rawOperation |

__example__

```jsx
const senderAddress = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
const receiverPublickey = "oxaoi8FuZpLJkEU8kStm8dndhwbo4FtfcCiJo76MkpiQmpu";
const currencyID = "MCC";
const amount = 10000;

const createOperation = mitum.account.create(
    senderAddress,
    receiverPublickey,
    currencyID,
    amount
);
console.log(createOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: CreateAccountsFact {
    hint: Hint { s: 'mitum-currency-create-accounts-operation-fact' },
    token: Token { s: '2023-06-23 05:37:51.739 +0000 UTC' },
    _hash: <Buffer e6 cf 2c a8 50 c0 88 54 cf 7f b0 ae 25 4f f6 af 9f 3e db 6a 60 d6 ce 25 97 2c 7c 6b c8 50 9b f9>,
    sender: Address {
      s: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca',
      type: 'btc'
    },
    items: [ [CreateAccountsItem] ]
  },
  hint: Hint { s: 'mitum-currency-create-accounts-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### createEtherAccount(sender, receiverEtherPubkey, currencyID, amount)

| Feature | Create a new account from Ethereum’s publickey. Note: In mitum network, a native-token transaction is required to create an account. Therefore, the sender's address, currency ID, and amount must be entered. |
| --- | --- |
| Parameters | string senderAddress, string receiverPublickey, string currency ID, int amount |
| Return Value | object rawOperation |

__example__

```jsx
const senderAddress = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
const receiverEtherPublickey = "0413814cd14d791c59092b3498d8ba7bf24762c555b38371fc5ebcef9ca324074eb1496e25f11a9a5d08d449843a26a8053f4fe481e8929a6a7dc706d8c058e726epu";
const currencyID = "MCC";
const amount = 10000;

const createOperation = mitum.account.create(
    senderAddress,
    receiverEtherPublickey,
    currencyID,
    amount
);
console.log(createOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: CreateAccountsFact {
    hint: Hint { s: 'mitum-currency-create-accounts-operation-fact' },
    token: Token { s: '2023-06-23 05:51:16.505 +0000 UTC' },
    _hash: <Buffer 16 e8 36 5d b3 a7 b5 9e a2 16 5e b9 c0 81 51 0a a2 fd 1b 49 f1 2b 20 e9 46 b6 76 09 8c 90 6c 9c>,
    sender: Address {
      s: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca',
      type: 'btc'
    },
    items: [ [CreateAccountsItem] ]
  },
  hint: Hint { s: 'mitum-currency-create-accounts-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### createMultiSig(sender, receiverPubkeys, currencyID, amount, threshold)

| Feature | Create a new account from multi publickeys. Note: In mitum network, a native-token transaction is required to create an account. Therefore, the sender's address, currency ID, and amount must be entered. Each public key should have a weight set based on its priority or importance in the multi sig account. The threshold must be less than or equal to 100, and the sum of the weights assigned to each publickey must be greater than or equal to the threshold. |
| --- | --- |
| Parameters | string senderAddress, Array object {publickey, weight}, string currency ID, int amount, int threshold |
| Return Value | object rawOperation |

__example__

```jsx
const senderAddress = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
const currencyID = "MCC";
const threshold = 100;
const amount = 10000;

const pubkey01 = {
		key: "28V9psXoGyjQ5cVtDLSFddHSaBnMYV95Y8kpJUk4rQKREmpu",
		weight: 50
};
const pubkey02 = {
		key: "diLUcZugeDFW6ftQdcjdz8Ks1KBGiACo9GAcKQUgwFdfmpu",
		weight: 50
};
const keysArray = [pubkey01, pubkey02];

const createOperation = mitum.account.createMultiSig(
    senderAddress,
    keysArray,
    currencyID,
    amount,
    threshold,
);
console.log(createOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: CreateAccountsFact {
    hint: Hint { s: 'mitum-currency-create-accounts-operation-fact' },
    token: Token { s: '2023-06-23 05:58:38.904 +0000 UTC' },
    _hash: <Buffer 1c bf 49 84 fc 66 c3 d5 a6 2f 54 22 b7 04 bf a5 3a ab a6 08 aa 0d 3a cb 4d c4 00 f6 d5 ef 70 1e>,
    sender: Address {
      s: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca',
      type: 'btc'
    },
    items: [ [CreateAccountsItem] ]
  },
  hint: Hint { s: 'mitum-currency-create-accounts-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### createEtherMultiSig(sender,receiverPubkeys,currencyID,amount,threshold)

| Feature | Create a new account from multi Ethereum’s publickeys. Note: In mitum network, a native-token transaction is required to create an account. Therefore, the sender's address, currency ID, and amount must be entered. Each public key should have a weight set based on its priority or importance in the multi sig account. The threshold must be less than or equal to 100, and the sum of the weights assigned to each publickey must be greater than or equal to the threshold. |
| --- | --- |
| Parameters | string senderAddress, Array object {publickey, weight}, string currency ID, int amount, int threshold |
| Return Value | object rawOperation |

__example__

```jsx
const senderAddress = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
const currencyID = "MCC";
const threshold = 100;
const amount = 10000;

const etherPubkey01 = {
		key: "04569fc4e3c36321ca0f9da4474a7c048d9aa43cfed9e5ff2814b5012514a599c8176b67a30609948a525d4ba75ff8d23507f126dec4fd4b72dc56d273da3ed03eepu",
		weight: 50
};
const etherPubkey02 = {
		key: "048bbbc4796a0a310762f08611df35c3799ce2dcb46f77985b05473e332cad1ce38a60403e1742334d0391a64936b1d0a64517730e73ab14493c0c8b725e4b1130epu",
		weight: 50
};
const keysArray = [etherPubkey01, etherPubkey02];

const createOperation = mitum.account.createEtherMultiSig(
    senderAddress,
    keysArray,
    currencyID,
    amount,
    threshold,
);
console.log(createOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: CreateAccountsFact {
    hint: Hint { s: 'mitum-currency-create-accounts-operation-fact' },
    token: Token { s: '2023-06-23 05:58:38.905 +0000 UTC' },
    _hash: <Buffer 87 ad b8 36 e0 88 e4 07 ed 66 d6 11 4f b2 04 24 41 cc 49 1a c2 e8 f7 da 3f e4 68 20 d2 12 a9 d1>,
    sender: Address {
      s: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca',
      type: 'btc'
    },
    items: [ [CreateAccountsItem] ]
  },
  hint: Hint { s: 'mitum-currency-create-accounts-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### update(targetAddress, newPublickey, currencyID)

| Feature | Replace the publickey involved in generating the address. (single or multi sig account ⇒ single account) Note: The address is preserved, only the publickey is changed, so the math to calculate the address is no longer true. |
| --- | --- |
| Parameters | string targetAddress, string newPublickey, string currencyID |
| Return Value | object rawOperation |

__example__

```jsx
const targetAddress = "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca";
const newPublickey = "28V9psXoGyjQ5cVtDLSFddHSaBnMYV95Y8kpJUk4rQKREmpu";
const currencyID = "MCC";

const updateOperation = mitum.account.update(targetAddress, newPublickey, currencyID);
console.log(updateOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: KeyUpdaterFact {
    hint: Hint { s: 'mitum-currency-keyupdater-operation-fact' },
    token: Token { s: '2023-06-23 06:40:56.4 +0000 UTC' },
    _hash: <Buffer bb 39 99 43 d5 04 70 eb d1 91 fe a6 70 bb 9e bf 11 4a 80 f8 11 c6 5e c9 0a 01 b4 0e e3 9e e9 5e>,
    target: Address {
      s: '2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca',
      type: 'btc'
    },
    keys: Keys { _keys: [Array], threshold: [Big] },
    currency: CurrencyID { s: 'MCC' }
  },
  hint: Hint { s: 'mitum-currency-keyupdater-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### updateMultiSig(targetAddress, newPubkeys, currencyID, threshold)

| Feature | Replace the publickey involved in generating the address. (single or multi sig account ⇒ multi sig account) Note: The address is preserved, only the publickey is changed, so the math to calculate the address is no longer true. |
| --- | --- |
| Parameters | string targetAddress, Array object {publickey, weight}, string currencyID, int threshold |
| Return Value | object rawOperation |

__example__

```jsx
const targetAddress = "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca";
const currencyID = "MCC";
const threshold = 100;

const pubkey01 = {
		key: "28V9psXoGyjQ5cVtDLSFddHSaBnMYV95Y8kpJUk4rQKREmpu",
		weight: 50
};
const pubkey02 = {
		key: "diLUcZugeDFW6ftQdcjdz8Ks1KBGiACo9GAcKQUgwFdfmpu",
		weight: 50
};
const newPublickeys = [pubkey01, pubkey02];

const updateOperation = mitum.account.updateMultiSig(targetAddress, newPublickeys, currencyID, threshold);
console.log(updateOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: KeyUpdaterFact {
    hint: Hint { s: 'mitum-currency-keyupdater-operation-fact' },
    token: Token { s: '2023-06-23 06:46:15.211 +0000 UTC' },
    _hash: <Buffer 43 6c 03 d1 6f 95 64 65 39 36 b4 f3 d8 2d 74 32 05 73 03 56 68 d9 a2 b9 b2 5e cc 82 0e 2a 5e 0b>,
    target: Address {
      s: '2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca',
      type: 'btc'
    },
    keys: Keys { _keys: [Array], threshold: [Big] },
    currency: CurrencyID { s: 'MCC' }
  },
  hint: Hint { s: 'mitum-currency-keyupdater-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### getAccount(address)

| Feature | Get specific address information. |
| --- | --- |
| Parameters | string address |
| Return Value | object accountInformation |

__example__

```jsx
// Note: an asynchronous request.
const addressInfo = async () => {
	const address = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
  const info = await mitum.account.get(address);

  console.log(info.data);
};
addressInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _embedded: {
    _hint: 'mitum-currency-account-value-v0.0.1',
    hash: '3VaLWonDfzZ6e4aKTvK57Kg51QujLNNj4Mt9RF5dD34b',
    address: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca',
    keys: {
      _hint: 'mitum-currency-keys-v0.0.1',
      hash: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4',
      keys: [Array],
      threshold: 100
    },
    balance: [ [Object] ],
    height: 0
  },
  _links: {
    'operations:{offset}': {
      templated: true,
      href: '/account/8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca/operations?offset={offset}'
    },
    'operations:{offset,reverse}': {
      templated: true,
      href: '/account/8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca/operations?offset={offset}&reverse=1'
    },
    block: { href: '/block/0' },
    self: {
      href: '/account/8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca'
    },
    operations: {
      href: '/account/8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca/operations'
    }
  }
}
```

### getOperation(address)

| Feature | Gets information about operations generated from a specific address. |
| --- | --- |
| Parameters | string address |
| Return Value | object operationInformation |

__example__

```jsx
// Note: an asynchronous request.
const operationByAddress = async () => {
	const address = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
  const info = await mitum.account.getOperation(address);

  console.log(info.data);
};
operationByAddress();

// output

```

### getByPublickey(publickey)

| Feature | Get account information from the publickey associated with the address. |
| --- | --- |
| Parameters | string publickey |
| Return Value | object accountInformation |

__example__

```jsx
// Note: an asynchronous request.
const addressInfoByPub = async () => {
	const publickey = "jdxEaVHTBSu94HcqG7K4oKF6jTPPqnhbrA7fN8qm3tvzmpu";
  const info = await mitum.account.getByPublickey(publickey);

  console.log(info.data);
};
addressInfoByPub();

// output

```

## Block Functions

### getAllBlocks()

| Feature | Get the information for all blocks. Note: The return value only shows information for some blocks, and you can get a link to get the next block's information from the returned object. |
| --- | --- |
| Parameters | null |
| Return Value | object blockInformation |

__example__

```jsx
// Note: an asynchronous request.
const blocksInfo = async () => {
  const info = await mitum.block.getAll();

  console.log(info.data);
};
blocksInfo();
```

### getBlock(blockNumber | blockHash)

| Feature | Get information about a block from a specific block number or block hash. |
| --- | --- |
| Parameters | int blockNumber or string blockHash |
| Return Value | object blockInformation |

__example__

```jsx
// Note: an asynchronous request.
const blockInfo = async () => {
	const hash = "";
	const blockNumber = 12743;
  const info = await mitum.block.get(hash);
	const info2 = await mitum.block.get(blockNumber);

  console.log(info.data);
	console.log(info2.data);
};
blockInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _embedded: {
    Manifest: {
      proposed_at: '2023-06-22T02:30:18.557Z',
      states_tree: 'E28amWuXgq1NjF8bXvSCtKT8ahu5AHWHQTSjcqv4C38h',
      hash: 'BbxsBuZsHrpfCN8yjKiEoENoPEFguUDC6f8cjyLK8rMB',
      previous: '',
      proposal: '9PbjAbeyr2bDeZCu4Pbq5sWEM8wwknWbWWd6ThENirV',
      operations_tree: '',
      suffrage: '3Gb1eXp8ZLc2i8URGLWd3WjurtS9eJRAsgBuQHhQHVuB',
      _hint: 'digest-manifest-v0.0.1',
      height: 0
    },
    operations: 3
  },
  _links: {
    'manifest:{hash}': {
      templated: true,
      href: '/block/{hash:(?i)[0-9a-z][0-9a-z]+}/manifest'
    },
    'block:{height}': { templated: true, href: '/block/{height:[0-9]+}' },
    self: { href: '/block/12743/manifest' },
    next: { href: '/block/12744/manifest' },
    block: { href: '/block/12743' },
    'block:{hash}': { templated: true, href: '/block/{height:[0-9]+}' },
    'manifest:{height}': { templated: true, href: '/block/{height:[0-9]+}/manifest' }
  }
}
```

### getOperation(blockNumber)

| Feature | Gets the operation information contained in a block from a specific block number. |
| --- | --- |
| Parameters | int blockNumber |
| Return Value | object operationInformation |

__example__

```jsx
// Note: an asynchronous request.
const operationInfo = async () => {
	const blockNumber = 12743;
  const info = await mitum.block.getOperation(blockNumber);

  console.log(info.data);
};
operationInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _embedded: [
    {
      _hint: 'mitum-currency-hal-v0.0.1',
      _embedded: [Object],
      _links: [Object]
    },
    {
      _hint: 'mitum-currency-hal-v0.0.1',
      _embedded: [Object],
      _links: [Object]
    },
    {
      _hint: 'mitum-currency-hal-v0.0.1',
      _embedded: [Object],
      _links: [Object]
    }
  ],
  _links: {
    reverse: { href: '/block/12743/operations?reverse=1' },
    next: { href: '/block/12743/operations?offset=2' },
    self: { href: '/block/12743/operations' }
  },
  _extra: { total_operations: 3 }
}
```

## Currency Functions

### getAllCurrencies()

| Feature | Get information about all currencies in the network. Note: currency is a concept similar to a common native token. It can be more than one currency in the mitum network. |
| --- | --- |
| Parameters | null |
| Return Value | object currenciesInformation |

__example__

```jsx
// Note: an asynchronous request.
const currencyInfo = async () => {
  const info = await mitum.currency.getAll();

  console.log(info.data);
};
currencyInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _links: {
    'currency:MCC': { href: '/currency/MCC' },
    self: { href: '/currency' },
    'currency:{currencyid}': { templated: true, href: '/currency/{currencyid:.*}' }
  }
}
```

### getCurrency(currencyID)

| Feature | Get information about a specific currency. |
| --- | --- |
| Parameters | string currencyID |
| Return Value | object currencyInformation |

__example__

```jsx
// Note: an asynchronous request.
const currencyInfo = async () => {
	const currencyID = "MCC";
  const info = await mitum.currency.get(currencyID);

  console.log(info.data);
};
currencyInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _embedded: {
    _hint: 'mitum-currency-currency-design-v0.0.1',
    amount: {
      amount: '1000000000000000000000000000',
      currency: 'MCC',
      _hint: 'mitum-currency-amount-v0.0.1'
    },
    genesis_account: '8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca',
    policy: {
      _hint: 'mitum-currency-currency-policy-v0.0.1',
      new_account_min_balance: '1',
      feeer: [Object]
    },
    aggregate: '1000000000000000000000000000'
  },
  _links: {
    'currency:{currencyid}': { templated: true, href: '/currency/{currencyid:.*}' },
    block: { href: '/block/0' },
    operations: {
      href: '/block/operation/EByABtz74mioWJgWiStwGdjHDHGAYHg593JCCnmqKUFG'
    },
    self: { href: '/currency/MCC' }
  }
}
```

### create(dataObject)

| Feature | Create a new currency. Note: Many conditions are required to create a new currency. See the example below for the structure of the parameters. |
| --- | --- |
| Parameters | object currencyStruct |
| Return Value | object currencyOperation |

| [ parameter(input data)’s structure ]

{
        currencyID: string;
        genesisAddress: string;
        totalSupply: number;
        minBalance: number;
        feeType: feeType;                           // "none" or "fixed" or "ratio"
        feeReceiver?: string;                      // receiver address
        fee?: number;                                  // case of "fixed" fee or “ratio”
        minFee?: number;
        maxFee?: number;
} |
| --- |
- feeType is optional and can be one of "none", "fixed", or "ratio".
    - "none" means no transaction fee is collected.
    - "fixed" collects a fixed fee, so you must enter a fee receiver address "feeReceiver" and a fixed fee "fee".
    - "ratio" collects a percentage of the transaction volume, so you must provide the address "feeReceiver", the fee ratio "fee", the minimum fee "minFee", and the maximum fee "maxFee".

__example__

```jsx
const inputData = {
		currencyID: "SIT",
		genesisAddress: "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca",
		totalSupply: 1000000000000,
		minBalance: 10,
		feeType: "fixed",
		feeReceiver: "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca",
		fee: 10,
}
const rawOperation = mitum.currency.create(inputData);
console.log(rawOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: CurrencyRegisterFact {
    hint: Hint { s: 'mitum-currency-currency-register-operation-fact' },
    token: Token { s: '2023-06-23 08:37:47.834 +0000 UTC' },
    _hash: <Buffer 9d ab e3 4a 34 4f 5e 87 1d 0a 86 2d ec 84 65 5f 47 82 0f a8 f1 67 49 34 c8 c4 f6 e5 a6 d6 f1 35>,
    design: CurrencyDesign {
      amount: [Amount],
      genesisAccount: [Address],
      policy: [CurrencyPolicy],
      aggregate: [Big]
    }
  },
  hint: Hint { s: 'mitum-currency-currency-register-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### setPolicy(dataObject)

| Feature | Create a new currency policy. Note: Creating a new currency means that a new currency policy is required. This requires many conditions, see the example below for the parameter structure. |
| --- | --- |
| Parameters | object policyStruct |
| Return Value | object policyForm |

| [ parameter(input data)’s structure ]

{
        currencyID: string;
        minBalance: number;
        feeType: feeType;                          // "none" or "fixed" or "ratio"
        feeReceiver?: string;                     // receiver address
        fee?: number;                                // case of "fixed" fee or “ratio”
        minFee?: number;
        maxFee?: number;
} |
| --- |
- feeType is optional and can be one of "none", "fixed", or "ratio".
    - "none" means no transaction fee is collected.
    - "fixed" collects a fixed fee, so you must enter a fee receiver address "feeReceiver" and a fixed fee "fee".
    - "ratio" collects a percentage of the transaction volume, so you must provide the address "feeReceiver", the fee ratio "fee", the minimum fee "minFee", and the maximum fee "maxFee".

__example__

```jsx
const inputData = {
		currencyID: "SIT",
		minBalance: 5,
		feeType: "ratio",
		feeReceiver: "3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca",
		fee: 3,               // 3%
		minFee: 5,
		maxFee: 10000,
}
const rawOperation = mitum.currency.setPolicy(inputData);
console.log(rawOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: CurrencyPolicyUpdaterFact {
    hint: Hint { s: 'mitum-currency-currency-policy-updater-operation-fact' },
    token: Token { s: '2023-06-23 08:47:48.016 +0000 UTC' },
    _hash: <Buffer b1 98 00 7f 96 98 8e aa 4d d2 8d 5f ba bb 5a db e2 bb b2 ce c2 52 6d 3b f3 37 df 3b 4f cc f2 b8>,
    currency: CurrencyID { s: 'SIT' },
    policy: CurrencyPolicy { newAccountMinBalance: [Big], feeer: [RatioFeeer] }
  },
  hint: Hint { s: 'mitum-currency-currency-policy-updater-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### transfer(sender, receiver, currencyID, amount)

| Feature | Sends the currency. |
| --- | --- |
| Parameters | string senderAddress, string receiverAddress, string currencyID, int amount |
| Return Value | object transferOperation |

__example__

```jsx
const sender = "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca";
const receiver = "3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca";
const currencyID = "MCC";
const amount = 25000;

const rawOperation = mitum.currency.transfer(sender, receiver, currencyID, amount);
console.log(rawOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: TransfersFact {
    hint: Hint { s: 'mitum-currency-transfers-operation-fact' },
    token: Token { s: '2023-06-23 08:51:20.634 +0000 UTC' },
    _hash: <Buffer e0 d7 b3 f5 50 53 b1 33 36 c1 ec 8d c3 48 30 6e 4b f4 e6 70 dd 98 46 c9 eb 28 22 45 97 fd 38 5b>,
    sender: Address {
      s: '2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca',
      type: 'btc'
    },
    items: [ [TransfersItem] ]
  },
  hint: Hint { s: 'mitum-currency-transfers-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

### mint(receiver, currencyID, amount)

| Feature | Increases the total supply of a particular currency. This is a feature that must be agreed upon by the nodes running the mitum network. |
| --- | --- |
| Parameters | string receiverAddress, string currencyID, int amount |
| Return Value | object inflationOperation |

__example__

```jsx
const receiver = "2VKEH78tLMJ71KXzYQUFej5LmwprqiRSC44E2ax2tn8Bmca";
const currencyID = "MCC";
const amount = 100000000;

const rawOperation = mitum.currency.mint(receiver, currencyID, amount);
console.log(rawOperation);

// output
{
  id: 'mitum',
  memo: '',
  fact: SuffrageInflationFact {
    hint: Hint { s: 'mitum-currency-suffrage-inflation-item' },
    token: Token { s: '2023-06-23 08:55:41.002 +0000 UTC' },
    _hash: <Buffer 43 8a 5e 4f 82 f3 12 13 5b 3d 25 d0 68 b7 c3 39 68 48 18 43 88 d6 89 d5 3a e4 15 82 8c 9f 73 94>,
    items: [ [SuffrageInflationItem] ]
  },
  hint: Hint { s: 'mitum-currency-suffrage-inflation-operation' },
  _factSigns: [],
  _hash: <Buffer >
}
```

## Operation Functions

### getAllOperations()

| Feature | Get all operations information. |
| --- | --- |
| Parameters | null |
| Return Value | object operationInformations |

__example__

```jsx
// Note: an asynchronous request.
const operationsInfo = async () => {
  const info = await mitum.operation.getAll();

  console.log(info.data);
};
operationsInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _embedded: [
    {
      _hint: 'mitum-currency-hal-v0.0.1',
      _embedded: [Object],
      _links: [Object]
    },
    {
      _hint: 'mitum-currency-hal-v0.0.1',
      _embedded: [Object],
      _links: [Object]
    },
    {
      _hint: 'mitum-currency-hal-v0.0.1',
      _embedded: [Object],
      _links: [Object]
    }
  ],
  _links: {
    reverse: { href: '/block/operations?reverse=1' },
    next: { href: '/block/operations?offset=0,2' },
    self: { href: '/block/operations' }
  },
  _extra: { total_operations: 3 }
}
```

### getOperation(factHash)

| Feature | Get specific operation information from facthash. |
| --- | --- |
| Parameters | string factHash |
| Return Value | object operationInformation |

__example__

```jsx
// Note: an asynchronous request.
const operationInfo = async () => {
	const facthash = "EhvvH6AAYEQus8gKk2m43cLTogiULe9PMvsfczacUZoT";
  const info = await mitum.operation.get(facthash);

  console.log(info.data);
};
operationInfo();

// output
{
  _hint: 'mitum-currency-hal-v0.0.1',
  _embedded: {
    _hint: 'mitum-currency-operation-value-v0.0.1',
    hash: 'EhvvH6AAYEQus8gKk2m43cLTogiULe9PMvsfczacUZoT',
    operation: {
      hash: '2TmfjXwzQcFpe4PgqKDv62WadevwP3bCWCQDj4pAE94V',
      fact: [Object],
      signs: null,
      _hint: 'currency-suffrage-genesis-join-operation-v0.0.1'
    },
    height: 0,
    confirmed_at: '2023-06-22T02:30:18.561Z',
    reason: null,
    in_state: true,
    index: 0
  },
  _links: {
    'block:{height}': { templated: true, href: '/block/{height:[0-9]+}' },
    self: {
      href: '/block/operation/EhvvH6AAYEQus8gKk2m43cLTogiULe9PMvsfczacUZoT'
    },
    block: { href: '/block/0' },
    'operation:{hash}': {
      href: '/block/operation/{hash:(?i)[0-9a-z][0-9a-z]+}',
      templated: true
    }
  }
}
```

### sign(privatekey, operation[, nodeType])

| Feature | Sign the raw operation using the privatekey. |
| --- | --- |
| Parameters | string privatekey, object operation, option nodeType |
| Return Value | object signedOperation |

__example__

```jsx
const sender = "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca";
const receiver = "3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca";
const currencyID = "MCC";
const amount = 25000;

const privatekey = "96UQnof9743WAykeq6a3f54vg9MENicWCrrqN9yam9aZmpr";

const rawOperation = mitum.currency.transfer(sender, receiver, currencyID, amount);
const signedOperation = mitum.operation.sign(privatekey, rawOperation);
console.log(signedOperation);

// output
{"_hint":"mitum-currency-transfers-operation-v0.0.1", \\
 "fact":{
		"_hint":"mitum-currency-transfers-operation-fact-v0.0.1",
		"hash":"J5NGt4uBSq8ZuwjXh1VM3Vo7hD965ELDPabMJbK7bcfe",
	  "token":"MjAyMy0wNi0yMyAwOTowODoyNi4zNSArMDAwMCBVVEM=",
	  "sender":"2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca",
	  "items":[{
			 "_hint":"mitum-currency-transfers-item-multi-amounts-v0.0.1",
				"amounts":[{
						"_hint":"mitum-currency-amount-v0.0.1",
						"currency":"MCC",
						"amount":"25000"
			 	}],
				"receiver":"3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca"
		}]
	},
 "hash":"8yyPJ6d7s8PFM7uWeSz5yBmzErWmXwsDcjsTkcuGh4gP",
 "memo":"",
 **"signs":[{
		"signer":"oxaoi8FuZpLJkEU8kStm8dndhwbo4FtfcCiJo76MkpiQmpu",
		"signature":"381yXYyJeTzGCQ3EJzHNDxQc4wZrzmBSpFfWxged4HXHSXzGJXwgNctXt3hGEzZW7jveCvdtz1fUi8szP3MFpBupDLof3n2b",
		"signed_at":"2023-06-23T09:08:26.355Z"
 }]**
}
```

### send(signedOperation[, header])

| Feature | Send the signed operation to the rpc node for broadcasting to the network. Note: Even if the response data is received successfully, it does not guarantee that the operation will be processed. Always check the operation's facthash to see if the operation was processed. |
| --- | --- |
| Parameters | object signedOperation, option httpHeader |
| Return Value | object httpResponse |

__example__

```jsx
// Note: an asynchronous request.
const sender = "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca";
const receiver = "3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca";
const currencyID = "MCC";
const amount = 25000;

const privatekey = "96UQnof9743WAykeq6a3f54vg9MENicWCrrqN9yam9aZmpr";

const rawOperation = mitum.currency.transfer(sender, receiver, currencyID, amount);
const signedOperation = mitum.operation.sign(privatekey, rawOperation);

const sendOperation = async () => {
  const info = await mitum.operation.send(signedOperation);

  console.log(info.data);
};
sendOperation();

// output
{
    "_hint": "mitum-currency-hal-v0.0.1",
    "_embedded":{
			"_hint":"mitum-currency-transfers-operation-v0.0.1", \\
			"fact":{
					"_hint":"mitum-currency-transfers-operation-fact-v0.0.1",
					"hash":"J5NGt4uBSq8ZuwjXh1VM3Vo7hD965ELDPabMJbK7bcfe",
				  "token":"MjAyMy0wNi0yMyAwOTowODoyNi4zNSArMDAwMCBVVEM=",
				  "sender":"2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca",
				  "items":[{
						 "_hint":"mitum-currency-transfers-item-multi-amounts-v0.0.1",
						 "amounts":[{
									"_hint":"mitum-currency-amount-v0.0.1",
									"currency":"MCC",
									"amount":"25000"
						 }],
						 "receiver":"3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca"
					}]
			},
			"hash":"8yyPJ6d7s8PFM7uWeSz5yBmzErWmXwsDcjsTkcuGh4gP",
		  "memo":"",
		  "signs":[{
					"signer":"oxaoi8FuZpLJkEU8kStm8dndhwbo4FtfcCiJo76MkpiQmpu",
					"signature":"381yXYyJeTzGCQ3EJzHNDxQc4wZrzmBSpFfWxged4HXHSXzGJXwgNctXt3hGEzZW7jveCvdtz1fUi8szP3MFpBupDLof3n2b",
					"signed_at":"2023-06-23T09:08:26.355Z"
		  }]
		},
		"_links": {
        "self": {
            "href": ""
        }
    }
}
```

### Contract Functions

(to be determined.)
