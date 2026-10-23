import DashX from '@dashx/node'

const dx = DashX.createClient({
    baseUri: process.env.DASHX_URI,
    publicKey: process.env.DASHX_PUBLIC_KEY,
    privateKey: process.env.DASHX_PRIVATE_KEY,
    targetEnvironment: process.env.DASHX_TARGET_ENVIRONMENT
})

export default dx
