import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, ModalRoot, ModalCard, ModalPage, ModalPageHeader, Button } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './css/app.css'
import './css/modal.scss'
import MainPanel from './panels/main'
import { Icon36CancelOutline } from '@vkontakte/icons';

const App = () => {
	const [user, setUser] = useState(null);
	const [popout, setPopout] = useState(null);
	const [activeModal, setActiveModal] = useState(null)
	const [qrs, setqrs] = useState(null)
	const [q_info_id, set_q_info_id] = useState(0)

	useEffect(() => {
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			getQrs()
		}
		async function getQrs() {
			const qrs = await bridge.send("VKWebAppStorageGet", { "keys": ["qrs_list"] })
			if(qrs.keys[0].value != null && qrs.keys[0].value != ''){
			setqrs(JSON.parse(qrs.keys[0].value))
			} else {
				setqrs([])
			}
		}
		fetchData();
	}, []);

	useEffect(async () => {
		if (qrs == null || qrs.length == 0) {
			return
		} else {
			let s = await bridge.send("VKWebAppStorageGet", { "keys": ["qrs_list"] })
			if (JSON.stringify(qrs) != s.keys[0].value) {
				let r = await bridge.send("VKWebAppStorageSet", {"key": "qrs_list", "value": JSON.stringify(qrs)})
				if(!r.result){
					set_modal('error_qr ')
				}
			}
		}
	}, [qrs])

	const modal = (
		<ModalRoot
			activeModal={activeModal}
			onClose={() => setActiveModal(null)}>
			<ModalPage
				id={'error_qr'}
				className='modal_my'
				onClose={() => setActiveModal(null)}
				
			>
				<span className='modal_title'>Ошибка</span>
				<span className='modal_desc'>Произошла ошибка во время сканирования QR кода</span>
				<Button size='l' mode='secondary' onClick={() => setActiveModal(null)} stretched className='modal_close_btn'>Закрыть</Button>
			</ModalPage>
			<ModalPage
				id={'info_qr'}
				className='modal_my'
				onClose={() => setActiveModal(null)}
				
			>
				{(qrs != null && qrs.length > 0) && 
				<>
				<span className='modal_title'>{qrs[q_info_id].name}</span>
				<span className='modal_desc'>{qrs[q_info_id].text}</span>
				<Button size='l' mode='secondary' onClick={() => setActiveModal(null) & set_q_info_id(0)} stretched className='modal_close_btn'>Закрыть</Button>
				</>}
			</ModalPage>
		</ModalRoot>
	)

	const set_modal = (n, payload) => {
		switch (n) {
			case 'error_qr':
				return setActiveModal('error_qr')
			case 'info_q':
				set_q_info_id(payload)
				return setActiveModal('info_qr')
			default:
				return
		}
	}

	const isUrl = (str) => {
		var a = document.createElement('a');
		a.href = str;
		console.log('function get')
		return (a.host && a.host != window.location.host);
	}

	const set_new_qr = (v) => {
		if (v != null) {
			console.log('get')
			let d = new Date()
				let day = d.getDay()
				if (day < 10) { day = '0' + day }
				let month = d.getMonth()
				if (month < 10) { month = '0' + month }
				let year = d.getFullYear()
				year = String(year).substr(2)
				let h = d.getHours()
				if (h < 10) { h =  '0' + h }
				let m = d.getMinutes()
				if (m < 10) { m = '0' + m }
				let oq = [...qrs]
			if (isUrl(v)) {
				const data = {
					name:`QR код #${qrs.length + 1}`,
					date:`${day}.${month}.${year} в ${h}:${m}`,
					text:v,
					type:'url'
				}
				oq.push(data)
				console.log(oq)
				setqrs(oq)
			} else {
				console.log('not url')
				const data = {
					name:`QR код #${qrs.length + 1}`,
					date:`${day}.${month}.${year} в ${h}:${m}`,
					text:v,
					type:'all'
				}
				console.log('no url')
				oq.push(data)
				console.log(oq)
				setqrs(oq)
			}
		}
	}

	return (
		<ConfigProvider platform={'ios'} scheme='space_gray'>
			<AdaptivityProvider>
				<AppRoot>
					<View activePanel={'main'} modal={modal} popout={popout}>
						<MainPanel id='main' user={user} set_modal={set_modal} qrs={qrs} sqrs={setqrs} set_new_qr={set_new_qr} />
					</View>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
