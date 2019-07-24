/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
var XLSX = require('xlsx')
const ccpPath = path.resolve(__dirname, '..', 'Config', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

class UserController {
    constructor() {
        console.log("constructer called")
    }
    async  RegisterUser(data) {
        try {
            let response = {};
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "Register an identity first";
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('tmcwabcochannel');

            // Get the contract from the network.
            const contract = network.getContract('mycc');


            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
            console.log(data)
            console.log('here')
            const channel = network.getChannel();
            // let eventhuborg = channel.newChannelEventHub('peer0.org1.example.com');
            // console.log(eventhuborg);
            // eventhuborg.connect()
            // let block_reg = eventhuborg.registerBlockEvent((block) => {
            //     console.log('Successfully received the block event');
            //     console.log(block)
            // }, (error) => {
            //     console.log('Failed to receive the block event ::' + error);

            // });

            let result = await contract.submitTransaction('addProduct', JSON.stringify(data));

            console.log('Transaction has been submitted');
            // Disconnect from the gateway.

            await gateway.disconnect();

            response.data = result.toString();

            response.httpstatus = 200;
            response.message = "Transaction has been submitted";

            return response;
        } catch (error) {
            response.error = error;
            response.httpstatus = 500;
            response.message = "something went wrong";
            return response;
        }
    }
    async  GetUser(id) {
        try {

            // Create a new file system based wallet for managing identities.
            let response = {};
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "Register an identity first";
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('tmcwabcochannel');

            // Get the contract from the network.
            const contract = network.getContract('mycc');

            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('getProduct', id);
            response.data = result.toString();
            response.httpstatus = 200;
            response.message = "Transaction has been evaluated";
            return response;


        } catch (error) {
            response.error = error;
            response.httpstatus = 500;
            response.message = "something went wrong";
            return response;
        }
    }

    async  uploadExcel(req) {
        try {

            let response = {};
            if (!req.file) {
                response.httpstatus = 400;
                response.message = "Please upload the file!";
                return response;
            }

            var workbook = XLSX.readFile(req.file.path, {
                cellDates: true
            });
            var sheet_name_list = workbook.SheetNames;
            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "Register an identity first";
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('tmcwabcochannel');

            // Get the contract from the network.
            const contract = network.getContract('mycc');

            (async () => {
                //console.log(typeof xlData)
                console.log(xlData.length)
                // check the data
                for (let i in xlData) {
                    var key, keys = Object.keys(xlData[i]);
                    var n = keys.length;

                    console.log(n)
                    var newobj = {}
                    while (n--) {
                        key = keys[n];
                        newobj[key.toLowerCase()] = xlData[i][key];
                    }
                    console.log(newobj);
                    await contract.submitTransaction('addProduct', JSON.stringify(newobj));
                    console.info(`${i} record added.`);
                }
            })().then(data => {
                console.log("All the records has been imported");
            }).catch(error => {
                console.error(error.error);
            });

            response.httpstatus = 200;
            response.message = "Records will be imported shortly!";
            return response;

        } catch (error) {
            response.error = error;
            response.httpstatus = 500;
            response.message = "something went wrong";
            return response;
        }
    }
}
module.exports = UserController;

