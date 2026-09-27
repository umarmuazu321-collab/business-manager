import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import './App.css'

const initialProducts = [
  { id: 1, name: 'Rice 25kg', category: 'Food', price: 45000, stock: 4 },
  { id: 2, name: 'Vegetable Oil', category: 'Cooking Oil', price: 18500, stock: 6 },
  { id: 3, name: 'Sugar 10kg', category: 'Food', price: 16000, stock: 7 },
  { id: 4, name: 'Spaghetti', category: 'Pasta', price: 12500, stock: 3 },
]

const initialCustomers = [
  { id: 1, name: 'Ahmed Musa', phone: '08012345678', address: 'Kano' },
  { id: 2, name: 'Fatima Bello', phone: '08123456789', address: 'Kano' },
  { id: 3, name: 'Muhammad Ali', phone: '09012345678', address: 'Kano' },
  { id: 4, name: 'Aisha Ibrahim', phone: '07012345678', address: 'Kano' },
]

const initialSales = [
  {
    id: 1,
    customer: 'Ahmed Musa',
    product: 'Rice 25kg',
    amount: 45000,
    status: 'Paid',
  },
  {
    id: 2,
    customer: 'Fatima Bello',
    product: 'Vegetable Oil',
    amount: 18500,
    status: 'Paid',
  },
  {
    id: 3,
    customer: 'Muhammad Ali',
    product: 'Sugar 10kg',
    amount: 16000,
    status: 'Pending',
  },
  {
    id: 4,
    customer: 'Aisha Ibrahim',
    product: 'Spaghetti',
    amount: 12500,
    status: 'Paid',
  },
]

const initialDebts = [
  {
    id: 1,
    customer: 'Ahmed Musa',
    item: 'Rice 25kg',
    total: 45000,
    paid: 20000,
  },
  {
    id: 2,
    customer: 'Fatima Bello',
    item: 'Vegetable Oil',
    total: 18500,
    paid: 10000,
  },
  {
    id: 3,
    customer: 'Muhammad Ali',
    item: 'Sugar 10kg',
    total: 16000,
    paid: 0,
  },
]

const initialExpenses = [
  {
    id: 1,
    name: 'Shop Rent',
    category: 'Rent',
    amount: 50000,
    date: '2026-09-01',
  },
  {
    id: 2,
    name: 'Transport',
    category: 'Transport',
    amount: 15000,
    date: '2026-09-03',
  },
  {
    id: 3,
    name: 'Electricity',
    category: 'Utilities',
    amount: 17500,
    date: '2026-09-05',
  },
]

const defaultBusinessSettings = {
  businessName: 'Business Manager',
  ownerName: 'Business Owner',
  phone: '',
  email: '',
  address: '',
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'D' },
  { id: 'products', label: 'Products', icon: 'P' },
  { id: 'sales', label: 'Sales', icon: 'S' },
  { id: 'customers', label: 'Customers', icon: 'C' },
  { id: 'debts', label: 'Debts', icon: 'D' },
  { id: 'expenses', label: 'Expenses', icon: 'E' },
  { id: 'reports', label: 'Reports', icon: 'R' },
  { id: 'settings', label: 'Settings', icon: 'S' },
]

const mapProduct = (product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: Number(product.price),
  stock: Number(product.stock),
})

const mapSale = (sale) => ({
  id: sale.id,
  customer: sale.customer,
  product: sale.product,
  amount: Number(sale.amount),
  status: sale.status,
  createdAt: sale.created_at || null,
})

const mapCustomer = (customer) => ({
  id: customer.id,
  name: customer.name,
  phone: customer.phone,
  address: customer.address,
})

const mapDebt = (debt) => ({
  id: debt.id,
  customer: debt.customer,
  item: debt.item,
  total: Number(debt.total),
  paid: Number(debt.paid),
})

const mapExpense = (expense) => ({
  id: expense.id,
  name: expense.name,
  category: expense.category,
  amount: Number(expense.amount),
  date: expense.date,
})

const mapBusinessSettings = (settings) => ({
  businessName: settings.business_name,
  ownerName: settings.owner_name,
  phone: settings.phone || '',
  email: settings.email || '',
  address: settings.address || '',
})

