
const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 text-white bg-slate-800 sm:p-2">
      <div className="text-2xl font-bold text-white logo">
        <span className="text-purple-400">&lt; </span>
        pass<span className="text-purple-400">KEEPER/ &gt;</span>
      </div>
      <div className='flex items-center justify-center'>
        Created with <img className='w-8 mx-2' src='icons/heart.png' alt='love & efforts' /> by Ayush Gupta
      </div>
    </div>
  );
};

export default Footer
