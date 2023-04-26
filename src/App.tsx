import React, {useState} from 'react'
import {Button, notification, Switch} from 'antd'
import './App.scss'

const fields = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const victories = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const score = {
  'o': 0,
  'x': 0,
  'ai': 0
}

const notify = (res: string) => {
  notification.open({
    message: res,
    description: 'Congratulations!',
    duration: 2,
    icon: <i className="fa-regular fa-face-grin-tongue-wink"/>
  })
}

const getRandomCell = (arr: string[]): number | boolean => {
  let isFreeCell: number | boolean = false

  // @ts-ignore
  const res = arr.reduce((acc, n, i) => {
    return (n !== 'o' && n !== 'x') ? [...acc, i] : acc
  }, [])

  if (res.length) {
    isFreeCell = Number(res[Math.floor(Math.random() * res.length)])
  }

  return isFreeCell
}

const getStorageAI = (): boolean => {
  const val = window.localStorage.getItem('AI')
  return val ? JSON.parse(val) : false
}

const getScore = () => {
  const val = window.localStorage.getItem('score')
  return val ? JSON.parse(val) : score
}

function App() {
  const [end, setEnd] = useState<boolean>(false)
  const [player, setPlayer] = useState<'o' | 'x'>('o')
  const [ai, setAi] = useState<boolean>(getStorageAI())
  const [score, setScore] = useState(getScore())

  const [initial, setInitial] = useState<string[]>(fields)

  const clickCell = (e: any) => {
    const number = e.target.dataset.item

    if (initial[number] === 'o' || initial[number] === 'x' || end) return

    if (player === 'o') {
      initial[number] = 'o'
      setPlayer('x')
    } else {
      initial[number] = 'x'
      setPlayer('o')
    }

    if (checkTie()) {
      setEnd(true)
      return notify(`Friendship won!`)
    }

    const win = checkWinner()

    if (win) {
      setEnd(true)
      updateScore(win)
      notify(`Winner ${win.toString().toUpperCase()}`)
    } else {
      if (ai) aiCell()
    }
  }

  const updateScore = (winner: string | boolean) => {
    if (!winner) return

    const upScore = {...score}

    if (winner === 'o') upScore['o'] = ++upScore['o']
    if (winner === 'x') {
      const key = ai ? 'ai' : 'x'
      upScore[key] = ++upScore[key]
    }

    window.localStorage.setItem('score', JSON.stringify(upScore))
    setScore(upScore)
  }

  // Функция для получения хода AI
  const getAiMove = () => {
    // Попытка найти выигрышный ход
    for (let i = 0; i < initial.length; i++) {
      if (initial[i] !== 'o' && initial[i] !== 'x') {
        const temp = initial[i]
        initial[i] = 'x'
        if (checkWinner() === 'x') {
          initial[i] = temp
          return i
        }
        initial[i] = temp
      }
    }

    // Попытка заблокировать выигрышный ход человека
    for (let i = 0; i < initial.length; i++) {
      if (initial[i] !== 'o' && initial[i] !== 'x') {
        const temp = initial[i]
        initial[i] = 'o'
        if (checkWinner() === 'o') {
          initial[i] = temp
          return i
        }
        initial[i] = temp
      }
    }

    // Возвращаем случайный ход
    return getRandomCell(initial)
  }

  const aiCell = () => {
    setTimeout(() => {
      const AI = getAiMove()
      if (Number.isInteger(AI)) {
        initial[Number(AI)] = 'x'
        setPlayer('o')

        const win = checkWinner()

        if (win) {
          setEnd(true)
          updateScore(win)
          notify(`Winner ${win.toString().toUpperCase()}`)
        }
      }
    }, 100)
  }

  // Функция рестарта
  const handleReset = () => {
    setPlayer('o')
    setEnd(false)
    setInitial(initial.map((_: any, i: number) => (++i).toString()))
  }

  const checkWinner = (): string | boolean => {
    let isWinner: string | boolean = false
    victories.map((arr: number[]) => {
      if (initial[arr[0]] === 'o' && initial[arr[1]] === 'o' && initial[arr[2]] === 'o') {
        isWinner = 'o'
      }
      if (initial[arr[0]] === 'x' && initial[arr[1]] === 'x' && initial[arr[2]] === 'x') {
        isWinner = 'x'
      }
    })
    return isWinner
  }

  // Функция для проверки, есть ли ничья
  function checkTie(): boolean {
    for (let i = 0; i < initial.length; i++) {
      if (initial[i] !== 'o' && initial[i] !== 'x') {
        return false
      }
    }

    return true
  }

  const activateAi = (res: boolean) => {
    window.localStorage.setItem('AI', JSON.stringify(res))
    handleReset()
    setAi(res)
  }

  return (
    <div className="as__app">
      <div className="as__control">
        <div className="as__btn-switch">
          <div>2 players <i className="fa-solid fa-people-pulling"/></div>
          <Switch onChange={activateAi} checked={getStorageAI()}/>
          <div>AI robot <i className="fa-solid fa-gun"/></div>
        </div>

        <Button
          className="as__btn-reset"
          type="primary"
          icon={<i className="fa-solid fa-right-left"/>}
          onClick={handleReset}
        >
          RESTART
        </Button>
      </div>

      <div className="as__player">Player <span>{player}</span> walks</div>

      <div className={`as__box ${!end || 'as__box_disabled'}`} onClick={clickCell}>
        {
          initial.map((item: string, i: number) => {
            const selectedClass = (item === 'o' || item === 'x') ? `as__box_item-${item}` : ''
            return <div key={i} className={`as__box_item ${selectedClass}`} data-item={i}>{item}</div>
          })
        }
      </div>

      <div className="as__score">
        <p><i className="fa-solid fa-star-half-stroke"/> Score:</p>
        <div className="as__score-list">
          <span>O: {score['o']}</span>
          <span>X: {score['x']}</span>
          <span>AI: {score['ai']}</span>
        </div>
      </div>

      <div className="as__feedback">
        <div>
          Feedback? — <a href="https://vk.com/alx.skryabin" target="_blank">vk</a>
        </div>
        <div>
          Improvements? — <a href="https://github.com/alx-skryabin/tic-tac-toe-game" target="_blank">github</a>
        </div>
      </div>
    </div>
  )
}

export default App
