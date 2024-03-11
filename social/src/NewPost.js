import React from 'react'

const NewPost = ({ handleSubmit,postTitle, setPostTitle, postBody, setPostBody }) => {
  return (
    <main className='NewPost'>
      <h2>NewPost</h2>
      <form className='newPostForm' onSubmit={handleSubmit}>

        <label htmlFor='postTitle'>Title:</label>
        <input
          id='postTitle'
          type='text'
          required
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}


        />
        <br />

        <label htmlFor='postBody'>Post:</label>
        <textarea
          id='postBody'
          type='text'
          required
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}


        />
        <br />
        <button onSubmit={handleSubmit}> Submit</button>

      </form>

    </main>
  )
}

export default NewPost
