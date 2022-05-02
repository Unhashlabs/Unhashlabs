import {  Client,
  PrivateKey,
  HbarUnit,
  TransferTransaction,
  Transaction,
  AccountId,
  Hbar,
  TransactionId,
  PublicKey } from "@hashgraph/sdk";

import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import React, { useContext, useEffect, useState } from "react";

import { userDetailsContext } from "./connectedUser";
import { useIDX } from "./idxUserContext";
//import {useHedera} from '../APIs/Hedera'

//Type declarations

 interface idxUser {
  accountId: string,
  setUserDetails: () => void;
}
interface userProps{
  accountId: string,
  loggedIn: boolean

}

interface SaveData {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: HashConnectTypes.WalletMetadata | null;
  pairedAccounts: string[];
  netWork?: string;
  id?: string;
  accountIds?: string[];
}

interface setUserDetails{
  accountId: string,
  loggedin:boolean
}

type Networks = "testnet" | "mainnet" | "previewnet";

interface PropsType {
  children: React.ReactNode;
  hashConnect: HashConnect;
  netWork: Networks;
  metaData?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

export interface HashConnectProviderAPI {
  connect: () => void;
  walletData: SaveData;
  netWork: Networks;
  metaData?: HashConnectTypes.AppMetadata;
  installedExtensions: HashConnectTypes.WalletMetadata | null;
}


const availableExtensions: HashConnectTypes.WalletMetadata[] = [];

const INITIAL_SAVE_DATA: SaveData = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedAccounts: [],
  pairedWalletData: null,
};

let APP_CONFIG: HashConnectTypes.AppMetadata = {
  name: "Metaswap",
  description: "The most interoperable marketplace ever.",
  icon: "https://absolute.url/to/icon.png",
};

const loadLocalData = (): null | SaveData => {
  let foundData = localStorage.getItem("  hashConnectData");

  if (foundData) {
    console.log("Found data!")
    const saveData: SaveData = JSON.parse(foundData);
    // setSaveData(saveData);
    return saveData;
  } else return null;
};



//Hashconnect Context 
export const HashConnectAPIContext =
  React.createContext<HashConnectProviderAPI>({
    //Props to be potentially passed to context  //1 function and 4 data stores
    connect: () => null,
    walletData: INITIAL_SAVE_DATA,
    netWork: "mainnet",
    installedExtensions: null,
  });



  //Hashconnect Context Provider
