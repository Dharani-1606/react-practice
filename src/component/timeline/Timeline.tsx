import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Timeline.css";

export default function Timeline() {
  // Current time
  const now = useMemo(() => new Date(), []);

  // Start = Now -10 mins
  const startTime = useMemo(
    () => new Date(now.getTime() - 10 * 60 * 1000),
    [now]
  );

  // End = Now +10 mins
  const endTime = useMemo(
    () => new Date(now.getTime() + 10 * 60 * 1000),
    [now]
  );

  const totalSeconds = 20 * 60; //1200 sec

  const [currentSecond, setCurrentSecond] = useState(0);

  const [playing, setPlaying] = useState(true);

  const [speed, setSpeed] = useState(1);

  const timer = useRef();

  useEffect(() => {
    if (!playing) return;

    timer.current = setInterval(() => {
      setCurrentSecond((prev) => {
        const next = prev + 5;

        if (next >= totalSeconds) {
          clearInterval(timer.current);
          // setPlaying(false);
          return totalSeconds;
        }

        return next;
      });
    }, 1000 / speed);

    return () => clearInterval(timer.current);
  }, [playing, speed]);

  const currentTime = new Date(
    startTime.getTime() + currentSecond * 1000
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    const percentage = (currentSecond / totalSeconds) * 100;
  return (
    <>
      <div className="rangeWrapper">
        <h2>Timeline Playback</h2>

        {/* Tooltip design */}
        <div
          className="rangeTooltip"
          style={{left: `calc(${percentage}% + ${10 - percentage * 0.2}px)`}}>
          {formatTime(currentTime)}
        </div>

        {/* Seekbar */}
        <div>
          <input
            type="range"
            min={0}
            max={totalSeconds}
            step={5}
            value={currentSecond}
            onChange={(e) =>
              setCurrentSecond(Number(e.target.value))
            }
          />
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            <span><strong>Start: </strong>{formatTime(startTime)}</span>
            <span><strong>End: </strong> {formatTime(endTime)}</span>
          </div>
        </div>

        {/* control buttons */}
        <div className="buttons">
          <button
            onClick={() => setPlaying(!playing)}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            onClick={() => setCurrentSecond(0)}
          >
            Reset
          </button>

          <select
            value={speed}
            onChange={(e) =>
              setSpeed(Number(e.target.value))
            }
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
      </div>
    </>

  );
}