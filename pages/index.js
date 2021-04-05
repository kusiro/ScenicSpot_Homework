import React, { useState, useRef, useCallback } from 'react'

import useScenSearch from '../components/useScenSearch'

export default function Home() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(30)
  const citys = [
    'Taipei',
    'NewTaipei',
    'Taoyuan',
    'Hsinchu',
    'Taichung',
    'Miaoli',
    'Changhua',
    'Yunlin',
    'Nantou',
    'Chiayi',
    'Tainan',
    'Kaohsiung',
    'Pingtung',
    'Yilan',
    'Hualien',
    'Taitung'
  ]

  const {
    scens,
    hasMore,
    loading,
    error
  } = useScenSearch(query, pageNumber)

  const observer = useRef()
  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleChange(e) {
    setQuery(e.target.value)
    setPageNumber(1)
    window.location.href = `#/ScenicSpot${e.target.value}`;
  }

  return (
    <>
      <div className="wrapper">
        <div className="btn-wrapper">
          <button onClick={handleChange}>all</button>
          {citys.map((city, index) => {
            return <button href={city} key={index} onClick={handleChange} value={`/${city}`}>{city}</button>
          })}
        </div>

        <div className="content">
          {scens.map((scen, index) => {
            return (
              <div ref={scens.length === index + 1 ? lastElementRef : null} key={index}>
                <h1>{scen.title}</h1>
              </div>
            )
          })}

          <div>{loading && 'Loading...'}</div>
          <div>{error && 'Error'}</div>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-wrap: wrap;
          height: 100vh;
          align-items: center;
          justify-content: space-around;
          overflow: hidden;
        }
        .btn-wrapper {
          display: flex;
          flex-direction: column;
        }
        .btn-wrapper button{
          font-size: 1.2rem;
          margin: 0.3rem 0;
        }
        .content {
          overflow-y: scroll;
          height: 80%;
          width: 80%;
          border: solid 1px;
          padding: 1rem;
        }
      `}</style>
    </>
  )
}
