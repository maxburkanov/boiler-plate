const test = 'This is a text';
//this is test bellow
let myData;
let currDisplayedData;
let dropdownForSearch = document.querySelector('.search-displayer');
let main = document.querySelector('.email');
let tabs = document.querySelector('.tab');
let mailWindow = document.querySelector('.mail-window');
let tabsBorder = document.querySelectorAll('.bottom');
let pageLeft = document.querySelector('.page-left');
let pageRight = document.querySelector('.page-right');
let pageRange = document.querySelector('.current-page');
let social;
let promotions;
let updates;
let searchedResult = {};
let page = 1;
const searchBar = document.querySelector('#search');

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
  tabs.children[0].click();
}

//event Listener on tabs
tabs.addEventListener('click', tabsClicked);
function tabsClicked(e) {
  page = 1;
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
  let data = getUndeletedEmails();
  checkPaginationButtons(page, Math.ceil(data.items.length / 20));
  displayPageRange(data);
  listAllEmails(data);
}

// HELPER FUNCTION ADDED NEW
function detectWhichTab() {
  let tab = document.querySelector('.active');
  let target = tab.getAttribute('area-label');
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
  main = document.querySelector('.email');
  while (!main.lastElementChild.hasAttribute('status')) {
    main.removeChild(main.lastElementChild);
  }
}

//HELPER FUNCTION ADDED NEW
function tabsColor(curr) {
  document.querySelectorAll('.tabs-hover').forEach((val) => {
    val.classList.remove('active');
  });
  /// loop tabs ad remove active class
  curr.classList.add('active');
  let current = curr.getAttribute('area-label');
  return current == 'Primary'
    ? '#D93025'
    : current == 'Social'
    ? '#1A73E8'
    : current == 'Promotions'
    ? '#188038'
    : '#DD7607'; //then it's gotta be updates
}

function listAllEmails(data) {
  currDisplayedData = data;
  removeAllFromDom();
  let list = document.querySelector('[status="template"]');
  let uppLimit = data.items.length > 20 ? 20 : data.items.length;

  for (let i = 0; i < uppLimit; i++) {
    let anEmail = list.cloneNode(true);
    anEmail.style.display = 'block';
    anEmail.removeAttribute('status');
    if (!data.items[i].isRead) {
      anEmail.classList.add('unread');
    } else if (data.items[i].isRead) {
      anEmail.classList.remove('unread');
    }

    let senderName = anEmail.querySelector('.sender-name');
    let senderEmail = anEmail.querySelector('.sender-email');
    let messageTitle = anEmail.querySelector('.message-title');
    let message = anEmail.querySelector('.message');
    let emailTime = anEmail.querySelector('.email-time');
    let emailDate = new Date(data.items[i].date);
    let stringDate = formatDate(emailDate, 'forEmailList');
    senderName.innerHTML = data.items[i].senderName;
    senderEmail.innerHTML = data.items[i].senderEmail;
    messageTitle.innerHTML = data.items[i].messageTitle;
    message.innerHTML = data.items[i].messages[0].message;
    emailTime.innerHTML = stringDate;
    anEmail.setAttribute('data-id', data.items[i].id);
    anEmail.addEventListener('click', openEmail);
    main.appendChild(anEmail);
  }
}

function addIdToData(data) {
  for (let i = 0; i < data.items.length; i++) {
    data.items[i].id = i;
  }
  return data;
}

function formatDate(date, format) {
  let result = '';
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
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const acceptedFormats = ['forEmailList', 'forOpennedEmail', 'forSearResults'];
  if (acceptedFormats.includes(format)) {
    switch (format) {
      case acceptedFormats[0]:
        result = `${date.getDate()} ${monthNames[date.getMonth()].substr(0, 3)}`;
        break;
      case acceptedFormats[1]:
        result = `
        ${date.getDate()} 
        ${monthNames[date.getMonth()].substr(0, 3)} 
        ${date.getFullYear()}, 
        ${date.getHours()}:${date.getMinutes()}
        `;
        break;
      case acceptedFormats[1]:
        result = `${date.getMonth()} ${date.getDate()} ${date.getFullYear() % 100}`;
        break;
    }
  } else {
    console.log('Date format not supported');
  }
  return result;
}

