//Jacob Tyson
/*This page will track the price-index of Bitcoin of a selected list of countries. Also it will track
the price  history of Bitcoin-US Dollar using a line graph created using chart.js. This chart has the
functionality of selecting dates in which you would like the history of, and then displiay those results in the
line graph. The api that is used is from coindesk.com. This api is used for both getting price date history and Bitcoin price index
by countries.*/

let chart;    // Creates chart variable.

//This function will get price index based on country of user choice.
function get_price_index(){
  let selected_country = document.getElementById('country').value    // gets value of selected country
  let price_index_url = `https://api.coindesk.com/v1/bpi/currentprice/${selected_country}.json`   //  gets price index of selected country

    fetch(price_index_url)   //  gets json data from url
    .then( (response)=>{
      let price_index = response.json();   //  creates json data
      return price_index
    })
    .then( (price_index_json)=>{
      let country_index = price_index_json.bpi[selected_country.toUpperCase()].rate    // gets the rate of country currency in bitcoin
      //displays the prpice in DOM element.
      document.getElementById('index-box').innerHTML = `The price of Bitcoin in <b> ${selected_country.toUpperCase()}</b> is <b>${country_index}</b>.`
    })
   .catch( (err) => alert('ERROR, please try again'<br> + err))  // Displays error message
 }

//creates chart of current month
function current_month_chart(){
    let current_month_url = 'https://api.coindesk.com/v1/bpi/historical/close.json'

    fetch(current_month_url)
    .then( (response)=>{
      let current_month_json = response.json()
      return current_month_json
    })
    .then( (current_month_json)=>{
      let rate_array = [];    //  array for price
      let label_array = [];   //  array for dates
      let current_month_data = current_month_json.bpi   //  gets dates:rate object from api json data

      for (date in current_month_data){   //  get all dates and labels and pushes them into array
        label_array.push(date)
        rate_array.push(current_month_data[date])
      }
      create_chart(rate_array, label_array)   // creates chart
    })
  }



function create_chart (rate_array, label_array){    //    creates chart using parameters for chart data and labels

  let ctx = document.getElementById('myChart').getContext('2d');
  let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: label_array,
        datasets: [{
            label: 'Bitcoin-USD Index',
            backgroundColor: '#9E4770',
            lineTension: 0,
            borderWidth: '2',
            borderColor: '#1C1F33',
            data: rate_array
        }]
    },
    // Configuration options
    options: {
      responsive: false,
    }
  });
}

//destroy chart element, create new canvas element, create new chart with new user selected data parameters.
function create_chart_with_selected_dates (){
  document.getElementById('myChart').remove();    //    destroys old canvas element - deletes old chart
  let chart_div = document.getElementById('chart-box')
  let new_chart_element = document.createElement('canvas')
  new_chart_element.setAttribute('id', 'myChart')   //    ensures new chart id is the same os old (so create_chart() works properly)
  chart_div.appendChild(new_chart_element)    //  creates new canvas element in proprer div element

  let start_date = document.getElementById('start-date').value;
  let end_date= document.getElementById('end-date').value;

  // url with date parameter of user inputs.

  let chosen_start_date = start_date.replace('-','');
  let chosen_start_date2 = chosen_start_date.replace('-','')


  let chosen_end_date = end_date.replace('-','')
  let chosen_end_date2 = chosen_end_date.replace('-','')

  var d = new Date()

  let today = new Date();     // get new date
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
  let yyyy = today.getFullYear();

  today = yyyy +  mm + dd;    //  formating new date
  console.log(today)
  //    validating user input for correct dates -- needs to be accurate for api.
  if(chosen_end_date2 < chosen_start_date2){
      alert(`Please select a Start date prior to your chosen End date (${end_date})`)  //  error message
}else if (chosen_end_date2 == chosen_start_date2 ){
  alert('Sorry, this chart only tracks the price of Bitcoin between two diffenet dates. Please try again')  //  error message

}else if (chosen_end_date2 > today) {
  alert(`please select an End date either on, or prior to, todays date.`)  //  error message

}else if (chosen_start_date2 == today){
  alert(`Please select a date prior to todays date.`)  //  error message

}else{

  let url_by_dates =  `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start_date}&end=${end_date}`   //  historical api
  fetch(url_by_dates)
  .then( (response) => {
    let historical_bydate_data = response.json()    //  creates json data
    return historical_bydate_data
  })
  .then( (historical_bydate_data) => {
    let historical_data = historical_bydate_data.bpi
    let rate_array = []
    let label_array = []

    for (date in historical_data) {
      label_array.push(date)    //    used for labels in chart
      rate_array.push(historical_data[date])    //  used for price data in chart
    }
    create_chart(rate_array, label_array)   //  Creates new chart with historical data.
  })
  .catch((err)=>alert('ERROR, Please try again'<br> + err))
    }

}

get_price_index()   //  runs on start of page (USD default)
document.getElementById('country').onclick = ()=>{get_price_index()}    //  runs get price index function on click.

current_month_chart()   // creates current month line graph on pages first load.

document.getElementById('submit').onclick = ()=>{create_chart_with_selected_dates()}
