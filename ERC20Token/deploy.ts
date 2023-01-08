const hre = require("hardhat");

async function main() {
  const NaderToken = await hre.ethers.getContractFactory("NaderToken");
  const naderToken = await NaderToken.deploy("1000000000000000000000000000");

  await naderToken.deployed();

  console.log("Token deployed to:", naderToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });