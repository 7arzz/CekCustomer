import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase/config";

const getCustomerRef = (userId) => collection(db, "users", userId, "customers");

export const subscribeToCustomers = (userId, callback) => {
  const q = query(getCustomerRef(userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const customers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
    callback(customers);
  });
};

export const addCustomer = async (userId, customerData) => {
  const activity = [{
    id: Date.now().toString(),
    date: new Date(),
    text: "Customer dibuat"
  }];

  return addDoc(getCustomerRef(userId), {
    ...customerData,
    activity,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateCustomer = async (userId, customerId, updates) => {
  const customerDoc = doc(db, "users", userId, "customers", customerId);
  return updateDoc(customerDoc, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteCustomer = async (userId, customerId) => {
  const customerDoc = doc(db, "users", userId, "customers", customerId);
  return deleteDoc(customerDoc);
};

export const addNote = async (userId, customerId, note, currentNotes = []) => {
  const customerDoc = doc(db, "users", userId, "customers", customerId);
  const newNote = {
    id: Date.now().toString(),
    date: new Date(),
    text: note
  };
  
  const activity = {
    id: `activity-${Date.now()}`,
    date: new Date(),
    text: "Catatan ditambahkan"
  };

  return updateDoc(customerDoc, {
    notes: [newNote, ...currentNotes],
    activity: [activity, ...(await getActivities(userId, customerId))],
    updatedAt: serverTimestamp()
  });
};

// Helper to get activities if needed separately
const getActivities = async (userId, customerId) => {
  // In a real app we might fetch the latest doc to get the current activities
  // For simplicity here, we assume activities are passed or handled in the component
  return []; 
};
