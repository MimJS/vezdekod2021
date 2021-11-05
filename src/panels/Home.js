import React, { useState } from 'react';

import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Input } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge'
import { Icon24SearchOutline } from '@vkontakte/icons';
import { Icon24AddOutline } from '@vkontakte/icons';

const Home = ({ id, go, fetchedUser, err }) => {
	const [i,si] = useState('')
	return (
		<Panel id={id}>
			<PanelHeader>DJFlash</PanelHeader>
			{fetchedUser &&
				<>
					<Group header={<Header mode="secondary">Инормация о пользователе</Header>}>
						<Cell
							before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} /> : null}
							description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
						>
							{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
						</Cell>
					</Group>

					<Group header={<Header mode="secondary">Играть</Header>}>
						<Div>
							<Button stretched size="l" mode="secondary" onClick={() => {
								window.socket.emit('req', {
									type: 'create_room'
								})
							}}
								before={<Icon24AddOutline />}
							>
								Создать комнату
				</Button>
						</Div>
						<Div>
							<Input style={{ marginBottom:10 }} placeholder='ex. 36121893' value={i} onChange={(e) => si(e.currentTarget.value)}></Input>
							<Button stretched size="l" mode="secondary" onClick={() => {
								window.socket.emit('req', {
									type:'connectRoom',
									room_id:i
								})
							}}
								before={<Icon24SearchOutline />}
							>
								Найти комнату
				</Button>
				{err &&
				<span>ERROR!</span>
				}
						</Div>
					</Group>
				</>
			}
		</Panel>
	)
}


export default Home;
