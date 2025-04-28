import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MoviesDetails";
import Shows from "./pages/Shows";
import ShowDetails from "./pages/ShowDetails";
import People from "./pages/People";
import PeopleDetails from "./pages/PeopleDetails";

function App() {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/shows" element={<Shows />} />
              <Route path="/shows/:id" element={<ShowDetails />} />
              <Route path="/people" element={<People />} />
              <Route path="/people/:id" element={<PeopleDetails />} />
            </Routes>
          </Layout>
        </Router>
      </div>
    </div>
  ); 
}

export default App;
