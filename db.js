import mysql from 'mysql2/promise';

const pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Pizzamaster7!',
    database: 'calendar'
});


// const connection = await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Pizzamaster7!',
//     database: 'calendar'
// })

async function createUserTable() {

    try {
        const [results, fields] = await connection.query(`
            CREATE TABLE users(
                id INT PRIMARY KEY AUTO_INCREMENT)`);
    }
    catch(err) {
        console.error(err);
    }
}
async function getUsers() {
    try {
        const [results, fields] = await pool.query(`SELECT * FROM users`)
        return results;
    }
    catch(err) {
        console.error(err);
    }

}
async function addUser(username, password) {
    try {
        let sql = `INSERT INTO users (username, password) VALUES (?, ?)`
        await pool.query(sql, [username, password]);

        sql = `
        SELECT id FROM Users
        ORDER BY id DESC
        LIMIT 1`
        const [results, fields] = await pool.query(sql)
        console.log(results)
        return results;
    }
    catch(err) {
        // console.error(err);
        return err.code;
    }
}


async function createEventTable() {
    try {
        const [results, fields] = await connection.query(`
            CREATE TABLE events(
                id INT PRIMARY KEY AUTO_INCREMENT,
                owner_id INT,
                day INT,
                month INT,
                year INT,
                title VARCHAR(255),
                FOREIGN KEY (owner_id) REFERENCES users(id))`);
    }
    catch(err) {
        console.error(err);
    }
}

