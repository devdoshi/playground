import React, {useEffect, useState} from 'react';

function useMediaDevices() {
    const [devices, setDevices] = useState([])
    useEffect(() => {
        async function update() {
            const devices = await navigator.mediaDevices.enumerateDevices()
            setDevices(devices)
        }

        async function task() {
            navigator.mediaDevices.addEventListener('devicechange', update)
            await update()
        }

        task()
    }, [])
    return devices
}

function useAudioInputs() {
    const devices = useMediaDevices()
    return devices.filter(x => x.kind === 'audioinput')
}

function useAudioOutputs() {
    const devices = useMediaDevices()
    return devices.filter(x => x.kind === 'audiooutput')
}

export function Microphone() {
    const [audioState, setAudioState] = useState({audioContext: new AudioContext()})
    const [selectedInput, setSelectedInput] = useState(null)
    const [selectedOutput, setSelectedOutput] = useState(null)
    const childProps = {
        selectedInput, setSelectedInput,
        selectedOutput, setSelectedOutput,
        audioState, setAudioState,
    }
    return (
        <AudioPassthrough
            {...childProps}
        />
    )
}

function AudioPassthrough(props) {
    const {
        selectedInput, setSelectedInput,
        selectedOutput, setSelectedOutput,
        audioState, setAudioState,
    } = props

    const inputs = useAudioInputs()
    const outputs = useAudioOutputs()

    const {audioContext, inputSource} = audioState
    useEffect(() => {
        if (selectedInput === null) {
            return
        }
        // if (selectedOutput === null) {
        //     return
        // }

        async function task() {
            console.log({
                selectedInput,
                selectedOutput,
                audioContext
            })

            const newInputStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedInput.deviceId
                }
            })
            const newInputSource = audioContext.createMediaStreamSource(newInputStream)
            newInputSource.connect(audioContext.destination)
            await audioContext.resume()
            setAudioState({audioContext})
        }

        task()
    }, [selectedInput/*, selectedOutput*/])

    return (
        <div style={{display: 'flex'}}>
            <div style={{flex: 1}}>
                <ul>
                    {inputs.map(x => {
                        return (
                            <li key={x.deviceId}>
                                <button
                                    disabled={selectedInput && x.deviceId === selectedInput.deviceId}
                                    onClick={() => setSelectedInput(x)}>{x.label}</button>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div style={{flex: 1}}>
                <ul>
                    {outputs.map(x => {
                        return (
                            <li key={x.deviceId}>
                                <button
                                    disabled={x === selectedOutput && x.deviceId === selectedOutput.deviceId}
                                    onClick={() => setSelectedOutput(x)}>{x.label}</button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

function App() {
    return <Microphone/>
}

export default App;
