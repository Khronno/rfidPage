import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import {Navbar, Sections} from './components/NavBar'
import Footer from './components/Footer'

function App() {

  return (
    <div className="App">
      <Navbar/>
      <Sections/>
      <Footer/>
    </div>
  )
}

export default App
