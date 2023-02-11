const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  
  describe('escrow', function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContractAndSetVariables() {
    //   const Escrow = await ethers.getContractAt('Escrow',"0x5FbDB2315678afecb367f032d93F642f64180aa3");
      const Escrow = await hre.ethers.getContractFactory("Escrow");
      const [arbiter, beneficiary] = await ethers.getSigners();
      const escrow = await Escrow.deploy(arbiter.address,beneficiary.address,{value:1});

      await escrow.deployed();

  
      return { escrow,arbiter,beneficiary };
    }
  
    it('Should expect the transaction to be reverted', async function () {
      const { escrow,arbiter,beneficiary } = await loadFixture(deployContractAndSetVariables);
      expect( await escrow.connect(arbiter).revertDeposit()).to.be.reverted;
  
    });

    it('Should expect the deposit to be sent back to owner', async function () {
      const { escrow,arbiter,beneficiary } = await loadFixture(deployContractAndSetVariables);
      expect( await escrow.revertDeposit());
  
    });

    it('Should not let you change the arbiter', async function () {
        const { escrow,arbiter,beneficiary } = await loadFixture(deployContractAndSetVariables);
        expect( await escrow.connect(beneficiary).changeArbiter(beneficiary.address)).to.be.reverted;
      });
  
    it('Should  let you change the arbiter', async function () {
        const { escrow,arbiter,beneficiary } = await loadFixture(deployContractAndSetVariables);
        expect( await escrow.connect(arbiter).changeArbiter(beneficiary.address));
    
      });
  
  });