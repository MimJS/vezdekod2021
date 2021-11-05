import React, { useState, useEffect } from 'react'
import { Panel, PanelHeader, PanelHeaderContent, Button } from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import './css/game.scss'
import { useSelector, useDispatch } from 'react-redux'

const Game = (p) => {

    const config = useSelector(state => state.game.config)
    const game = useSelector(state => state.game)
    const dispatch = useDispatch()

    const [newcfg, setnewcfg] = useState(config.btns)

    const [red, setred] = useState(false)

    const change = (a) => {
        window.socket.emit('req', {
            type: 'update_config',
            payload: { ...config, btns: a }
        })
        return
    }

    useEffect(() => {
        if (config.play == true) {
            if (config.btns[config.currentButton] == 0 && config.btns[config.currentButton - 1] != 0) { bridge.send("VKWebAppFlashSetLevel", { "level": config.btns[config.currentButton] }) }
            if (config.btns[config.currentButton] == 1 && config.btns[config.currentButton - 1] != 1) { bridge.send("VKWebAppFlashSetLevel", { "level": config.btns[config.currentButton] }) }
        }
    }, [config])

    return (
        <Panel id={p.id}>
            <PanelHeader separator={false}>
                <PanelHeaderContent>DJFlash</PanelHeaderContent>
            </PanelHeader>
            {Object.keys(config).length > 0 &&
            <div className='in'>
            <span className='room_id'>ID: {game.owner}</span>
            <div className='block_btns'>
                <Button className={`${config.currentButton == 0 ? 'btn-active' : config.btns[0] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                <Button className={`${config.currentButton == 1 ? 'btn-active' : config.btns[1] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                <Button className={`${config.currentButton == 2 ? 'btn-active' : config.btns[2] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                <Button className={`${config.currentButton == 3 ? 'btn-active' : config.btns[3] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                <Button className={`${config.currentButton == 4 ? 'btn-active' : config.btns[4] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                <Button className={`${config.currentButton == 5 ? 'btn-active' : config.btns[5] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                <Button className={`${config.currentButton == 6 ? 'btn-active' : config.btns[6] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                <Button className={`${config.currentButton == 7 ? 'btn-active' : config.btns[7] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
            </div>
            {red &&
                <div className='block_btns'>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[0] = e[0] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 0 ? 'btn-active' : newcfg[0] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[1] = e[1] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 1 ? 'btn-active' : newcfg[1] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[2] = e[2] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 2 ? 'btn-active' : newcfg[2] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[3] = e[3] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 3 ? 'btn-active' : newcfg[3] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[4] = e[4] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 4 ? 'btn-active' : newcfg[4] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[5] = e[5] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 5 ? 'btn-active' : newcfg[5] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[6] = e[6] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 6 ? 'btn-active' : newcfg[6] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                    <Button onClick={() => {
                        let e = { ...newcfg }
                        e[7] = e[7] == 1 ? 0 : 1
                        setnewcfg(e)
                    }} className={`${config.currentButton == 7 ? 'btn-active' : newcfg[7] == 1 ? 'btn-light' : ''}`} size='m' mode='secondary'></Button>
                </div>
            }
            {game.owner == p.user.id &&
                <Button size='l' style={{ marginBottom: 16 }} stretched mode='secondary' onClick={() => {
                    if (game.owner == p.user.id) {
                        setred(!red)
                    }
                    if (red == true) {
                        change(newcfg)
                    }
                }}>{red ? 'Готово' : 'Изменить'}</Button>
            }
            <Button size='l' stretched mode='secondary' onClick={() => window.socket.emit('req', {
                type: 'leaveRoom'
            })}>Выйти</Button>
        </div>
            }
        </Panel>
    )
}

export default Game