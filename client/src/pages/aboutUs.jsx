import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div style={{minHeight:"59vh"}}>
        <h1 style={{margin:"20px"}}>About DocConnect</h1>
        <p style={{textAlign:"center",fontSize:"20px"}}>
          Welcome to DocConnect, where we are dedicated to revolutionizing the way you interact with healthcare.
          Founded by Mohamad Mahdi Chahine, our mission is to simplify healthcare accessibility and empower
          individuals to take control of their healthcare journey.
        </p>
        <h1 style={{margin:"20px"}}>Our Mission</h1>
        <p style={{textAlign:"center",fontSize:"20px"}}>
          In an era defined by technological advancements and convenience, healthcare can still be plagued by
          complexity and inefficiency. The quest to find and connect with healthcare professionals often feels
          like a daunting journey. That's why we've developed DocConnect, a web application,
          aimed at streamlining this process and making healthcare accessible to everyone, irrespective of their
          technological proficiency.
        </p>
        <h1 style={{margin:"20px"}}>Meet Our Team</h1>
        <p style={{textAlign:"center",fontSize:"20px"}}>
        Meet our dedicated team led by Mohammad Mahdi Chahine, each of whom shares a passion for making a positive impact in healthcare.
        </p>
        <h1 style={{margin:"20px"}}>Get in Touch</h1>
        <p style={{textAlign:"center",fontSize:"20px"}}>
        Have questions or feedback? We'd love to hear from you! Feel free to reach out to us at mmchahine0@gmail.com.
        </p></div>
      <Footer />
    </div>
  );
};

export default AboutUs;
