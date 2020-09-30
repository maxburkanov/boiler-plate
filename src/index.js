const test = 'This is a text';
//this is test bellow
let myData;
let main = document.querySelector('.email');
let tabs = document.querySelector('.tab');
let tabsBorder = document.querySelectorAll('.bottom');
let social;
let promotions;
let updates;
let newObj = {};

for (let i = 0; i < tabs.children.length; i++) {
  tabs.children[i].setAttribute('area-label', tabs.children[i].innerText);
  tabsBorder[i].setAttribute('area-label', tabs.children[i].innerText);
}

fetch('https://polar-reaches-49806.herokuapp.com/api?page=1&category=primary')
  .then((response) => response.json())
  .then((data) => {
    onReady(data);
  })
  .catch((error) => {
    console.log(error);
  });

function onReady(fetchedData) {
  myData = fetchedData;
  myData = addIdToData(myData);
  social = toSocial(myData);
  promotions = toPromotions(myData);
  updates = toUpdates(myData);
  listAllEmails(myData);
}

//event Listener on tabs
tabs.addEventListener('click', tabsClicked);
function tabsClicked(e) {
  if (e.target.nodeName !== 'DIV') return;
  let curr = e.target;
  for (let i = 0; i < tabsBorder.length; i++) {
    tabsBorder[i];
    tabs.children[i].removeAttribute('style');
    if (tabsBorder[i].classList.contains('tabs')) {
      tabsBorder[i].classList.remove('tabs');
    }
    tabsBorder[i].style.backgroundColor = 'transparent';
  }
  curr.children[1].classList.add('tabs');
  curr.style.color = tabsColor(curr);
  curr.children[1].style.backgroundColor = tabsColor(curr);
  removeAllFromDom();
  listAllEmails(detectWhichTab(curr));
}

// HELPER FUNCTION ADDED NEW
function detectWhichTab(e) {
  let target = e.getAttribute('area-label');
  let subData;
  switch (target) {
    case 'Social':
      subData = social;
      break;
    case 'Promotions':
      subData = promotions;
      break;
    case 'Updates':
      subData = updates;
      break;
    default:
      subData = myData;
  }
  return subData;
}

// HELPER FUNCTION ADDED NEW
function removeAllFromDom() {
  while (!main.lastElementChild.hasAttribute('status')) {
    main.removeChild(main.lastElementChild);
  }
}

//HELPER FUNCTION ADDED NEW
function tabsColor(curr) {
  /// loop tabs ad remove active class
  curr.classList.add('active');
  return curr.getAttribute('area-label') == 'Primary'
    ? '#D93025'
    : curr.getAttribute('area-label') == 'Social'
    ? '#1A73E8'
    : curr.getAttribute('area-label') == 'Promotions'
    ? '#188038'
    : curr.getAttribute('area-label') == 'Updates'
    ? '#DD7607'
    : 'none';
}

function listAllEmails(data) {
  let list = document.querySelector('[status="template"]');
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  for (let i = 0; i < data.items.length; i++) {
    let anEmail = list.cloneNode(true);
    main.appendChild(anEmail);
    anEmail.style.display = 'block';
    anEmail.removeAttribute('status');
    let senderName = document.querySelectorAll('.sender-name')[i + 1];
    let senderEmail = document.querySelectorAll('.sender-email')[i + 1];
    let messageTitle = document.querySelectorAll('.message-title')[i + 1];
    let message = document.querySelectorAll('.message')[i + 1];
    let emailTime = document.querySelectorAll('.email-time')[i + 1];
    let emailDate = new Date(data.items[i].date);
    let stringDate = `${emailDate.getDate()} ${monthNames[emailDate.getMonth()].substr(0, 3)}`;
    senderName.innerHTML = data.items[i].senderName;
    senderEmail.innerHTML = data.items[i].senderEmail;
    messageTitle.innerHTML = data.items[i].messageTitle;
    message.innerHTML = data.items[i].messages[0].message;
    emailTime.innerHTML = stringDate;
    anEmail.setAttribute('data-id', data.items[i].id);
    anEmail.addEventListener('click', openEmail);
  }
}

function addIdToData(data) {
  for (let i = 0; i < data.items.length; i++) {
    data.items[i].id = i;
  }
  return data;
}

function toSocial(data) {
  let social = {};
  social.items = data.items.filter((i) => {
    return i.senderName == 'Facebook' || i.senderName == 'Seytech Co';
  });
  social.next = data.next;
  social.next.page = social.items.length < 50 ? 1 : 2;
  social.total = social.items.length;
  return social;
}

//THIS SECTION IS FOR FILTERING RAW DATA
function toPromotions(data) {
  let promotions = {};
  promotions.items = data.items.filter((i) => {
    return i.senderName == 'Chase' || i.senderName == 'Seytech Co';
  });

  promotions.next = data.next;
  promotions.next.page = promotions.items.length < 50 ? 1 : 2;
  promotions.total = promotions.items.length;
  return promotions;
}

function toUpdates(data) {
  let updates = {};
  updates.items = data.items.filter((i) => {
    return i.senderName == 'Michael Dunn' || i.senderName == 'Seytech Co';
  });
  updates.next = data.next;
  updates.next.page = updates.items.length < 50 ? 1 : 2;
  updates.total = updates.items.length;
  return updates;
}

// OPEN INDIVIDUAL EMAIL
function openEmail(event) {
  let currElement = event.target;
  //What is the class name of the currElement?
  //If it is bucket, star, or spam then do other funcitons and return
  //else continue executing the below code
  let curID = getIdOfEmailClicked(currElement);
  let openWindowEmail = document.querySelector('.opened-email');
  let email;
  if (myData) {
    removeAllFromDom();
    let openWindowEmail = document.querySelector('.opened-email');
    openWindowEmail.style.display = 'block';
    let senderName = document.querySelector('.sender-full-name');
    senderName.innerHTML = myData.items[curID].senderName;
    let emailAddress = document.querySelector('.sender-email-open');
    emailAddress.innerHTML = myData.items[curID].senderEmail;
    let emailSubject = document.querySelector('.subject');
    emailSubject.innerHTML = myData.items[curID].messageTitle;
    let emailMessage = document.querySelector('.message-open');
    emailMessage.innerHTML = myData.items[curID].messages[0].message;
  }
}

function getIdOfEmailClicked(element) {
  let checkedElement = element.parentElement;
  while (!checkedElement.hasAttribute('data-id')) {
    checkedElement = checkedElement.parentElement;
  }
  return checkedElement.getAttribute('data-id');
}

// Tool
document.getElementById('selectAll').addEventListener('click', function(ev) {
  ev.target.parentNode.parentNode.classList[ev.target.checked ? 'add' : 'remove']('selected');
}, false);