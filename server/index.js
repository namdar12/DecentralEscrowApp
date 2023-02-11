const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const CircularJSON = require('circular-json');



app.use(cors());
app.use(express.json());



const contracts = [];


app.get("/information", (req, res) => {
  res.send(contracts);
});


app.post("/send", async (req, res) => {

  const {arbiter,beneficiary,txAddress,value,txString} = req.body;
  const contractObject = {
                          arbiter:arbiter,
                          beneficiary:beneficiary,
                          txAddress:txAddress,
                          value:value,
                          txString:txString,
                          approved : false
                          };

  contracts.push(contractObject);
 
});

// app.post("/sendServer", async (req, res) => {

//   // const {contract} = req.body;
//   // console.log(contract);
//   const receivedData = JSON.parse(req.body);
//   console.log(receivedData)

// });

app.post("/sendApproved", async (req, res) => {
  const address = req.body;
  for(let i=0;i<contracts.length;i++){
    if(contracts[i].txAddress ===address){
      contracts[i].approved = true;
      break;
    }
  }
  

});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

// function setInitialBalance(address) {
//   if (!balances[address]) {
//     balances[address] = 0;
//   }
// }