function toSocial(data) {
  let social = {};
  social.items = data.items.filter((i) => {
    return (i.senderName == 'Facebook' || i.senderName == 'Seytech Co') && !i.tags.isTrash && !i.tags.isSpam;
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
    return (i.senderName == 'Chase' || i.senderName == 'Seytech Co') && !i.tags.isTrash && !i.tags.isSpam;
  });

  promotions.next = data.next;
  promotions.next.page = promotions.items.length < 50 ? 1 : 2;
  promotions.total = promotions.items.length;
  return promotions;
}

function toUpdates(data) {
  let updates = {};
  updates.items = data.items.filter((i) => {
    return (i.senderName == 'Michael Dunn' || i.senderName == 'Seytech Co') && !i.tags.isTrash && !i.tags.isSpam;
  });
  updates.next = data.next;
  updates.next.page = updates.items.length < 50 ? 1 : 2;
  updates.total = updates.items.length;
  return updates;
}

// OPEN INDIVIDUAL EMAIL
function openEmail(event) {
  currDisplayedData = detectWhichTab();
  let curID;
  let currElement = event.target;
  if (currElement.classList.contains('email-delete')) {
    curID = getIdOfEmailClicked(currElement);
    myData.items[curID].tags.isTrash = true;
    let data = getUndeletedEmails();
    displayPageRange(data);
    listAllEmails(data);
    return;
  }
  if (myData) {
    pageRange.innerHTML = 'not developed';
    pageLeft.setAttribute('active', false);
    pageRight.setAttribute('active', false);
    let openWindowEmail = document.querySelector('.opened-email');
    curID = getIdOfEmailClicked(currElement);
    myData.items[curID].isRead = true;
    updateCurrDisplayedData();
    removeAllFromDom();
    hideMainCheckBox();
    openWindowEmail.style.display = 'block';
    let senderName = document.querySelector('.sender-full-name');
    senderName.innerHTML = myData.items[curID].senderName;
    let emailAddress = document.querySelector('.sender-email-open');
    emailAddress.innerHTML = myData.items[curID].senderEmail;
    let emailSubject = document.querySelector('.subject');
    emailSubject.innerHTML = myData.items[curID].messageTitle;
    let emailMessage = document.querySelector('.message-open');
    emailMessage.innerHTML = myData.items[curID].messages[0].message;
    let emailTime = document.querySelector('.time-date-openned');
    let emailDate = new Date(myData.items[curID].date);
    let stringDate = formatDate(emailDate, 'forOpennedEmail');
    emailTime.innerHTML = stringDate;
  }
}

function hideMainCheckBox() {
  let mainCheckBox = document.querySelector('#selectAll');
  mainCheckBox.style.display = 'none';
  let arrowDown = document.querySelector('.fa-caret-down');
  arrowDown.style.display = 'none';
  let returnButton = document.querySelector('.return');
  returnButton.style.display = 'block';
  returnButton.addEventListener('click', closeOpenedEmail);
}

function closeOpenedEmail() {
  let mainCheckBox = document.querySelector('#selectAll');
  mainCheckBox.style.display = 'block';
  let arrowDown = document.querySelector('.fa-caret-down');
  arrowDown.style.display = 'block';
  let returnButton = document.querySelector('.return');
  returnButton.style.display = 'none';
  let openWindowEmail = document.querySelector('.opened-email');
  openWindowEmail.style.display = 'none';
  page = 1;
  debugger;
  displayPageRange(currDisplayedData);
  checkPaginationButtons(page, Math.ceil(currDisplayedData.items.length / 20));
  listAllEmails(currDisplayedData);
}

function getIdOfEmailClicked(element) {
  let checkedElement = element;
  while (!checkedElement.hasAttribute('data-id')) {
    checkedElement = checkedElement.parentElement;
  }
  return checkedElement.getAttribute('data-id');
}

// Tool
document.getElementById('selectAll').addEventListener(
  'click',
  function (ev) {
    ev.target.parentNode.parentNode.classList[ev.target.checked ? 'add' : 'remove']('selected');
  },
  false
);

//EVENT LISTENER FOR SEARCH BAR -- OUR LOCAL SEARCH ENGINE
let drop = document.querySelector('.middle div');
let searchMiddle = document.querySelector('.middle');

searchBar.addEventListener('input', getSearchCriteria);

