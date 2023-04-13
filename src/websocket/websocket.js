import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const webSocketURL = 'http://localhost:8080/socket';

let stompClient = null;
let ws = null;

export const connectAndReconnect = async (name, isReconnect, setShouldReconnect, handleNotification) => {
	ws = new SockJS(webSocketURL);
	stompClient = Stomp.over(ws);

	stompClient.connect({}, () => {
		if (stompClient.connected && isReconnect) {
			subscribeToOwnChannel(name, handleNotification);
			setShouldReconnect(true);
		}
	}, () => {
		setTimeout(() => {
			connectAndReconnect(name, true, setShouldReconnect, handleNotification);
		}, 5000);
	});

	return stompClient;
}

export const subscribeToOwnChannel = (name, handleNotification) => {
	stompClient.subscribe(`/socket-publisher/${name}`, notification => {
		handleNotification(notification);
	});
}
