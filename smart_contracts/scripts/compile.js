// ESM version
import path, { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs-extra";
import solc from "solc";

// 取得 __dirname (ESM 沒有內建)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contractsPath = path.resolve(__dirname, "../contracts");

function buildSources() {
  const sources = {};
  const contractsFiles = fs.readdirSync(contractsPath);
  contractsFiles.forEach((file) => {
    if (file.endsWith(".sol")) {
      const contractFullPath = path.resolve(contractsPath, file);
      sources[file] = {
        content: fs.readFileSync(contractFullPath, "utf8"),
      };
    }
  });
  return sources;
}

const input = {
  language: "Solidity",
  sources: buildSources(),
  settings: {
    outputSelection: {
      "*": {
        "*": ["*", "evm.bytecode"],
      },
    },
  },
};

function compileContracts() {
  const stringifiedJson = JSON.stringify(input);
  const compilationResult = solc.compile(stringifiedJson);
  const output = JSON.parse(compilationResult);

  const compiledContracts = output.contracts;
  for (let contract in compiledContracts) {
    for (let contractName in compiledContracts[contract]) {
      fs.outputJsonSync(
        path.resolve(contractsPath, `${contractName}.json`),
        compiledContracts[contract][contractName],
        { spaces: 2 }
      );
    }
  }
}

function main() {
  compileContracts();
  console.log("Contracts compiled successfully!");
}

// 判斷是否直接執行 (node scripts/compile.js)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export default main;




// const path = require('path');
// const fs = require('fs-extra');
// const solc = require('solc');

// const contractsPath = path.resolve(__dirname, '../', 'contracts');

// function buildSources() {
//   const sources = {};
//   const contractsFiles = fs.readdirSync(contractsPath);
//   contractsFiles.forEach(file => {
//     if(file.endsWith(".sol")){
//       const contractFullPath = path.resolve(contractsPath, file);
//       sources[file] = {
//         content: fs.readFileSync(contractFullPath, 'utf8')
//       };
//     }
//   });
//   return sources;
// }

// const input = {
// 	language: 'Solidity',
// 	sources: buildSources(),
// 	settings: {
// 		outputSelection: {
// 			'*': {
// 				'*': [ '*', 'evm.bytecode'  ]
// 			}
// 		}
// 	}
// }

// function compileContracts() {
//   const stringifiedJson = JSON.stringify(input);
//   const compilationResult = solc.compile(stringifiedJson);
//   const output = JSON.parse(compilationResult);
// 	const compiledContracts = output.contracts;
// 	for (let contract in compiledContracts) {
// 		for(let contractName in compiledContracts[contract]) {
// 			fs.outputJsonSync(
// 				path.resolve(contractsPath, `${contractName}.json`),
// 				compiledContracts[contract][contractName], { spaces: 2 }
// 			)
// 		}
// 	}
// }

// const main = () => {
// 	compileContracts();
// }

// if (require.main === module) {
//   main();
// }

// module.exports = exports = main


