"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Ana Sayfa", path: "/" },
  { name: "Acil Çağrı", path: "/emergency" }
]

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="mb-4 border-b border-spruce px-0 lg:mb-8 lg:px-8">
      <ul className="flex">
        {navItems.map((item) => (
          <li key={item.path} className="w-full transition-all duration-200 hover:bg-haze/10 lg:w-fit">
            <Link
              href={item.path}
              title={item.name}
              className="flex w-full items-center justify-center lg:w-fit lg:min-w-14 lg:px-8"
            >
              <div className={clsx("relative h-full w-fit py-4 text-[15px]", pathname === item.path ? "font-bold" : "font-medium text-gray")}>
                <span>{item.name}</span>
                {pathname === item.path && (
                  <div className="absolute bottom-0 h-1 w-full min-w-14 rounded-full bg-primary" />
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar