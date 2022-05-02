
import { create } from "domain";
import { stat } from "fs";
import { useReducer } from "react";

import React from "react";
import { useContext, useState, createContext, useEffect } from "react";
import ReactDOM from "react-dom";

//manage hasconnect context from user context. 
import { useHashConnect } from "./Hashpack";
//inital metaswap user data

//use intefaces for all objects 

interface propsTypes {
    children: React.ReactNode
}
interface userProps{
    accountId: string,
    loggedIn: boolean
    profilePic : string,

}
// export interface userContext {

//         accountId: string,
//         userName: string,
//         bio: string,
//         loggedIn: false,
//         joinDate: string,
//         instagramLink: string,
//         twitter: string,
//         profilePic: string, 
//         Followers: string[]|null,
//         Following: string[]|null,
//         NFTs: NFTs | null,
//     setUserDetails: () => void;

// }
export interface userContextAPIProvider {
    accountId: string,
    profilePic: string,
    loggedIn: boolean,
    setUserDetails: ({}:userProps) => void

}


//User state interface type
interface userState {
  accountId: string, 
  userName: string, 
  NFTs: [],
  LoggedIn: boolean,
  // followers: [],
  // following: [],
  // likedItems: []
}

//inital user object 
const initialUserState: userState = {
  accountId: "MetaswapUser",
  userName: "MetaswapUser",
  NFTs: [],
  LoggedIn: false

}

//POSSIBLE ACTION Kinds enumeration 
enum ActionKind{
  updateUser = 'UPDATE',
  readUser = 'READ',
  logUser = 'LogInSwitch'
}


//actiond and payload type
type Action = {
  type: ActionKind,
  payload: any
}


function userReducer(state: userState, action: Action){
  const {type, payload} = action;
  switch (type) {
    case ActionKind.updateUser:
      console.log("Update user from udx typescript")
      return{
        ...state,
      }
    case ActionKind.logUser:

    console.log("Log user in from udx typescript")
      return{
        ...state,
      }
    default: 
    return state
  }
}


//IDX Context
export const IDXuserDetailsContext = 
React.createContext<userContextAPIProvider>({
   accountId: 'ERROR!!!',
   profilePic: "https://source.unsplash.com/random",
   loggedIn: false,
   setUserDetails: () => {}
});







export function CreateActions (dispatch: any) {
  return{
    //dispatch funcitons 
    // updateProfile: () => dispatch({type: 'updateProfile'}),
    dispatch
  }
}



//userContextProvider
export default function  IDXUserContextDetailsProvider ({ children }: propsTypes) { 


//state and dispatch of user functions.
const [state, dispatch] = useReducer(userReducer, initialUserState);


  //setUser State controls 
 const setUserDetails = ( {
   accountId,
   loggedIn ,
   profilePic 
 }: userProps) => {

  console.log("Setting the User!")
  updateUserDetails( prevState =>{
    const newState = {...prevState, ...{profilePic,accountId,loggedIn }}

    //Check if user is being logged in.
    if (loggedIn == true) {
      console.log("being logged in.")

      //Login with IDX and assign all other necessary attributes to account ID


      //perform authentication with credentials?
    }else{
      console.log("being logged out.")

    }


    console.log(`Previous state : ${prevState}`)
    console.log(`New state : ${newState}`)
    console.log(newState)






    return newState
    })
   }


   //random use effect to load any ncessary data...
   useEffect(() => {
       console.log("use effect for idx context called")

    
  //-=-=-=-=-==-=-=--==-
    return () => {
      // Detach existing handlers
    
    };

  }, []);

  //User state
    const State: userContextAPIProvider ={
     accountId: "NO ERRORS",
     profilePic: "https://source.unsplash.com/random",
     loggedIn: false,
     setUserDetails: setUserDetails,
     
    }
  
const [userDetails, updateUserDetails] = useState<userContextAPIProvider>(State);

//userdetails are a memoized version of the user dispatch functions.
return (
<IDXuserDetailsContext.Provider value={userDetails}>
  {children}
</IDXuserDetailsContext.Provider>

)

}

export function useIDX(){
    const value = React.useContext(IDXuserDetailsContext)
    return value
}



  //userProvider



  ///example loading context



