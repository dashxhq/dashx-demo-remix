//@ts-nocheck
import DashXWeb from '@dashx/browser'

const dashx = DashXWeb({
  baseUri: window.env.DASHX_BASE_URI,
  publicKey: window.env.DASHX_PUBLIC_KEY as string,
  targetEnvironment: window.env.DASHX_TARGET_ENVIRONMENT
})

export default dashx
