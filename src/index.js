const test = 'This is a text';
//this is test bellow
let myData;
let main = document.querySelector('.email')

fetch('https://polar-reaches-49806.herokuapp.com/api?page=1&category=primary')
.then(response => response.json())
.then((data)=>{
  onReady(data)})
  .catch((error) => {
    console.error('Error:', error);
  });
  
function onReady(fetchedData){
  listAllEmails(fetchedData)
  myData = fetchedData
}
function listAllEmails(data){ 
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  let emailList = document.querySelector('.email')
  let list = document.querySelector('.email-list-wrapper')
  
  for (let i = 0; i < data.next.limit; i++) {
    if (data.items.length === 0){
      list.style.visibility = 'none' 
      return 
    }
    else {
      
      let anEmail = list.cloneNode(true)
      let senderName = document.querySelectorAll('.sender-name')[i]
      let senderEmail = document.querySelectorAll('.sender-email')[i]
      let messageTitle = document.querySelectorAll('.message-title')[i]
      let emailTime = document.querySelectorAll('.email-time')[i]
      let emailDate = new Date(data.items[i].date)
      let stringDate = `${emailDate.getDate()} ${monthNames[emailDate.getMonth()].substr(0,3)}`
      senderName.innerHTML = data.items[i].senderName
      senderEmail.innerHTML = data.items[i].senderEmail
      messageTitle.innerHTML = data.items[i].messageTitle
      emailTime.innerHTML = stringDate
      emailList.appendChild(anEmail)
      console.log()
    }
  }
}
  








