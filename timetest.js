const { Mitum } = require("./cjs");

const mitum = new Mitum("http://127.0.0.1:54320");

const exp = (str, value) => {
  console.log("");
  console.log(
    "=================================================================="
  );
  console.log(str);
  console.log(
    "------------------------------------------------------------------"
  );
  console.log(value);
  console.log("");
};

const test = async () => {
  const sender = "8DtafRFAvcvXgYHwvsUToY9UT4hkfRxi4AsCNPzWs5Y4mca";
  const currencyID = "MCC";
  const pubkey = "oxaoi8FuZpLJkEU8kStm8dndhwbo4FtfcCiJo76MkpiQmpu";
  const privatekey = "DNQF7ruLFUD8ZXXrZimjFZdHAJSwc754dz1JdGADwTEDmpr";

  // contract 계정 생성
  //   const ca1 = mitum.contract.create(sender, pubkey, currencyID, 100000);
  //   const s1 = mitum.operation.sign(privatekey, ca1);
  //   const res = await mitum.operation.send(s1);
  //   exp("axios result", res.status);

  // test 에 사용할 계정 생성
  //   const p1 = "28V9psXoGyjQ5cVtDLSFddHSaBnMYV95Y8kpJUk4rQKREmpu";
  //   const p2 = "diLUcZugeDFW6ftQdcjdz8Ks1KBGiACo9GAcKQUgwFdfmpu";
  //   const pa1 = mitum.account.create(sender, p1, currencyID, 111111);
  //   const pa2 = mitum.account.create(sender, p2, currencyID, 222222);
  //   const ss1 = mitum.operation.sign(privatekey, pa1);
  //   const ss2 = mitum.operation.sign(privatekey, pa2);
  //   const res1 = await mitum.operation.send(ss1);
  //   const res2 = await mitum.operation.send(ss2);
  //   console.log(res1.status);
  //   console.log(res2.status);

  const contract = "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca";
  const serviceId = "SIT";
  const projectId = "protocon";
  const a1 = "3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca";
  const a2 = "2VKEH78tLMJ71KXzYQUFej5LmwprqiRSC44E2ax2tn8Bmca";
  const priv1 = "CHNoLNrykannTec3L1Aa1kXsDkC2QS2tDXrTxhHAcySwmpr";
  const priv2 = "62LMhQdA2BabwWTyA5Y4gipeby8uUtz39MWJt8vSXxGvmpr";

  mitum.timestamp.setContractAddress(contract);
  mitum.timestamp.setServiceId(serviceId);

  // createTimestampService
  //   const oper1 = mitum.timestamp.createTimestampService(
  //     sender,
  //     serviceId,
  //     currencyID
  //   );
  //   const s3 = mitum.operation.sign(privatekey, oper1);
  //   const res1 = await mitum.operation.send(s3);
  //   console.log(oper1);
  //   console.log(res1.status);

  // get service info ******************************************************
  //   const info1 = await mitum.timestamp.getServiceInfo();
  //   console.log(info1.data);

  // append
  //   const requestTimeNumber = 6000000;
  //   const data =
  //     "/Users/justinpark/Desktop/mitumsdk/mitumjs/cjs/contract/timestamp/information.js:27";
  //   const oper = mitum.timestamp.append(
  //     sender,
  //     projectId,
  //     requestTimeNumber,
  //     data,
  //     currencyID
  //   );
  //   const s4 = mitum.operation.sign(privatekey, oper);
  //   const res = await mitum.operation.send(s4);
  //   console.log(oper);
  //   console.log(res.status);

  // getTimestampInfo ******************************************************
  //   const data = await mitum.timestamp.getTimestampInfo(serviceId, projectId, 0);
  //   console.log(data.data);
};

test();
