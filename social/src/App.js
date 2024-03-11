import About from "./About";
import { Link, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom"
import Header from "./Header";
import Home from "./Home";
import Missing from "./Missing";
import Nav from "./Nav";
import NewPost from "./NewPost";
import PostPage from "./PostPage";  
import Footer from "./Footer";
import Post from "./Post";
import useWindowSize from "./hooks/useWindowSize";

import { useEffect, useState } from "react";
import { format } from "date-fns"
import api from "./api/posts"
import EditPost from "./EditPost";

function App() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('');
  const [searchresults, setSearchresults] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [editBody,setEditBody]=useState('')
  const [editTitle,setEditTitle]=useState('')
  const navigate = useNavigate();
  const {width}=useWindowSize();

  useEffect(() => {
    const fetchposts = async () => {
      try {
        const response = await api.get('/posts')
        setPosts(response.data)
      } catch (err) {
        console.log(`Error:${err.message}`);
      }
    }
    fetchposts();
  }, [])

  useEffect(() => {
    const filterrecords = posts.filter((post) =>
      ((post.body).toLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLowerCase())
    );

    setSearchresults(filterrecords.reverse());


  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newpost = { id, title: postTitle, datetime, body: postBody }
    try {
      const response = await api.post('/posts', newpost)
      const allposts = [...posts, response.data]
      setPosts(allposts)
      setPostTitle('')
      setPostBody('')
      navigate('/')
    } catch (err) {
      console.log(`Error:${err.message}`);
    }

  }
  const handleDelete = async(id) => {
    try {
      await api.delete(`/posts/${id}`)
      const postlists = posts.filter(post => post.id !== id)
      
      setPosts(postlists);
      navigate('/')
    } catch (err) {
      console.log(`Error:${err}`);
    }
  }

  const handleEdit = async ( id )=>{
      
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedpost = { id, title: editTitle, datetime, body: editBody }
    try{
        const response=await api.put(`/posts/${id}`,updatedpost)
        console.log(response);
        setPosts(posts.map(post=>post.id === id ? {...response.data}:post))
        setEditTitle('')
        setEditBody('')
        navigate('/')


    }catch(err){
      console.log(`Error : ${err.message}`)
    }
  }

  return (
    <div className="App">


      <Header title="Social Media" width={width}/>
      <Nav
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path="/" element={<Home
          posts={searchresults} />} />
        <Route path="/post">
          <Route index element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}

          />} />
          <Route path=":id" element={<PostPage posts={posts}  handleDelete={handleDelete}
          />} />
         
        </Route>
        <Route path="/edit/:id" element={<EditPost 
          posts={posts}
          handleEdit={handleEdit}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editBody={editBody}
          setEditBody={setEditBody}
        
        />} />
        

        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />


    </div>
  );
}

export default App;
