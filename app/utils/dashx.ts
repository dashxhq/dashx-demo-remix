import DashX from '@dashx/node'
import DashXWeb from '@dashx/browser'


// Initialize DashX SDK
const dx = DashX.createClient({
    baseUri: process.env.DASHX_URI,
    publicKey: process.env.DASHX_PUBLIC_KEY,
    privateKey: process.env.DASHX_PRIVATE_KEY,
    targetEnvironment: process.env.DASHX_TARGET_ENVIRONMENT
  })

// const dashx = DashXWeb({
//   baseUri: process.env.REACT_APP_DASHX_BASE_URI,
//   publicKey: process.env.REACT_APP_DASHX_PUBLIC_KEY as string,
//   targetEnvironment: process.env.REACT_APP_DASHX_TARGET_ENVIRONMENT
// })

export { dx }
