## Abstraction

- __mitum.js__ is the framework of the mitum blockchain written in the typescript language.
- The Mitum blockchain operates on a __multi-sig account__ basis. However, for user convenience, __single-sig__ is prioritized.
- Name the method so that it can be called intuitively from the user's perspective.
- For consistency, method names use camel notation.
- To eliminate confusion about the singular/plural representation of method names, we unify the singular notation.
    
    The exception is when there are more than one method with the same function and the return value is singular and plural.
    
</br> 

## **Install**

You can import and use TypeScript as is, but you can also build it with JavaScript and use it.
    
- Both commonjs (cjs) and ES2020 (esm) are available.
    

```bash
$ git clone https://github.com/ProtoconNet/mitumjs.git
# or
$ git clone git@github.com:ProtoconNet/mitumjs.git
$ cd mitumjs
$ npm i
# run build, if you want cjs or esm module
$ npm run build
```

</br> 

## Usage

- After running build, a directory **<code>dist</code>** include **<code>bundle.cjs.cjs</code>** and **<code>bundle.esm.mjs</code>** files will be created.

- This is an example of how to 'require' a CJS module.
    
    Enter an RPC-URL to communicate with the node.
    
    You can omit the RPC-URL if you don't need to communicate with the node (for example, to generate a simple key pair or an operation for signing).
    
    You can set the RPC-URL as shown below.
    

```jsx
//cjs_test.cjs
const { Mitum } = require("./dist/bundle.cjs.cjs");

const mitum = new Mitum(/* "RPC-URL" */);

// You can set the RPC-URL as shown below.
const rpcurl = "http://127.0.0.1:54320";
mitum.setNode(rpcurl);
```

- This is an example of using an ESM module by 'importing' it.
    
    Some of the modules used for cryptography are CommonJS modules and may not support all module.exports as named exports.

    **⚠️So you have to fix that part manually.**

    The rest of the usage is the same, except for the syntax to 'import' the Mitum module at the beginning.
    
Open the <code>bundle.esm.mjs</code> files and fix below lines.

```jsx
//line 5
import { sha3_256, keccak256 as keccak256$1 } from 'js-sha3';
//line 14
import { ec } from 'elliptic';
```

<br>

The above lines need to be fix like below

```jsx
//line 5
import pkg from 'js-sha3';
const { sha3_256, keccak256: keccak256$1 } = pkg;

//line 14
import pkg2 from 'elliptic';
const { ec } = pkg2;
```

<br>

In other words, the Import part of bundle.esm.mjs should be as follows.

```jsx
import Int64 from 'int64-buffer';
import bigInt from 'big-integer';
import axios from 'axios';
import base58 from 'bs58';
import pkg2 from 'js-sha3';
const { sha3_256, keccak256: keccak256$1 } = pkg2;
import { Wallet } from 'ethers';
import secureRandom from 'secure-random';
import { hmac } from '@noble/hashes/hmac';
import { sha256 as sha256$1 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';
import { getPublicKey } from '@noble/secp256k1';
import * as crypto from 'crypto';
import pkg from 'elliptic';
const { ec } = pkg;
```

<br>

After fix the builded file, you can import <code>Mitum</code> like below

```jsx
//esm_test.mjs
import Mitum from "./dist/esm_test.mjs";

const mitum = new Mitum(/* "RPC-URL" */);
```


> **⚠️ Note**
> 
> If you want to specify whether to use CommonJS or ESM in your package, add the following entry in the <code>package.json</code> : </br>
> <code>"type": "commonjs"</code> or <code>"type": "module"</code>. <br>
> Also, consider explicitly specifying the file extension as <code>.cjs</code> or <code>.mjs</code> rather than <code>.js</code> in the execution file.</br>

</br>


## Functions

**Important note** **about using functions :**

The operation of Mitum is a transaction ‘message’.

Thus if function returns an operation object, remember that you **haven't sent an operation to the network.**

Any operation returned by the function is a raw transaction object, which **requires additional signing.**

Signed operation object must be **sent to the network via the operation.send() function.**
(This is similar to web3.js and ethers.js).

</br> 

## Mitum JS SDK user guide

Futher etailed information on how to use each function and the contract model can be found at the link below.

*Be sure to check it out before using SDK.* 

<a href="https://socialinfratech.gitbook.io/mitum-js-sdk/introduction/installation"> 📖 Mitum JS SDK user guide </a>