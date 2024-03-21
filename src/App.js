import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { checkAdminRoleAndLogoutIfNot } from "./config/utils";
import { useAuth } from "./authState";
import { db } from "./config/firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import store from "../src/store/store";
import Skeleton from "./components/Skeleton";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./protectedRoutes";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import LoadingScreen from "./components/LoadingScreen";
import Bonds from "./pages/Bonds";
import AddBond from "./pages/Bonds/Add";
import EditBond from "./pages/Bonds/Edit";
import Dashboard from "./pages/Dashboard";
import RegisteredUsers from "./pages/RegisteredUsers";
import { ModalProvider } from "./context/ModalContext";
import AddNewUser from "./pages/RegisteredUsers/AddUser";
import ViewUser from "./pages/RegisteredUsers/ViewUser";
import Edit from "./pages/RegisteredUsers/ClientInfo/Edit";
import EditKyc from "./pages/RegisteredUsers/KYC/edit";
import EditBankDetails from "./pages/RegisteredUsers/BankDetails/Edit";
import ClientCashPage from "./pages/RegisteredUsers/AccountOverview/ClientCashBalance";
import EditPortfolio from "./pages/RegisteredUsers/AccountOverview/ClientCashBalance/Edit";
import AddCashBalance from "./pages/RegisteredUsers/AccountOverview/ClientCashBalance/Add";

function App() {
  const { loadingAuthState } = useAuth();

  useEffect(() => {
    checkAdminRoleAndLogoutIfNot(db);
  }, []);

  return (
    <ModalProvider>
      <Provider store={store}>
        <div className="App">
          <Router>
            <Routes>
              <Route
                path="/dashboard/"
                element={
                  <ProtectedRoute>
                    <Skeleton />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users"
                  element={
                    <ProtectedRoute>
                      <RegisteredUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/add_new_user"
                  element={
                    <ProtectedRoute>
                      <AddNewUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/:userId"
                  element={
                    <ProtectedRoute>
                      <ViewUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/edit/:userId"
                  element={
                    <ProtectedRoute>
                      <Edit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/edit_kyc/:userId"
                  element={
                    <ProtectedRoute>
                      <EditKyc />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/edit_bank_details/:userId"
                  element={
                    <ProtectedRoute>
                      <EditBankDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_cash_details/:userId"
                  element={
                    <ProtectedRoute>
                      <ClientCashPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/add_cash_details/:userId"
                  element={
                    <ProtectedRoute>
                      <AddCashBalance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/edit_cash_details/:userId"
                  element={
                    <ProtectedRoute>
                      <EditPortfolio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bonds"
                  element={
                    <ProtectedRoute>
                      <Bonds />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bonds/add"
                  element={
                    <ProtectedRoute>
                      <AddBond />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bonds/edit/:bondId"
                  element={
                    <ProtectedRoute>
                      <EditBond />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="/" index element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Router>
          {loadingAuthState && <LoadingScreen />}
        </div>
      </Provider>
    </ModalProvider>
  );
}

export default App;
