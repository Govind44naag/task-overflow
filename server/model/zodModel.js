import zod from 'zod'

// ✅ User Signup Schema
export const userSignupSchema = zod.object({
  name: zod.string().min(1, 'Name is required').trim(),
  email: zod.string().email('Invalid email address').trim(),
  password: zod.string().min(5, 'Password must be at least 5 characters long')
})

// ✅ User Signin Schema
export const userSigninSchema = zod.object({
  email: zod.string().email('Invalid email address').trim(),
  password: zod.string().min(5, 'Password must be at least 5 characters long')
})

// ✅ User Profile Schema
export const zodProfile = zod.object({
  name: zod.string().min(1, 'Name is required').trim(),
  email: zod.string().email('Invalid email address').trim()
})

// ✅ Task Creation Schema
export const zodCreateTask = zod.object({
  title: zod.string(),
  description: zod.string(),
  priority: zod.enum(['Low', 'Medium', 'High']),
  dueDate: zod.string(),
  completed: zod.boolean()
})

