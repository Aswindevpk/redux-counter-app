import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { PostsList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { EditPostForm } from './features/posts/EditPostForm'
import { useAppSelector } from './app/hooks'
import { LoginPage } from './features/auth/LoginPage'
import { selectCurrentUsername } from './features/auth/authSlice'


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername)

  if (!username) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={
            <LoginPage />
          } />
          <Route path='/*' element={
            <ProtectedRoute>
              <Routes>
                <Route path='/posts' element={
                  <>
                    <AddPostForm />
                    <PostsList />
                  </>
                } />
                <Route path='/posts/:postId' element={
                  <SinglePostPage />
                } />
                <Route path='/editPost/:postId' element={
                  <EditPostForm />
                } />
              </Routes>
            </ProtectedRoute>
          }>
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
