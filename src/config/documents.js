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
import {
  setDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

//DOCUMENTS
export const fetchDocument = async () => {
  const usersCollection = collection(db, "users");
  const userDocs = await getDocs(usersCollection);
  const allDocuments = [];
  for (const userDoc of userDocs.docs) {
    const user = userDoc.data();
    const docCollection = collection(userDoc.ref, "docs");
    const docDocs = await getDocs(docCollection);
    docDocs.docs.forEach((docDoc) => {
      allDocuments.push({
        userId: userDoc.id,
        ...docDoc.data(),
        fullName: user.fullName,
        docId: docDoc.id,
      });
    });
  }
  return allDocuments;
};

export const fetchUserDocument = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "docs")
    );
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } else {
      return;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

export const deleteDocument = async (userId, docId, fileName) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${userId}/${fileName}`);

  try {
    await deleteObject(storageRef);
    const docRef = doc(db, "users", userId, "docs", docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error during deletion:", error);
    throw error;
  }
};
export const updateDocument = async (
  userId,
  fileDescription,
  file,
  documentId
) => {
  const storage = getStorage();
console.log(documentId)
  try {
    if (documentId) {
      const docRef = doc(db, "users", userId, "docs", documentId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Document exists, proceed with update
        const existingDocData = docSnapshot.data();
        const existingDownloadURL = existingDocData.downloadURL;
        const existingStorageRef = ref(storage, existingDownloadURL);
        console.log(existingDocData, existingDownloadURL, existingStorageRef);

        // Delete the existing file from Firebase Storage
        await deleteObject(existingStorageRef);
        // Upload the new file to Firebase Storage
        const newStorageRef = ref(storage, `${userId}/${file.name}`);
        const uploadTask = uploadBytesResumable(newStorageRef, file);
        await uploadTask;

        const downloadURL = await getDownloadURL(newStorageRef);

        const updatedDocData = {
          fileDescription,
          downloadURL,
          fileName: file.name,
        };
        console.log(updatedDocData, 'updated successfully');
        await updateDoc(docRef, updatedDocData);
      } else {
        await createNewDocument(userId, fileDescription, file, db);
      }
    } 
    else {
      await createNewDocument(userId, fileDescription, file, db);
    }
  } catch (error) {
    console.error("Error during file upload or Firestore operation:", error);
    throw error;
  }
};

const createNewDocument = async (userId, fileDescription, file, db) => {
  const storage = getStorage();
  const newStorageRef = ref(storage, `${userId}/${file.name}`);
  const uploadTask = uploadBytesResumable(newStorageRef, file);
  await uploadTask;

  const downloadURL = await getDownloadURL(newStorageRef);
  const userDocCollectionRef = collection(db, "users", userId, "docs");
  const newDocData = {
    fileDescription,
    downloadURL,
    fileName: file.name,
  };

  await addDoc(userDocCollectionRef, newDocData);
  console.log("New document created successfully.");
};
export const downloadFile = async (doc) => {
  try {
    // Get the download URL for the file
    const downloadURL = doc.downloadURL;
    // Fetch the file data from the download URL
    const response = await fetch(downloadURL);
    const blob = await response.blob();

    // Create a temporary anchor element to initiate the download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    // Set the file name for the download
    a.download = doc.fileName || "download";

    // Append the anchor element to the body and click it to start the download
    document.body.appendChild(a);
    a.click();

    // Remove the anchor element from the body
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
