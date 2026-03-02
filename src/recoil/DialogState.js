import { atom } from "recoil";

export const dialogMessageState = atom({
  key: "dialogMessageState",
  default:""
})


export const showConfirmModalState = atom({
    key: "showConfirmModalState",
    default:false
  })

  export const confirmValueState = atom({
    key: "confirmValueState",
    default:false
  })


  export const successModalState = atom({
    key: "successModalState",
    default:false
  })
  
  export const successValueState = atom({
    key: "successValueState",
    default:false
  })
  

  export const failedModalState = atom({
    key: "failedModalState",
    default:false
  })
  

  export const failedValueState = atom({
    key: "failedState",
    default:false
  })
  

  export const displayConfirmSaveDialogState = atom({
    key: "displayConfirmSaveDialogState",
    default:false
  })
  
  
  export const suscessDialogState = atom({
    key: "suscessDialogState",
    default:false
  })
  
  export const unSuscessDialogState = atom({
    key: "unSuscessDialogState",
    default:false
  })
  