

import { create } from "domain";

import React from "react";
import { useContext, useState, createContext, useEffect } from "react";
import ReactDOM from "react-dom";

//manage hasconnect context from user context. 
import { useHashConnect } from "./Hashpack";
//inital metaswap user data

//use intefaces for all objects 


//MetaswapUser: {}
//userContext initialized with metaswap User
export const userDetailsContext = createContext({
  accountId: '',
  username: '',
  bio: '',
  joinDate: '',
  NFTs: {},
  setUserDetails: () => {}
  } )

//userContextProvider
export const UserContextDetailsProvider = ({ children}) => { 

//hashconnect context information to be managed from user context internally
const { connect, walletData, installedExtensions } = useHashConnect();
const { accountIds, netWork, id } = walletData;

  //setUser State controls 
 const setUserDetails = ({
   accountId,
   loggedIn
  
 }) => {

  console.log("Its working, got a response from hashpack and called provider function!")

  updateUserDetails( prevState =>{
    const newState = {...prevState, ...{accountId,loggedIn }}
    console.log(`Previous state : ${prevState}`)
    console.log(newState)
    return newState
      
    })



   }


const checkIfConnected = ({}) =>{
  console.log("Working!")
}


   useEffect(() => {
    //setUserDetails to hashconnect 
console.log("Connected user page loaded")
  //-=-=-=-=-==-=-=--==-
    return () => {
      // Detach existing handlers
      
    
    };

  }, []);

  //userState
    const userState = {
      accountId: "0.0.000000",
      userName: "@initialized From Provider",
      Bio:" The first account on Metaswap",
      loggedIn: false,
      instagramLink: "vintage.inspried",
      twitter: "VTG.inspired",
      profilePic: "https://source.unsplash.com/random", 
      Followers: [ "0.0.524493","0.0.522113","0.0.522113"],
      Following: [ "0.0.524343","0.0.527793","0.0.523593"],
      NFTs: [
        { "TokenId1" : ["",""] },
        { "TokenId2" : ["",""] },
        { "TokenId3" : ["",""] },
        { "TokenId4" : ["",""] },
      ],
      setUserDetails
    }
  
const [userDetails, updateUserDetails] = useState(userState);


return (
<userDetailsContext.Provider value={userDetails}>
  {children}
</userDetailsContext.Provider>

)

}



  //userProvider



  ///example loading context



