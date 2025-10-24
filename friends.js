//TODO:
//add removing friends functionality
//make it so that you cant send a friend request to user who are already your friend

import { searchUsers, addRequest, getFriendRequests, acceptFriendRequest, getFriends, removeFriend, compareCalendars} from "./clientreq.js";
import { user_id, currentMonth, currentYear } from "./main.js";

const toggleFriends = document.querySelector('#toggleFriends');
const friendsDiv = document.querySelector('#friends');

const addFriendsToggle = document.querySelector('#addFriendsToggle');

const searchBar = document.querySelector('#searchBar')
const searchButton = document.querySelector('#searchButton')

const friendList = document.querySelector('#list')

const friendRequestsToggle = document.querySelector('#friendRequestsToggle')

const friendListToggle = document.querySelector('#friendListToggle')

const friendToggles = document.querySelectorAll('.friendToggle')


function setClass(element) {
    searchBar.value = '';
    for(const friendToggle of friendToggles) {
        friendToggle.classList.remove('friendToggleActive');
    }
    element.classList.add('friendToggleActive')
}


toggleFriends.addEventListener('click', ()=> {
    if(friendsDiv.classList.contains('active')) {
        friendsDiv.classList.remove('active');
    }
    else {
        friendsDiv.classList.add('active')
        toggleFriendList();
    }
})

function clearList() {
    friendList.innerHTML = '';
}

addFriendsToggle.addEventListener('click', ()=> {

    clearList();
    setClass(addFriendsToggle);


    // friend table, two columns id1 and id2
    // each row is a pair of friends
    //When request is accepted, add pair of friends to friend table
    //type username into searchbar, find matching usernames.

    // separate "friend requests" table
    // one column sender one column reciever
    // when request is sent, add row to table
    // when client goes onto the website, check the friends list to see if their id is in column 2 (recieved)
    // if yes load the senders username into friend request list
    // when reuqest is accepted from reciever end, remove request row, and add friend row
    // when client loads in/toggles friend list, go into database and get all friends

    //yeah yeah yeah lets goooooooooooooooooooooooo
})

function makeUserDiv(user) {
    const userDiv = document.createElement('div')
    const usernameDiv = document.createElement('div');
    const requestButton = document.createElement('button');

    userDiv.appendChild(usernameDiv);
    userDiv.appendChild(requestButton);

    friendList.appendChild(userDiv);

    userDiv.classList.add('friendListDivs')
    usernameDiv.classList.add('usernameDivs');
    requestButton.classList.add('requestButtons')

    usernameDiv.textContent = user.username

    return {userDiv, usernameDiv, requestButton}
}

searchButton.addEventListener('click', async ()=> {

    if(!addFriendsToggle.classList.contains('friendToggleActive')) return;

    clearList();

    const search = searchBar.value;

    const userTable = await searchUsers(search);

    userTable.forEach((user, index) => {

        const div = makeUserDiv(user);
        div.requestButton.textContent = 'Add friend'

        div.requestButton.addEventListener('click', async () => {
            const result = await addRequest(parseInt(user_id), user.id);
            if(result==true) {
                div.requestButton.textContent = 'Requested'
            }
        })
    })
})


friendRequestsToggle.addEventListener('click', async () => {
    clearList();
    setClass(friendRequestsToggle);
    const incomingFriendReqs = await getFriendRequests(user_id);

    incomingFriendReqs.forEach((req, index) => {
        const div = makeUserDiv(req);
        div.requestButton.textContent = 'Accept'
        div.requestButton.addEventListener('click', async() => {
            const result = await acceptFriendRequest(req.id, user_id)
            if(result==true) {
                div.requestButton.textContent = 'Accepted'
            }
            else {
                div.requestButton.textContent = 'Try again'
            }
        })
    })
})

const compareCalendarsDiv = document.querySelector('#compareCalendarsDiv')
const dayInput = document.querySelector('#dayInput')
const compareCalendarsSubmit = document.querySelector('#compareCalendarsSubmit')
const compareCalendarsResultsDiv = document.querySelector('#compareCalendarsResultsDiv')
const messageDiv = document.querySelector('#message')
const exitButton = document.querySelector('#exit')

exitButton.addEventListener('click', () => {
    compareCalendarsResultsDiv.classList.remove('active')
})

async function toggleFriendList() {
    clearList();
    setClass(friendListToggle);

    const friendList = await getFriends(user_id);
    friendList.forEach((friend, index) => {
        const div = makeUserDiv(friend[0]);

        const compareCalendarButton = document.createElement('button');
        div.userDiv.appendChild(compareCalendarButton);
        compareCalendarButton.classList.add('requestButtons') // just makes it float right
        compareCalendarButton.textContent = 'Compare Calendars'
        compareCalendarButton.addEventListener('click', () => {
            
            compareCalendarsDiv.classList.add('active');

            compareCalendarsSubmit.addEventListener('click', async () => {
                const result = await compareCalendars(user_id, friend[0].id, dayInput.value, currentMonth, currentYear)
                dayInput.value = '';
                compareCalendarsDiv.classList.remove('active')

                compareCalendarsResultsDiv.classList.add('active')
                console.log(result)

                let freeTimeString = '';
                for(let i=0; i<result.length-1; i++) {
                    freeTimeString+= `${result[i].startTime} to ${result[i].endTime}, `
                }
                freeTimeString+=`and ${result[result.length-1].startTime} to ${result[result.length-1].endTime}.`

                const message = `You and ${friend[0].username} are free together from ${freeTimeString}`;
                console.log(message)
                messageDiv.textContent = message;
            });


        });


        div.requestButton.textContent = 'Remove';

        div.requestButton.addEventListener('click', async () => {
            const result = await removeFriend(parseInt(user_id), friend[0].id);
            if(result==true) {
                div.userDiv.remove();
                div.usernameDiv.remove();
                div.requestButton.remove();
            }
            else {
                div.requestButton.textContent = "Try again"
            }
        })

    })
}

friendListToggle.addEventListener('click', toggleFriendList);

//should i load the whole list in every time you toggle, or have both lists set always and then just turn on visibilty/switch between whenever buttton pressed?