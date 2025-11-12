import fs from "fs";
import { Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const keystoreJson = fs.readFileSync("./keystore-key.json", "utf8");
const password = ""; // 通常 docker-compose 設定時有設定

const wallet = Wallet.fromEncryptedJsonSync(keystoreJson, password);

console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