export default function HashConnectProvider({
  children,
  hashConnect,
  metaData,
  netWork,
  debug,
}: PropsType) {
  //Saving Wallet Details in Ustate

  const {setUserDetails, accountId} = useIDX()

  

  const [saveData, SetSaveData] = useState<SaveData>(INITIAL_SAVE_DATA);
  const [installedExtensions, setInstalledExtensions] = useState<HashConnectTypes.WalletMetadata | null>(null);
   
  //? Initialize the package in mount
  const initializeHashConnect = async () => {
    const saveData = INITIAL_SAVE_DATA;
    const localData = loadLocalData();
    try {

      console.log("||| Initializing HashConnect ! |||  ")
      if (!localData) {
        if (debug) console.log("===Local data not found.=====");

        //first init and store the private for later
        let initData = await hashConnect.init(metaData ?? APP_CONFIG);
        saveData.privateKey = initData.privKey;

        //then connect, storing the new topic for later
        const state = await hashConnect.connect();
        saveData.topic = state.topic;

        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = hashConnect.generatePairingString(
          state,
          netWork,
          false
        );

        //find any supported local wallets (only works on https)
        hashConnect.findLocalWallets();

        console.log("||| done initializing after no data was found |||  ")
      } else {
        if (debug) console.log("====Local data found====", localData);
        //use loaded data for initialization + connection
        hashConnect.init(metaData ?? APP_CONFIG, localData?.privateKey);
        hashConnect.connect(
          localData?.topic,
          localData?.pairedWalletData ?? metaData
        );
        console.log("Hashpack Info")
        console.log(hashConnect)
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (localData) {
        SetSaveData((prevData) => ({ ...prevData, ...localData }));
      } else {
        SetSaveData((prevData) => ({ ...prevData, ...saveData }));
      }
      if (debug) console.log("====Wallet details updated to state====");
    }
  };

  //Signing service
  //Add private Key
  const signAndMakeBytes = async (trans: Transaction, signingAcctId: string) => {

    const privKey = PrivateKey.fromString("302e020100300506032b65700422042042504be0cbdcb40f45bd5c3cf54b2af95b3e6ffa30a324bf8d8e56f592079dc6");
    const pubKey = privKey.publicKey;

    let nodeId = [new AccountId(3)];
    let transId = TransactionId.generate(signingAcctId)
    
    trans.setNodeAccountIds(nodeId);
    trans.setTransactionId(transId);
    
    trans = await trans.freeze();

    let transBytes = trans.toBytes();

    const sig = await privKey.signTransaction(Transaction.fromBytes(transBytes) as any);

    const out = trans.addSignature(pubKey, sig);

    const outBytes = out.toBytes();
    
    console.log("Transaction bytes", outBytes);

    return outBytes;
  }
  const makebytes = async  (trans: Transaction, signingAcctId: string) => {
        
    let transId = TransactionId.generate(signingAcctId)
    trans.setTransactionId(transId);
    trans.setNodeAccountIds([new AccountId(3)]);

    await trans.freeze();
    
    let transBytes = trans.toBytes();

    return transBytes;
}


  const saveDataInLocalStorage = (data: MessageTypes.ApprovePairing) => {
    if (debug)
      console.info("===============Saving to localstorage::=============");
    const { metadata, ...restData } = data;
    SetSaveData((prevSaveData) => {
      prevSaveData.pairedWalletData = metadata;
      return { ...prevSaveData, ...restData };
    });
    let dataToSave = JSON.stringify(data);
    localStorage.setItem("hashconnectData", dataToSave);
  };

  const additionalAccountResponseEventHandler = (
    data: MessageTypes.AdditionalAccountResponse
  ) => {
    if (debug) console.debug("=====additionalAccountResponseEvent======", data);
    // Do a thing
  };

  const foundExtensionEventHandler = (
    data: HashConnectTypes.WalletMetadata
  ) => {
    if (debug) console.debug("====foundExtensionEvent====", data);
    // Do a thing
    setInstalledExtensions(data);
  };

  const pairingEventHandler = (data: MessageTypes.ApprovePairing) => {
    console.log("Handling pairing event.")
    if (debug) console.log("====pairingEvent:::Wallet connected=====", data);
    // Save Data to localStorage
    saveDataInLocalStorage(data);
  };

  useEffect(() => {
    //Intialize the setup
    console.log("Initializing hashconnect")
    initializeHashConnect();
    console.log(hashConnect)
  //Create event handlers //Suggested implementation from discord guy

  const additionalAccountResponseEventHandler = (data: any) => {
    console.debug('additionalAccountResponseEvent', data)
    // Do a thing
  }
  const foundExtensionEventHandler = (data: any) => {
    console.debug('foundExtensionEvent', data)
    // Do a thing
  }
  const pairingEventHandler = (data: any) => {
    //console.log('pairingEvent', data)
   // console.log(data.accountIds[0])
    //use savedata to loacal storage function

  //does not work without typescript

    console.log(`User Logged in from hashpack! now do a thing here with id ${accountId}`)
    //set user details which reveals open layout automatically: 

    // Do a thing
    //Stage the user to be logged into IDX by loading thir authID and displaying the secret message box.
    setUserDetails({accountId: data.accountIds[0], loggedIn: false, profilePic: "noprofilePicBeforeLogin"})
    saveDataInLocalStorage(data)
    
  }

  // Attach event handlers
  hashConnect.additionalAccountRequestEvent.on(additionalAccountResponseEventHandler)
  // (only workd with https)
  hashConnect.foundExtensionEvent.on(foundExtensionEventHandler)
  hashConnect.pairingEvent.on(pairingEventHandler)

  //-=-=-=-=-==-=-=--==-
    return () => {
      // Detach existing handlers
       hashConnect.additionalAccountRequestEvent.off(additionalAccountResponseEventHandler)
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
    };

  }, []);

  //connect function to be passes to provider 
  const connect = () => {
    if (installedExtensions) {
      if (debug) console.log("Pairing String::", saveData.pairingString);
      hashConnect.connectToLocalWallet(saveData?.pairingString);
    } else {
      if (debug) console.log("====No Extension is not in browser====");
      return "wallet not installed";
    }
  };

  
  //TXN Signing Functions
  const sendTransaction = async (trans: Transaction, acctToSign: string) =>{

    let transactionBytes: Uint8Array = await signAndMakeBytes(trans, acctToSign)


    const transaction: MessageTypes.Transaction ={
      topic: saveData.topic,
      byteArray: transactionBytes,
      metadata:{
        accountToSign: acctToSign,
        returnTransaction: false
      }
    }

    let response = await hashConnect.sendTransaction(saveData.topic, transaction)
    console.log("Transaction successfully Sent!")

  }

  

  return (
    <HashConnectAPIContext.Provider
      value={{ connect, walletData: saveData, netWork, installedExtensions } }
    >
      {children}
    </HashConnectAPIContext.Provider>
  );
}



//Hashconnect props
const defaultProps: Partial<PropsType> = {
  metaData: {
    name: "Metaswap",
    description: "The most interoperable marketplace ever.",
    icon: "https://absolute.url/to/icon.png",
  },
  netWork: "mainnet",
  debug: false,
};
HashConnectProvider.defaultProps = defaultProps;

//exported hashconnect init function
 function useHashConnect() {
  const value = React.useContext(HashConnectAPIContext);
  return value;
}



export{useHashConnect}

