

./bin/cryptogen generate --config=./crypto-config.yaml

export FABRIC_CFG_PATH=$PWD

./bin/configtxgen -profile TwoOrgsOrdererGenesis -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block

export CHANNEL_NAME=tmcwabcochannel

./bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

./bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/WabcoMSPanchors.tx -channelID $CHANNEL_NAME -asOrg WabcoMSP

./bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/TmsMSPanchors.tx -channelID $CHANNEL_NAME -asOrg TmsMSP

export CHANNEL_NAME=tmcwabcochannel

peer channel create -o orderer.wabco.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/wabco.com/orderers/orderer.wabco.com/msp/tlscacerts/tlsca.wabco.com-cert.pem

peer channel join -b tmcwabcochannel.block

peer chaincode install -n mycc -v 1.0 -p github.com/chaincode/

peer chaincode instantiate -o orderer.wabco.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/wabco.com/orderers/orderer.wabco.com/msp/tlscacerts/tlsca.wabco.com-cert.pem -C $CHANNEL_NAME -n mycc -v 1.0 -c '{"Args":[]}' -P "OR ('WabcoMSP.peer')"


peer chaincode invoke -o orderer.wabco.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/wabco.com/orderers/orderer.wabco.com/msp/tlscacerts/tlsca.wabco.com-cert.pem -C $CHANNEL_NAME -n mycc --peerAddresses peer0.wabco.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/wabco.com/peers/peer0.wabco.com/tls/ca.crt  -c '{"Args":["addProduct","{\"loading_list\": \"32/987-45678\",\"delivery_nbr\": \"21/67242\",\"vendor\": \"Venus group\",\"recipient\": \"WABCO ASDF\",\"street\": \"123 chennai\",\"country\": \"IN\",\"postal\": \"123456\",\"city\": \"chennai\",\"nbr_packages\": 3,\"pallets\": \"EB\",\"weight\": 32.65,\"gross_weight\": 45.55,\"volume\": 1.45,\"volume_on\": 12.5,\"truck\": \"CH011234\",\"delivery_date\": \"2019-05-28T14:51:45.334Z\",\"nb\": 1,\"nbr\": 3,\"transportation_charges\": \"ASDF\",\"goods_receipt_date\": \"2019-05-28T14:51:45.334Z\"}"]}'

peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["getProduct","af240654102c71474953d054ed5f24ff900424a7e462631cd76eb12f091c6721"]}'