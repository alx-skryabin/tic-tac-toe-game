import {createSlice} from '@reduxjs/toolkit'

export interface SystemState {
  profile: {}
}

const initialState: SystemState = {
  profile: {}
}

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload.profile
    }
  }
})

export const {setProfile} = systemSlice.actions

export default systemSlice.reducer