function getSearchCriteria(e) {
  if (e.target.value == '') {
    dropdownForSearch.innerHTML = '';
  }
  drop.style.display = 'block';
  searchedResult.items = [];
  for (let i = 0; i < myData.items.length; i++) {
    for (let k in myData.items[i]) {
      if (typeof myData.items[i][k] == 'string' && k !== 'date') {
        if (e.target.value === '') {
          searchedResult.items.length = 0;
          searchedResult.total = searchedResult.items.length;
          return;
        }
        if (myData.items[i][k].toLowerCase().includes(e.target.value.trim().toLowerCase())) {
          searchedResult.items.push(myData.items[i]);
        }
      } else {
        if (Array.isArray(myData.items[i][k])) {
          for (let j = 0; j < myData.items[i][k].length; j++) {
            console.log('this', myData.items[i][k]);
            //       console.log('this',myData.items[i][k])
            if (myData.items[i][k][0].message.toLowerCase().includes(e.target.value.trim().toLowerCase())) {
              searchedResult.items.push(myData.items[i]);
            }
          }
        }
      }
    }
  }
  searchedResult.next = searchedResult.next;
  searchedResult.total = searchedResult.items.length;
  console.log(e.target.value, searchedResult);
  if (!drop.classList.contains('search-drop-result')) {
    drop.classList.toggle('search-drop-result');
  }

  renderToDropMenu();
}

function renderToDropMenu() {
  dropdownForSearch.innerHTML = '';

  for (let i = 0; i < searchedResult.total; i++) {
    let date = new Date(searchedResult.items[i].date);
    let div = document.createElement('div');
    div.className = 'searched-email';
    div.innerHTML = `
      <div class="left-side">
        <i class="fas fa-envelope"></i>
        <div class="searched-message">
          <div class="searched-top">
            ${searchedResult.items[i].messageTitle}
          </div>
          <div class="searched-bottom">
            ${searchedResult.items[i].senderName}
          </div>
        </div>
      </div>
      <div class="right-side">
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear() % 100}
      </div>
    `;
    div.setAttribute('data-id', searchedResult.items[i].id);
    console.log(div.getAttribute('data-id'), 'id-match', searchedResult.items[i].id);
    div.addEventListener('click', openEmail);
    dropdownForSearch.appendChild(div);
  }
}

//SIDEBAR SWITCHING
let btnSwitch = document.querySelectorAll('.left-tag');
for (let i = 0; i < btnSwitch.length; i++) {
  btnSwitch[i].addEventListener('click', changeToAnother);
}
function changeToAnother(e) {
  if (e.currentTarget.classList.contains('trash')) {
    let deleteButtons = document.querySelectorAll('.email-delete');
    deleteButtons.forEach((value) => {
      value.classList.add('hidden');
    });
    page = 1;
    mailWindow.classList.remove(mailWindow.classList[1]);
    mailWindow.classList.add('trash');
    tabs.style.display = 'none';
    let deletedData = getDeletedEmails();
    displayPageRange(deletedData);
    checkPaginationButtons(page, Math.ceil(deletedData.items.length / 20));
    listAllEmails(deletedData);
  } else if (e.currentTarget.classList.contains('inbox')) {
    let deleteButtons = document.querySelectorAll('.email-delete');
    deleteButtons.forEach((value) => {
      value.classList.remove('hidden');
    });
    mailWindow.classList.remove(mailWindow.classList[1]);
    mailWindow.classList.add('inbox');
    tabs.style.display = 'flex';
    tabs.children[0].click();
  }

  for (let i = 0; i < btnSwitch.length; i++) {
    btnSwitch[i].classList.remove('switch');
  }
  let el = e.currentTarget;
  el.classList.add('switch');
  console.log(e.currentTarget);
}

//SIDEBAR CATEGORIES DROPDOWN
let categoriesButton = document.querySelector('.dropbtn');
categoriesButton.addEventListener('click', myFunction);

function myFunction() {
  document.getElementById('myDropdown').classList.toggle('show');
}

// // Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }

searchBar.addEventListener('change', closeSearchMenu);

function closeSearchMenu() {
  setTimeout(() => {
    drop.style.display = 'none';
  }, 140);
}

function getDeletedEmails() {
  let deletedEmailsArray = [];
  myData.items.forEach((value) => {
    if (value.tags.isTrash) {
      deletedEmailsArray.push(value);
    }
  });
  let deletedEmailData = formInputObjectForRendering(deletedEmailsArray);
  return deletedEmailData;
}

function getUndeletedEmails() {
  currDisplayedData = detectWhichTab();
  let undeletedEmailsArray = [];
  currDisplayedData.items.forEach((value) => {
    if (!value.tags.isTrash) {
      undeletedEmailsArray.push(value);
    }
  });
  let undeletedEmailData = formInputObjectForRendering(undeletedEmailsArray);
  return undeletedEmailData;
}

