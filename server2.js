process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

import querystring from 'node:querystring'

import {getUsers, addUser, saveEvent, getEvents, getEventsForOneUser, checkUser, searchUser, addRequest, getFriendRequests, acceptFriendRequest, getFriends, removeFriend, compareCalendars, removeEvent} from './db.js'

const port = 3000;
const host = 'localhost';

const options = {
    key: fs.readFileSync('C:\\http certificates\\private-key.pem'),
    cert: fs.readFileSync('C:\\http certificates\\certificate.pem'),
};

// const types = {

//     default: "application/octet-stream",

//     html: "text/html; charset=UTF-8",
//     js: "text/javascript",
//     css: "text/css",
// }

// console.log(process.cwd())

// const toBool = [() => true, () => false];

// async function prepareFile(url) {

//     const STATIC_PATH = path.join(process.cwd(), "./static");
//     console.log(STATIC_PATH)

//     const paths = [STATIC_PATH, url];
//     if (url.endsWith("/")) paths.push("new.html");

//     const filePath = path.join(...paths)
//     console.log(filePath)

//     const pathTraversal = !filePath.startsWith(STATIC_PATH);
//     const exists = await fs.promises.access(filePath).then(...toBool);
//     const found = !pathTraversal && exists;
//     const streamPath = found ? filePath : `${STATIC_PATH}/404.html`;

//     const ext = path.extname(filePath).substring(1).toLowerCase();
//     console.log(ext)
//     const stream = fs.createReadStream(streamPath);
//     console.log('hereeeeee');
//     return {found, ext, stream};
// }

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = https.createServer(options, async (req, res) => {


    const filePath = path.join(process.cwd(), req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    // console.log(req.headers.cookie)


    if(contentType!='application/octet-stream') {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            }
            else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
        return;
    }
    // console.log('here')



    // console.log(req.url)

    // console.log('here')
    // const file = await prepareFile(req.url);
    // console.log('plsdontbehere')
    // const statusCode = file.found ? 200 : 404;
    // res.writeHead(200, { "Content-Type": 'text/html' })
    // res.end();
    // file.stream.pipe(res);
    // console.log(`${req.method} ${req.url} ${statusCode}`);

    // console.log('as')
    // res.end();

    // console.log(req.url)
    // console.log(req.method)

    async function checkGet() {
        if(req.method=='GET') {
            const fullUrl = new URL(req.url, 'https://localhost:3000/');
            if(fullUrl.pathname=='/events') {
                // searchParams pathname href
                const owner_id = fullUrl.searchParams.get('owner_id');
                const results = await getEventsForOneUser(owner_id);
                // console.log(results)
                res.writeHead(200, { "Content-Type": "application/json" })
                res.end(JSON.stringify(results));
            }
            if(req.url=='/users') {
                let userData;
                getUsers().then((data) => {
                    // console.log(data)
                    res.end(JSON.stringify(data));
                })
            }
            // console.log(fullUrl.pathname)
        }
    }
    checkGet()


    if(req.method == 'PUT') {

        if(req.url=='/events') {
            // console.log(req.url)
            let data;
            req.on('data', (d) => {
                // console.log(d)
                // const parsedData = JSON.parse(d);
                // console.log(parsedData[1])
                // data.push(parsedData);
                data = JSON.parse(d);
            })
            req.on('end', (d) => {
                // if (d!=undefined) {
                //     data.push(JSON.parse(d));
                // }

                saveEvent(data.owner_id, data.day, data.month, data.year, data.title, data.index, data.startTime, data.endTime).then(() => {
                    getEvents().then((eventTable) => {
                        console.log(eventTable);
                    })
                })
                //put in all the event object data as parameters and then handle it in saveEvent method in db.js
            })
            res.end();
        }
        if(req.url=='/users') {

            let data;
            req.on('data', (d) => {
                data = JSON.parse(d);
            });
            req.on('end', async() => {
                const result = await addUser(data.username, data.password);
                // console.log(result)
                if (result=='ER_DUP_ENTRY') {
                    res.writeHead(406);
                    res.end();
                    return;
                }
                if(typeof(result)=='string') {
                    res.writeHead(404);
                    res.end();
                    return;
                }
                // console.log(result.id)
                // console.log(result[0].id)

                res.writeHead(200, {"Content-Type": "application/json", "Set-Cookie": `id=${result[0].id}; httpOnly; secure`});
                res.end(JSON.stringify(result));

                getUsers().then((userTable) => {
                    // console.log(userTable);
                })
            })
        }
        if(req.url=='/request') {
            let data;
            req.on('data', (d) => {
                data=JSON.parse(d);
            })
            req.on('end', async () => {
                console.log(data)
                const result = await addRequest(data.id1, data.id2);
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(result))
            });
        }
    }
    if(req.method=='POST') {
        console.log("HERE")
        if(req.url=='/checkuser') {

            let data;
            req.on('data', (d) => {
                data = JSON.parse(d)
            });

            req.on('end', async() => {
                const username = data.username;
                const password = data.password;
                const results = await checkUser(username, password);
                if(results.length==0) {
                    res.writeHead(405);
                    res.end();
                    return;
                }
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(results));
            });

        }
        if(req.url=='/getID') {
            // console.log(req.headers.cookie)
        }
        if(req.url=='/searchUsers') {
            let data;
            req.on('data', (d) => {
                console.log(d)
                data=JSON.parse(d);
            })
            req.on('end', async()=> {
                console.log(data)
                const results = await searchUser(data.username);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(results));
            })
        }
        if(req.url=='/incomingRequests') {
            let data;
            req.on('data', (d) => {
                console.log(d);
                data = JSON.parse(d)
            });
            req.on('end', async(d) => {
                const results = await getFriendRequests(data.user_id);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(results))
            })
        }
        if(req.url=='/reqAccepted') {
            let data;
            req.on('data', (d) => {
                data = JSON.parse(d);
            })
            req.on('end', async () => {
                const result = await acceptFriendRequest(data.requester_id, data.reciever_id);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result))
            })
        }
        if(req.url=='/getFriends') {
            let data;
            req.on('data', (d) => {
                data = JSON.parse(d);
            });
            req.on('end', async () => {
                const result = await getFriends(data.user_id);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            })
        }
        if(req.url=='/removeFriend') {
            let data;
            req.on('data', (d) => {
                data = JSON.parse(d);
            })
            req.on('end', async () => {
                const result = await removeFriend(data.id1, data.id2);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result))
            })
        }
        if(req.url=='/compareCalendars') {
            let data;
            req.on('data', (d) => {
                data = JSON.parse(d);
            })
            req.on('end', async () => {
                const result = await compareCalendars(data.id1, data.id2, data.day, data.month, data.year);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            })
        }
    }
    if(req.method=='DELETE') {
        if(req.url=='/event') {
            let data;
            req.on('data', (d) => {
                data = JSON.parse(d);
            })
            req.on('end', async () => {
                const result = await removeEvent(data.id);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result))
            })
        }
    }

    // console.log('pls')
    // // res.writeHead(200, {"Content-Type": "application/json"});
    // // res.write('yoo its me fabio')
    // // res.end();
    // console.log('uh oh')

});
// server.on('request', async (req, res) => {

