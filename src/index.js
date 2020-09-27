const test = 'This is a text';
//this is test bellow
let myData;
let main = document.querySelector('.email')
let tabs = document.querySelector('.tab')
let tabsBorder = document.querySelectorAll('.bottom')
let social = new Object(myData)

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
      let message = document.querySelectorAll('.message')[i]
      let emailTime = document.querySelectorAll('.email-time')[i]
      let emailDate = new Date(data.items[i].date)
      let stringDate = `${emailDate.getDate()} ${monthNames[emailDate.getMonth()].substr(0,3)}`
      senderName.innerHTML = data.items[i].senderName
      // senderEmail.innerHTML = data.items[i].senderEmail
      messageTitle.innerHTML = data.items[i].messageTitle
      message.innerHTML = data.items[i].messages[0].message
      emailTime.innerHTML = stringDate
      emailList.appendChild(anEmail)
    }
  }
}
  
for (let i = 0; i < tabs.children.length; i++) {
  tabs.children[i].setAttribute('area-label', tabs.children[i].innerText)
  tabsBorder[i].setAttribute('area-label', tabs.children[i].innerText)
}
  
tabs.addEventListener('click', tabsClicked)
  
function tabsClicked(e){
  if (e.target.nodeName !== 'DIV') return
  let curr = e.target
  for (let i = 0; i < tabsBorder.length; i++) {
    tabsBorder[i]
    tabs.children[i].removeAttribute('style')
    if (tabsBorder[i].classList.contains('tabs')){
      tabsBorder[i].classList.remove('tabs')
    }
    tabsBorder[i].style.backgroundColor = 'transparent'
  }
  curr.children[1].classList.add('tabs')
  curr.style.color = tabsColor(curr)
  curr.children[1].style.backgroundColor = tabsColor(curr)
  // social.next = 20
  console.log(social.next)
}

function tabsColor(curr) {
  return curr.getAttribute('area-label') == 'Primary'? '#D93025' 
  : curr.getAttribute('area-label') == 'Social'? '#1A73E8' 
  : curr.getAttribute('area-label') == 'Promotions'? '#188038' 
  : curr.getAttribute('area-label') == 'Updates' ? '#DD7607'
  : 'none'
}
tabs.children[0].click()







