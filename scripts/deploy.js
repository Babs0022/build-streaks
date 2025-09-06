const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying BuildStreak contract...");

  const BuildStreak = await ethers.getContractFactory("BuildStreak");
  const buildStreak = await BuildStreak.deploy();

  await buildStreak.waitForDeployment();

  const address = await buildStreak.getAddress();
  console.log("BuildStreak deployed to:", address);

  // Verify contract on BaseScan
  console.log("Waiting for block confirmations...");
  await buildStreak.deploymentTransaction().wait(6);

  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on BaseScan!");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
