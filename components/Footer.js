export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className='w-full flex justify-center mt-auto'>
      <div className='w-full max-w-4xl text-center p-4 text-white/80'>
        © {currentYear} CenterPoint Gaming. All rights reserved.
      </div>
    </footer>
  );
}