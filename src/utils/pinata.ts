import api from 'api'
import to from 'await-to-js'

const sdk = api('@pinata-cloud/v1.0#12ai2blmsggcsb')

export async function checkPinataAuthentication(pinataJWT: string) {
  sdk.auth(pinataJWT)
  const [err, res] = await to<any>(sdk.getDataTestauthentication())
  if (err)
    return false

  return res.status === 200
}
