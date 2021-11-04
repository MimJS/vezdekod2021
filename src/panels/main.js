import React, { useState, useEffect } from 'react'
import { Panel, PanelHeader, PanelHeaderContent, SimpleCell, Button, ConfigProvider, Avatar, Spinner, SliderSwitch, FixedLayout, Link } from '@vkontakte/vkui'
import './main.scss'
import { Icon24Qr } from '@vkontakte/icons';
import { Icon24InfoCircleOutline } from '@vkontakte/icons';
import { Icon24LinkCircle } from '@vkontakte/icons';
import { Icon28ScanViewfinderOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge'

const MainPanel = (p) => {

    const [activeSwitch, setActiveSwitch] = useState('all')
    const [loadingSwitch, setLoadingSwitch] = useState(true)
    const [torend, settorend] = useState([])

    const sort_t = (activeSwitch, qrs) => {
        if (qrs == null || qrs == '') {
            return setLoadingSwitch(false)
        }
        if (activeSwitch == 'all') {
            let e = qrs.sort((a, b) => a.name.split('QR код #')[1] < b.name.split('QR код #')[1] ? 1 : -1)
            settorend(e)
            setLoadingSwitch(false)
        } else {
            let ee = qrs.sort((a, b) => a.name.split('QR код #')[1] < b.name.split('QR код #')[1] ? 1 : -1)
            let re = ee.filter((e, i) => e.type != 'all')
            settorend(re)
            setLoadingSwitch(false)
        }
    }

    useEffect(() => {
        setLoadingSwitch(true)
        sort_t(activeSwitch, p.qrs)
    }, [activeSwitch])

    useEffect(() => {
        setLoadingSwitch(true)
        sort_t(activeSwitch, p.qrs)
    }, [p.qrs])

    return (
        <Panel id={p.id}>
            <ConfigProvider platform='android' scheme='space_gray'>
                <PanelHeader separator={false}>
                    <PanelHeaderContent><span>My</span><Icon24Qr width={20} height={20} /></PanelHeaderContent>
                </PanelHeader>
            </ConfigProvider>
            <div className='in'>
                {p.qrs != null ?
                    <>
                        <SimpleCell
                            hasHover={false}
                            hasActive={false}
                            className='user_profile'
                            before={<Avatar size={107} src={p.user.photo_100} />}
                            description={
                                <span className='total_scan'>Отсканировано :<span className='count'>{p.qrs.length}</span><Icon24Qr width={14} height={14} /></span>
                            }
                        >
                            <span className='nickname'>{p.user.first_name} {p.user.last_name}</span>
                        </SimpleCell>
                        <div className='list'>
                            <div className='up'>
                                <span className='list_name'>Мои QR</span>
                                <SliderSwitch
                                    options={[
                                        {
                                            name: 'Все',
                                            value: 'all',
                                        },
                                        {
                                            name: 'Ссылки',
                                            value: 'urls',
                                        }
                                    ]}
                                    activeValue={activeSwitch}
                                    onSwitch={(e) => setActiveSwitch(e)}
                                />
                            </div>
                            {!loadingSwitch ?
                                <>
                                    {(torend != null && torend.length > 0) && torend.map((d, e) => {
                                        if (d.type == 'all') {
                                            return (
                                                <SimpleCell
                                                    key={e}
                                                    className='list_qr_block'
                                                    hasHover={false}
                                                    hasActive={false}
                                                    before={<Avatar size={46}><Icon24Qr fill='#f9d039' /></Avatar>}
                                                    after={<span className='actions'>
                                                        <Button size='l' stretched mode='secondary' onClick={() => p.set_modal('info_q', e)} ><Icon24InfoCircleOutline width={22} height={22} /></Button>
                                                    </span>}
                                                    description={<span className='date'>{d.date}</span>}>
                                                    <span className='qr_name'>{d.name}</span>
                                                </SimpleCell>
                                            )
                                        } else {
                                            return (
                                                <SimpleCell
                                                    key={e}
                                                    className='list_qr_block'
                                                    hasHover={false}
                                                    hasActive={false}
                                                    before={<Avatar size={46}><Icon24Qr fill='#f9d039' /></Avatar>}
                                                    after={<span className='actions'>
                                                        <Link href={d.text} target='_blank'><Button size='l' stretched mode='secondary'><Icon24LinkCircle width={22} height={22} /></Button></Link>
                                                        <Button size='l' stretched mode='secondary' onClick={() => p.set_modal('info_q', e)} ><Icon24InfoCircleOutline width={22} height={22} /></Button>
                                                    </span>}
                                                    description={<span className='date'>{d.date}</span>}>
                                                    <span className='qr_name'>{d.name}</span>
                                                </SimpleCell>
                                            )
                                        }
                                    })}
                                    {torend.length == 0 &&
                                        <span style={{ fontSize: 14, display: 'flex', justifyContent: 'center', margin: '20px 0 5px' }}>Отсканируйте свой первый QR код</span>
                                    }
                                </> : <Spinner size='small' style={{ margin: '32px 0' }} />}
                        </div>
                    </>
                    : <Spinner size='small' />}
            </div>
            <FixedLayout vertical='bottom'>
                <div className='bottom_menu'>{p.qrs != null && <Button size='l' mode='secondary' onClick={() => {
                    bridge.send("VKWebAppOpenCodeReader").then((r) => {
                        p.set_new_qr(r.code_data)
                    }).catch((e) => {
                        p.set_modal('error_qr')
                    })
                }}><Icon28ScanViewfinderOutline fill='#f9d039' /></Button>}</div>
            </FixedLayout>
        </Panel>
    )
}

export default MainPanel