import {HardhatUserConfig, task} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";

// require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

task("accounts", "Prints the list of accounts", async (taskArgs: any, hre: any) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

module.exports = {
  solidity: "0.8.4",
  networks:{
    mumbai:{
      url: "https://polygon-mumbai.g.alchemy.com/v2/4fJe2lvB87sYoxydgO4x3iVnVIdJGVPg",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};

export default config;
