const API_URL = 'http://www.finds.jp/ws/rgeocode.php'

document.addEventListener('DOMContentLoaded', () => {
    const message_id = document.getElementById('message')

    // 位置情報取得対応かチェック
    if(navigator.geolocation){
        // 現在位置をPromiseとして取得
        getCurrentPositionAsPromise().then(postion => {
            // 逆ジオコーディングにかける
            console.log('Got Position')
            getPrefecture(postion.coords.latitude, postion.coords.longitude).then(json => {
                const prefecuture = json.result.prefecture.pname
                // 香川県なら県のホームページへ
                if(prefecuture == '香川県'){
                    location.href = 'https://www.pref.kagawa.lg.jp/'
                }else {
                    message_id.innerHTML = 'ようこそ'
                }
            }, reject => {
                console.log(reject)
                message_id.innerHTML = '都道府県を特定できませんでした'
            })
        }, reject => {
            console.log(reject)
            message_id.innerHTML = '現在位置を取得できませんでした'
        })
    }else {
        message_id.innerHTML = '位置情報取得を許可してください'
    }
})

function getCurrentPositionAsPromise(){
    return new Promise((resolve, reject) =>{
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function getPrefecture(latitude, longitude){
    return fetch(`${API_URL}?json&lat=${latitude}&lon=${longitude}`,{
        mode: 'cors'
    }).then(response => {
        if(response.ok){
            return response.json()
        }else {
            return Promise.reject(new Error(`${response.status}: ${response.statusText}`))
        }
    })
}