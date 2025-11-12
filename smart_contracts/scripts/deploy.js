import hardhat from "hardhat";
import fs from "fs";
import path from "path";
const { ethers, network } = hardhat;

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function loadJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); }
  catch { return {}; }
}

async function main() {
    // deploy RecordStorage contract
    const RecordStorage = await ethers.getContractFactory("RecordStorage");
    const recordStorage = await RecordStorage.deploy();
    const address = await recordStorage.getAddress();
    console.log("RecordStorage deployed to:", address);

    // write deployment info to build/deployments/<network>.json
    const outDir = path.join(process.cwd(), "build");
    ensureDir(outDir);
    const outPath = path.join(outDir, `addresses.${network.name}.json`);

    const data = loadJsonSafe(outPath);
    data["RecordStorage"] = address;
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log(`Saved addresses to: ${outPath}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });