import "./contact.component.css"

function Contact(){
    return (
        <div className="contact">
            <form>
                <div className="form_heading">
                    <h2>Contact Me.</h2>
                </div>
                <div>
                    <h3>Name</h3>
                    <input type={"text"} id="name" name="name"/>
                </div>
                <div>
                    <h3>Email</h3>
                    <input type={"email"} id="email" name="email"/>
                </div>
                <div>
                    <h3>Name</h3>
                    <select>
                        <option>Free lancing</option>
                    </select>
                </div>
                <div>
                    <h3>Your message</h3>
                    <textarea></textarea>
                </div>
                <div>
                    <button type="button">Submit</button>
                </div>
            </form>
        </div>
    )
}


export default Contact