import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import alarmSound from '../assets/alarm.wav'


const ALARM_SOUND_PATH = alarmSound

enum TIMER_STATE {
  READY,
  RUNNING,
  PAUSE,
}
const HOUR_MS = 60 * 60 * 1000
const MINUTE_MS = 60 * 1000
const SECOND_MS = 1000
const TIMER_LOOP_WAIT = 100

//マイナスおよび100時間以上は設定できなくする
const fitTime = (time: number) => {
  return Math.max(Math.min(time, 100 * HOUR_MS - SECOND_MS), 0)
}

const useTimer = (initSettingTime: number) => {
  const [timerState, setTimerState] = useState(TIMER_STATE.READY)
  const [settingTime, setSettingTime] = useState(initSettingTime)
  const [timerId, setTimerId] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [pauseElapsedTime, setPauseElapsedTime] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(ALARM_SOUND_PATH)
  }, [])

  const leftTime = useMemo((): number => {
    const elapsedTime = currentTime - startTime
    return fitTime(settingTime - pauseElapsedTime - elapsedTime)
  }, [settingTime, startTime, currentTime, pauseElapsedTime])

  const displayTime = useMemo((): string => {
    let time = leftTime
    const hours = Math.floor(time / HOUR_MS)
    time %= HOUR_MS
    const minutes = Math.floor(time / MINUTE_MS)
    time %= MINUTE_MS
    const seconds = Math.floor(time / SECOND_MS)

    const hours_text = hours.toString().padStart(2, '0')
    const minutes_text = minutes.toString().padStart(2, '0')
    const seconds_text = seconds.toString().padStart(2, '0')
    return `${hours_text}h${minutes_text}m${seconds_text}s`
  }, [leftTime])

  const resetTimer = useCallback(() => {
    clearInterval(timerId)
    setStartTime(0)
    setCurrentTime(0)
    setPauseElapsedTime(0)
    if (timerState === TIMER_STATE.READY) setSettingTime(0)
    setTimerState(TIMER_STATE.READY)
  }, [timerId, timerState])

  const handleStart = () => {
    if (timerState === TIMER_STATE.RUNNING) return
    setTimerState(TIMER_STATE.RUNNING)
    setStartTime(Date.now())
    setCurrentTime(Date.now())
    setTimerId(
      window.setInterval(() => {
        setCurrentTime(Date.now())
      }, TIMER_LOOP_WAIT)
    )
  }
  useEffect(() => {
    if (leftTime <= 0 && timerState === TIMER_STATE.RUNNING) {
      resetTimer()
      
      // 音を鳴らす
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(error => {
          console.error('音声の再生に失敗しました:', error)
        })
      }
      setTimeout(() => {
        alert('時間です！！')
      }, 500)
    }
  }, [leftTime, resetTimer, timerState])

  const handlePlusSettingTime = (time: number) => {
    if (timerState !== TIMER_STATE.READY) return
    setSettingTime((prev: number) => fitTime(prev + time))
  }
  const handleReset = () => {
    resetTimer()
  }

  const handlePause = () => {
    if (timerState !== TIMER_STATE.RUNNING) return
    clearInterval(timerId)
    setPauseElapsedTime((prev: number) => prev + currentTime - startTime)
    setStartTime(0)
    setCurrentTime(0)
    setTimerState(TIMER_STATE.PAUSE)
  }

  return {
    displayTime,
    timerState,
    handleStart,
    handleReset,
    handlePause,
    handlePlusSettingTime,
  }
}
export { useTimer, TIMER_STATE }
