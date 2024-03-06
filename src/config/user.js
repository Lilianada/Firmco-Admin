import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    signOut,
  } from "firebase/auth";
  
  const ADMINUSERS_COLLECTION = "adminUsers";
  const ADMINDASH_COLLECTION = "admin_users";
  const USERS_COLLECTION = "users";
  
  //Admin Users
  export function addAdminUser(uid, fullName, email) {
    // Use the uid directly as the document ID
    return setDoc(doc(db, ADMINUSERS_COLLECTION, uid), {
      fullName,
      email,
    });
  }
  
  export const checkAdminRoleAndLogoutIfNot = async (db) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      return false;
    }
  
    try {
      const adminUserRef = doc(db, ADMINUSERS_COLLECTION, user.uid);
      const adminUserDoc = await getDoc(adminUserRef);
  
      if (adminUserDoc.exists() && adminUserDoc.data().role === "admin") {
        return true;
      } else {
        await signOut(auth);
        return false;
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      await signOut(auth);
      return false;
    }
  };
  
  //USER REQUESTS
  const USER_REQUESTS_COLLECTION = "userRequests";
  
  //Get all user requests
  export const fetchUserRequests = async (db) => {
    if (!db) {
      throw new Error("Database instance not provided");
    }
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDocs = await getDocs(adminDashRef);
    let allUserRequests = [];
  
    for (const doc of adminDocs.docs) {
      const userRequestsRef = collection(
        db,
        ADMINDASH_COLLECTION,
        doc.id,
        USER_REQUESTS_COLLECTION
      );
      const userRequestsSnapshot = await getDocs(userRequestsRef);
      const requests = userRequestsSnapshot.docs.map((userDoc) => ({
        ...userDoc.data(),
        id: userDoc.id,
        uid: doc.id,
      }));
      allUserRequests = allUserRequests.concat(requests);
    }
    return allUserRequests;
  };
  
  //handle user approval
  export const handleUserApproval = async (db, auth, userId, requestData) => {
    try {
      // Step 1: Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        requestData.email,
        requestData.password
      );
  
      const user = userCredential.user;
      // Send email verification
      await sendEmailVerification(user);
  
      // Step 2: Use the User ID as the document ID in the 'users' collection
      const newUserId = userCredential.user.uid;
      await setDoc(doc(db, "users", newUserId), {
        fullName: requestData.fullName,
        email: requestData.email,
        address: requestData.address,
        mobilePhone: requestData.mobilePhone,
        country: requestData.country,
        jointAccount: requestData.jointAccount,
        secondaryAccountHolder: requestData.secondaryAccountHolder,
      });
  
      // Step 3: Delete the admin request
      await deleteDoc(
        doc(
          db,
          ADMINDASH_COLLECTION,
          requestData.uid,
          USER_REQUESTS_COLLECTION,
          userId
        )
      );
  
      // Step 4: Send a confirmation email
      const mailRef = collection(db, "mail");
      await addDoc(mailRef, {
        to: requestData.email,
        message: {
          subject: "Signup Request Approved",
          html: `<p>Hello ${requestData.fullName},</p>
            <p>Your signup request has been approved! You can now log in using your credentials.</p>
            <p>Thank you for joining us!</p>`,
        },
      });
  
      return "User request approved successfully.";
    } catch (error) {
      console.error("Error approving user:", error);
      throw new Error(`Error approving user: ${error.message}`);
    }
  };
  
  //handle user rejection
  export const handleUserRejection = async (db, userId, requestData) => {
    try {
      // Step 1: Delete the specific user request
      await deleteDoc(
        doc(
          db,
          ADMINDASH_COLLECTION,
          requestData.uid,
          USER_REQUESTS_COLLECTION,
          userId
        )
      );
  
      // Step 2: Send a rejection email
      const mailRef = collection(db, "mail");
      await addDoc(mailRef, {
        to: requestData.email,
        message: {
          subject: "Signup Request Rejected",
          html: `<p>Hello ${requestData.fullName},</p>
            <p>We regret to inform you that your signup request has been rejected. 
            If you believe this is an error or want to inquire further, please contact our support team.</p>
            <p>Thank you for your understanding!</p>`,
        },
      });
  
      return "User request rejected and removed successfully.";
    } catch (error) {
      console.error("Error rejecting and removing user:", error);
      throw new Error(`Error rejecting and removing user: ${error.message}`);
    }
  };
  
  // Sum userRequests
  export function sumUserRequests(db, setRequests) {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    let userRequestsCount = 0;
    let activeListeners = 0;
  
    onSnapshot(adminDashRef, (adminDocs) => {
      userRequestsCount = 0; // Reset the count for each update
      activeListeners = adminDocs.size; // Reset the number of active listeners
  
      if (activeListeners === 0) {
        setRequests(0); // If no admin docs, set count to 0
      }
  
      adminDocs.forEach((doc) => {
        const usersRequestsRef = collection(
          db,
          ADMINDASH_COLLECTION,
          doc.id,
          USER_REQUESTS_COLLECTION
        );
  
        onSnapshot(usersRequestsRef, (usersRequestsSnapshot) => {
          userRequestsCount += usersRequestsSnapshot.size;
  
          activeListeners -= 1;
          if (activeListeners === 0) {
            setRequests(userRequestsCount); // Update the count when all listeners have reported
          }
        });
      });
    });
  }
  
  // get all users
  export async function getUser(uid) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      return [{ ...userSnap.data(), id: userSnap.id }];
    } else {
      return [];
    }
  }
  
  // update user data
  export function updateUser(uid, userData) {
    const userDoc = doc(db, USERS_COLLECTION, uid);
    console.log("userData", userData);
    return updateDoc(userDoc, userData);
  }
  
  //delete user
  export function deleteuser(uid) {
    const userDoc = doc(db, USERS_COLLECTION, uid);
    return deleteDoc(userDoc);
  }
  
  // Fetch all users
export async function getRegisteredUsers() {
  try {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const usersData = userSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
      }));
      return usersData;
  } catch (error) {
      console.error("Error fetching users:", error);
      return []; // Return an empty array or handle the error as needed
  }
}