//     async function checkGet() {
//         if(req.method=='GET') {
//             const fullUrl = new URL(req.url, 'https://localhost:3000/');
//             if(fullUrl.pathname=='/events') {
//                 // searchParams pathname href
//                 const owner_id = fullUrl.searchParams.get('owner_id');
//                 const results = await getEventsForOneUser(owner_id);
//                 console.log(results);
//             }
//         }
//     }
//     checkGet()

//     if(req.method == 'GET') {
//         if(req.url=='/users') {
//             let userData;
//             getUsers().then((data) => {
//                 console.log(data)
//                 res.end(JSON.stringify(data));
//             })
//         }
//     }

//     if(req.method == 'PUT')    {

//         console.log(req.url)
//         let data;
//         req.on('data', (d) => {
//             console.log(d)
//             // const parsedData = JSON.parse(d);
//             // console.log(parsedData[1])
//             // data.push(parsedData);
//             data = JSON.parse(d);
//         })
//         req.on('end', (d) => {
//             // if (d!=undefined) {
//             //     data.push(JSON.parse(d));
//             // }
//             console.log('data')
//             console.log(data);

//             saveEvent(data.owner_id, data.day, data.month, data.year, data.title).then(() => {
//                 getEvents().then((eventTable) => {
//                     console.log(eventTable);
//                 })
//             })
//             //put in all the event object data as parameters and then handle it in saveEvent method in db.js
//         })

//         console.log('here')
//         addUser().then(() => {
//             getUsers().then((userTable) => {
//                 console.log(userTable);
//             })
//         })
//     }

//     console.log('pls')
//     // res.writeHead(200, {"Content-Type": "application/json"});
//     // res.write('yoo its me fabio')
//     // res.end();
//     console.log('uh oh')
// });

// server.on('data', () => {
//     console.log('i got the message');
// });

server.listen(port, host, () => {
    console.log('server is running at https://'+host+':'+port+'/');
});

// https.get('https://localhost:3000/users', (res) => {

//     let data = '';


//     res.on('data', (d) => {
//         data+=d;
//     });
//     res.on('close', () => {
//         console.log('server says' + data);
//     })
// });

