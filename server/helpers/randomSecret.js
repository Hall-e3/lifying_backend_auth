export const email_confirmation_code = ()=>{
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    var charactersLength = characters.length;
  
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return(result);
}