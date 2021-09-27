const IP = {
  setIp() {
    let url = 'https://api.ipify.org?format=json'

    fetch(url)
      .then(response => response.json())
      .then(dados => {
        localStorage.setItem('ip', dados.ip)
      })
      .catch(err => {
        console.log('Failed retrieving information', err)
      })
  }
}

const DOM = {
  containerPhrase: document.querySelector('.context-phrase'),
  containerTime: document.querySelector('.current-time'),
  containerCards: document.querySelector('.cards'),
  ip_address: localStorage.getItem('ip'),

  innerHours() {
    let key = '80564cc5819a4c6f8341956fa97f2888'
    let url =
      'https://api.ipgeolocation.io/timezone?apiKey=' +
      key +
      '&ip=' +
      DOM.ip_address

    fetch(url)
      .then(response => response.json())
      .then(dados => {
        console.log(dados)
        const separatorTime = dados.date_time.split(' ')
        const time = separatorTime[1].split('', 5).join('')

        const number = parseInt(separatorTime[1].split('', 2).join(''))

        const text =
          number < 12 ? 'bom dia' : number > 18 ? 'boa noite' : 'boa tarde'

        DOM.containerTime.insertAdjacentHTML(
          'afterbegin',
          innerHTML.htmlHour(text, time)
        )
      })
  },

  innerLocalization() {
    let key = '342bdff55c7b1778c91db25027551291'
    let url = 'http://api.ipapi.com/' + DOM.ip_address + '?access_key=' + key

    fetch(url)
      .then(response => response.json())
      .then(dados => {
        console.log(dados)
        localStorage.setItem('city', dados.city)

        DOM.containerTime.insertAdjacentHTML(
          'beforeend',
          innerHTML.htmlLocalization(dados)
        )

        DOM.containerCards.insertAdjacentHTML(
          'afterbegin',
          innerHTML.htmlCard(dados)
        )
      })
  },

  innerWeather() {
    let city = localStorage.getItem('city')
    let ip_address = localStorage.getItem('ip')
    let key = '64740f8d10944339a2c164919212509'
    let url =
      'https://api.worldweatheronline.com/premium/v1/weather.ashx?key=' +
      key +
      '&q=' +
      ip_address +
      '&format=json'

    console.log(url)

    fetch(url)
      .then(response => response.json())
      .then(dados => {
        console.log(dados)

        DOM.containerCards.insertAdjacentHTML(
          'afterbegin',
          innerHTML.htmlCardWeath(dados)
        )
      })
  },

  innerPhrase() {
    const url = 'https://type.fit/api/quotes'

    fetch(url)
      .then(response => response.json())
      .then(dados => {
        let tamanho_array = dados.length
        let numberRandom = Math.floor(Math.random() * tamanho_array)

        DOM.containerPhrase.insertAdjacentHTML(
          'afterbegin',
          innerHTML.htmlPhares(dados, numberRandom)
        )
      })
  },

  reloadPhrase() {
    DOM.containerPhrase.innerHTML = ''
    DOM.innerPhrase()
  },

  addClass() {
    const alterDiv = document.querySelectorAll('.btn-background span')

    for (i = 0; i < alterDiv.length; i++) {
      alterDiv[i].addEventListener('click', event => {
        Utils.cleanBtn(alterDiv)
        event.target.classList.contains('active')
          ? event.target.classList.remove('active')
          : event.target.classList.add('active')
        event.target.classList.contains('dark')
          ? document.querySelector(':root').classList.add('dark-mode')
          : document.querySelector(':root').classList.remove('dark-mode')
      })
    }
  }
}

const Utils = {
  cleanBtn(dados) {
    for (i = 0; i < dados.length; i++) {
      if (dados[i].classList.contains('active')) {
        dados[i].classList.remove('active')
      }
    }
  }
}

const innerHTML = {
  htmlHour(text, time) {
    const contextHour = `
    
      <p> 
        <span class=${
          text === 'bom dia' || 'boa tarde'
            ? 'icon-wb_sunny'
            : 'icon-brightness_2'
        }></span>
        ${text} | É atualmente
      </p>  
      <p class="hours">${time}<span>${time > '12' ? 'pm' : 'am'}</span> </p>
    `

    return contextHour
  },

  htmlLocalization(dados) {
    const contextLocalization = `
      <p>Você está em ${dados.city}, ${dados.region_name}</p> 
    `
    return contextLocalization
  },

  htmlCard(dados) {
    const contextCard = `
      <div>
        <div class="card-corp">
          <p class="card-title">País</p>  
          <hr>                  
          <p>${dados.country_name}</p>
        </div>
      </div>
      <div>
        <div class="card-corp">
          <p class="card-title">Idioma</p>
          <hr>             
          <p>${dados.location.languages[0].native}</p>           
        </div>        
      </div>
      <div>
        <div class="card-corp">
          <p class="card-title">Capital</p>  
          <hr>                  
          <p>${dados.location.capital}</p>
        </div>
      </div>
    `
    return contextCard
  },

  htmlCardWeath(dados) {
    const contextCardWeath = `
      <div>
        <div class="card-corp">
          <p class="card-title">Clima</p>  
          <hr>              
          <p>${dados.data.current_condition[0].FeelsLikeC}</p>
        </div>
      </div>      
      <div>
        <div class="card-corp">
          <p class="card-title">Umidade</p> 
          <hr>                   
          <p>${dados.data.current_condition[0].humidity}</p>
        </div>
      </div>
    `
    return contextCardWeath
  },

  htmlPhares(dados, numberRandom) {
    const contextPhrase = `                     
      <p>${dados[numberRandom].text}
      <strong>${dados[numberRandom].author}</strong>  
      </p> 
    `
    return contextPhrase
  }
}

const API = {
  init() {
    IP.setIp()
    DOM.innerHours()
    DOM.innerLocalization()
    DOM.innerWeather()
    DOM.innerPhrase()
    DOM.addClass()
  }
}

API.init()
