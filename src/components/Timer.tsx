import React from 'react'
import { useTimer, TIMER_STATE } from './use-timer'
import './Timer.css'

const settingButtonList = [
  { value: '+1h', time: 60 * 60 * 1000 },
  { value: '+30m', time: 30 * 60 * 1000 },
  { value: '+10m', time: 10 * 60 * 1000 },
  { value: '+5m', time: 5 * 60 * 1000 },
  { value: '+1m', time: 60 * 1000 },
  { value: '+10s', time: 10 * 1000 },
]

const Timer = () => {
  const {
    displayTime,
    timerState,
    handleStart,
    handleReset,
    handlePause,
    handlePlusSettingTime,
  } = useTimer(0)

  return (
    <div className="timer">
      <div className="main">
        <div className="timer-display">{displayTime}</div>
        <div className="setting-buttons">
          {settingButtonList.map(({ value, time }) => {
            return (
              <button
                className="setting-button"
                key={value}
                onClick={() => handlePlusSettingTime(time)}
              >
                {value}
              </button>
            )
          })}
        </div>
        <div className="control-buttons">
          <button className="reset-button" onClick={() => handleReset()}>
            Reset
          </button>
          {timerState !== TIMER_STATE.RUNNING ? (
            <button className="start-button" onClick={() => handleStart()}>
              Start
            </button>
          ) : (
            <button className="pause-button" onClick={() => handlePause()}>
              Pause
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Timer
