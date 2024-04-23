import React from 'react'
import {
    AcademicCapIcon,
    BanknotesIcon,
    CheckBadgeIcon,
    ClockIcon,
    CreditCardIcon,
    ReceiptRefundIcon,
    UsersIcon,
  } from '@heroicons/react/24/outline'
  
const actions = [
    {
      icon: UsersIcon,
      name: 'Add new user',
      href: '/dashboard/registered_users',
      iconForeground: 'text-sky-700',
      iconBackground: 'bg-sky-50',
      text: 'Add a new user to the system. To do this, you need to go to the REGISTERED USERS, click on the ADD USER button and fill the form.',
    },
    {
      icon: CreditCardIcon,
      name: 'Add new bonds',
      href: '/dashboard/bonds',
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-50',
      text: 'Add a new bond to the system. To do this, you need to go to the BONDS PAGE, click on the ADD BONDS button and fill the form.',
    },
    {
      icon: BanknotesIcon,
      name: 'Add new fixed term deposit',
      href: '/dashboard/fixed_term_deposits',
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-50',
        text: 'Add a new fixed term deposit to the system. To do this, you need to go to the FIXED TERM DEPOSITS page, click on the ADD TERMS button and fill the form.',
    },
    {
      icon: ClockIcon,
      name: 'Requests from users',
      href: '#',
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-50',
        text: 'View all requests from users. On the sidebar, click on any one of the REQUESTS button and view all requests users make on different products.',
    },
    {
      icon: ReceiptRefundIcon,
      name: 'Submit an expense',
      href: '#',
      iconForeground: 'text-rose-700',
      iconBackground: 'bg-rose-50',
    },
    {
      icon: AcademicCapIcon,
      name: 'Training',
      href: '#',
      iconForeground: 'text-indigo-700',
      iconBackground: 'bg-indigo-50',
    },
  ]
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  export default function Todo() {
    return (
      <section aria-labelledby="quick-links-title">
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        <h2 className="sr-only" id="quick-links-title">
          Quick links
        </h2>
        {actions.map((action, actionIdx) => (
          <div
            key={action.name}
            className={classNames(
              actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
              actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
              actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
              actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
              'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500'
            )}
          >
            <div>
              <span
                className={classNames(
                  action.iconBackground,
                  action.iconForeground,
                  'inline-flex rounded-lg p-3 ring-4 ring-white'
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <a href={action.href} className="focus:outline-none">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500">
               {action.text}
              </p>
            </div>
            <span
              className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </section>
    )
  }
  