/*
* @license
* Copyright 2022 Google LLC
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { db } from './firebase'; // Make sure this path is correct
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

const FEEDBACK_COLLECTION = "feedback";

// Function to send feedback
export const sendFeedback = async (feedback) => {
  try {
    await addDoc(collection(db, FEEDBACK_COLLECTION), {
      name: "Anonymous", // Replace "Anonymous" with dynamic user data if available
      feedback: feedback,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw new Error("Failed to send feedback");
  }
};

// Function to fetch feedback in real-time
export const fetchFeedback = (setComments) => {
  return onSnapshot(collection(db, FEEDBACK_COLLECTION), (snapshot) => {
    const fetchedFeedbacks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().timestamp?.toDate().toLocaleDateString() // Formatting the timestamp
    }));
    setComments(fetchedFeedbacks);
  });
};
