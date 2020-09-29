const test = 'This is a text';
//this is test bellow
let myData;
let main = document.querySelector('.email')
let tabs = document.querySelector('.tab')
let tabsBorder = document.querySelectorAll('.bottom')
let social;
let promotions;
let updates;
let newObj = {};
for (let i = 0; i < tabs.children.length; i++) {
  tabs.children[i].setAttribute('area-label', tabs.children[i].innerText)
  tabsBorder[i].setAttribute('area-label', tabs.children[i].innerText)
}
fetch('https://polar-reaches-49806.herokuapp.com/api?page=1&category=primary')
.then(response => response.json())
.then((data)=>{
  onReady(data) })
.catch((error) => {
  console.log(error);
});
function onReady(fetchedData){
  myData = fetchedData
  social = toSocial(fetchedData)
  promotions = toPromotions(fetchedData)
  updates = toUpdates(fetchedData)
  trigger.click()
  addIdToData(myData)
  listAllEmails(fetchedData)  
}
//event Listener on tabs  
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
  removeAllFromDom() 
  listAllEmails(detectWhichTab(curr))
}
// HELPER FUNCTION ADDED NEW
function detectWhichTab(e){
  let target = e.getAttribute('area-label')
  return target == 'Primary'? myData 
  : target == 'Social'? social 
  : target == 'Promotions'? promotions 
  : updates 
}
// HELPER FUNCTION ADDED NEW
function removeAllFromDom(){
  let lastChild = main.lastElementChild
  while (main.firstElementChild) {
    main.removeChild(main.firstChild);
  }
  main.appendChild(lastChild)
  return lastChild
}
//HELPER FUNCTION ADDED NEW
function tabsColor(curr) {
  /// loop tabs ad remove active class
  curr.classList.add('active')
  return curr.getAttribute('area-label') == 'Primary'? '#D93025' 
  : curr.getAttribute('area-label') == 'Social'? '#1A73E8' 
  : curr.getAttribute('area-label') == 'Promotions'? '#188038' 
  : curr.getAttribute('area-label') == 'Updates' ? '#DD7607'
  : 'none'
}
function listAllEmails(data){ 
  let list = document.querySelector('.email-list-wrapper')
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  for (let i = 0; i < data.items.length; i++) {
    if (data.items.length === 0){
      list.style.visibility = 'none' 
      return 
    }
    else {
      let anEmail = list.cloneNode(true)
      // let senderName = anEmail.children[0].children[3]
      let senderName = document.querySelectorAll('.sender-name')[i]
      let senderEmail = document.querySelectorAll('.sender-email')[i]
      let messageTitle = document.querySelectorAll('.message-title')[i]
      let message = document.querySelectorAll('.message')[i]
      let emailTime = document.querySelectorAll('.email-time')[i]
      let emailDate = new Date(data.items[i].date)
      let stringDate = `${emailDate.getDate()} ${monthNames[emailDate.getMonth()].substr(0,3)}`
      senderName.innerHTML = data.items[i].senderName
      messageTitle.innerHTML = data.items[i].messageTitle
      message.innerHTML = data.items[i].messages[0].message
      emailTime.innerHTML = stringDate
      anEmail.setAttribute('data-id', i)
      main.appendChild(anEmail)
    }
  }
}
function addIdToData(data) {
  for (let i = 0; i < data.items.length; i++) {
    data.items[i].id = i
  }
}
function toSocial(data){
  let social = {}
  social.items = data.items.filter((i)=>{
    return i.senderName == 'Facebook' || i.senderName == 'Seytech Co' 
  })
  social.next = data.next
  social.next.page = social.items.length < 50? 1 : 2
  social.total = social.items.length
  return social
}
//THIS SECTION IS FOR FILTERING RAW DATA
function toPromotions(data){
  let promotions = {}
  promotions.items = data.items.filter((i)=>{
    return i.senderName == 'Chase' || i.senderName == 'Seytech Co' 
  })
  promotions.next = data.next
  promotions.next.page = promotions.items.length < 50? 1 : 2
  promotions.total = promotions.items.length
  return promotions
}
function toUpdates(data){
  let updates = {}
  updates.items = data.items.filter((i)=>{
    return i.senderName == 'Michael Dunn' || i.senderName == 'Seytech Co' 
  })
  updates.next = data.next
  updates.next.page = updates.items.length < 50? 1 : 2
  updates.total = updates.items.length
  return updates
}
//FILTERING RAW DATA ENDS
var trigger = tabs.children[0];

document.querySelector('.inbox').addEventListener('click', ()=>{
  console.log(social)
})