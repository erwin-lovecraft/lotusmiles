export default interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  referrer_code?: string
  onboarded: boolean
  created_at: string
  updated_at: string
}
