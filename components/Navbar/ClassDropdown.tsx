import { Menu, Disclosure } from "@headlessui/react";
import Link from "next/link";
export default function ClassDropdown() {
  return (
    <Menu as="div" className="inline-block text-left ">
      <Menu.Button className="outline-none focus:outline-none">
        <div className="flex flex-row p-2 outline-none focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="hidden md:block">Courses</p>
        </div>
      </Menu.Button>
      <Menu.Items
        className="absolute bg-blue-100 w-screen right-0 outline-none focus:outline-none"
        style={{ marginTop: "13.8px" }}
      >
        <Menu.Item>
          {({ active }) => (
            <>
              <div className="flex flex-col outline-none focus:outline-none text-lg ml-6">
                <Disclosure>
                  <Disclosure.Button className="py-2 outline-none focus:outline-none pt-4">
                    <section className="flex flex-row items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <p className="ml-1">Math: High School and College</p>
                    </section>
                  </Disclosure.Button>
                  <Disclosure.Panel className="">
                    <section className="flex flex-col pl-6 text-lg text-blue-500">
                      <Link href="Algebra 1">Algebra 1</Link>
                      <Link href="Geometry">Geometry</Link>
                      <Link href="Algebra 2">Algebra 2</Link>
                      <Link href="Precalculus">Precalculus</Link>
                      <Link href="AP Calculus AB">AP Calculus AB</Link>
                      <Link href="AP Calculus BC">AP Calculus BC</Link>
                      <Link href="AP Statistics">AP Statistics</Link>
                      <Link href="Multivariable Calculus">
                        Multivariable Calculus
                      </Link>
                      <Link href="Differential Equations">
                        Differential Equations
                      </Link>
                      <Link href="Linear Algebra">Linear Algebra</Link>
                    </section>
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button className="py-2 outline-none focus:outline-none">
                    <section className="flex flex-row ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <p className="ml-1">SAT</p>
                    </section>
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-gray-500">
                    <section className="flex flex-col pl-6 text-lg text-blue-500">
                      <Link href="SAT Reading">SAT Reading</Link>
                      <Link href="SAT Writing &amp; Grammar">
                        SAT Writing &amp; Grammar
                      </Link>
                      <Link href="SAT Math with Calculator">
                        SAT Math with Calculator
                      </Link>
                      <Link href="SAT Math without Calculator">
                        SAT Math without Calculator
                      </Link>
                    </section>
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button className="py-2 outline-none focus:outline-none">
                    <section className="flex flex-row text-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <p className="ml-1">Regents Preparation</p>
                    </section>
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-gray-500">
                    <section className="pl-6">To be made...</section>
                  </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                  <Disclosure.Button className="py-2 outline-none focus:outline-none">
                    <section className="flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <p className="ml-1">Science</p>
                    </section>
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-gray-500">
                    <section className="flex flex-col pl-6 text-lg text-blue-500">
                      <Link href="AP Chemistry">AP Chemistry</Link>
                      <Link href="AP Physics">AP Physics C: E&amp;M</Link>
                      <Link href="AP Physics">AP Physics C: Mechanics</Link>
                      <Link href="AP Physics">AP Physics 1</Link>
                      <Link href="AP Physics">AP Physics 2</Link>
                    </section>
                  </Disclosure.Panel>
                  <div className="pb-4"></div>
                </Disclosure>
              </div>
            </>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
