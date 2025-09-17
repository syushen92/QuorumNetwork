// import { ethers } from "hardhat";
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const address = "0x38Fef9ccf460A4d296f8327eBF7A9DfbD9135709"; // 已經部署好的合約
  const RecordStorage = await ethers.getContractFactory("RecordStorage");

  const provider = new ethers.WebSocketProvider("ws://127.0.0.1:8546"); 
  const recordStorage = new ethers.Contract(address, RecordStorage.interface, provider);

  console.log("Listening for events...");
  recordStorage.on("RecordUpdated", (id, content, creator, event) => {
    console.log("📢 Event RecordUpdated:");
    console.log("  id:", id.toString());
    console.log("  content:", content);
    console.log("  creator:", creator);
    console.log("  blockNumber:", event.blockNumber);
  });
}

main();