function AuthPage({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  message,
  error,
  loading,
  onSignIn,
  onSignUp,
  onForgotPassword,
  onUpdatePassword,
}) {
  const isSignUp = mode === 'signup'
  const isForgotPassword = mode === 'forgot'
  const isUpdatePassword = mode === 'update-password'

  const title = isUpdatePassword
    ? 'Set a new password'
    : isForgotPassword
      ? 'Reset your password'
      : isSignUp
        ? 'Create your account'
        : 'Welcome back'

  const description = isUpdatePassword
    ? 'Choose a new password for your Business Manager account.'
    : isForgotPassword
      ? 'Enter your email and we will send you a password reset link.'
      : isSignUp
        ? 'Create a secure account to access your Business Manager.'
        : 'Sign in to continue to your Business Manager.'

  const handleSubmit = (event) => {
    if (isUpdatePassword) {
      onUpdatePassword(event)
    } else if (isForgotPassword) {
      onForgotPassword(event)
    } else if (isSignUp) {
      onSignUp(event)
    } else {
      onSignIn(event)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: '#f5f7f6',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '18px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(18, 55, 42, 0.12)',
          border: '1px solid #e2e8e5',
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '12px',
              background: '#12372a',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 800,
              marginBottom: '16px',
            }}
          >
            B
          </div>

          <h1
            style={{
              margin: 0,
              color: '#12372a',
              fontSize: '28px',
            }}
          >
            Business Manager
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#66736d',
              lineHeight: 1.6,
            }}
          >
            {title}
          </p>

          <p
            style={{
              margin: '8px 0 0',
              color: '#7a8580',
              lineHeight: 1.5,
              fontSize: '14px',
            }}
          >
            {description}
          </p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: '#eef8f1',
              color: '#21643b',
              fontSize: '14px',
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: '#fff1f1',
              color: '#b42318',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isUpdatePassword && (
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="auth-email"
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#26342e',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Email Address
              </label>

              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid #d4ded9',
                  borderRadius: '10px',
                  padding: '12px 13px',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {!isForgotPassword && !isUpdatePassword && !isSignUp && (
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="auth-password"
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#26342e',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Password
              </label>

              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                minLength="6"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid #d4ded9',
                  borderRadius: '10px',
                  padding: '12px 48px 12px 13px',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                style={{
                  position: 'relative',
                  float: 'right',
                  marginTop: '-40px',
                  marginRight: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: '#52615a',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

              <div style={{ clear: 'both' }} />
            </div>
          )}

          {(isSignUp || isUpdatePassword) && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="new-password"
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#26342e',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  {isSignUp ? 'Password' : 'New Password'}
                </label>

                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isSignUp
                      ? 'Enter your password'
                      : 'Enter your new password'
                  }
                  autoComplete="new-password"
                  required
                  minLength="6"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '1px solid #d4ded9',
                    borderRadius: '10px',
                    padding: '12px 48px 12px 13px',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  style={{
                    position: 'relative',
                    float: 'right',
                    marginTop: '-40px',
                    marginRight: '10px',
                    border: 'none',
                    background: 'transparent',
                    color: '#52615a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>

                <div style={{ clear: 'both' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="confirm-password"
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#26342e',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  {isSignUp ? 'Confirm Password' : 'Confirm New Password'}
                </label>

                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder={
                    isSignUp
                      ? 'Confirm your password'
                      : 'Confirm your new password'
                  }
                  autoComplete="new-password"
                  required
                  minLength="6"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '1px solid #d4ded9',
                    borderRadius: '10px',
                    padding: '12px 48px 12px 13px',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  style={{
                    position: 'relative',
                    float: 'right',
                    marginTop: '-40px',
                    marginRight: '10px',
                    border: 'none',
                    background: 'transparent',
                    color: '#52615a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>

                <div style={{ clear: 'both' }} />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '10px',
              padding: '13px 16px',
              background: loading ? '#6b8178' : '#12372a',
              color: '#ffffff',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? 'Please wait...'
              : isUpdatePassword
                ? 'Update Password'
                : isForgotPassword
                  ? 'Send Reset Link'
                  : isSignUp
                    ? 'Create Account'
                    : 'Sign In'}
          </button>
        </form>

        {!isUpdatePassword && (
          <div
            style={{
              marginTop: '20px',
              display: 'grid',
              gap: '10px',
              textAlign: 'center',
            }}
          >
            {!isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setMode(isSignUp ? 'login' : 'signup')
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#21643b',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : 'New here? Create an account'}
              </button>
            )}

            {!isSignUp && (
              <button
                type="button"
                onClick={() =>
                  setMode(isForgotPassword ? 'login' : 'forgot')
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#52615a',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {isForgotPassword
                  ? 'Back to sign in'
                  : 'Forgot password?'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const authRecoveryPromise = useRef(null)

  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirmPassword, setAuthConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [authError, setAuthError] = useState('')
  const [authActionLoading, setAuthActionLoading] = useState(false)
  const [passwordRecovery, setPasswordRecovery] = useState(false)

  const [businessSettings, setBusinessSettings] = useState(
    defaultBusinessSettings,
  )
  const [settingsData, setSettingsData] = useState(
    defaultBusinessSettings,
  )
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsFeedback, setSettingsFeedback] = useState({
    type: '',
    message: '',
  })

  const [products, setProducts] = useState(initialProducts)
  const [productLoading, setProductLoading] = useState(false)

  const [sales, setSales] = useState(initialSales)
  const [salesLoading, setSalesLoading] = useState(false)

  const [customers, setCustomers] = useState(initialCustomers)
  const [customerLoading, setCustomerLoading] = useState(false)
  const [debts, setDebts] = useState(initialDebts)
  const [debtLoading, setDebtLoading] = useState(false)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [expenseLoading, setExpenseLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')

  const [showProductForm, setShowProductForm] = useState(false)
  const [showSaleForm, setShowSaleForm] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showDebtForm, setShowDebtForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)

  const [paymentDebtId, setPaymentDebtId] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')

  const [editingCustomerId, setEditingCustomerId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  })

  const [saleData, setSaleData] = useState({
    customer: '',
    productId: '',
    quantity: '1',
    status: 'Paid',
  })

  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
  })

  const [debtData, setDebtData] = useState({
    customer: '',
    item: '',
    total: '',
    paid: '',
  })

  const [expenseData, setExpenseData] = useState({
    name: '',
    category: '',
    amount: '',
    date: '',
  })

  const navigateTo = (page) => {
    setActivePage(page)
    setMobileMenuOpen(false)
  }

  const recoverFromDataError = async (error, label) => {
    const message = error?.message || 'Unknown error'
    const isFutureJwtError = /jwt issued at future|token.*future/i.test(
      message,
    )

    console.error(`${label}:`, error)

    if (isFutureJwtError) {
      if (!authRecoveryPromise.current) {
        authRecoveryPromise.current = supabase.auth.refreshSession()
      }

      const { error: refreshError } =
        await authRecoveryPromise.current
      authRecoveryPromise.current = null

      if (!refreshError) {
        setAuthError(
          'Your session timestamp was out of sync. The session was refreshed; please wait while your data reloads.',
        )
        return
      }

      setAuthError(
        `Could not refresh your session: ${refreshError.message}`,
      )
      return
    }

    setAuthError(`${label}: ${message}`)
  }

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) {
        return
      }

      if (error) {
        setAuthError(error.message)
      }

      setSession(data.session)
      setAuthLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)

      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true)
        setAuthMode('update-password')
        setAuthMessage(
          'Choose a new password for your account.',
        )
      }

      setAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  /*
   * STAGE 11.2
   * Load products from Supabase for the logged-in user.
   */
  useEffect(() => {
    if (!session) {
      return
    }

    const loadProducts = async () => {
      setProductLoading(true)

      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, price, stock, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })

      if (error) {
        await recoverFromDataError(error, 'Could not load products')
        setProductLoading(false)
        return
      }

      if (data.length === 0) {
        const seedProducts = initialProducts.map((product) => ({
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
        }))

        const {
          data: insertedProducts,
          error: seedError,
        } = await supabase
          .from('products')
          .insert(seedProducts)
          .select('id, name, category, price, stock, created_at')

        if (seedError) {
          await recoverFromDataError(
            seedError,
            'Could not create starter products',
          )

          setProductLoading(false)
          return
        }

        setProducts(insertedProducts.map(mapProduct))
        setProductLoading(false)
        return
      }

      setProducts(data.map(mapProduct))
      setProductLoading(false)
    }

    loadProducts()
  }, [session])

  /*
   * STAGE 11.3
   * Load sales from Supabase for the logged-in user.
   */
  useEffect(() => {
    if (!session) {
      return
    }

    const loadSales = async () => {
      setSalesLoading(true)

      const { data, error } = await supabase
        .from('sales')
        .select('id, customer, product, amount, status, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        await recoverFromDataError(error, 'Could not load sales')
        setSalesLoading(false)
        return
      }

      if (data.length === 0) {
        const seedSales = initialSales.map((sale) => ({
          customer: sale.customer,
          product: sale.product,
          amount: sale.amount,
          status: sale.status,
        }))

        const {
          data: insertedSales,
          error: seedError,
        } = await supabase
          .from('sales')
          .insert(seedSales)
          .select('id, customer, product, amount, status, created_at')

        if (seedError) {
          await recoverFromDataError(
            seedError,
            'Could not create starter sales',
          )

          setSalesLoading(false)
          return
        }

        setSales(insertedSales.map(mapSale))
        setSalesLoading(false)
        return
      }

      setSales(data.map(mapSale))
      setSalesLoading(false)
    }

    loadSales()
  }, [session])

  /*
   * STAGE 11.4
   * Load customers from Supabase for the logged-in user.
   */
  useEffect(() => {
    if (!session) {
      return
    }

    const loadCustomers = async () => {
      setCustomerLoading(true)

      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone, address, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })

      if (error) {
        await recoverFromDataError(error, 'Could not load customers')
        setCustomerLoading(false)
        return
      }

      if (data.length === 0) {
        const seedCustomers = initialCustomers.map((customer) => ({
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        }))

        const {
          data: insertedCustomers,
          error: seedError,
        } = await supabase
          .from('customers')
          .insert(seedCustomers)
          .select('id, name, phone, address, created_at')

        if (seedError) {
          await recoverFromDataError(
            seedError,
            'Could not create starter customers',
          )

          setCustomerLoading(false)
          return
        }

        setCustomers(insertedCustomers.map(mapCustomer))
        setCustomerLoading(false)
        return
      }

      setCustomers(data.map(mapCustomer))
      setCustomerLoading(false)
    }

    loadCustomers()
  }, [session])

  /*
   * STAGE 11.5
   * Load debts from Supabase for the logged-in user.
   */
  useEffect(() => {
    if (!session) {
      return
    }

    const loadDebts = async () => {
      setDebtLoading(true)

      const { data, error } = await supabase
        .from('debts')
        .select('id, customer, item, total, paid, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        await recoverFromDataError(error, 'Could not load debts')
        setDebtLoading(false)
        return
      }

      if (data.length === 0) {
        const seedDebts = initialDebts.map((debt) => ({
          customer: debt.customer,
          item: debt.item,
          total: debt.total,
          paid: debt.paid,
        }))

        const {
          data: insertedDebts,
          error: seedError,
        } = await supabase
          .from('debts')
          .insert(seedDebts)
          .select('id, customer, item, total, paid, created_at')

        if (seedError) {
          console.error(
            'Could not create starter debts:',
            seedError,
          )

          setAuthError(
            `Could not create starter debts: ${seedError.message}`,
          )

          setDebtLoading(false)
          return
        }

        setDebts(insertedDebts.map(mapDebt))
        setDebtLoading(false)
        return
      }

      setDebts(data.map(mapDebt))
      setDebtLoading(false)
    }

    loadDebts()
  }, [session])

  /*
   * STAGE 11.6
   * Load expenses from Supabase for the logged-in user.
   */
  useEffect(() => {
    if (!session) {
      return
    }

    const loadExpenses = async () => {
      setExpenseLoading(true)

      const { data, error } = await supabase
        .from('expenses')
        .select('id, name, category, amount, date, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        await recoverFromDataError(error, 'Could not load expenses')
        setExpenseLoading(false)
        return
      }

      if (data.length === 0) {
        const seedExpenses = initialExpenses.map((expense) => ({
          name: expense.name,
          category: expense.category,
          amount: expense.amount,
          date: expense.date,
        }))

        const {
          data: insertedExpenses,
          error: seedError,
        } = await supabase
          .from('expenses')
          .insert(seedExpenses)
          .select('id, name, category, amount, date, created_at')

        if (seedError) {
          await recoverFromDataError(
            seedError,
            'Could not create starter expenses',
          )

          setExpenseLoading(false)
          return
        }

        setExpenses(insertedExpenses.map(mapExpense))
        setExpenseLoading(false)
        return
      }

      setExpenses(data.map(mapExpense))
      setExpenseLoading(false)
    }

    loadExpenses()
  }, [session])

  /*
   * STAGE 11.7
   * Load or create business settings for the logged-in user.
   */
  useEffect(() => {
    if (!session) {
      return
    }

    const loadBusinessSettings = async () => {
      setSettingsLoading(true)

      const { data, error } = await supabase
        .from('business_settings')
        .select(
          'id, business_name, owner_name, phone, email, address, created_at, updated_at',
        )
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (error) {
        await recoverFromDataError(
          error,
          'Could not load business settings',
        )
        setSettingsLoading(false)
        return
      }

      if (!data) {
        const { data: insertedSettings, error: insertError } =
          await supabase
            .from('business_settings')
            .insert({
              business_name: defaultBusinessSettings.businessName,
              owner_name: defaultBusinessSettings.ownerName,
              phone: defaultBusinessSettings.phone,
              email: defaultBusinessSettings.email,
              address: defaultBusinessSettings.address,
            })
            .select(
              'id, business_name, owner_name, phone, email, address, created_at, updated_at',
            )
            .single()

        if (insertError) {
          await recoverFromDataError(
            insertError,
            'Could not create business settings',
          )
          setSettingsLoading(false)
          return
        }

        const mappedSettings = mapBusinessSettings(
          insertedSettings,
        )
        setBusinessSettings(mappedSettings)
        setSettingsData(mappedSettings)
        setSettingsLoading(false)
        return
      }

      const mappedSettings = mapBusinessSettings(data)
      setBusinessSettings(mappedSettings)
      setSettingsData(mappedSettings)
      setSettingsLoading(false)
    }

    loadBusinessSettings()
  }, [session])

  const clearAuthFeedback = () => {
    setAuthMessage('')
    setAuthError('')
  }

  const handleSignIn = async (event) => {
    event.preventDefault()
    clearAuthFeedback()
    setAuthActionLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    })

    if (error) {
      setAuthError(error.message)
    }

    setAuthActionLoading(false)
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    clearAuthFeedback()

    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.')
      return
    }

    if (authPassword.length < 6) {
      setAuthError(
        'Password must be at least 6 characters long.',
      )
      return
    }

    setAuthActionLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      setAuthError(error.message)
    } else if (data.session) {
      setAuthMessage('Account created successfully.')
    } else {
      setAuthMessage(
        'Account created successfully. Check your email to confirm your account before signing in.',
      )

      setAuthPassword('')
      setAuthConfirmPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    }

    setAuthActionLoading(false)
  }

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    clearAuthFeedback()

    if (!authEmail.trim()) {
      setAuthError('Enter your email address first.')
      return
    }

    setAuthActionLoading(true)

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        authEmail.trim(),
        {
          redirectTo: window.location.origin,
        },
      )

    if (error) {
      setAuthError(error.message)
    } else {
      setAuthMessage(
        'Password reset link sent. Check your email and follow the link.',
      )
    }

    setAuthActionLoading(false)
  }

  const handleUpdatePassword = async (event) => {
    event.preventDefault()
    clearAuthFeedback()

    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.')
      return
    }

    if (authPassword.length < 6) {
      setAuthError(
        'Password must be at least 6 characters long.',
      )
      return
    }

    setAuthActionLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: authPassword,
    })

    if (error) {
      setAuthError(error.message)
    } else {
      setAuthMessage(
        'Password updated successfully. You can continue.',
      )

      setPasswordRecovery(false)
      setAuthMode('login')
      setAuthPassword('')
      setAuthConfirmPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    }

    setAuthActionLoading(false)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setAuthError(error.message)
    }
  }

  const handleSettingsChange = (event) => {
    const { name, value } = event.target

    setSettingsData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSaveSettings = async (event) => {
    event.preventDefault()

    if (
      !settingsData.businessName.trim() ||
      !settingsData.ownerName.trim() ||
      !session
    ) {
      setSettingsFeedback({
        type: 'error',
        message:
          'Business Name and Owner / Manager Name are required.',
      })
      return
    }

    setSettingsFeedback({
      type: '',
      message: '',
    })

    const { data, error } = await supabase
      .from('business_settings')
      .update({
        business_name: settingsData.businessName.trim(),
        owner_name: settingsData.ownerName.trim(),
        phone: settingsData.phone.trim(),
        email: settingsData.email.trim(),
        address: settingsData.address.trim(),
      })
      .eq('user_id', session.user.id)
      .select(
        'id, business_name, owner_name, phone, email, address, created_at, updated_at',
      )
      .single()

    if (error) {
      console.error('Could not save business settings:', error)
      setSettingsFeedback({
        type: 'error',
        message:
          'Could not save business settings: ' +
          error.message,
      })
      return
    }

    const savedSettings = mapBusinessSettings(data)
    setBusinessSettings(savedSettings)
    setSettingsData(savedSettings)
    setSettingsFeedback({
      type: 'success',
      message: 'Business profile saved successfully.',
    })
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
  }, [products, search])

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = customerSearch.toLowerCase()

    return customers.filter((customer) =>
      [
        customer.name,
        customer.phone,
        customer.address,
      ].some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(normalizedSearch),
      ),
    )
  }, [customers, customerSearch])

  const totalSales = sales.reduce(
    (total, sale) => total + sale.amount,
    0,
  )

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSaleChange = (event) => {
    const { name, value } = event.target

    setSaleData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleCustomerChange = (event) => {
    const { name, value } = event.target

    setCustomerData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleDebtChange = (event) => {
    const { name, value } = event.target

    setDebtData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  /*
   * STAGE 11.2
   * Add product to Supabase.
   */
  const handleAddProduct = async (event) => {
    event.preventDefault()

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      return
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
      })
      .select('id, name, category, price, stock')
      .single()

    if (error) {
      console.error('Could not save product:', error)

      alert(`Could not save product: ${error.message}`)
      return
    }

    setProducts((current) => [
      ...current,
      mapProduct(data),
    ])

    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
    })

    setShowProductForm(false)
  }

  /*
   * STAGE 11.2
   * Delete product from Supabase.
   */
  const handleDeleteProduct = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Could not delete product:', error)

      alert(`Could not delete product: ${error.message}`)
      return
    }

    setProducts((current) =>
      current.filter((product) => product.id !== id),
    )
  }

  /*
   * STAGE 11.3
   * Record sale in Supabase and update product stock.
   */
  const handleRecordSale = async (event) => {
    event.preventDefault()

    const selectedProduct = products.find(
      (product) =>
        String(product.id) === String(saleData.productId),
    )

    const quantity = Number(saleData.quantity)

    if (
      !saleData.customer ||
      !selectedProduct ||
      !quantity ||
      quantity < 1
    ) {
      return
    }

    if (quantity > selectedProduct.stock) {
      alert(
        `Only ${selectedProduct.stock} units are available.`,
      )
      return
    }

    const saleAmount = selectedProduct.price * quantity

    const saleProductName =
      quantity > 1
        ? `${selectedProduct.name} × ${quantity}`
        : selectedProduct.name

    const {
      data: insertedSale,
      error: saleError,
    } = await supabase
      .from('sales')
      .insert({
        customer: saleData.customer.trim(),
        product: saleProductName,
        amount: saleAmount,
        status: saleData.status,
      })
      .select('id, customer, product, amount, status, created_at')
      .single()

    if (saleError) {
      console.error('Could not save sale:', saleError)

      alert(`Could not save sale: ${saleError.message}`)
      return
    }

    const newStock =
      selectedProduct.stock - quantity

    const {
      data: updatedProduct,
      error: stockError,
    } = await supabase
      .from('products')
      .update({
        stock: newStock,
      })
      .eq('id', selectedProduct.id)
      .eq('user_id', session.user.id)
      .select('id, name, category, price, stock')
      .single()

    if (stockError) {
      console.error(
        'Could not update product stock:',
        stockError,
      )

      await supabase
        .from('sales')
        .delete()
        .eq('id', insertedSale.id)
        .eq('user_id', session.user.id)

      alert(
        `Could not update product stock: ${stockError.message}`,
      )
      return
    }

    setSales((current) => [
      mapSale(insertedSale),
      ...current,
    ])

    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id
          ? mapProduct(updatedProduct)
          : product,
      ),
    )

    setSaleData({
      customer: '',
      productId: '',
      quantity: '1',
      status: 'Paid',
    })

    setShowSaleForm(false)
  }

  const handleAddCustomer = async (event) => {
    event.preventDefault()

    if (
      !customerData.name ||
      !customerData.phone ||
      !customerData.address
    ) {
      return
    }

    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customerData.name.trim(),
        phone: customerData.phone.trim(),
        address: customerData.address.trim(),
      })
      .select('id, name, phone, address')
      .single()

    if (error) {
      console.error('Could not save customer:', error)
      alert(`Could not save customer: ${error.message}`)
      return
    }

    setCustomers((current) => [
      ...current,
      mapCustomer(data),
    ])

    setCustomerData({
      name: '',
      phone: '',
      address: '',
    })

    setShowCustomerForm(false)
  }

  const handleDeleteCustomer = async (id) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Could not delete customer:', error)
      alert(`Could not delete customer: ${error.message}`)
      return
    }

    setCustomers((current) =>
      current.filter((customer) => customer.id !== id),
    )
  }

  const handleEditCustomer = (customerId) => {
    const customer = customers.find(
      (current) => current.id === customerId,
    )

    if (!customer) {
      return
    }

    setEditingCustomerId(customerId)

    setCustomerData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    })

    setShowCustomerForm(true)
  }

  const handleUpdateCustomer = async (event) => {
    event.preventDefault()

    if (
      !customerData.name ||
      !customerData.phone ||
      !customerData.address
    ) {
      return
    }

    const { data, error } = await supabase
      .from('customers')
      .update({
        name: customerData.name.trim(),
        phone: customerData.phone.trim(),
        address: customerData.address.trim(),
      })
      .eq('id', editingCustomerId)
      .eq('user_id', session.user.id)
      .select('id, name, phone, address')
      .single()

    if (error) {
      console.error('Could not update customer:', error)
      alert(`Could not update customer: ${error.message}`)
      return
    }

    setCustomers((current) =>
      current.map((customer) =>
        customer.id === editingCustomerId
          ? mapCustomer(data)
          : customer,
      ),
    )

    setCustomerData({
      name: '',
      phone: '',
      address: '',
    })

    setEditingCustomerId(null)
    setShowCustomerForm(false)
  }

  const handleAddDebt = async (event) => {
    event.preventDefault()

    if (
      !debtData.customer ||
      !debtData.item ||
      !debtData.total
    ) {
      return
    }

    const total = Number(debtData.total)
    const paid = Number(debtData.paid) || 0

    if (paid > total) {
      alert(
        'Amount paid cannot be greater than the total amount.',
      )
      return
    }

    const { data, error } = await supabase
      .from('debts')
      .insert({
        customer: debtData.customer.trim(),
        item: debtData.item.trim(),
        total,
        paid,
      })
      .select('id, customer, item, total, paid')
      .single()

    if (error) {
      console.error('Could not save debt:', error)
      alert(`Could not save debt: ${error.message}`)
      return
    }

    setDebts((current) => [
      mapDebt(data),
      ...current,
    ])

    setDebtData({
      customer: '',
      item: '',
      total: '',
      paid: '',
    })

    setShowDebtForm(false)
  }

  const handleRecordPayment = async (event) => {
    event.preventDefault()

    const amount = Number(paymentAmount)

    if (paymentDebtId === null || !amount || amount <= 0) {
      return
    }

    const selectedDebt = debts.find(
      (debt) => debt.id === paymentDebtId,
    )

    if (!selectedDebt) {
      return
    }

    const remaining =
      selectedDebt.total - selectedDebt.paid

    if (amount > remaining) {
      alert(
        `Payment cannot be greater than the remaining debt of ₦${remaining.toLocaleString()}.`,
      )
      return
    }

    const newPaid = selectedDebt.paid + amount

    const { data, error } = await supabase
      .from('debts')
      .update({ paid: newPaid })
      .eq('id', selectedDebt.id)
      .eq('user_id', session.user.id)
      .select('id, customer, item, total, paid')
      .single()

    if (error) {
      console.error('Could not record debt payment:', error)
      alert(`Could not record debt payment: ${error.message}`)
      return
    }

    setDebts((current) =>
      current.map((debt) =>
        debt.id === selectedDebt.id
          ? mapDebt(data)
          : debt,
      ),
    )

    setPaymentAmount('')
    setPaymentDebtId(null)
  }

  const handleExpenseChange = (event) => {
    const { name, value } = event.target

    setExpenseData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleAddExpense = async (event) => {
    event.preventDefault()

    if (
      !expenseData.name ||
      !expenseData.category ||
      !expenseData.amount ||
      !expenseData.date
    ) {
      return
    }

    const amount = Number(expenseData.amount)

    if (amount <= 0) {
      return
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        name: expenseData.name.trim(),
        category: expenseData.category,
        amount,
        date: expenseData.date,
      })
      .select('id, name, category, amount, date')
      .single()

    if (error) {
      console.error('Could not save expense:', error)
      alert(`Could not save expense: ${error.message}`)
      return
    }

    setExpenses((current) => [
      mapExpense(data),
      ...current,
    ])

    setExpenseData({
      name: '',
      category: '',
      amount: '',
      date: '',
    })

    setShowExpenseForm(false)
  }

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#f5f7f6',
          color: '#12372a',
          fontWeight: 700,
        }}
      >
        Checking your session...
      </div>
    )
  }

  if (!session) {
    return (
      <AuthPage
        mode={
          passwordRecovery
            ? 'update-password'
            : authMode
        }
        setMode={setAuthMode}
        email={authEmail}
        setEmail={setAuthEmail}
        password={authPassword}
        setPassword={setAuthPassword}
        confirmPassword={authConfirmPassword}
        setConfirmPassword={setAuthConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        message={authMessage}
        error={authError}
        loading={authActionLoading}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onForgotPassword={handleForgotPassword}
        onUpdatePassword={handleUpdatePassword}
      />
    )
  }

  return (
    <div className="app">
      <div
        className={`mobile-drawer-backdrop ${
          mobileMenuOpen ? 'is-open' : ''
        }`}
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <span className="brand-icon">B</span>
            <span>
              <strong>{businessSettings.businessName}</strong>
              <small>Business Manager</small>
            </span>
          </div>
          <button
            className="mobile-close-button"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activePage === item.id ? 'active' : ''}
              onClick={() => navigateTo(item.id)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          className="mobile-logout-button"
          type="button"
          onClick={handleSignOut}
        >
          <span className="mobile-nav-icon">↪</span>
          <span>Logout</span>
        </button>
      </aside>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">B</div>

          <div>
            <h1>{businessSettings.businessName}</h1>
            <span>Business Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activePage === 'dashboard'
                ? 'active'
                : ''
            }
            aria-label="Dashboard"
            title="Dashboard"
            onClick={() =>
              setActivePage('dashboard')
            }
          >
            📊 Dashboard
          </button>

          <button
            className={
              activePage === 'products'
                ? 'active'
                : ''
            }
            aria-label="Products"
            title="Products"
            onClick={() =>
              setActivePage('products')
            }
          >
            📦 Products
          </button>

          <button
            className={
              activePage === 'sales'
                ? 'active'
                : ''
            }
            aria-label="Sales"
            title="Sales"
            onClick={() =>
              setActivePage('sales')
            }
          >
            💰 Sales
          </button>

          <button
            className={
              activePage === 'customers'
                ? 'active'
                : ''
            }
            aria-label="Customers"
            title="Customers"
            onClick={() =>
              setActivePage('customers')
            }
          >
            👥 Customers
          </button>

          <button
            className={
              activePage === 'debts'
                ? 'active'
                : ''
            }
            aria-label="Debts"
            title="Debts"
            onClick={() =>
              setActivePage('debts')
            }
          >
            💳 Debts
          </button>

          <button
            className={
              activePage === 'expenses'
                ? 'active'
                : ''
            }
            aria-label="Expenses"
            title="Expenses"
            onClick={() =>
              setActivePage('expenses')
            }
          >
            💸 Expenses
          </button>

          <button
            className={
              activePage === 'reports'
                ? 'active'
                : ''
            }
            aria-label="Reports"
            title="Reports"
            onClick={() =>
              setActivePage('reports')
            }
          >
            📈 Reports
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className={
              activePage === 'settings'
                ? 'active'
                : ''
            }
            aria-label="Settings"
            title="Settings"
            onClick={() =>
              setActivePage('settings')
            }
          >
            ⚙️ Settings
          </button>

          <button
            aria-label="Log out"
            title="Log out"
            onClick={handleSignOut}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <button
            className="mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="mobile-header-brand">
            <span className="mobile-header-logo">B</span>
            <span className="mobile-header-copy">
              <strong>{businessSettings.businessName}</strong>
              <small>
                {businessSettings.ownerName || 'Business Owner'}
              </small>
            </span>
          </div>

          <button
            className="mobile-profile-button"
            type="button"
            aria-label={`Open profile for ${businessSettings.ownerName}`}
            onClick={() => navigateTo('settings')}
          >
            {(businessSettings.ownerName || 'Business Owner')
              .charAt(0)
              .toUpperCase()}
          </button>
        </header>

        {authError && (
          <div className="app-error-banner" role="alert">
            <span>{authError}</span>

            <button
              type="button"
              onClick={() => setAuthError('')}
            >
              Dismiss
            </button>
          </div>
        )}

        {activePage === 'dashboard' && (
          <DashboardStage12
            products={products}
            sales={sales}
            customers={customers}
            debts={debts}
            totalSales={totalSales}
            totalExpenses={totalExpenses}
            businessSettings={businessSettings}
          />
        )}

        {activePage === 'products' && (
          <ProductsPage
            products={filteredProducts}
            search={search}
            setSearch={setSearch}
            showForm={showProductForm}
            setShowForm={setShowProductForm}
            formData={formData}
            handleChange={handleChange}
            handleAddProduct={handleAddProduct}
            handleDeleteProduct={handleDeleteProduct}
            loading={productLoading}
          />
        )}

        {activePage === 'sales' && (
          <SalesPage
            products={products}
            sales={sales}
            showForm={showSaleForm}
            setShowForm={setShowSaleForm}
            saleData={saleData}
            handleSaleChange={handleSaleChange}
            handleRecordSale={handleRecordSale}
            loading={salesLoading}
          />
        )}

        {activePage === 'customers' && (
          <CustomersPage
            customers={filteredCustomers}
            allCustomers={customers}
            customerSearch={customerSearch}
            setCustomerSearch={setCustomerSearch}
            showForm={showCustomerForm}
            setShowForm={setShowCustomerForm}
            setEditingCustomerId={setEditingCustomerId}
            customerData={customerData}
            setCustomerData={setCustomerData}
            handleCustomerChange={handleCustomerChange}
            editingCustomerId={editingCustomerId}
            handleEditCustomer={handleEditCustomer}
            handleUpdateCustomer={handleUpdateCustomer}
            handleAddCustomer={handleAddCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
            loading={customerLoading}
          />
        )}

        {activePage === 'expenses' && (
          <ExpensesPage
            expenses={expenses}
            totalExpenses={totalExpenses}
            showForm={showExpenseForm}
            setShowForm={setShowExpenseForm}
            expenseData={expenseData}
            handleExpenseChange={handleExpenseChange}
            handleAddExpense={handleAddExpense}
            loading={expenseLoading}
          />
        )}

        {activePage === 'debts' && (
          <DebtsPage
            debts={debts}
            showForm={showDebtForm}
            setShowForm={setShowDebtForm}
            debtData={debtData}
            handleDebtChange={handleDebtChange}
            handleAddDebt={handleAddDebt}
            paymentDebtId={paymentDebtId}
            setPaymentDebtId={setPaymentDebtId}
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            handleRecordPayment={handleRecordPayment}
            loading={debtLoading}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            businessSettings={businessSettings}
            settingsData={settingsData}
            handleSettingsChange={handleSettingsChange}
            handleSaveSettings={handleSaveSettings}
            feedback={settingsFeedback}
            loading={settingsLoading}
          />
        )}

        {activePage === 'reports' && (
          <ReportsPage
            products={products}
            sales={sales}
            customers={customers}
            debts={debts}
            expenses={expenses}
            totalSales={totalSales}
            totalExpenses={totalExpenses}
            loading={
              productLoading ||
              salesLoading ||
              customerLoading ||
              debtLoading ||
              expenseLoading
            }
          />
        )}
      </main>
    </div>
  )
}

