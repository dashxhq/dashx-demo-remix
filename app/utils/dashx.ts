import DashX from '@dashx/node'

// Initialize DashX SDK
const dashx = DashX.createClient({
    baseUri: process.env.DASHX_URI,
    publicKey: process.env.DASHX_PUBLIC_KEY,
    privateKey: process.env.DASHX_PRIVATE_KEY,
    targetEnvironment: process.env.DASHX_TARGET_ENVIRONMENT
  })

export default dashx



