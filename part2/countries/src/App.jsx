import {useState, useEffect} from 'react'
import axios from 'axios';
import Country from './components/Country';

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`).then(
      function (response) {
        setCountries(response.data)
      }
    )
  }, [])

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <h1>Countries</h1>
      
      <p>Find countries</p>
      <input 
        type="text" 
        placeholder="Search for a country" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />

      {search === "" ? null : filteredCountries.length > 10 ?
        <p>Too many matches, specify the request</p> :
          filteredCountries.length > 1 ?
            <ul>
              {filteredCountries.map(country => (
                <div key={country.cca3}>
                  <li>{country.name.common}</li>
                  <button onClick={() => setSearch(country.name.common)}>Show</button>
                </div>
              ))}
            </ul> : 
            filteredCountries.length === 1 ? 
              <Country country={filteredCountries[0]} /> : null
      }
    </>
  )
}

export default App