/*
function Dashboard({
  products,
  sales,
  customers,
  debts,
  totalSales,
  totalExpenses,
  businessSettings,
}) {
  const totalStock = products.reduce(
    (total, product) =>
      total + product.stock,
    0,
  )

  const outstandingDebt = debts.reduce(
    (total, debt) => total + (debt.total - debt.paid),
    0,
  )

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  )

  const netProfit = totalSales - totalExpenses
  const lowStockProducts = products.filter(
    (product) => product.stock <= 7,
  )
  const ownerName = businessSettings.ownerName || 'Business Owner'

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <h2>Dashboard</h2>
          <p>
            Welcome back! Here's what's happening with your business.
          </p>
        </div>

        <button className="profile-button">
          <span className="avatar">
            {businessSettings.ownerName
              .charAt(0)
              .toUpperCase()}
          </span>

          <span>
            {businessSettings.ownerName}
          </span>
        </button>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <div className="card-icon sales-icon">
            💰
          </div>

          <div>
            <span>Total Sales</span>

            <h3>
              ₦{totalSales.toLocaleString()}
            </h3>

            <small>
              {sales.length} transactions
            </small>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon expense-icon">
            💸
          </div>

          <div>
            <span>Total Expenses</span>

            <h3>
              ₦{totalExpenses.toLocaleString()}
            </h3>

            <small>
              {totalExpenses > 0
                ? 'Recorded expenses'
                : 'No expenses recorded yet'}
            </small>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon profit-icon">
            📈
          </div>

          <div>
            <span>Net Profit</span>

            <h3>
              ₦
              {(totalSales - totalExpenses).toLocaleString()}
            </h3>

            <small>
              Sales minus expenses
            </small>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon stock-icon">
            📦
          </div>

          <div>
            <span>Products in Stock</span>

            <h3>{totalStock}</h3>

            <small>
              {products.length} products
            </small>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card recent-sales">
          <div className="section-heading">
            <div>
              <h3>Recent Sales</h3>

              <p>
                Your latest business transactions
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {sales.slice(0, 6).map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.customer}</td>

                    <td>{sale.product}</td>

                    <td>
                      ₦{sale.amount.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={
                          sale.status === 'Paid'
                            ? 'status paid'
                            : 'status pending'
                        }
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card low-stock">
          <div className="section-heading">
            <div>
              <h3>Low Stock</h3>

              <p>
                Products that need attention
              </p>
            </div>
          </div>

          {products
            .filter(
              (product) =>
                product.stock <= 7,
            )
            .map((product) => (
              <div
                className="stock-item"
                key={product.id}
              >
                <div>
                  <strong>
                    {product.name}
                  </strong>

                  <span>
                    Only {product.stock} left
                  </span>
                </div>

                <span
                  className={
                    product.stock <= 3
                      ? 'stock-danger'
                      : 'stock-warning'
                  }
                >
                  {product.stock <= 3
                    ? 'Critical'
                    : 'Low'}
                </span>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

*/
function DashboardStage12({
  products,
  sales,
  customers,
  debts,
  totalSales,
  totalExpenses,
  businessSettings,
}) {
  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0,
  )
  const outstandingDebt = debts.reduce(
    (total, debt) => total + (debt.total - debt.paid),
    0,
  )
  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  )
  const netProfit = totalSales - totalExpenses
  const lowStockProducts = products.filter(
    (product) => product.stock <= 7,
  )
  const ownerName = businessSettings.ownerName || 'Business Owner'

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening with your business.</p>
        </div>
        <button className="profile-button">
          <span className="avatar">
            {ownerName.charAt(0).toUpperCase()}
          </span>
          <span>{ownerName}</span>
        </button>
      </header>

      <section className="dashboard-summary-grid">
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-icon sales">S</div>
          <div>
            <span className="dashboard-metric-label">Total Sales</span>
            <strong className="dashboard-metric-value">
              ₦{totalSales.toLocaleString()}
            </strong>
            <small>{sales.length} transactions</small>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-icon expenses">E</div>
          <div>
            <span className="dashboard-metric-label">Total Expenses</span>
            <strong className="dashboard-metric-value">
              ₦{totalExpenses.toLocaleString()}
            </strong>
            <small>
              {totalExpenses > 0
                ? 'Recorded expenses'
                : 'No expenses recorded'}
            </small>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-icon profit">P</div>
          <div>
            <span className="dashboard-metric-label">Net Profit</span>
            <strong
              className={
                netProfit < 0
                  ? 'dashboard-metric-value negative'
                  : 'dashboard-metric-value'
              }
            >
              ₦{netProfit.toLocaleString()}
            </strong>
            <small>Sales minus expenses</small>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-icon debt">D</div>
          <div>
            <span className="dashboard-metric-label">Outstanding Debt</span>
            <strong className="dashboard-metric-value">
              ₦{outstandingDebt.toLocaleString()}
            </strong>
            <small>{debts.length} debt records</small>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-icon customers">C</div>
          <div>
            <span className="dashboard-metric-label">Total Customers</span>
            <strong className="dashboard-metric-value">
              {customers.length}
            </strong>
            <small>Registered customers</small>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-icon inventory">I</div>
          <div>
            <span className="dashboard-metric-label">Products in Stock</span>
            <strong className="dashboard-metric-value">{totalStock}</strong>
            <small>{products.length} products</small>
          </div>
        </div>
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-eyebrow">Activity</span>
              <h3>Recent Sales</h3>
              <p>Your latest business transactions</p>
            </div>
            <span className="dashboard-panel-count">
              {sales.length} total
            </span>
          </div>
          {sales.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-mark">S</div>
              <strong>No sales recorded yet</strong>
              <p>Record a sale to start tracking business activity.</p>
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 6).map((sale) => (
                    <tr key={sale.id}>
                      <td><strong>{sale.customer}</strong></td>
                      <td>{sale.product}</td>
                      <td className="dashboard-table-amount">
                        ₦{sale.amount.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={
                            sale.status === 'Paid'
                              ? 'status paid'
                              : 'status pending'
                          }
                        >
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-eyebrow">Inventory</span>
              <h3>Low-stock products</h3>
              <p>Products that need attention</p>
            </div>
            <span className="dashboard-panel-count warning">
              {lowStockProducts.length} flagged
            </span>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="dashboard-empty-state compact">
              <div className="dashboard-empty-mark healthy">✓</div>
              <strong>Inventory looks healthy</strong>
              <p>No products are at or below the low-stock threshold.</p>
            </div>
          ) : (
            <div className="dashboard-stock-list">
              {lowStockProducts.map((product) => (
                <div className="dashboard-stock-item" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                  </div>
                  <div className="dashboard-stock-quantity">
                    <strong>{product.stock}</strong>
                    <span>units left</span>
                  </div>
                  <span
                    className={
                      product.stock <= 3
                        ? 'dashboard-stock-badge critical'
                        : 'dashboard-stock-badge'
                    }
                  >
                    {product.stock <= 3 ? 'Critical' : 'Low'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-panel dashboard-business-summary">
        <div className="dashboard-panel-header">
          <div>
            <span className="dashboard-eyebrow">Business health</span>
            <h3>Business summary</h3>
            <p>A quick view of your current operations</p>
          </div>
        </div>
        <div className="dashboard-summary-list">
          <div className="dashboard-summary-item">
            <span>Total customers</span>
            <strong>{customers.length}</strong>
            <small>Registered customers</small>
          </div>
          <div className="dashboard-summary-item">
            <span>Total products</span>
            <strong>{products.length}</strong>
            <small>Products in catalogue</small>
          </div>
          <div className="dashboard-summary-item">
            <span>Units in stock</span>
            <strong>{totalStock}</strong>
            <small>Available inventory</small>
          </div>
          <div className="dashboard-summary-item">
            <span>Inventory value</span>
            <strong>₦{inventoryValue.toLocaleString()}</strong>
            <small>Price × current stock</small>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductsPage({
  products,
  search,
  setSearch,
  showForm,
  setShowForm,
  formData,
  handleChange,
  handleAddProduct,
  handleDeleteProduct,
  loading,
}) {
  return (
    <>
      <header className="topbar">
        <div>
          <h2>Products</h2>

          <p>
            Manage your products, prices and stock.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() => {
            setShowForm((current) => !current)
          }}
        >
          {showForm
            ? 'Close Form'
            : '+ Add Product'}
        </button>
      </header>

      {showForm && (
        <form
          className="product-form"
          onSubmit={handleAddProduct}
        >
          <div>
            <label htmlFor="product-name">Product Name</label>

            <input
              id="product-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rice 50kg"
              required
            />
          </div>

          <div>
            <label htmlFor="product-category">Category</label>

            <input
              id="product-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Food"
              required
            />
          </div>

          <div>
            <label htmlFor="product-price">Price (₦)</label>

            <input
              id="product-price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="45000"
              required
            />
          </div>

          <div>
            <label htmlFor="product-stock">Stock Quantity</label>

            <input
              id="product-stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="20"
              required
            />
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Save Product
          </button>
        </form>
      )}

      <section className="products-card">
        <div className="products-toolbar">
          <div>
            <h3>All Products</h3>

            <p>
              {loading
                ? 'Loading products...'
                : `${products.length} products found`}
            </p>
          </div>

          <input
            aria-label="Search products"
            className="search-input"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
          />
        </div>

        <div className="product-list">
          {loading ? (
            <div className="empty-state">
              Loading products from database...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              No products found.
            </div>
          ) : (
            products.map((product) => (
              <div
                className="product-row"
                key={product.id}
              >
                <div className="product-info">
                  <div className="product-icon">
                    📦
                  </div>

                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="product-price">
                  ₦{product.price.toLocaleString()}
                </div>

                <div
                  className={
                    product.stock <= 3
                      ? 'product-stock critical'
                      : product.stock <= 7
                        ? 'product-stock low'
                        : 'product-stock'
                  }
                >
                  {product.stock} in stock
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDeleteProduct(
                      product.id,
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}

/*
function SalesPage({
  products,
  sales,
  showForm,
  setShowForm,
  saleData,
  handleSaleChange,
  handleRecordSale,
  loading,
}) {
  return (
    <>
      <header className="topbar">
        <div>
          <h2>Sales</h2>

          <p>
            Record customer purchases and track your sales.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm
            ? 'Close Form'
            : '+ Record Sale'}
        </button>
      </header>

      {showForm && (
        <form
          className="sale-form"
          onSubmit={handleRecordSale}
        >
          <div>
            <label>Customer Name</label>

            <input
              name="customer"
              value={saleData.customer}
              onChange={handleSaleChange}
              placeholder="e.g. John Ibrahim"
            />
          </div>

          <div>
            <label>Product</label>

            <select
              name="productId"
              value={saleData.productId}
              onChange={handleSaleChange}
            >
              <option value="">
                Select a product
              </option>

              {products
                .filter(
                  (product) =>
                    product.stock > 0,
                )
                .map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} —{' '}
                    {product.stock} available
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Quantity</label>

            <input
              name="quantity"
              type="number"
              min="1"
              value={saleData.quantity}
              onChange={handleSaleChange}
            />
          </div>

          <div>
            <label>Payment Status</label>

            <select
              name="status"
              value={saleData.status}
              onChange={handleSaleChange}
            >
              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Record Sale
          </button>
        </form>
      )}

      <section className="products-card">
        <div className="products-toolbar">
          <div>
            <h3>Sales History</h3>

            <p>
              {loading
                ? 'Loading sales from database...'
                : `${sales.length} transactions recorded`}
            </p>
          </div>
        </div>

        <div className="sales-history">
          {loading ? (
            <div className="empty-state">
              Loading sales from database...
            </div>
          ) : sales.length === 0 ? (
            <div className="empty-state">
              No sales recorded yet.
            </div>
          ) : (
            sales.map((sale) => (
              <div
                className="sale-row"
                key={sale.id}
              >
                <div>
                  <strong>
                    {sale.customer}
                  </strong>

                  <span>
                    {sale.product}
                  </span>
                </div>

                <strong>
                  ₦{sale.amount.toLocaleString()}
                </strong>

                <span
                  className={
                    sale.status === 'Paid'
                      ? 'status paid'
                      : 'status pending'
                  }
                >
                  {sale.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}

*/

function SalesPage({
  products,
  sales,
  showForm,
  setShowForm,
  saleData,
  handleSaleChange,
  handleRecordSale,
  loading,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')

  const formatCurrency = (value) =>
    '₦' + Number(value).toLocaleString()

  const formatSaleDate = (createdAt) => {
    if (!createdAt) {
      return 'Date unavailable'
    }

    const date = new Date(createdAt)

    if (Number.isNaN(date.getTime())) {
      return 'Date unavailable'
    }

    return date.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const getSaleDateKey = (createdAt) => {
    if (!createdAt) {
      return ''
    }

    const date = new Date(createdAt)

    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-')
  }

  const paidSales = sales.filter(
    (sale) => sale.status === 'Paid',
  )

  const pendingSales = sales.filter(
    (sale) => sale.status === 'Pending',
  )

  const totalSalesAmount = sales.reduce(
    (total, sale) => total + Number(sale.amount || 0),
    0,
  )

  const paidSalesAmount = paidSales.reduce(
    (total, sale) => total + Number(sale.amount || 0),
    0,
  )

  const pendingSalesAmount = pendingSales.reduce(
    (total, sale) => total + Number(sale.amount || 0),
    0,
  )

  const filteredSales = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase()

    return sales.filter((sale) => {
      const customer = String(sale.customer || '')
        .toLowerCase()
      const product = String(sale.product || '')
        .toLowerCase()
      const matchesSearch =
        !normalizedSearch ||
        customer.includes(normalizedSearch) ||
        product.includes(normalizedSearch)
      const matchesStatus =
        statusFilter === 'All' ||
        sale.status === statusFilter
      const matchesDate =
        !dateFilter ||
        getSaleDateKey(sale.createdAt) === dateFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      )
    })
  }, [
    dateFilter,
    sales,
    searchTerm,
    statusFilter,
  ])

  const hasFilters =
    Boolean(searchTerm) ||
    statusFilter !== 'All' ||
    Boolean(dateFilter)

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
    setDateFilter('')
  }

  return (
    <div className="sales-page">
      <header className="topbar">
        <div>
          <h2>Sales</h2>

          <p>
            Record customer purchases and track your sales.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm ? 'Close Form' : '+ Record Sale'}
        </button>
      </header>

      <section className="sales-summary-grid">
        <article className="sales-summary-card">
          <div className="sales-summary-icon sales-icon-green">
            $
          </div>

          <div>
            <span>Total Sales Amount</span>
            <strong>{formatCurrency(totalSalesAmount)}</strong>
          </div>
        </article>

        <article className="sales-summary-card">
          <div className="sales-summary-icon sales-icon-orange">
            #
          </div>

          <div>
            <span>Total Transactions</span>
            <strong>{sales.length}</strong>
          </div>
        </article>

        <article className="sales-summary-card">
          <div className="sales-summary-icon sales-icon-teal">
            ✓
          </div>

          <div>
            <span>Paid Sales</span>
            <strong>{paidSales.length}</strong>
            <small>{formatCurrency(paidSalesAmount)}</small>
          </div>
        </article>

        <article className="sales-summary-card">
          <div className="sales-summary-icon sales-icon-amber">
            !
          </div>

          <div>
            <span>Pending Sales</span>
            <strong>{pendingSales.length}</strong>
            <small>{formatCurrency(pendingSalesAmount)}</small>
          </div>
        </article>
      </section>

      {showForm && (
        <form
          className="sale-form sales-record-form"
          onSubmit={handleRecordSale}
        >
          <div>
            <label htmlFor="sale-customer">Customer Name</label>

            <input
              id="sale-customer"
              name="customer"
              value={saleData.customer}
              onChange={handleSaleChange}
              placeholder="e.g. John Ibrahim"
              required
            />
          </div>

          <div>
            <label htmlFor="sale-product">Product</label>

            <select
              id="sale-product"
              name="productId"
              value={saleData.productId}
              onChange={handleSaleChange}
              required
            >
              <option value="">Select a product</option>

              {products
                .filter(
                  (product) => product.stock > 0,
                )
                .map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} — {product.stock} available
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="sale-quantity">Quantity</label>

            <input
              id="sale-quantity"
              name="quantity"
              type="number"
              min="1"
              value={saleData.quantity}
              onChange={handleSaleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="sale-status">Payment Status</label>

            <select
              id="sale-status"
              name="status"
              value={saleData.status}
              onChange={handleSaleChange}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Record Sale
          </button>
        </form>
      )}

      <section className="products-card sales-history-card">
        <div className="sales-toolbar">
          <div>
            <h3>Sales History</h3>

            <p>
              {loading
                ? 'Loading sales from database...'
                : filteredSales.length +
                  ' of ' +
                  sales.length +
                  ' transactions shown'}
            </p>
          </div>

          <div className="sales-filter-controls">
            <label className="sales-search">
              <span>Search sales</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Customer or product"
              />
            </label>

            <label className="sales-filter">
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </label>

            <label className="sales-filter">
              <span>Date</span>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
              />
            </label>

            {hasFilters && (
              <button
                type="button"
                className="sales-clear-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="sales-empty-state">
            <div className="sales-loading-mark">...</div>
            <strong>Loading sales</strong>
            <span>Fetching your latest transactions.</span>
          </div>
        ) : sales.length === 0 ? (
          <div className="sales-empty-state">
            <strong>No sales recorded yet</strong>
            <span>
              Record your first sale to start tracking business activity.
            </span>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="sales-empty-state">
            <strong>No matching transactions</strong>
            <span>Try changing your search or filters.</span>
          </div>
        ) : (
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Date / Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td data-label="Customer">
                      <strong>{sale.customer}</strong>
                    </td>

                    <td data-label="Product">
                      <span className="sales-product-name">
                        {sale.product}
                      </span>
                    </td>

                    <td data-label="Amount">
                      <strong>{formatCurrency(sale.amount)}</strong>
                    </td>

                    <td data-label="Payment Status">
                      <span
                        className={
                          sale.status === 'Paid'
                            ? 'sales-status-badge sales-status-paid'
                            : 'sales-status-badge sales-status-pending'
                        }
                      >
                        <span className="sales-status-dot" />
                        {sale.status}
                      </span>
                    </td>

                    <td data-label="Date / Time">
                      <span className="sales-date">
                        {formatSaleDate(sale.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

/*
function CustomersPage({
  customers,
  customerSearch,
  setCustomerSearch,
  showForm,
  setShowForm,
  customerData,
  setCustomerData,
  handleCustomerChange,
  editingCustomerId,
  handleEditCustomer,
  handleUpdateCustomer,
  handleAddCustomer,
  handleDeleteCustomer,
  loading,
}) {
  const handleFormSubmit =
    editingCustomerId
      ? handleUpdateCustomer
      : handleAddCustomer

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Customers</h2>

          <p>
            Manage your customers and their contact information.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() => {
            if (showForm && editingCustomerId) {
              setEditingCustomerId(null)
              setCustomerData({
                name: '',
                phone: '',
                address: '',
              })
            }

            setShowForm((current) => !current)
          }}
        >
          {editingCustomerId
            ? 'Edit Customer'
            : '+ Add Customer'}
        </button>
      </header>

      {showForm && (
        <form
          className="customer-form"
          onSubmit={handleFormSubmit}
        >
          <div>
            <label>Customer Name</label>

            <input
              name="name"
              value={customerData.name}
              onChange={handleCustomerChange}
              placeholder="e.g. John Ibrahim"
            />
          </div>

          <div>
            <label>Phone Number</label>

            <input
              name="phone"
              value={customerData.phone}
              onChange={handleCustomerChange}
              placeholder="08012345678"
            />
          </div>

          <div>
            <label>Address</label>

            <input
              name="address"
              value={customerData.address}
              onChange={handleCustomerChange}
              placeholder="e.g. Kano"
            />
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            {editingCustomerId
              ? 'Update Customer'
              : 'Save Customer'}
          </button>
        </form>
      )}

      <section className="products-card">
        <div className="products-toolbar">
          <div>
            <h3>All Customers</h3>

            <p>
              {loading
                ? 'Loading customers...'
                : `${customers.length} customers found`}
            </p>
          </div>

          <input
            className="search-input"
            value={customerSearch}
            onChange={(event) =>
              setCustomerSearch(
                event.target.value,
              )
            }
            placeholder="Search customers..."
          />
        </div>

        <div className="customer-list">
          {loading ? (
            <div className="empty-state">
              Loading customers from database...
            </div>
          ) : customers.length === 0 ? (
            <div className="empty-state">
              No customers found.
            </div>
          ) : (
            customers.map((customer) => (
              <div
                className="customer-row"
                key={customer.id}
              >
                <div className="customer-avatar">
                  {customer.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="customer-info">
                  <strong>
                    {customer.name}
                  </strong>

                  <span>
                    {customer.phone}
                  </span>
                </div>

                <div className="customer-address">
                  {customer.address}
                </div>

                <button
                  type="button"
                  className="edit-button"
                  onClick={() =>
                    handleEditCustomer(
                      customer.id,
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDeleteCustomer(
                      customer.id,
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}

*/

function CustomersPage({
  customers,
  allCustomers,
  customerSearch,
  setCustomerSearch,
  showForm,
  setShowForm,
  setEditingCustomerId,
  customerData,
  handleCustomerChange,
  editingCustomerId,
  handleEditCustomer,
  handleUpdateCustomer,
  handleAddCustomer,
  handleDeleteCustomer,
  loading,
}) {
  const handleFormSubmit = editingCustomerId
    ? handleUpdateCustomer
    : handleAddCustomer

  const customersWithPhone = allCustomers.filter(
    (customer) =>
      String(customer.phone || '').trim().length > 0,
  ).length

  const customersWithAddress = allCustomers.filter(
    (customer) =>
      String(customer.address || '').trim().length > 0,
  ).length

  const handleCloseForm = () => {
    setEditingCustomerId(null)
    setCustomerData({
      name: '',
      phone: '',
      address: '',
    })
    setShowForm(false)
  }

  const handleToggleForm = () => {
    if (showForm) {
      handleCloseForm()
      return
    }

    setShowForm(true)
  }

  return (
    <div className="customers-page">
      <header className="topbar">
        <div>
          <h2>Customers</h2>

          <p>
            Manage customer relationships and contact information.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={handleToggleForm}
        >
          {editingCustomerId
            ? 'Close Edit'
            : '+ Add Customer'}
        </button>
      </header>

      <section className="customers-summary-grid">
        <article className="customers-summary-card">
          <div className="customers-summary-icon customers-icon-green">
            #
          </div>

          <div>
            <span>Total Customers</span>
            <strong>{allCustomers.length}</strong>
            <small>Customer records</small>
          </div>
        </article>

        <article className="customers-summary-card">
          <div className="customers-summary-icon customers-icon-orange">
            ☎
          </div>

          <div>
            <span>With Phone Numbers</span>
            <strong>{customersWithPhone}</strong>
            <small>Contactable customers</small>
          </div>
        </article>

        <article className="customers-summary-card">
          <div className="customers-summary-icon customers-icon-teal">
            ⌂
          </div>

          <div>
            <span>With Addresses</span>
            <strong>{customersWithAddress}</strong>
            <small>Customers with locations</small>
          </div>
        </article>
      </section>

      {showForm && (
        <form
          className="customer-form customers-record-form"
          onSubmit={handleFormSubmit}
        >
          <div>
            <label htmlFor="customer-name">Customer Name</label>

            <input
              id="customer-name"
              name="name"
              value={customerData.name}
              onChange={handleCustomerChange}
              placeholder="e.g. John Ibrahim"
              required
            />
          </div>

          <div>
            <label htmlFor="customer-phone">Phone Number</label>

            <input
              id="customer-phone"
              name="phone"
              value={customerData.phone}
              onChange={handleCustomerChange}
              placeholder="08012345678"
              required
            />
          </div>

          <div>
            <label htmlFor="customer-address">Address</label>

            <input
              id="customer-address"
              name="address"
              value={customerData.address}
              onChange={handleCustomerChange}
              placeholder="e.g. Kano"
              required
            />
          </div>

          <div className="customers-form-actions">
            <button
              type="submit"
              className="save-product-button"
            >
              {editingCustomerId
                ? 'Update Customer'
                : 'Save Customer'}
            </button>

            {editingCustomerId && (
              <button
                type="button"
                className="customers-cancel-button"
                onClick={handleCloseForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <section className="products-card customers-list-card">
        <div className="customers-toolbar">
          <div>
            <h3>Customer Directory</h3>

            <p>
              {loading
                ? 'Loading customers from database...'
                : customerSearch
                  ? customers.length +
                    ' matching customers'
                  : allCustomers.length +
                    ' customers in your directory'}
            </p>
          </div>

          <label className="customers-search">
            <span>Search customers</span>

            <input
              type="search"
              value={customerSearch}
              onChange={(event) =>
                setCustomerSearch(event.target.value)
              }
              placeholder="Name, phone, or address"
            />
          </label>
        </div>

        {loading ? (
          <div className="customers-empty-state">
            <div className="customers-loading-mark">...</div>
            <strong>Loading customers</strong>
            <span>Fetching your customer directory.</span>
          </div>
        ) : allCustomers.length === 0 ? (
          <div className="customers-empty-state">
            <strong>No customers yet</strong>
            <span>
              Add your first customer to start building your directory.
            </span>
          </div>
        ) : customers.length === 0 ? (
          <div className="customers-empty-state">
            <strong>No matching customers</strong>
            <span>
              Try searching by a different name, phone number, or address.
            </span>
          </div>
        ) : (
          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td data-label="Customer">
                      <div className="customers-identity">
                        <div className="customer-avatar">
                          {String(customer.name || '?')
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>{customer.name}</strong>
                      </div>
                    </td>

                    <td data-label="Phone">
                      <span className="customers-contact">
                        {customer.phone || 'No phone added'}
                      </span>
                    </td>

                    <td data-label="Address">
                      <span className="customers-contact">
                        {customer.address || 'No address added'}
                      </span>
                    </td>

                    <td data-label="Actions">
                      <div className="customers-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEditCustomer(customer.id)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteCustomer(customer.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

/*
function SettingsPage({
  settingsData,
  handleSettingsChange,
  handleSaveSettings,
  loading,
}) {
  return (
    <>
      <header className="topbar">
        <div>
          <h2>Settings</h2>

          <p>
            Manage your business profile and contact information.
          </p>
        </div>
      </header>

      <section className="products-card">
        <div className="products-toolbar">
          <div>
            <h3>Business Profile</h3>

            <p>
              {loading
                ? 'Loading your business profile...'
                : 'These details are saved to your account and used across the dashboard.'}
            </p>
          </div>
        </div>

        <form
          className="customer-form"
          onSubmit={handleSaveSettings}
        >
          <div>
            <label>Business Name</label>

            <input
              name="businessName"
              value={settingsData.businessName}
              onChange={handleSettingsChange}
              placeholder="e.g. ALBARKA FOOD ITEMS"
            />
          </div>

          <div>
            <label>
              Owner / Manager Name
            </label>

            <input
              name="ownerName"
              value={settingsData.ownerName}
              onChange={handleSettingsChange}
              placeholder="e.g. Maliyah Jr"
            />
          </div>

          <div>
            <label>Phone Number</label>

            <input
              name="phone"
              type="tel"
              value={settingsData.phone}
              onChange={handleSettingsChange}
              placeholder="08012345678"
            />
          </div>

          <div>
            <label>Email Address</label>

            <input
              name="email"
              type="email"
              value={settingsData.email}
              onChange={handleSettingsChange}
              placeholder="business@example.com"
            />
          </div>

          <div>
            <label>Business Address</label>

            <input
              name="address"
              value={settingsData.address}
              onChange={handleSettingsChange}
              placeholder="e.g. Kano, Nigeria"
            />
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Save Business Profile
          </button>
        </form>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="section-heading">
            <div>
              <h3>Profile Preview</h3>

              <p>
                How your business information appears in the app
              </p>
            </div>
          </div>

          <div className="sales-history">
            <div className="sale-row">
              <div>
                <strong>Business</strong>

                <span>
                  {settingsData.businessName ||
                    'Not set'}
                </span>
              </div>
            </div>

            <div className="sale-row">
              <div>
                <strong>
                  Owner / Manager
                </strong>

                <span>
                  {settingsData.ownerName ||
                    'Not set'}
                </span>
              </div>
            </div>

            <div className="sale-row">
              <div>
                <strong>Phone</strong>

                <span>
                  {settingsData.phone ||
                    'Not set'}
                </span>
              </div>
            </div>

            <div className="sale-row">
              <div>
                <strong>Email</strong>

                <span>
                  {settingsData.email ||
                    'Not set'}
                </span>
              </div>
            </div>

            <div className="sale-row">
              <div>
                <strong>Address</strong>

                <span>
                  {settingsData.address ||
                    'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="section-heading">
            <div>
              <h3>
                Settings Information
              </h3>

              <p>Important note</p>
            </div>
          </div>

          <div className="sales-history">
            <div className="sale-row">
              <div>
                <strong>
                  Saved to your account
                </strong>

                <span>
                  Your business profile stays available after refresh.
                </span>
              </div>
            </div>

            <div className="sale-row">
              <div>
                <strong>
                  Required fields
                </strong>

                <span>
                  Business Name and Owner / Manager Name
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

*/

function SettingsPage({
  businessSettings,
  settingsData,
  handleSettingsChange,
  handleSaveSettings,
  feedback,
  loading,
}) {
  const displayValue = (value) =>
    value && value.trim() ? value : 'Not provided'

  return (
    <div className="settings-page">
      <header className="topbar">
        <div>
          <h2>Settings</h2>

          <p>
            Keep your business profile accurate across the application.
          </p>
        </div>
      </header>

      {loading && (
        <div className="settings-loading-state">
          <span className="settings-loading-mark">...</span>
          <strong>Loading business profile</strong>
          <span>Fetching your saved settings.</span>
        </div>
      )}

      {feedback.message && (
        <div
          className={
            feedback.type === 'success'
              ? 'settings-feedback settings-feedback-success'
              : 'settings-feedback settings-feedback-error'
          }
          role="status"
        >
          <span className="settings-feedback-icon">
            {feedback.type === 'success' ? '✓' : '!'}
          </span>
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="settings-content-grid">
        <form
          className="settings-form-card"
          onSubmit={handleSaveSettings}
        >
          <section className="settings-form-section">
            <div className="settings-section-heading">
              <div>
                <span className="settings-eyebrow">Business profile</span>
                <h3>Business Profile</h3>
                <p>
                  The name and ownership details used to identify your business.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="settings-field settings-field-wide">
                <label htmlFor="business-name">
                  Business Name <span>Required</span>
                </label>

                <input
                  id="business-name"
                  name="businessName"
                  value={settingsData.businessName}
                  onChange={handleSettingsChange}
                  placeholder="e.g. ALBARKA FOOD ITEMS"
                  required
                />
              </div>

              <div className="settings-field">
                <label htmlFor="owner-name">
                  Owner / Manager Name <span>Required</span>
                </label>

                <input
                  id="owner-name"
                  name="ownerName"
                  value={settingsData.ownerName}
                  onChange={handleSettingsChange}
                  placeholder="e.g. Maliyah Jr"
                  required
                />
              </div>

              <div className="settings-field settings-field-wide">
                <label htmlFor="business-address">
                  Business Address <span>Optional</span>
                </label>

                <input
                  id="business-address"
                  name="address"
                  value={settingsData.address}
                  onChange={handleSettingsChange}
                  placeholder="e.g. Kano, Nigeria"
                />
              </div>
            </div>
          </section>

          <section className="settings-form-section settings-contact-section">
            <div className="settings-section-heading">
              <div>
                <span className="settings-eyebrow">Contact information</span>
                <h3>Contact Information</h3>
                <p>
                  Give customers and your team reliable ways to reach the business.
                </p>
              </div>
            </div>

            <div className="settings-form-grid settings-contact-grid">
              <div className="settings-field">
                <label htmlFor="business-phone">
                  Phone Number <span>Optional</span>
                </label>

                <input
                  id="business-phone"
                  name="phone"
                  type="tel"
                  value={settingsData.phone}
                  onChange={handleSettingsChange}
                  placeholder="08012345678"
                />
              </div>

              <div className="settings-field">
                <label htmlFor="business-email">
                  Email Address <span>Optional</span>
                </label>

                <input
                  id="business-email"
                  name="email"
                  type="email"
                  value={settingsData.email}
                  onChange={handleSettingsChange}
                  placeholder="business@example.com"
                />
              </div>
            </div>
          </section>

          <section className="settings-save-section">
            <div>
              <span className="settings-eyebrow">Save changes</span>
              <h3>Save Changes</h3>
              <p>
                Your profile is saved securely to your account and remains available
                after refresh.
              </p>
            </div>

            <button
              type="submit"
              className="save-product-button settings-save-button"
              disabled={loading}
            >
              {loading ? 'Loading Profile...' : 'Save Business Profile'}
            </button>
          </section>
        </form>

        <aside className="settings-summary-card">
          <div className="settings-summary-header">
            <div className="settings-summary-avatar">
              {String(
                businessSettings.businessName || 'B',
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <span className="settings-eyebrow">Profile summary</span>
              <h3>Current Business Profile</h3>
              <p>Saved information used across Business Manager.</p>
            </div>
          </div>

          <div className="settings-summary-list">
            <div className="settings-summary-item">
              <span>Business name</span>
              <strong>
                {displayValue(businessSettings.businessName)}
              </strong>
            </div>

            <div className="settings-summary-item">
              <span>Owner / Manager</span>
              <strong>
                {displayValue(businessSettings.ownerName)}
              </strong>
            </div>

            <div className="settings-summary-item">
              <span>Phone</span>
              <strong>{displayValue(businessSettings.phone)}</strong>
            </div>

            <div className="settings-summary-item">
              <span>Email</span>
              <strong>{displayValue(businessSettings.email)}</strong>
            </div>

            <div className="settings-summary-item">
              <span>Address</span>
              <strong>
                {displayValue(businessSettings.address)}
              </strong>
            </div>
          </div>

          <div className="settings-summary-note">
            <strong>Dashboard branding</strong>
            <span>
              Business and owner names update the dashboard after a successful save.
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}

/*
function ReportsPage({
  products,
  sales,
  customers,
  debts,
  expenses,
  totalSales,
  totalExpenses,
}) {
  const paidSales = sales.filter(
    (sale) => sale.status === 'Paid',
  )

  const pendingSales = sales.filter(
    (sale) => sale.status === 'Pending',
  )

  const outstandingDebt = debts.reduce(
    (total, debt) =>
      total + (debt.total - debt.paid),
    0,
  )

  const totalStock = products.reduce(
    (total, product) =>
      total + product.stock,
    0,
  )

  const stockValue = products.reduce(
    (total, product) =>
      total +
      product.price * product.stock,
    0,
  )

  const netProfit =
    totalSales - totalExpenses

  const expenseByCategory =
    expenses.reduce((groups, expense) => {
      groups[expense.category] =
        (groups[expense.category] || 0) +
        expense.amount

      return groups
    }, {})

  const topProducts = products
    .slice()
    .sort(
      (a, b) => b.stock - a.stock,
    )
    .slice(0, 5)

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Reports</h2>

          <p>
            Get a clear overview of your business performance.
          </p>
        </div>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <div className="card-icon sales-icon">
            💰
          </div>

          <div>
            <span>Total Sales</span>

            <h3>
              ₦{totalSales.toLocaleString()}
            </h3>

            <small>
              {sales.length} transactions
            </small>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon expense-icon">
            💸
          </div>

          <div>
            <span>Total Expenses</span>

            <h3>
              ₦{totalExpenses.toLocaleString()}
            </h3>

            <small>
              {expenses.length} expense records
            </small>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon profit-icon">
            📈
          </div>

          <div>
            <span>Net Profit</span>

            <h3>
              ₦{netProfit.toLocaleString()}
            </h3>

            <small>
              Sales minus expenses
            </small>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon expense-icon">
            💳
          </div>

          <div>
            <span>
              Outstanding Debt
            </span>

            <h3>
              ₦{outstandingDebt.toLocaleString()}
            </h3>

            <small>
              {debts.length} debt records
            </small>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="section-heading">
            <div>
              <h3>
                Business Overview
              </h3>

              <p>
                Current business statistics
              </p>
            </div>
          </div>

          <div className="sales-history">
            <div className="sale-row">
              <div>
                <strong>
                  Total Customers
                </strong>

                <span>
                  Registered customers
                </span>
              </div>

              <strong>
                {customers.length}
              </strong>
            </div>

            <div className="sale-row">
              <div>
                <strong>
                  Total Products
                </strong>

                <span>
                  Products in catalogue
                </span>
              </div>

              <strong>
                {products.length}
              </strong>
            </div>

            <div className="sale-row">
              <div>
                <strong>
                  Units in Stock
                </strong>

                <span>
                  Available inventory
                </span>
              </div>

              <strong>
                {totalStock}
              </strong>
            </div>

            <div className="sale-row">
              <div>
                <strong>
                  Inventory Value
                </strong>

                <span>
                  Price × current stock
                </span>
              </div>

              <strong>
                ₦{stockValue.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="section-heading">
            <div>
              <h3>Sales Status</h3>

              <p>
                Payment status of recorded sales
              </p>
            </div>
          </div>

          <div className="sales-history">
            <div className="sale-row">
              <div>
                <strong>
                  Paid Sales
                </strong>

                <span>
                  Completed payments
                </span>
              </div>

              <span className="status paid">
                {paidSales.length}
              </span>
            </div>

            <div className="sale-row">
              <div>
                <strong>
                  Pending Sales
                </strong>

                <span>
                  Payments still pending
                </span>
              </div>

              <span className="status pending">
                {pendingSales.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="section-heading">
            <div>
              <h3>
                Expenses by Category
              </h3>

              <p>
                Where the business money is going
              </p>
            </div>
          </div>

          <div className="sales-history">
            {Object.keys(
              expenseByCategory,
            ).length === 0 ? (
              <div className="empty-state">
                No expense data available.
              </div>
            ) : (
              Object.entries(
                expenseByCategory,
              ).map(
                ([category, amount]) => (
                  <div
                    className="sale-row"
                    key={category}
                  >
                    <div>
                      <strong>
                        {category}
                      </strong>

                      <span>
                        Expense category
                      </span>
                    </div>

                    <strong>
                      ₦{amount.toLocaleString()}
                    </strong>
                  </div>
                ),
              )
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="section-heading">
            <div>
              <h3>
                Stock Overview
              </h3>

              <p>
                Products currently in inventory
              </p>
            </div>
          </div>

          <div className="sales-history">
            {topProducts.map(
              (product) => (
                <div
                  className="sale-row"
                  key={product.id}
                >
                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category}
                    </span>
                  </div>

                  <span
                    className={
                      product.stock <= 3
                        ? 'stock-danger'
                        : product.stock <= 7
                          ? 'stock-warning'
                          : 'status paid'
                    }
                  >
                    {product.stock} units
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  )
}

*/

function ReportsPage({
  products,
  sales,
  customers,
  debts,
  expenses,
  totalSales,
  totalExpenses,
  loading,
}) {
  const [reportDate, setReportDate] = useState('')

  const formatCurrency = (value) =>
    '₦' + Number(value || 0).toLocaleString()

  const getSaleDateKey = (createdAt) => {
    if (!createdAt) {
      return ''
    }

    const date = new Date(createdAt)

    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-')
  }

  const formatReportDate = (value) => {
    if (!value) {
      return ''
    }

    const date = new Date(value + 'T00:00:00')

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const reportSales = useMemo(() => {
    if (!reportDate) {
      return sales
    }

    return sales.filter(
      (sale) => getSaleDateKey(sale.createdAt) === reportDate,
    )
  }, [reportDate, sales])

  const reportExpenses = useMemo(() => {
    if (!reportDate) {
      return expenses
    }

    return expenses.filter(
      (expense) => expense.date === reportDate,
    )
  }, [expenses, reportDate])

  const reportTotalSales = reportDate
    ? reportSales.reduce(
        (total, sale) =>
          total + Number(sale.amount || 0),
        0,
      )
    : totalSales

  const reportTotalExpenses = reportDate
    ? reportExpenses.reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0,
      )
    : totalExpenses

  const netProfit =
    reportTotalSales - reportTotalExpenses

  const paidSales = reportSales.filter(
    (sale) => sale.status === 'Paid',
  )

  const pendingSales = reportSales.filter(
    (sale) => sale.status === 'Pending',
  )

  const paidSalesAmount = paidSales.reduce(
    (total, sale) => total + Number(sale.amount || 0),
    0,
  )

  const pendingSalesAmount = pendingSales.reduce(
    (total, sale) => total + Number(sale.amount || 0),
    0,
  )

  const totalDebt = debts.reduce(
    (total, debt) => total + Number(debt.total || 0),
    0,
  )

  const totalPaidDebt = debts.reduce(
    (total, debt) => total + Number(debt.paid || 0),
    0,
  )

  const outstandingDebt = debts.reduce(
    (total, debt) =>
      total +
      Number(debt.total || 0) -
      Number(debt.paid || 0),
    0,
  )

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0,
  )

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) *
        Number(product.stock || 0),
    0,
  )

  const lowStockProducts = products.filter(
    (product) => product.stock <= 7,
  )

  const expenseCategories = [
    'Rent',
    'Transport',
    'Utilities',
    'Supplies',
    'Salary',
    'Other',
  ]

  const expenseByCategory = expenseCategories
    .map((category) => ({
      category,
      amount: reportExpenses
        .filter((expense) => expense.category === category)
        .reduce(
          (total, expense) =>
            total + Number(expense.amount || 0),
          0,
        ),
    }))
    .filter((entry) => entry.amount > 0)

  const largestCategoryAmount = Math.max(
    ...expenseByCategory.map((entry) => entry.amount),
    1,
  )

  const clearDateFilter = () => {
    setReportDate('')
  }

  return (
    <div className="reports-page">
      <header className="topbar">
        <div>
          <h2>Reports</h2>

          <p>
            Understand performance across sales, costs, inventory, and debt.
          </p>
        </div>

        <div className="reports-date-control">
          <label>
            <span>Report date</span>

            <input
              type="date"
              value={reportDate}
              onChange={(event) =>
                setReportDate(event.target.value)
              }
            />
          </label>

          {reportDate && (
            <button
              type="button"
              className="reports-clear-button"
              onClick={clearDateFilter}
            >
              All dates
            </button>
          )}
        </div>
      </header>

      {loading && (
        <div className="reports-loading-state">
          <span className="reports-loading-mark">...</span>
          <strong>Loading report data</strong>
          <span>Refreshing your business metrics from the database.</span>
        </div>
      )}

      {reportDate && (
        <div className="reports-filter-note">
          Showing sales and expenses for {formatReportDate(reportDate)}.
          Inventory, customers, and debt balances are current totals because
          those records do not contain report dates.
        </div>
      )}

      <section className="reports-section">
        <div className="reports-section-heading">
          <div>
            <span className="reports-eyebrow">Financial overview</span>
            <h3>Business performance</h3>
            <p>Core financial indicators for your business.</p>
          </div>
        </div>

        <div className="reports-financial-grid">
          <article className="reports-metric-card">
            <div className="reports-metric-icon reports-icon-green">
              S
            </div>

            <div>
              <span>Total Sales</span>
              <strong>{formatCurrency(reportTotalSales)}</strong>
              <small>{reportSales.length} transactions</small>
            </div>
          </article>

          <article className="reports-metric-card">
            <div className="reports-metric-icon reports-icon-orange">
              E
            </div>

            <div>
              <span>Total Expenses</span>
              <strong>{formatCurrency(reportTotalExpenses)}</strong>
              <small>{reportExpenses.length} expense records</small>
            </div>
          </article>

          <article className="reports-metric-card">
            <div className="reports-metric-icon reports-icon-blue">
              P
            </div>

            <div>
              <span>Net Profit</span>
              <strong
                className={
                  netProfit < 0
                    ? 'reports-negative'
                    : ''
                }
              >
                {formatCurrency(netProfit)}
              </strong>
              <small>Sales minus expenses</small>
            </div>
          </article>

          <article className="reports-metric-card">
            <div className="reports-metric-icon reports-icon-amber">
              D
            </div>

            <div>
              <span>Outstanding Debt</span>
              <strong>{formatCurrency(outstandingDebt)}</strong>
              <small>{debts.length} debt records</small>
            </div>
          </article>
        </div>
      </section>

      <section className="reports-section">
        <div className="reports-section-heading">
          <div>
            <span className="reports-eyebrow">Business overview</span>
            <h3>Current operations</h3>
            <p>A snapshot of customers and available inventory.</p>
          </div>
        </div>

        <div className="reports-overview-grid">
          <article className="reports-overview-card">
            <span>Total Customers</span>
            <strong>{customers.length}</strong>
            <small>Registered customers</small>
          </article>

          <article className="reports-overview-card">
            <span>Total Products</span>
            <strong>{products.length}</strong>
            <small>Products in catalogue</small>
          </article>

          <article className="reports-overview-card">
            <span>Units in Stock</span>
            <strong>{totalStock}</strong>
            <small>Available inventory</small>
          </article>

          <article className="reports-overview-card">
            <span>Inventory Value</span>
            <strong>{formatCurrency(inventoryValue)}</strong>
            <small>Price multiplied by current stock</small>
          </article>
        </div>
      </section>

      <div className="reports-two-column">
        <section className="reports-panel">
          <div className="reports-section-heading">
            <div>
              <span className="reports-eyebrow">Sales performance</span>
              <h3>Sales activity</h3>
              <p>Payment status across recorded transactions.</p>
            </div>

            <span className="reports-panel-count">
              {reportSales.length} transactions
            </span>
          </div>

          <div className="reports-detail-grid">
            <div className="reports-detail-item">
              <span>Total Transactions</span>
              <strong>{reportSales.length}</strong>
            </div>

            <div className="reports-detail-item">
              <span>Paid Sales</span>
              <strong>{paidSales.length}</strong>
              <small>{formatCurrency(paidSalesAmount)}</small>
            </div>

            <div className="reports-detail-item">
              <span>Pending Sales</span>
              <strong>{pendingSales.length}</strong>
              <small>{formatCurrency(pendingSalesAmount)}</small>
            </div>
          </div>

          {reportSales.length === 0 && (
            <div className="reports-small-empty">
              No sales data is available for this report period.
            </div>
          )}
        </section>

        <section className="reports-panel">
          <div className="reports-section-heading">
            <div>
              <span className="reports-eyebrow">Debt overview</span>
              <h3>Customer balances</h3>
              <p>Collections and outstanding obligations.</p>
            </div>

            <span className="reports-panel-count warning">
              {debts.length} records
            </span>
          </div>

          <div className="reports-detail-grid">
            <div className="reports-detail-item">
              <span>Total Debt</span>
              <strong>{formatCurrency(totalDebt)}</strong>
            </div>

            <div className="reports-detail-item">
              <span>Total Paid</span>
              <strong>{formatCurrency(totalPaidDebt)}</strong>
            </div>

            <div className="reports-detail-item">
              <span>Total Outstanding</span>
              <strong className="reports-warning-value">
                {formatCurrency(outstandingDebt)}
              </strong>
            </div>

            <div className="reports-detail-item">
              <span>Debt Records</span>
              <strong>{debts.length}</strong>
            </div>
          </div>

          {debts.length === 0 && (
            <div className="reports-small-empty">
              No debt records are available.
            </div>
          )}
        </section>
      </div>

      <section className="reports-panel">
        <div className="reports-section-heading">
          <div>
            <span className="reports-eyebrow">Expenses analysis</span>
            <h3>Where money is going</h3>
            <p>Category totals from recorded business expenses.</p>
          </div>

          <span className="reports-panel-count">
            {reportExpenses.length} records
          </span>
        </div>

        <div className="reports-expense-summary">
          <div className="reports-expense-total">
            <span>Total Expenses</span>
            <strong>{formatCurrency(reportTotalExpenses)}</strong>
          </div>

          <div className="reports-expense-total">
            <span>Number of Expenses</span>
            <strong>{reportExpenses.length}</strong>
          </div>
        </div>

        {expenseByCategory.length === 0 ? (
          <div className="reports-small-empty">
            No expense category data is available for this report period.
          </div>
        ) : (
          <div className="reports-category-list">
            {expenseByCategory.map((entry) => (
              <div
                className="reports-category-row"
                key={entry.category}
              >
                <div className="reports-category-label">
                  <strong>{entry.category}</strong>
                  <span>{formatCurrency(entry.amount)}</span>
                </div>

                <div className="reports-progress-track">
                  <div
                    className={
                      'reports-progress-fill reports-category-' +
                      entry.category.toLowerCase()
                    }
                    style={{
                      width:
                        (entry.amount / largestCategoryAmount) *
                          100 +
                        '%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="reports-panel">
        <div className="reports-section-heading">
          <div>
            <span className="reports-eyebrow">Inventory overview</span>
            <h3>Stock health</h3>
            <p>Products that may need attention soon.</p>
          </div>

          <span
            className={
              lowStockProducts.length
                ? 'reports-panel-count warning'
                : 'reports-panel-count'
            }
          >
            {lowStockProducts.length} low-stock products
          </span>
        </div>

        <div className="reports-inventory-summary">
          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>

          <div>
            <span>Units in Stock</span>
            <strong>{totalStock}</strong>
          </div>

          <div>
            <span>Inventory Value</span>
            <strong>{formatCurrency(inventoryValue)}</strong>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="reports-small-empty reports-healthy-state">
            Inventory is healthy. No products are at or below the low-stock
            threshold.
          </div>
        ) : (
          <div className="reports-inventory-list">
            {lowStockProducts.map((product) => (
              <div
                className="reports-inventory-row"
                key={product.id}
              >
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                </div>

                <span
                  className={
                    product.stock <= 3
                      ? 'reports-stock-badge critical'
                      : 'reports-stock-badge'
                  }
                >
                  {product.stock} units
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/*
function ExpensesPage({
  expenses,
  totalExpenses,
  showForm,
  setShowForm,
  expenseData,
  handleExpenseChange,
  handleAddExpense,
  loading,
}) {
  return (
    <>
      <header className="topbar">
        <div>
          <h2>Expenses</h2>

          <p>
            Record and track the money your business spends.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm
            ? 'Close Form'
            : '+ Add Expense'}
        </button>
      </header>

      {showForm && (
        <form
          className="customer-form"
          onSubmit={handleAddExpense}
        >
          <div>
            <label>
              Expense Name
            </label>

            <input
              name="name"
              value={expenseData.name}
              onChange={handleExpenseChange}
              placeholder="e.g. Shop Rent"
            />
          </div>

          <div>
            <label>Category</label>

            <select
              name="category"
              value={expenseData.category}
              onChange={handleExpenseChange}
            >
              <option value="">
                Select category
              </option>

              <option value="Rent">
                Rent
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Utilities">
                Utilities
              </option>

              <option value="Supplies">
                Supplies
              </option>

              <option value="Salary">
                Salary
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label>
              Amount (₦)
            </label>

            <input
              name="amount"
              type="number"
              min="1"
              value={expenseData.amount}
              onChange={handleExpenseChange}
              placeholder="25000"
            />
          </div>

          <div>
            <label>Date</label>

            <input
              name="date"
              type="date"
              value={expenseData.date}
              onChange={handleExpenseChange}
            />
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Save Expense
          </button>
        </form>
      )}

      <section className="summary-grid">
        <div className="summary-card">
          <div className="card-icon expense-icon">
            💸
          </div>

          <div>
            <span>
              Total Expenses
            </span>

            <h3>
              ₦{totalExpenses.toLocaleString()}
            </h3>

            <small>
              {expenses.length} expense records
            </small>
          </div>
        </div>
      </section>

      <section className="products-card">
        <div className="products-toolbar">
          <div>
            <h3>
              Expense History
            </h3>

            <p>
              {loading
                ? 'Loading expenses...'
                : 'All recorded business expenses'}
            </p>
          </div>
        </div>

        <div className="sales-history">
          {loading ? (
            <div className="empty-state">
              Loading expenses from database...
            </div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">
              No expenses recorded yet.
            </div>
          ) : (
            expenses.map(
              (expense) => (
                <div
                  className="sale-row"
                  key={expense.id}
                >
                  <div>
                    <strong>
                      {expense.name}
                    </strong>

                    <span>
                      {expense.category}
                    </span>
                  </div>

                  <span>
                    {expense.date}
                  </span>

                  <strong>
                    ₦{expense.amount.toLocaleString()}
                  </strong>
                </div>
              ),
            )
          )}
        </div>
      </section>
    </>
  )
}

*/

function ExpensesPage({
  expenses,
  showForm,
  setShowForm,
  expenseData,
  handleExpenseChange,
  handleAddExpense,
  loading,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(
    'All Categories',
  )
  const [dateFilter, setDateFilter] = useState('')

  const formatCurrency = (value) =>
    '₦' + Number(value || 0).toLocaleString()

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0,
  )

  const averageExpense = expenses.length
    ? totalExpenses / expenses.length
    : 0

  const highestExpense = expenses.reduce(
    (highest, expense) =>
      Math.max(highest, Number(expense.amount || 0)),
    0,
  )

  const formatExpenseDate = (value) => {
    if (!value) {
      return 'Date unavailable'
    }

    const date = new Date(value + 'T00:00:00')

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCategoryClass = (category) =>
    String(category || 'other')
      .toLowerCase()
      .replace(/\s+/g, '-')

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase()

    return expenses.filter((expense) => {
      const name = String(expense.name || '').toLowerCase()
      const category = String(expense.category || '')
        .toLowerCase()
      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        category.includes(normalizedSearch)
      const matchesCategory =
        categoryFilter === 'All Categories' ||
        expense.category === categoryFilter
      const matchesDate =
        !dateFilter || expense.date === dateFilter

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      )
    })
  }, [
    categoryFilter,
    dateFilter,
    expenses,
    searchTerm,
  ])

  const hasFilters =
    Boolean(searchTerm) ||
    categoryFilter !== 'All Categories' ||
    Boolean(dateFilter)

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('All Categories')
    setDateFilter('')
  }

  return (
    <div className="expenses-page">
      <header className="topbar">
        <div>
          <h2>Expenses</h2>

          <p>
            Record and track the money your business spends.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm ? 'Close Form' : '+ Add Expense'}
        </button>
      </header>

      <section className="expenses-summary-grid">
        <article className="expenses-summary-card">
          <div className="expenses-summary-icon expenses-icon-green">
            $
          </div>

          <div>
            <span>Total Expenses</span>
            <strong>{formatCurrency(totalExpenses)}</strong>
            <small>All recorded expenses</small>
          </div>
        </article>

        <article className="expenses-summary-card">
          <div className="expenses-summary-icon expenses-icon-orange">
            #
          </div>

          <div>
            <span>Number of Expenses</span>
            <strong>{expenses.length}</strong>
            <small>Expense records</small>
          </div>
        </article>

        <article className="expenses-summary-card">
          <div className="expenses-summary-icon expenses-icon-teal">
            ∅
          </div>

          <div>
            <span>Average Expense</span>
            <strong>{formatCurrency(averageExpense)}</strong>
            <small>Average per record</small>
          </div>
        </article>

        <article className="expenses-summary-card">
          <div className="expenses-summary-icon expenses-icon-purple">
            ↑
          </div>

          <div>
            <span>Highest Expense</span>
            <strong>{formatCurrency(highestExpense)}</strong>
            <small>Largest recorded amount</small>
          </div>
        </article>
      </section>

      {showForm && (
        <form
          className="customer-form expenses-record-form"
          onSubmit={handleAddExpense}
        >
          <div>
            <label htmlFor="expense-name">Expense Name</label>

            <input
              id="expense-name"
              name="name"
              value={expenseData.name}
              onChange={handleExpenseChange}
              placeholder="e.g. Shop Rent"
              required
            />
          </div>

          <div>
            <label htmlFor="expense-category">Category</label>

            <select
              id="expense-category"
              name="category"
              value={expenseData.category}
              onChange={handleExpenseChange}
              required
            >
              <option value="">Select category</option>
              <option value="Rent">Rent</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Supplies">Supplies</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="expense-amount">Amount (₦)</label>

            <input
              id="expense-amount"
              name="amount"
              type="number"
              min="1"
              value={expenseData.amount}
              onChange={handleExpenseChange}
              placeholder="25000"
              required
            />
          </div>

          <div>
            <label htmlFor="expense-date">Date</label>

            <input
              id="expense-date"
              name="date"
              type="date"
              value={expenseData.date}
              onChange={handleExpenseChange}
              required
            />
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Save Expense
          </button>
        </form>
      )}

      <section className="products-card expenses-history-card">
        <div className="expenses-toolbar">
          <div>
            <h3>Expense History</h3>

            <p>
              {loading
                ? 'Loading expenses from database...'
                : filteredExpenses.length +
                  ' of ' +
                  expenses.length +
                  ' expenses shown'}
            </p>
          </div>

          <div className="expenses-filter-controls">
            <label className="expenses-search">
              <span>Search expenses</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Name or category"
              />
            </label>

            <label className="expenses-filter">
              <span>Category</span>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
              >
                <option value="All Categories">
                  All Categories
                </option>
                <option value="Rent">Rent</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Supplies">Supplies</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="expenses-filter">
              <span>Date</span>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
              />
            </label>

            {hasFilters && (
              <button
                type="button"
                className="expenses-clear-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="expenses-empty-state">
            <div className="expenses-loading-mark">...</div>
            <strong>Loading expenses</strong>
            <span>Fetching your latest expense records.</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="expenses-empty-state">
            <strong>No expenses recorded yet</strong>
            <span>
              Add your first expense to start tracking business costs.
            </span>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="expenses-empty-state">
            <strong>No matching expenses</strong>
            <span>
              Try changing your search, category, or date filter.
            </span>
          </div>
        ) : (
          <div className="expenses-table-wrapper">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Expense Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td data-label="Expense Name">
                      <strong>{expense.name}</strong>
                    </td>

                    <td data-label="Category">
                      <span
                        className={
                          'expense-category expense-category-' +
                          getCategoryClass(expense.category)
                        }
                      >
                        {expense.category}
                      </span>
                    </td>

                    <td data-label="Amount">
                      <strong className="expenses-amount">
                        {formatCurrency(expense.amount)}
                      </strong>
                    </td>

                    <td data-label="Date">
                      <span className="expenses-date">
                        {formatExpenseDate(expense.date)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

/*
function DebtsPage({
  debts,
  showForm,
  setShowForm,
  debtData,
  handleDebtChange,
  handleAddDebt,
  paymentDebtId,
  setPaymentDebtId,
  paymentAmount,
  setPaymentAmount,
  handleRecordPayment,
  loading,
}) {
  const totalDebt = debts.reduce(
    (total, debt) =>
      total +
      (debt.total - debt.paid),
    0,
  )

  const getDebtStatus = (debt) => {
    const remaining =
      debt.total - debt.paid

    if (remaining === 0) {
      return 'Paid'
    }

    if (debt.paid > 0) {
      return 'Partial'
    }

    return 'Unpaid'
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h2>Debts</h2>

          <p>
            Track customer debts and outstanding payments.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm
            ? 'Close Form'
            : '+ Add Debt'}
        </button>
      </header>

      {showForm && (
        <form
          className="customer-form"
          onSubmit={handleAddDebt}
        >
          <div>
            <label>
              Customer Name
            </label>

            <input
              name="customer"
              value={debtData.customer}
              onChange={handleDebtChange}
              placeholder="e.g. Ahmed Musa"
            />
          </div>

          <div>
            <label>Item</label>

            <input
              name="item"
              value={debtData.item}
              onChange={handleDebtChange}
              placeholder="e.g. Rice 25kg"
            />
          </div>

          <div>
            <label>
              Total Amount (₦)
            </label>

            <input
              name="total"
              type="number"
              min="0"
              value={debtData.total}
              onChange={handleDebtChange}
              placeholder="45000"
            />
          </div>

          <div>
            <label>
              Amount Paid (₦)
            </label>

            <input
              name="paid"
              type="number"
              min="0"
              value={debtData.paid}
              onChange={handleDebtChange}
              placeholder="20000"
            />
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Save Debt
          </button>
        </form>
      )}

      <section className="summary-grid">
        <div className="summary-card">
          <div className="card-icon expense-icon">
            💳
          </div>

          <div>
            <span>
              Total Outstanding Debt
            </span>

            <h3>
              ₦{totalDebt.toLocaleString()}
            </h3>

            <small>
              {debts.length} debt records
            </small>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon sales-icon">
            👥
          </div>

          <div>
            <span>
              Customers With Debt
            </span>

            <h3>{debts.length}</h3>

            <small>
              Active debt records
            </small>
          </div>
        </div>
      </section>

      <section className="products-card">
        <div className="products-toolbar">
          <div>
            <h3>
              Debt Records
            </h3>

            <p>
              Customer payment information
            </p>
          </div>
        </div>

        <div className="debt-list">
          {loading ? (
            <div className="empty-state">
              Loading debts from database...
            </div>
          ) : debts.length === 0 ? (
            <div className="empty-state">
              No debt records found.
            </div>
          ) : (
            debts.map((debt) => {
              const remaining =
                debt.total - debt.paid

              const status =
                getDebtStatus(debt)

              return (
                <div
                  className="debt-row"
                  key={debt.id}
                >
                  <div className="debt-customer">
                    <div className="customer-avatar">
                      {debt.customer
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {debt.customer}
                      </strong>

                      <span>
                        {debt.item}
                      </span>
                    </div>
                  </div>

                  <div className="debt-amount">
                    <span>Total</span>

                    <strong>
                      ₦{debt.total.toLocaleString()}
                    </strong>
                  </div>

                  <div className="debt-amount">
                    <span>Paid</span>

                    <strong>
                      ₦{debt.paid.toLocaleString()}
                    </strong>
                  </div>

                  <div className="debt-amount remaining">
                    <span>
                      Remaining
                    </span>

                    <strong>
                      ₦{remaining.toLocaleString()}
                    </strong>
                  </div>

                  <span
                    className={
                      status === 'Paid'
                        ? 'status paid'
                        : status === 'Partial'
                          ? 'status pending'
                          : 'stock-danger'
                    }
                  >
                    {status}
                  </span>

                  {status !== 'Paid' && (
                    <button
                      className="save-product-button"
                      onClick={() => {
                        setPaymentDebtId(
                          debt.id,
                        )
                        setPaymentAmount('')
                      }}
                    >
                      Pay
                    </button>
                  )}

                  {paymentDebtId ===
                    debt.id && (
                    <form
                      className="customer-form"
                      onSubmit={
                        handleRecordPayment
                      }
                    >
                      <div>
                        <label>
                          Payment Amount (₦)
                        </label>

                        <input
                          type="number"
                          min="1"
                          max={remaining}
                          value={paymentAmount}
                          onChange={(event) =>
                            setPaymentAmount(
                              event.target
                                .value,
                            )
                          }
                          placeholder={`Up to ${remaining.toLocaleString()}`}
                          autoFocus
                        />
                      </div>

                      <button
                        type="submit"
                        className="save-product-button"
                      >
                        Record Payment
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => {
                          setPaymentDebtId(
                            null,
                          )
                          setPaymentAmount('')
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </>
  )
}

*/

function DebtsPage({
  debts,
  showForm,
  setShowForm,
  debtData,
  handleDebtChange,
  handleAddDebt,
  paymentDebtId,
  setPaymentDebtId,
  paymentAmount,
  setPaymentAmount,
  handleRecordPayment,
  loading,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const formatCurrency = (value) =>
    '₦' + Number(value || 0).toLocaleString()

  const getDebtStatus = (debt) => {
    const remaining = debt.total - debt.paid

    if (remaining === 0) {
      return 'Paid'
    }

    if (debt.paid > 0) {
      return 'Partial'
    }

    return 'Unpaid'
  }

  const totalDebt = debts.reduce(
    (total, debt) => total + Number(debt.total || 0),
    0,
  )

  const totalPaid = debts.reduce(
    (total, debt) => total + Number(debt.paid || 0),
    0,
  )

  const totalOutstanding = debts.reduce(
    (total, debt) =>
      total +
      Number(debt.total || 0) -
      Number(debt.paid || 0),
    0,
  )

  const filteredDebts = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase()

    return debts.filter((debt) => {
      const customer = String(debt.customer || '')
        .toLowerCase()
      const item = String(debt.item || '').toLowerCase()
      const matchesSearch =
        !normalizedSearch ||
        customer.includes(normalizedSearch) ||
        item.includes(normalizedSearch)
      const matchesStatus =
        statusFilter === 'All' ||
        getDebtStatus(debt) === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [debts, searchTerm, statusFilter])

  const hasFilters =
    Boolean(searchTerm) || statusFilter !== 'All'

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
  }

  const closePaymentForm = () => {
    setPaymentDebtId(null)
    setPaymentAmount('')
  }

  return (
    <div className="debts-page">
      <header className="topbar">
        <div>
          <h2>Debts</h2>

          <p>
            Track customer balances and collect outstanding payments.
          </p>
        </div>

        <button
          className="add-product-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm ? 'Close Form' : '+ Add Debt'}
        </button>
      </header>

      <section className="debts-summary-grid">
        <article className="debts-summary-card">
          <div className="debts-summary-icon debts-icon-green">
            $
          </div>

          <div>
            <span>Total Debt</span>
            <strong>{formatCurrency(totalDebt)}</strong>
            <small>Across all records</small>
          </div>
        </article>

        <article className="debts-summary-card">
          <div className="debts-summary-icon debts-icon-teal">
            ✓
          </div>

          <div>
            <span>Total Paid</span>
            <strong>{formatCurrency(totalPaid)}</strong>
            <small>Payments received</small>
          </div>
        </article>

        <article className="debts-summary-card">
          <div className="debts-summary-icon debts-icon-orange">
            !
          </div>

          <div>
            <span>Total Outstanding</span>
            <strong>{formatCurrency(totalOutstanding)}</strong>
            <small>Still to be collected</small>
          </div>
        </article>

        <article className="debts-summary-card">
          <div className="debts-summary-icon debts-icon-purple">
            #
          </div>

          <div>
            <span>Total Debt Records</span>
            <strong>{debts.length}</strong>
            <small>Customer balances</small>
          </div>
        </article>
      </section>

      {showForm && (
        <form
          className="customer-form debts-record-form"
          onSubmit={handleAddDebt}
        >
          <div>
            <label htmlFor="debt-customer">Customer Name</label>

            <input
              id="debt-customer"
              name="customer"
              value={debtData.customer}
              onChange={handleDebtChange}
              placeholder="e.g. Ahmed Musa"
              required
            />
          </div>

          <div>
            <label htmlFor="debt-item">Item</label>

            <input
              id="debt-item"
              name="item"
              value={debtData.item}
              onChange={handleDebtChange}
              placeholder="e.g. Rice 25kg"
              required
            />
          </div>

          <div>
            <label htmlFor="debt-total">Total Amount (₦)</label>

            <input
              id="debt-total"
              name="total"
              type="number"
              min="0"
              value={debtData.total}
              onChange={handleDebtChange}
              placeholder="45000"
              required
            />
          </div>

          <div>
            <label htmlFor="debt-paid">Amount Paid (₦)</label>

            <input
              id="debt-paid"
              name="paid"
              type="number"
              min="0"
              value={debtData.paid}
              onChange={handleDebtChange}
              placeholder="20000"
            />
          </div>

          <button
            type="submit"
            className="save-product-button"
          >
            Save Debt
          </button>
        </form>
      )}

      <section className="products-card debts-list-card">
        <div className="debts-toolbar">
          <div>
            <h3>Debt Records</h3>

            <p>
              {loading
                ? 'Loading debts from database...'
                : filteredDebts.length +
                  ' of ' +
                  debts.length +
                  ' records shown'}
            </p>
          </div>

          <div className="debts-filter-controls">
            <label className="debts-search">
              <span>Search debts</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Customer or item"
              />
            </label>

            <label className="debts-filter">
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </label>

            {hasFilters && (
              <button
                type="button"
                className="debts-clear-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="debts-empty-state">
            <div className="debts-loading-mark">...</div>
            <strong>Loading debts</strong>
            <span>Fetching your latest debt records.</span>
          </div>
        ) : debts.length === 0 ? (
          <div className="debts-empty-state">
            <strong>No debt records yet</strong>
            <span>
              Add a debt record to start tracking customer balances.
            </span>
          </div>
        ) : filteredDebts.length === 0 ? (
          <div className="debts-empty-state">
            <strong>No matching debt records</strong>
            <span>
              Try changing your search or status filter.
            </span>
          </div>
        ) : (
          <div className="debts-table-wrapper">
            <table className="debts-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDebts.map((debt) => {
                  const remaining =
                    debt.total - debt.paid
                  const status = getDebtStatus(debt)

                  return (
                    <tr key={debt.id}>
                      <td data-label="Customer">
                        <div className="debts-customer">
                          <div className="customer-avatar">
                            {String(debt.customer || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>{debt.customer}</strong>
                        </div>
                      </td>

                      <td data-label="Item">
                        <span className="debts-item">
                          {debt.item}
                        </span>
                      </td>

                      <td data-label="Total">
                        <strong>
                          {formatCurrency(debt.total)}
                        </strong>
                      </td>

                      <td data-label="Paid">
                        <span className="debts-paid">
                          {formatCurrency(debt.paid)}
                        </span>
                      </td>

                      <td data-label="Remaining">
                        <strong className="debts-remaining">
                          {formatCurrency(remaining)}
                        </strong>
                      </td>

                      <td data-label="Status">
                        <span
                          className={
                            status === 'Paid'
                              ? 'debt-status debt-status-paid'
                              : status === 'Partial'
                                ? 'debt-status debt-status-partial'
                                : 'debt-status debt-status-unpaid'
                          }
                        >
                          <span className="debt-status-dot" />
                          {status}
                        </span>
                      </td>

                      <td data-label="Actions">
                        <div className="debts-actions">
                          {status !== 'Paid' ? (
                            <button
                              type="button"
                              className="save-product-button debts-pay-button"
                              onClick={() => {
                                setPaymentDebtId(debt.id)
                                setPaymentAmount('')
                              }}
                            >
                              Pay
                            </button>
                          ) : (
                            <span className="debts-settled-label">
                              Settled
                            </span>
                          )}

                          {paymentDebtId === debt.id && (
                            <form
                              className="debt-payment-form"
                              onSubmit={handleRecordPayment}
                            >
                              <label htmlFor={'payment-amount-' + debt.id}>
                                Payment Amount (₦)
                              </label>

                              <input
                                id={'payment-amount-' + debt.id}
                                type="number"
                                min="1"
                                max={remaining}
                                value={paymentAmount}
                                onChange={(event) =>
                                  setPaymentAmount(
                                    event.target.value,
                                  )
                                }
                                placeholder={
                                  'Up to ' +
                                  remaining.toLocaleString()
                                }
                                autoFocus
                                required
                              />

                              <div className="debt-payment-actions">
                                <button
                                  type="submit"
                                  className="save-product-button"
                                >
                                  Record Payment
                                </button>

                                <button
                                  type="button"
                                  className="delete-button"
                                  onClick={closePaymentForm}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
