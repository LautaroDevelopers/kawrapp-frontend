import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMenuLine, RiCloseLine } from '@remixicon/react';

export const NavBar = () => {
    const [open, setOpen] = useState(false);
    const closeMenu = () => setOpen(false);

    return (
        <>
            <nav className="bg-blue-500 p-4 md:px-6 flex justify-between items-center shadow-md relative" role="navigation" aria-label="Principal">
                <Link to="/dashboard" className="text-white text-lg font-bold hover:text-blue-100 transition-colors duration-150">
                    KawrApp
                </Link>

                {/* Desktop menu */}
                <ul className="hidden md:flex space-x-4 items-center">
                    <li>
                        <Link
                            to="/dashboard"
                            className="text-white hover:text-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-600/50 transition-all duration-150 cursor-pointer"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/animals"
                            className="text-white hover:text-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-600/50 transition-all duration-150 cursor-pointer"
                        >
                            Animales
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/health"
                            className="text-white hover:text-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-600/50 transition-all duration-150 cursor-pointer"
                        >
                            Salud Animal
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/auth/login"
                            className="text-white hover:text-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-600/50 transition-all duration-150 cursor-pointer"
                        >
                            Logout
                        </Link>
                    </li>
                </ul>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-blue-600/60 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                    aria-controls="mobile-menu"
                    aria-expanded={open}
                    onClick={() => setOpen(o => !o)}
                >
                    {open ? <RiCloseLine /> : <RiMenuLine />}
                </button>
            </nav>

            {/* Mobile dropdown */}
            <div
                id="mobile-menu"
                className={`${open ? 'block' : 'hidden'} md:hidden bg-blue-500/95 shadow-inner`}
            >
                <ul className="flex flex-col space-y-1 p-2">
                    <li>
                        <Link
                            to="/dashboard"
                            onClick={closeMenu}
                            className="block text-white hover:text-blue-100 px-3 py-2 rounded-lg hover:bg-blue-600/60 transition-all duration-150"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/animals"
                            onClick={closeMenu}
                            className="block text-white hover:text-blue-100 px-3 py-2 rounded-lg hover:bg-blue-600/60 transition-all duration-150"
                        >
                            Animales
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard/health"
                            onClick={closeMenu}
                            className="block text-white hover:text-blue-100 px-3 py-2 rounded-lg hover:bg-blue-600/60 transition-all duration-150"
                        >
                            Salud Animal
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/auth/login"
                            onClick={closeMenu}
                            className="block text-white hover:text-blue-100 px-3 py-2 rounded-lg hover:bg-blue-600/60 transition-all duration-150"
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
}