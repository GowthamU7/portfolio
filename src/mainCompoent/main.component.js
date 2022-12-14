import "./main.component.css"
import profile from "../assets/profile.jpg"


function Main(){
    return (
        <main>
            <div className="about">
                <img src={profile} alt="profile" className="profile"/>
                <h3> {"<React-beginner/>"}</h3>
                <p>Just lost in world of React.</p>
            </div>
        </main>
    )
}


export default Main