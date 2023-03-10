import { Contract,ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import EscrowArtifact from './artifacts/contracts/Escrow.sol/Escrow';
import server from './server';
const CircularJSON = require('circular-json');



const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer,txAddress) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
  
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [information, setInformation] = useState([])

  //Gets and sets the signer
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  //Gets an array of objects from the server
  async function getInformations(){
    try{
      const response = await server.get(`information`);
      return response.data;
    }
    catch (ex) {
      
       console.error(ex)
     }
 }
  //calls getInformation to get objects and assigns them to the state variable
  useEffect(() => {
     async function main(){
      const info = await getInformations();
      setInformation(...information, info)
    }
    main();
  }, []);

  console.log("Im here", information)

  async function txApproved(txAddress) {

    try {
      await server.post(`/sendApproved`, {
        _txaddress: txAddress,
      });
    } catch (ex) {
      console.error(ex)
    }
  }
  
  //This function needs to be sent to Escrow.js
  const handleApprove = async (txString,signer,txAddress) => {
    //const provider = new ethers.getDefaultProvider('goerli');

    const escrowContract = CircularJSON.parse(txString);
    console.log("me")
    console.log(escrowContract)
    const escrowCon = new Contract(txAddress, EscrowArtifact.abi,signer);
        escrowCon.on('Approved', () => {
        document.getElementById(txAddress).className = 'complete';
        document.getElementById(txAddress).innerText = "??? It's been approved!";

      });

      const approveTxn = await escrowCon.approve();
      await approveTxn.wait();
      txApproved(txAddress) 
      
  };



  //This function gets called everytime a new contract is made
  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseUnits(document.getElementById('eth').value, "ether");
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    const info = await getInformations();
    console.log(info)
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "??? It's been approved!";
        });

        await approve(escrowContract, signer,escrowContract.address);
        txApproved(escrowContract.address) ;


      },
    };
    
    setEscrows([...escrows, escrow]);

  }



  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
        
          }}
        >
          Deploy
        </div>
      </div>
      <div className="existing-contracts">
        <h1> Contract Just Deployed</h1>
        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      <div className="existing-contracts">
      <h1> Previous Existing Contracts </h1>
      <div id="container">
        {information != null || information.data === 0 ? information.map((contractObject)=>{
            return <div> 
            <p>hello</p>
            <p>txAddress: {contractObject.txAddress} </p>
            <Escrow address={contractObject.txAddress}
            arbiter={contractObject.arbiter} 
            beneficiary={contractObject.beneficiary}
            value = {contractObject.value.hex}
            approved = {contractObject.approved}
            handleApprove={() => handleApprove(contractObject.txString,signer,contractObject.txAddress)}
             />
            </div>
          }) :"Deploy a contract"}
      </div>
      </div>
    </>
  );
}

export default App;
