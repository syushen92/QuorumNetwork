// import hardhat from "hardhat";

// const { ethers } = hardhat;

// async function main() {
//   // deploy Counter contract
//   const Counter = await ethers.getContractFactory("Counter");
//   const counter = await Counter.deploy();
//   await counter.deployed();
//   console.log("Counter deployed to:", counter.address);

//   // deploy RecordStorage contract
//   const RecordStorage = await ethers.getContractFactory("RecordStorage");
//   const recordStorage = await RecordStorage.deploy(123);
//   await recordStorage.deployed();
//   console.log("RecordStorage deployed to:", recordStorage.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {

    // deploy Counter contract
    // const Counter = await ethers.getContractFactory("Counter"); // 取得合約工廠
    // const counter = await Counter.deploy(); // 部署合約
    // await counter.deployed(); // 等待部署完成
    // console.log("Counter deployed to:", counter.address);

    // deploy RecordStorage contract
    const RecordStorage = await ethers.getContractFactory("RecordStorage");
    const recordStorage = await RecordStorage.deploy({
      gasLimit: 100000
    });
    // await recordStorage.deployed();

    // ether v6
    const address = await recordStorage.getAddress();
    console.log("RecordStorage deployed to:", address);

    // 檢查交易 receipt
    // const txReceipt = await recordStorage.deploymentTransaction().wait();
    // console.log("Deployment transaction hash:", txReceipt.transactionHash);
    // console.log("Block number:", txReceipt.blockNumber);

    // 寫入一筆資料
    const tx = await recordStorage.addRecord("Hello Quorum");
    await tx.wait(); // 等待交易完成
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 遇到問題：ES Module 與 CommonJS 衝突