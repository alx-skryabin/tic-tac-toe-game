import React, {useState} from 'react'
import {Button, notification, Switch} from 'antd'
import './App.scss'

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

const notify = (res: string) => {
  notification.open({
    message: res,
    description: 'Congratulations!',
    duration: 2,
    icon: <i className="fa-regular fa-face-grin-tongue-wink"/>,
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

function App() {
  const [end, setEnd] = useState<boolean>(false)
  const [player, setPlayer] = useState<'o' | 'x'>('o')
  const [ai, setAi] = useState<boolean>(false)
  const [initial, setInitial] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9'])

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

    checkWinner().then(res => {
      if (!res) return
      setEnd(true)
      notify(res.toString())
    })

    if (ai) aiCell()
  }

  const aiCell = () => {
    // if (end) return

    setTimeout(() => {
      const AI = getRandomCell(initial)
      if (Number.isInteger(AI)) {
        initial[Number(AI)] = 'x'
        setPlayer('o')

        checkWinner().then(res => {
          if (!res) return
          setEnd(true)
          notify(res.toString())
        })
      }
    }, 100)
  }

  const handleReset = () => {
    setPlayer('o')
    setEnd(false)
    setInitial(initial.map((_: any, i: number) => (++i).toString()))
  }

  const checkWinner = async () => {
    let isWinner: string | boolean = false
    victories.map((arr: number[]) => {
      if (initial[arr[0]] === 'o' && initial[arr[1]] === 'o' && initial[arr[2]] === 'o') {
        isWinner = 'Winner O'
      }
      if (initial[arr[0]] === 'x' && initial[arr[1]] === 'x' && initial[arr[2]] === 'x') {
        isWinner = 'Winner X'
      }
    })
    return isWinner
  }

  const activateAi = (res: boolean) => {
    handleReset()
    setAi(res)
  }

  return (
    <div className="as__app">
      <div className="as__player">Player <span>{player}</span> walks</div>

      <div className="as__control">
        <Button
          className="as__btn-reset"
          type="primary"
          icon={<i className="fa-solid fa-wand-magic-sparkles"/>}
          onClick={handleReset}
        >
          Reset
        </Button>

        <div className="as__btn-switch">
          <div>2 players</div>
          <Switch onChange={activateAi}/>
          <div>AI robot</div>
        </div>
      </div>

      <div className={`as__box ${!end || 'as__box_disabled'}`} onClick={clickCell}>
        {
          initial.map((item: string, i: number) => {
            const selectedClass = (item === 'o' || item === 'x') ? `as__box_item-${item}` : ''
            return <div key={i} className={`as__box_item ${selectedClass}`} data-item={i}>{item}</div>
          })
        }
      </div>
    </div>
  )
}

export default App
