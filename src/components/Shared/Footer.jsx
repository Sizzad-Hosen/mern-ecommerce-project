import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-gray-900 text-white rounded p-10">

<nav className="grid grid-flow-col text-sm gap-4">

  <Link href="/" className="link link-hover ">Home</Link>
  <Link href="/dashboard/profile" className="link link-hover">Profile</Link>
  <Link href="/dashboard" className="link link-hover">Dashboard</Link>
  <Link href="/dashboard/myOrders" className="link link-hover">MyOrder</Link>

</nav>


      <nav>
        

<div className="flex items-center gap-4">
  {/* GitHub Icon */}
  <Link href="https://github.com/Sizzad-Hosen" target="_blank">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="hover:text-gray-600 transition"
    >
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.729.082-.729 
      1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.335-5.467-5.93 
      0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.527.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 
      2.045.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.649.24 2.873.12 3.176.765.84 1.23 
      1.91 1.23 3.22 0 4.61-2.807 5.625-5.48 5.922.426.37.81 1.102.81 2.222 0 1.606-.015 2.896-.015 
      3.286 0 .315.21.694.825.576C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  </Link>

  {/* LinkedIn Icon */}
  <Link href="https://www.linkedin.com/in/md-sizzad-hosen-5a2618301/" target="_blank">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-current hover:text-blue-700 transition"
    >
      <path d="M4.98 3.5C3.32 3.5 2 4.82 2 6.48s1.32 2.98 2.98 2.98c1.66 0 2.98-1.32 2.98-2.98S6.64 3.5 4.98 3.5zM2.4 8.6H7.6V21H2.4V8.6zM9.6 8.6h4.8v1.7h.1c.6-1.1 2-2.3 4-2.3 4.3 0 5.1 2.8 5.1 6.4V21H18V14.5c0-1.6-.03-3.7-2.25-3.7-2.25 0-2.6 1.76-2.6 3.6V21H9.6V8.6z" />
    </svg>
  </Link>
          <Link href={"https://www.facebook.com/sizzadhosenofficial"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current">
              <path
                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </Link>
        </div>
      </nav>
      <aside>
        <p className='text-xl'>Copyright © {new Date().getFullYear()} - All right reserved by Developer <span className='text-[#0967C2] text-2xl'>Sizzad Hosen</span></p>
      </aside>
    </footer>
  );
};

export default Footer;