function updateCurrDisplayedData() {
  currDisplayedData.items.forEach((value, ind) => {
    let indOfMyData = currDisplayedData.items[ind].id;
    currDisplayedData.items[ind].isRead = myData.items[indOfMyData].isRead;
    currDisplayedData.items[ind].tags.isTrash = myData.items[indOfMyData].tags.isTrash;
    currDisplayedData.items[ind].tags.isStar = myData.items[indOfMyData].tags.isStar;
    currDisplayedData.items[ind].tags.isSpam = myData.items[indOfMyData].tags.isStar;
  });
}

function displayPageRange(data) {
  let emailNum = data.items.length;
  let totalPages = Math.ceil(emailNum / 20);
  let total = data.items.length;
  let start;
  let end;
  if (emailNum === 0) {
    formPageRange(0, 0);
    return;
  } else if (totalPages === page && totalPages === 1) {
    start = 1;
    end = emailNum % 20;
  } else if (page < totalPages) {
    start = (page - 1) * 20 + 1;
    end = start + 19;
  } else if (page === totalPages) {
    start = (page - 1) * 20 + 1;
    end = start + (emailNum % 20) - 1;
  }
  formPageRange(start, total, end);
}

function formPageRange(start, total, end = undefined) {
  if (end) {
    pageRange.innerHTML = `${start} - ${end} of ${total}`;
  } else {
    pageRange.innerHTML = `${start} of ${total}`;
  }
}

pageLeft.addEventListener('click', listToLeft);

function listToLeft() {
  let data;

  if (mailWindow.classList.contains('inbox')) {
    data = getUndeletedEmails();
  } else if (mailWindow.classList.contains('trash')) {
    data = getDeletedEmails();
  }

  let emailNum = data.items.length;
  let totalPages = Math.ceil(emailNum / 20);
  let start;
  let end;
  let dataToDisplayArray;
  let toDisplayData;

  if (page < 1) {
    return;
  } else if (page === 1) {
    start = 1;
    end = totalPages > 1 ? 20 : emailNum.num;
  } else {
    page--;
    start = (page - 1) * 20;
    end = start + 19;
  }
  checkPaginationButtons(page, totalPages);
  dataToDisplayArray = data.items.slice(start, end);
  toDisplayData = formInputObjectForRendering(dataToDisplayArray);
  displayPageRange(data);
  listAllEmails(toDisplayData);
}

//COMPOSE MESSAGE OPEN/CLOSE
let composeButton = document.querySelector('.compose');
let openButton = document.querySelector('.window');
let closeButton = document.querySelector('.close-icon');

composeButton.addEventListener('click', () => {
  openButton.classList.remove('window');
  openButton.classList.add('compose-window');
});

closeButton.addEventListener('click', (e) => {
  openButton.classList.remove('compose-window');
  openButton.classList.add('window');
});

pageRight.addEventListener('click', listToRight);

function listToRight() {
  let data;

  if (mailWindow.classList.contains('inbox')) {
    data = getUndeletedEmails();
  } else if (mailWindow.classList.contains('trash')) {
    data = getDeletedEmails();
  }

  let emailNum = data.items.length;
  let totalPages = Math.ceil(emailNum / 20);
  let start = (page - 1) * 20;
  let end;
  let dataToDisplayArray;
  let toDisplayData;

  if (page > totalPages) {
    return;
  } else if (page === totalPages) {
    end = start + (emailNum % 20) - 1;
  } else {
    page++;
    start += 20;
    end = start + 19;
  }

  checkPaginationButtons(page, totalPages);
  dataToDisplayArray = data.items.slice(start, end);
  toDisplayData = formInputObjectForRendering(dataToDisplayArray);
  displayPageRange(data);
  listAllEmails(toDisplayData);
}

function formInputObjectForRendering(arr) {
  let obj = {
    items: arr,
    next: {
      page: social.items.length < 50 ? 1 : 2,
      limit: 50,
    },
    total: arr.length,
  };

  return obj;
}

function checkPaginationButtons(page, pageNum) {
  if (page === 1 && pageNum === 1) {
    pageLeft.setAttribute('active', false);
    pageRight.setAttribute('active', false);
  } else if (page <= 1) {
    pageLeft.setAttribute('active', false);
    pageRight.setAttribute('active', true);
  } else if (page >= pageNum) {
    pageLeft.setAttribute('active', true);
    pageRight.setAttribute('active', false);
  } else {
    pageLeft.setAttribute('active', true);
    pageRight.setAttribute('active', true);
  }
}
