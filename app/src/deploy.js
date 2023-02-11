import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';
import server from './server';
const CircularJSON = require('circular-json');


async function txStoragePost(arbiter,beneficiary,txAddress,value,txString) {

  try {
    await server.post(`/send`, {
      arbiter: arbiter,
      beneficiary : beneficiary,
      txAddress:txAddress,
      value:value,
      txString,txString,
    });
  } catch (ex) {
    console.error(ex)
  }
}

export default async function deploy(signer, arbiter, beneficiary, value) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer,
  );
  let tx = await factory.deploy(arbiter, beneficiary, { value });
  await tx.deployed();
  const txString = CircularJSON.stringify(tx)
  

  txStoragePost(arbiter,beneficiary,tx.address,value,txString);
  return tx;
}
