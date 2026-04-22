import { createSlice } from "@reduxjs/toolkit";


const authSlice=createSlice({

name:"auth",
initialState:{
    user:null
    ,loading:true,
    error:null,
    loader:false
},
reducers:{
    setuser:(state,action)=>{
state.user=action.payload;
    },
    setloading:(state,action)=>{
state.loading=action.payload;
    },
    seterror:(state,action)=>{
state.error=action.payload;
    },
    setloader:(state,action)=>{
state.loader=action.payload;
    }
}

})

export const {seterror,setloading,setuser,setloader}=authSlice.actions;

export default authSlice.reducer;