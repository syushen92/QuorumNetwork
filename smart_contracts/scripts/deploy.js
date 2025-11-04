import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    // deploy RecordStorage contract
    const RecordStorage = await ethers.getContractFactory("RecordStorage");
    const recordStorage = await RecordStorage.deploy();
    const address = await recordStorage.getAddress();
    
    console.log("RecordStorage deployed to:", address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });