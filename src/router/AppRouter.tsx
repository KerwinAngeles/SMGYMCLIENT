import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import DashboardPage from "@/features/dashboard/pages/dashboard-page"
import AttendancePage from "@/features/attendance/pages/AttendancePage"
import ClientPage from "@/features/clients/pages/ClientPage"
import MembershipPage from "@/features/memberships/pages/MembershipPage"
import Login from "@/features/auth/pages/LoginPage"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import Register from "@/features/auth/pages/RegisterPage"
import StaffPage from "@/features/staff/pages/StaffPage"
import PlanPage from "@/features/plans/pages/PlanPage"
import AccountPage from "@/features/account/pages/AccountPage"
import StepperPage from "@/features/stepper/page/StepperPage"
import { ForgotPassword } from "@/features/auth/components/ForgotPassword"
import { ResetPassword } from "@/features/auth/components/ResetPassword"

export function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword/>}/>
          <Route path="/resetPassword" element={<ResetPassword/>}/>
          <Route path="/dashboard" element={<ProtectedRoute> <DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/stepper" element={<ProtectedRoute> <DashboardLayout><StepperPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute> <DashboardLayout><StaffPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/client" element={<ProtectedRoute> <DashboardLayout><ClientPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute> <DashboardLayout><MembershipPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute> <DashboardLayout><PlanPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute> <DashboardLayout><AttendancePage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute> <DashboardLayout><AccountPage /></DashboardLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>

  )
}
