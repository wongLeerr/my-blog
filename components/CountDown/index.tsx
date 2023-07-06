import { useEffect, useState } from 'react'
import styles from './index.module.scss'

interface IProp {
    time: number;
    onEnd:Function
}

const CountDown = ({ time, onEnd }: IProp) => {
   const [count,setCount] = useState(time || 60)
    useEffect(() => {
        // console.log("启用定时器")
       const timer =  setInterval(() => {
            setCount((count) => {
                if (count == 1) {
                    clearInterval(timer)
                    onEnd && onEnd()
                    return count-1
                }
                return count-1
            })
       }, 1000)
        return () => {
            clearInterval(timer)
        }
    },[time,onEnd])
    return (<div className={styles.countDown}>{ count } 秒后重新发送</div>)
}

export default CountDown