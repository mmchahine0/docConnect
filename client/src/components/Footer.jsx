import '../styles/FooterStyles.css'
import fb from "../images/facebook.png"
import TwitterX from "../images/twitter.png"
import insta from "../images/insta.png"

const Footer = () => {

  return (
    <>
      <div className="footer">
        <div className='sb_footer section_padding'>
          <div className='sb_footer-links'>
            
            <div className='sb_footer-links_div'>
             <h4>Resources</h4> 
            <a href="/aboutUs">
                <p>Employee</p>
              </a>
              <a href="/aboutUs">
                <p>Health</p>
              </a>
              <a href="/aboutUs">
                <p>Individual</p>
              </a>
            </div> 
            <div className='sb_footer-links_div'>
              <h4>Company</h4> 
              <a href="/aboutUs">
                <p>About</p>
              </a>
              <a href="/aboutUs">
                <p>Press</p>
              </a>
              <a href="/aboutUs">
                <p>Carrer</p>
              </a>
              <a href="/aboutUs">
                <p>Contact</p>
              </a>
            </div>
                <div className='sb_footer-links_div'>
                  <h4>Coming on social media</h4> 
                <div className='socialmedia'>
                <p><img style={{ width: "40px", height: "27px", marginTop:"3px" }} src={fb} alt="Facebook"/></p>
                <p><img style={{ width: "40px", height: "35px" }} src={TwitterX} alt="Twitter"/></p>
                <p><img style={{ width: "35px", height: "32px" }} src={insta} alt="Instagram"/></p>
              </div>
             </div>
          </div>
          <hr />
          <div className='sb_footer-below'>
            <div className='sb_footer-copyright'>
              <p>
                @{new Date().getFullYear()} All right reserved.
              </p>
            </div>
            <div className='sb_footer-below-links'>
  <a href="https://www.freeprivacypolicy.com/live/01072943-aa43-40c5-b742-aca47f300343" target="_blank" rel="noopener noreferrer">
    <div><p>Terms &amp; Conditions</p></div>
  </a>
  <a href="https://www.freeprivacypolicy.com/live/01072943-aa43-40c5-b742-aca47f300343" target="_blank" rel="noopener noreferrer">
    <div><p>Privacy</p></div>
  </a>
  <a href="https://www.freeprivacypolicy.com/live/01072943-aa43-40c5-b742-aca47f300343" target="_blank" rel="noopener noreferrer">
    <div><p>Security</p></div>
  </a>
  <a href="https://www.freeprivacypolicy.com/live/01072943-aa43-40c5-b742-aca47f300343" target="_blank" rel="noopener noreferrer">
    <div><p>Cookie Declaration</p></div>
  </a>
</div>
          </div>
        </div>
      </div>
    </>
  )
};
export default Footer;