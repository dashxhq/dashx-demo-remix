const validateEmail = (email: any) => {
  if (!email) {
    return 'Email is Required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid email address'
  }
}

const validateName = (name: any, type: string) => {
  if (!name) {
    return `${type} is required`
  } else if (typeof name !== 'string' || name.length < 3) {
    return `${type} must be at least 3 characters long`
  }
}

const validatePassword = (password: any) => {
  if (!password) {
    return 'Password is required'
  } else if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`
  }
}

const validateUrl = (url: any) => {
  let urls = ['/register', '/', 'https://dashxdemo.com']
  if (urls.includes(url)) {
    return '/contact-us'
  }
  return '/login'
}

export { validateEmail, validateName, validatePassword, validateUrl } 
