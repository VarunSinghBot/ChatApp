import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Connect from './Connect';
import Chat from './Chat';
import ErrPage from './ErrPage';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function App() {

  const routes = [
    {
      path: "/connect",
      element: <Connect/>,
    },{
      path: "/chat",
      element: <Chat roomId='1352' username='Varun'/>,
    }
  ];



  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/" element={<Layout />}>
            {routes.map((r, index) => {
              return <Route key={index} path={r.path} element={r.element} />;
            })}
          </Route>
          <Route path="*" element={<ErrPage />} />
        </Routes>
      </Router>
    </>
  )
}


function Layout() {
  return (
    <>
      <div className='h-dvh w-dvw bg-black'>
        {/* <ToastContainer position="bottom-right" autoClose={1600}/> */}
        <Outlet />
      </div>
    </>
  );
}

export default App
