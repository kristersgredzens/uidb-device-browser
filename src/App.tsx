import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import DeviceList from '@/pages/DeviceList'
import DeviceDetail from '@/pages/DeviceDetail'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DeviceList />} />
        <Route path="/devices/:id" element={<DeviceDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
