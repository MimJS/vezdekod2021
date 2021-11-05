import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './css/app.css'

import Home from './panels/Home';
import Game from './panels/game';
import io from 'socket.io-client'
import {useDispatch} from 'react-redux'

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [err,seterr] = useState(false)
	const dispatch = useDispatch()

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppViewHide') {
				setActivePanel('home')
				bridge.send("VKWebAppFlashSetLevel", { "level": 0 })
				window.socket.emit('req',{type:'leaveRoom'})
				return 
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			window.socket = io('https://vkmteam.ru:3000', {
				autoConnect:false,
				auth:{
					uid:user.id
				}
			})
			window.socket.connect()
			event(window.socket)
		}
		fetchData();
	}, []);

	const event = (s) => {
		s.on('connect', () => {
			setPopout(null);
		})
		s.on('res', (d) => {
			if(d.type == 'connectRoom'){
				dispatch({
					type:'updateGame',
					payload:d.data
				})
				seterr(false)
				go('game')
			}
			if(d.type == 'updateConfig'){
				dispatch({
					type:'updateConfig',
					payload:d.data
				})
			}
			if(d.type == 'roomClose'){
				go('home')
				dispatch({type:'restoreGame'})
				seterr(true)
				bridge.send("VKWebAppFlashSetLevel", { "level": 0 })
			}
		})
		s.on('disconnect', () => {
			go('home')
			dispatch({type:'restoreGame'})
			bridge.send("VKWebAppFlashSetLevel", { "level": 0 })
		})
	}

	const go = e => {
		setActivePanel(e);
	};

	return (
		<ConfigProvider platform='ios' scheme='space_gray'>
			<AdaptivityProvider>
				<AppRoot>
					<View activePanel={activePanel} popout={popout}>
						<Home id='home' fetchedUser={fetchedUser} go={go} err={err} />
						<Game id='game' user={fetchedUser} />
					</View>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
