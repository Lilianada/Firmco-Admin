import { UserCircleIcon } from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { fetchFeedback, sendFeedback } from '../../config/feedback';
  
export default function Feedback() {
    const [comments, setComments] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');

  useEffect(() => {
    const unsubscribe = fetchFeedback(setComments);
    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newFeedback.trim()) return;
    await sendFeedback(newFeedback);
    setNewFeedback('');
  };
  return (
    <section aria-labelledby="notes-title">
    <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
      <div className="divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h2 id="notes-title" className="text-lg font-medium text-gray-900">
            Feedbacks
          </h2>
        </div>
        <div className="px-4 py-6 sm:px-6">
          <ul className="space-y-8">
            {comments.map((comment) => (
              <li key={comment.id}>
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <UserCircleIcon
                      className="h-10 w-10 text-gray-500"
                    />
                  </div>
                  <div>
                    <div className="text-sm">
                      <Link htoref="#" className="font-medium text-gray-900">
                        {comment.name}
                      </Link>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>{comment.feedback}</p>
                    </div>
                    <div className="mt-2 space-x-2 text-sm">
                      <span className="font-medium text-gray-500">{comment.date}</span>{' '}
                      <span className="font-medium text-gray-500">&middot;</span>{' '}
                      <button type="button" className="font-medium text-gray-900">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-6 sm:px-6">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <UserCircleIcon className='h5 w-5 text-gray-500' />
          </div>
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="comment" className="sr-only">
                  About
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Add a text"
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                  />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  to="#"
                  className="group inline-flex items-start space-x-2 text-sm text-gray-500 hover:text-gray-900"
                >
                  <QuestionMarkCircleIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span>Some HTML is okay.</span>
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Leave feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
