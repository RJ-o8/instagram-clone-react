import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import ImageUpload from './Components/ImageUpload';
import Post from './Components/Post';
import { auth, db } from './firebase';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles(); 
  const [modalStyle] = useState(getModalStyle);
  const [openLogin, setOpenlogin] = useState(false)
  const [posts,setPost ]= useState([]);
  const [open,setOpen] =useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");
  const [user,setUser] = useState(null)

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPost(snapshot.docs.map(doc=> ({
        id:doc.id,
        post : doc.data()
      })))
    })
    
  }, [])

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
        // if logged in
        if(authUser){
            setUser(authUser);
            
            if(authUser.displayName){
                //dont update it
            }
            else{
                //just created a user
                return authUser.updateProfile({
                    displayName:username,
                })
            }
        }
        else{
            //logged out
            setUser(null)
        }
    })
    return () =>{
        //clean up action of listners
        unsubscribe();
    }
  }, [user,username])

  const handelsignup = (e)=>{
    e.preventDefault();
    
    auth
    .createUserWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    setOpen(false)
  }
  
  const login =(e)=>{
    e.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
    .catch(err => alert(err.message));
    setOpenlogin(false)
  }

  return (
    <div className="app">

      <Modal open={open} onClose={()=> setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <div>
            <form className="signup">
                <center>
                    <img className="app_headerImage" 
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                        alt=""
                    />
                </center>
                <Input 
                    placeholder= "username"
                    type="text"
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                />
                <Input 
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <Input 
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />
                <Button onClick={handelsignup}>SignUp</Button>
            </form>
          </div>
        </div>
      </Modal>


      <Modal open={openLogin} onClose={()=> setOpenlogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <div>
            <form className="signup">
                <center>
                    <img className="app_headerImage" 
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                        alt=""
                    />
                </center>
                <Input 
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <Input 
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />
                <Button onClick={login}>Login</Button>
            </form>
          </div>
        </div>
      </Modal>

      <div className="app_header">
        <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
        {/* signup button */}
        {
          user ? (
            <Button onClick={()=>auth.signOut()} >Logout</Button>
          ):(
            <div className="login_container">
            <Button onClick={()=> setOpenlogin(true)}>Login</Button>

            <Button onClick={()=> setOpen(true)}>SignUp</Button>

            </div>
          )
        }
      </div>
      <div className="app_posts">

          {/* actual post rendering */}
          {
            posts.map(({id,post}) => (
              <Post key={id} user={user} postId={id} username={post.username} photoUrl={post.photoUrl} caption ={post.caption}/>
            ))
          }
        
      </div>
      
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />  
      ):(
        <h3>LOGIN TO UPLOAD</h3>
      )
      }
    </div>
  );
}

export default App;
