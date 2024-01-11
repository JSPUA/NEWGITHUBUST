const initialState = {
    icNo: '',
    activeTab: '',
  };
  
  function userReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          icNo: action.payload.icNo,
          activeTab: action.payload.activeTab,
        };
      default:
        return state;
    }
  }
  
  export default userReducer;