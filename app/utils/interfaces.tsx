export type ActionData = {
    formError?: string
    fieldErrors?: {
      email: string | undefined
      password?: string | undefined
      name?: string | undefined
      feedback?: string | undefined
      firstName?: string | undefined
      lastName?: string | undefined
    }
    fields?: {
      name?: string
      email: string
      password?: string
      firstName?: string
      lastName?: string
      feedback?: string
    }
  }

export type RequestType = {
    first_name?: string
    last_name?: string
    name?: string
    email: string
    password?: string
    feedback?: string
  }
