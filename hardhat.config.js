import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      // 本地測試鏈
      // Hardhat v3 開始不支援 type: "edr-simulated"，可先用預設
    },
    quorum: {
      url: process.env.QUORUM_RPC_URL || "http://127.0.0.1:8545",
      accounts: process.env.QUORUM_PRIVATE_KEY ? [process.env.QUORUM_PRIVATE_KEY] : [],
    },
  },
};

export default config;

// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox-viem";
// import * as dotenv from "dotenv";

// dotenv.config();

// const config: HardhatUserConfig = {
//   solidity: "0.8.28",
//   networks: {
//     hardhat: { // 本地測試鏈
//       type: "edr-simulated"
//     },
//     quorum: {
//       type: "http", // Quorum 使用 HTTP RPC
//       url: process.env.QUORUM_RPC_URL!,
//       accounts: [process.env.QUORUM_PRIVATE_KEY!], // 用 dotenv 載入
//     },
//   },
// };

// export default config;