async function saveEvent(owner_id, day, month, year, title, index, startTime, endTime) {
    try {
        const sql = `INSERT INTO events (owner_id, day, month, year, title, \`index\`, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        const [results, fields] = await pool.query(sql, [owner_id, day, month, year, title, index, startTime, endTime]);
    }
    catch(err) {
        console.error(err);
    }
}

async function getEvents() {
    try {
        const [results, fields] = await pool.query(`SELECT * FROM Events`);
        return results;
    }
    catch(err) {
        console.error(err);
    }
}

async function getUsersAndEvents() {
    try {
        const [results, fields] = await connection.query(`
            SELECT * FROM Users
            INNER JOIN Events ON Users.id = Events.owner_id`);
    }
    catch(err) {
        console.error(err);
    }
}

async function getEventsForOneUser(id) {
    try {
        const [results, fields] = await pool.query(`
            SELECT * FROM Events WHERE owner_id=${id}`);
        return results;
    }
    catch(err) {
        console.log(err);
    }
}

async function checkUser(username, password) {
    try {
        const sql = `SELECT id FROM Users WHERE username='${username}' AND password='${password}'`
        const [results, fields] = await pool.query(sql, [username, password])
        return results;
    }
    catch(err) {
        console.log(err);
    }
}

async function searchUser(username) {
    try {
        const sql = `SELECT * FROM Users WHERE LOWER(username) LIKE LOWER('%${username}%')`
        const [results, fields] = await pool.query(sql, [username])
        return results;
    }
    catch(err) {
        console.log(err)
    }
}
async function addRequest(requester_id, reciever_id) {
    try {
        const sql = `INSERT INTO friendRequests (requester_id, reciever_id) VALUES (?, ?)`;
        const [results, fields] = await pool.query(sql, [requester_id, reciever_id]);

        return true;
    }
    catch(err) {
        console.log(err)
        return false;
    }
}
async function getFriendRequests(user_id) {
    try {
        // const sql = `SELECT (requester_id) FROM friendRequests WHERE reciever_id=${user_id}`;
        // const [results, fields] = await pool.query(sql, [user_id]);
        // console.log(results);

        const sql = `SELECT id, username FROM Users WHERE id IN (SELECT requester_id FROM friendRequests WHERE reciever_id=?)`;
        const [results, fields] = await pool.query(sql, [user_id]);
        return results;
        //change everythign to question marks
    }
    catch(err) {
        console.log(err);
    }
}
async function acceptFriendRequest(requester_id, reciever_id) {
    try {
        const sql1 = `DELETE FROM friendRequests WHERE requester_id=? AND reciever_id=?`
        const [results1, fields1] = await pool.query(sql1, [requester_id, reciever_id]);

        const sql2 = `INSERT INTO Friends(id1, id2) VALUES(?, ?)`
        const [results2, fields2] = await pool.query(sql2, [requester_id, reciever_id])

        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

async function makeFriendList() {

}

async function getFriends(user_id) {
    try {
        let idList = [];
        const sql = `SELECT * FROM Friends WHERE id1=? OR id2=?`
        const [results, fields] = await pool.query(sql, [user_id, user_id])

        console.log(results)

        results.forEach((pair, index) => {
            if(pair.id1==user_id) {
                idList.push(pair.id2)
            }
            else {
                idList.push(pair.id1)
            }
        });

        const friendList = [];

        for (const id of idList) {
            const sql2 = `SELECT id, username FROM Users WHERE id=?`
            const [results2, fields2] = await pool.query(sql2, [id])
            friendList.push(results2);
        }


        return friendList;


    }
    catch(err) {
        console.log(err)
    }
}
async function removeFriend(id1, id2) {
    try {
        const sql = `DELETE FROM Friends WHERE (id1=? AND id2=?) OR (id1=? AND id2=?)`;
        const [results, fields] = await pool.query(sql, [id1, id2, id2, id1])
        return true;
    }
    catch(err) {
        console.log(err);
        return false
    }
}

function sortEvents(eventTimes) {
    console.log(eventTimes)
    const result = [];
    for(let i = 0; i<eventTimes.length; i++) {
        if(result.length==0) {
            result.push(eventTimes[i]);
            continue;
        }
        let placingIndex = 0;
        while(placingIndex<result.length) {
            if(result[placingIndex].startTime>eventTimes[i].startTime) {
                break;
            }
            placingIndex++;
        }
        result.splice(placingIndex, 0, eventTimes[i])
        console.log(`iteration ${i}`)
        console.log(result)
    };
    console.log(result)
    return result;
}

async function compareCalendars(id1, id2, day, month, year) {
    try {

        console.log('COMPARING')

        const sql1 = `SELECT startTime, endTime FROM EVENTS WHERE owner_id=? AND day=?`
        const [results1, fields1] = await pool.query(sql1, [id1, day]);

        const sql2 = `SELECT startTime, endTime FROM EVENTS WHERE owner_id=? AND day=?`
        const [results2, fields2] = await pool.query(sql2, [id2, day]);

        console.log('results 1')
        console.log(results1)
        console.log(results2)
        const eventTimes = results1.concat(results2);

        const sortedEvents = sortEvents(eventTimes);

        const freeTimes = [];
        freeTimes.push({startTime: '00:00', endTime: sortedEvents[0].startTime})
        
        let latestEndTime = sortedEvents[0].endTime;

        for(let i=1; i<sortedEvents.length; i++) {
            if(sortedEvents[i].startTime>latestEndTime) {
                freeTimes.push({startTime: latestEndTime, endTime: sortedEvents[i].startTime})
            }
            if(sortedEvents[i].endTime>latestEndTime) {
                latestEndTime = sortedEvents[i].endTime;
            }


        }
        freeTimes.push({startTime: latestEndTime, endTime: '24:00'})
        // freeTimes[freeTimes.length-1].endTime = '24:00';

        console.log('free times')
        console.log(freeTimes)
        return freeTimes;



        // for(let hour=0; hour<24; hour++) {
        //     if(hour<10) {
        //         hour = '0'+hour
        //     }
        //     eventTimes.foreach((time)=> {
        //         if(time[0].startsWith(hour) || time[1].startsWith(hour)) {
        //             for(const min=0; min<60; min++) {
        //                 if(min<10) {
        //                     min = '0'+min;
        //                 }
        //                 time.forEach((subTime)=> {
        //                     if(subTime.endsWith(min)) {

        //                     }
        //                 });
        //             }   
        //         }
        //     })
        // }
        
    }
    catch(err) {
        console.log(err)
    }
}

async function removeEvent(id) {
    try {
        const sql = `DELETE FROM Events WHERE id=?`;
        const [results, fields] = await pool.query(sql, [id]);
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}
// createUserTable();
// addUser();
// createEventTable();
// addEvent();
// getUsers();
// getEvents();
// getUsersAndEvents();

// connection.end();

export {getUsers, addUser, saveEvent, getEvents, getEventsForOneUser, checkUser, searchUser, addRequest, getFriendRequests, acceptFriendRequest, getFriends, removeFriend, compareCalendars, removeEvent};