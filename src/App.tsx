import { InfoAlert } from './components/custom/alertCustom'

const App = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#fffcf6]">
      <h1 className='text-5xl text-black'>Hello, World!</h1>
      <InfoAlert />
    </div>
  )
}

export default App