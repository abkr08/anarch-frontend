import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const webSocketURL = 'http://localhost:8080/socket';

let stompClient = null;
let ws = null;

export const connectAndReconnect = async () => {
	ws = new SockJS(webSocketURL);
	stompClient = Stomp.over(ws);

	stompClient.connect({}, () => {
		// if (stompClient.connected) {
		// 	subscribeToOwnChannel(username);
		// }
	}, () => {
		setTimeout(() => {
			connectAndReconnect();
		}, 5000);
	});

	return stompClient;
}

export const subscribeToOwnChannel = (name, handleNotification) => {
	stompClient.subscribe(`/socket-publisher/${name}`, notification => {
		handleNotification(notification);
	});
}

// const handleNotification = (data) => {
//     alert(data);
//     let notification = JSON.parse(data.body);
//     switch (notification.type) {
//       case 'chatRequest':
//         return data;
//       default:
//         console.log(data)
//     }
//   }

const sendNotification = notification => {
	stompClient.send(`/socket-subscriber/${notification.to}`, {}, JSON.stringify(notification))
}

const subscribeToRoom = (id) => {
	stompClient.subscribe("/socket-publisher/" + id, message => {
		console.log(message);
	});
}