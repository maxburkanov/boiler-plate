const test = 'This is a text';
//this is test bellow
var emailData; 
let main = document.querySelector('.email')
fetch('https://polar-reaches-49806.herokuapp.com/api?page=1&category=primary')
  .then(response => response.json())
  .then((data)=>{
    emailData = data
    ready()
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
  function ready(){
    // console.log(2, emailData)
    mail(emailData)
  }
  function mail(a){
    console.log(a.items)
  }
