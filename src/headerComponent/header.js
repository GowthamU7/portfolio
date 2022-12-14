import github from "../assets/github.png"
import email from "../assets/email.png"
import linkedin from "../assets/linkedin.png"
import "./header.css"


function Header(){
    return (
        <header>
            <div className="social_connect">
                <nav>
                    <a 
                    href="https://github.com/GowthamU7"
                    >
                        <img 
                            className="logo" 
                            src={github}
                            alt="github"
                        />
                    </a>
                    <a 
                    href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=CllgCJNqspNxCkLNMGWngpPkGBwMGBJNSHShHtbBnXZNNZmmfxxPGLLMGGHTzWVJNNbXHPVNnfg"
                    >
                        <img 
                            className="logo" 
                            src={email}
                            alt="email"
                        />
                    </a>
                    <a 
                    href="https://www.linkedin.com/in/gowtham-sai-b07348170/"
                    >
                        <img 
                            className="logo" 
                            src={linkedin}
                            alt="linkedin"
                        />
                    </a>
                </nav>
            </div>
            <div className="other_links">
                <nav>
                    <a href="/">Projects</a>
                    <a href="/">Contact me</a>
                </nav>
            </div>
        </header>
    )
}
export default Header