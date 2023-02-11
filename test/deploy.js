const hre = require("hardhat");

async function main() {
  const NewContract = await hre.ethers.getContractFactory("Escrow");
  const [arbiter, beneficiary] = await ethers.getSigners();
  const newContract = await NewContract.deploy(arbiter.address,beneficiary.address,{value:1});

  await newContract.deployed();

  console.log(
    `The New Contract address is: ${newContract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
