import { useState, useEffect } from 'react'

// import ReactDOM from 'react-dom'
import styles from './App.module.scss'
import { css } from '@emotion/react'
import PacmanLoader from 'react-spinners/PacmanLoader'
import classnames from 'classnames'
import React from 'react'
import logo from './taipeilogo.png'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)
const App = () => {
  let [color] = useState('#e88239')
  let [loading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [taipeiDistrict, setTaipeiDistrict] = useState([])
  const [currentData, setCurrentData] = useState('')
  // const [test, setTest] = useState('')

  useEffect(() => {
    // console.log();
    getData()
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (data.length > 0) {
      getNumber('松山區')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  async function getData() {
    await fetch('http://localhost:3000/gender', {
      method: 'GET',
    })
      .then((r) => r.json())
      .then((obj) => {
        // console.log(obj)
        const newDate = obj.filter((el) => {
          return el.district_code.includes('63000')
        })
        const district = []
        for (let i = 0; i < newDate.length; i++) {
          district.push(newDate[i].site_id.slice(3))
        }
        const uniqDistrict = [...new Set(district)]

        setTaipeiDistrict(uniqDistrict)
        setData(newDate)
        // setSelectedOption('松山區')
      })
  }
  const options = {
    responsive: true,
    // maintainAspectRatio:true,
    aspectRatio: 1,
    type: 'bar',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 20,
          },
        },
      },
      title: {
        display: true,
        text: '109年台北市人口戶數及性別',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 20,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 20,
          },
        },
      },
    },
  }
  const labels = ['共同生活戶', '獨立生活戶']

  const dataSet = {
    labels,
    datasets: [
      {
        label: '男',
        data: [currentData.a, currentData.b],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 1,
      },
      {
        label: '女',
        data: [currentData.c, currentData.d],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
      },
    ],
  }
  function getNumber(e) {
    const newNumber = data.filter((el) => {
      return el.site_id.includes(e)
    })
    let sum = { a: 0, b: 0, c: 0, d: 0 }
    newNumber.forEach((a) => {
      sum.a += parseInt(a.household_ordinary_m, 10)
      sum.b += parseInt(a.household_ordinary_f, 10)
      sum.c += parseInt(a.household_single_m, 10)
      sum.d += parseInt(a.household_single_f, 10)
    })

    setCurrentData(sum)
  }
  const display = (
    <>
      <div className={classnames(styles.outsideContainner, 'flex-wrap')}>
        <img src={logo} alt="" className={classnames(styles.logo)} />
        <div className={classnames(styles.container, 'col-md-10')}>
          <div className={styles.selectSection}>
            <p className={classnames(styles.district)}>地區</p>
            <select
              // className="form-select"
              className={classnames('form-select', styles.formSelect)}
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value)
                // setTest(e.target.value)
                getNumber(e.target.value)
              }}
            >
              {taipeiDistrict.map((el, i) => {
                return (
                  <option key={i} value={el}>
                    {el}
                  </option>
                )
              })}
            </select>
          </div>
          <Bar
            type="bar"
            options={options}
            data={dataSet}
            className={classnames(styles.charts)}
          />
        </div>
      </div>
    </>
  )
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `
  const spinner = (
    <div
      className={classnames(
        styles.profile_top,
        'd-flex',
        'justify-content-between',
        'align-items-center'
      )}
    >
      <PacmanLoader color={color} loading={loading} css={override} size={30} />
    </div>
  )
  return <>{isLoading ? spinner : display}</>
}

export default App
