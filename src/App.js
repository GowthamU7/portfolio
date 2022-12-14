import Contact from "./contactComponent/contact.component";
import Footer from "./footerComponent/footer.component";
import Header from "./headerComponent/header";
import Main from "./mainCompoent/main.component";
import Projects from "./projectsComponent/projects.component";

function App() {
  return (
    <div className="App">
      <Header/>
      <Main/>
      <Projects/>
      <Contact/>
      <Footer/>
    </div>
  );
}

export default App;