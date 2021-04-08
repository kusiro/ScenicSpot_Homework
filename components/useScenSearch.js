import { useEffect, useState } from 'react'
import axios from 'axios'
import jsSHA from '../lib/sha1'
  
export default function useScenSearch(query, pageNumber) {
  function GetAuthorizationHeader() {
    var AppID = '4b83095654904ec9a82f1afbaf928bf5';
    var AppKey = 'A70NOkt0hzIF02-CiVmZmwEQm4k';

    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString};
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [scens, setScens] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setScens([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot${query}`,
      params: {
        $skip: (pageNumber > 30) ? pageNumber - 30 : 0,
        $top: pageNumber,
        $format: 'JSON'
      },
      headers: GetAuthorizationHeader(),
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setScens(prevScens => {
        return [...new Set([...prevScens, ...res.data.docs.map(b => b)])]
      })
      setHasMore(res.data.docs.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, scens, hasMore }
}
