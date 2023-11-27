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
$ npm run build
# link locally
$ npm link
# Use in another project
$ cd another_project_folder
$ npm link mitum
```

</br> 

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